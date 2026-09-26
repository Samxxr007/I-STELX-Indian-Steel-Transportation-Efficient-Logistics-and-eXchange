import datetime
import random
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.models import CargoRequirement, Vessel, Port
from app.schemas.schemas import CargoRequirementCreate, CargoRequirementResponse
from app.services.freight_ml_service import FreightMLService
from app.services.port_compatibility_service import PortCompatibilityService
from app.services.cost_engine_service import CostEngineService
from app.services.ai_charter_advisor_service import AICharterAdvisorService

router = APIRouter(prefix="/requirements", tags=["Cargo Requirements"])

@router.get("", response_model=List[CargoRequirementResponse])
def list_requirements(db: Session = Depends(get_db)):
    return db.query(CargoRequirement).order_by(CargoRequirement.id.desc()).all()

@router.get("/{req_id}", response_model=CargoRequirementResponse)
def get_requirement(req_id: int, db: Session = Depends(get_db)):
    req = db.query(CargoRequirement).filter(CargoRequirement.id == req_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Cargo requirement not found.")
    return req

@router.post("", response_model=CargoRequirementResponse)
def create_requirement(req_in: CargoRequirementCreate, db: Session = Depends(get_db)):
    # Auto-generate serial requirement code
    count = db.query(CargoRequirement).count() + 1
    year = datetime.datetime.now().year
    req_code = f"REQ-{year}-{count:04d}"

    new_req = CargoRequirement(
        requirement_code=req_code,
        cargo_type=req_in.cargo_type,
        quantity_mt=req_in.quantity_mt,
        origin_country=req_in.origin_country,
        origin_port=req_in.origin_port,
        destination_port=req_in.destination_port,
        delivery_date=req_in.delivery_date,
        laycan_start=req_in.laycan_start,
        laycan_end=req_in.laycan_end,
        preferred_vessel_type=req_in.preferred_vessel_type or "Panamax",
        notes=req_in.notes,
        status="DRAFT",
        created_by="charter.manager@sail.in"
    )
    db.add(new_req)
    db.commit()
    db.refresh(new_req)
    return new_req

@router.post("/{req_id}/analyze")
def analyze_requirement(req_id: int, db: Session = Depends(get_db)):
    req = db.query(CargoRequirement).filter(CargoRequirement.id == req_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Cargo requirement not found.")

    # 1. Freight Forecast
    v_type = req.preferred_vessel_type or "Panamax"
    freight = FreightMLService.train_and_forecast(req.origin_port, req.destination_port, v_type, req.cargo_type)

    # 2. Port Compatibility & Lookup
    dest_port = db.query(Port).filter(Port.name.ilike(f"%{req.destination_port}%")).first()
    if not dest_port:
        dest_port = db.query(Port).filter(Port.is_indian_port == True).first()

    # 3. Vessel Screening & Selection
    available_vessels = db.query(Vessel).all()
    vessel_evaluations = []

    for v in available_vessels:
        advice = AICharterAdvisorService.evaluate_charter_scenario(req, v, dest_port, freight)
        vessel_evaluations.append({
            "vessel_id": v.id,
            "vessel_name": v.name,
            "vessel_type": v.vessel_type,
            "dwt": v.dwt,
            "capacity_mt": v.capacity_mt,
            "draft_m": v.draft_m,
            "speed_knots": v.speed_knots,
            "availability_status": v.availability_status,
            "is_port_compatible": advice["port_compatible"],
            "port_status": advice["port_compatibility_status"],
            "recommendation_score": advice["recommendation_score"],
            "risk_level": advice["risk_level"],
            "expected_cost_cr": advice["expected_cost_cr"],
            "why_reasons": advice["why_reasons"],
            "cautions": advice["cautions"]
        })

    # Sort vessels by recommendation score descending
    vessel_evaluations.sort(key=lambda x: x["recommendation_score"], reverse=True)

    # Update requirement status
    req.status = "ANALYZED"
    db.commit()

    return {
        "requirement_id": req.id,
        "requirement_code": req.requirement_code,
        "cargo_type": req.cargo_type,
        "quantity_mt": req.quantity_mt,
        "origin_port": req.origin_port,
        "destination_port": req.destination_port,
        "laycan_window": f"{req.laycan_start} to {req.laycan_end}",
        "freight_intelligence": {
            "current_rate_usd_mt": freight["current_rate"],
            "forecast_30d_usd_mt": freight["forecast_30d"],
            "trend": freight["trend"],
            "confidence_score": freight["confidence_score"],
            "model_version": freight["model_version"]
        },
        "destination_port_info": {
            "name": dest_port.name,
            "max_draft_m": dest_port.max_draft_m,
            "max_loa_m": dest_port.max_loa_m,
            "waiting_time_hours": dest_port.waiting_time_hours,
            "congestion": dest_port.current_congestion_level
        },
        "vessel_rankings": vessel_evaluations,
        "top_recommended_vessel": vessel_evaluations[0] if vessel_evaluations else None,
        "workflow_step": "ANALYZED"
    }
