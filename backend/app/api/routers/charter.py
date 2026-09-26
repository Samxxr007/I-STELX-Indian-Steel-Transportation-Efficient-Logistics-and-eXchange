import datetime
import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import CargoRequirement, Vessel, Port, CharterScenario, CharterApproval, AuditLog
from app.schemas.schemas import CharterAdviceRequest, CharterAdviceResponse, CharterApprovalRequest
from app.services.ai_charter_advisor_service import AICharterAdvisorService
from app.services.freight_ml_service import FreightMLService

router = APIRouter(prefix="/charter", tags=["AI Charter Advisor & Fixtures"])

@router.post("/advice", response_model=CharterAdviceResponse)
def get_charter_advice(payload: CharterAdviceRequest, db: Session = Depends(get_db)):
    req = db.query(CargoRequirement).filter(CargoRequirement.id == payload.requirement_id).first()
    vessel = db.query(Vessel).filter(Vessel.id == payload.vessel_id).first()
    if not req or not vessel:
        raise HTTPException(status_code=404, detail="Requirement or Vessel not found.")

    dest_port = db.query(Port).filter(Port.name.ilike(f"%{req.destination_port}%")).first()
    if not dest_port:
        dest_port = db.query(Port).filter(Port.is_indian_port == True).first()

    freight = FreightMLService.train_and_forecast(req.origin_port, req.destination_port, vessel.vessel_type, req.cargo_type)
    advice = AICharterAdvisorService.evaluate_charter_scenario(req, vessel, dest_port, freight)
    return advice

@router.post("/scenarios/save")
def save_scenario(payload: dict, db: Session = Depends(get_db)):
    req_id = payload.get("requirement_id")
    vessel_id = payload.get("vessel_id")
    
    req = db.query(CargoRequirement).filter(CargoRequirement.id == req_id).first()
    vessel = db.query(Vessel).filter(Vessel.id == vessel_id).first()
    if not req or not vessel:
        raise HTTPException(status_code=404, detail="Requirement or Vessel not found.")

    scenario = CharterScenario(
        requirement_id=req.id,
        vessel_id=vessel.id,
        freight_rate_usd_mt=payload.get("freight_rate_usd_mt", 24.30),
        ocean_freight_cr=payload.get("ocean_freight_cr", 15.52),
        port_charges_cr=payload.get("port_charges_cr", 0.38),
        handling_cr=payload.get("handling_cr", 0.24),
        demurrage_cr=payload.get("demurrage_cr", 0.12),
        fuel_other_cr=payload.get("fuel_other_cr", 0.17),
        total_cost_cr=payload.get("total_cost_cr", 16.43),
        risk_level=payload.get("risk_level", "MEDIUM"),
        recommendation_score=payload.get("recommendation_score", 88.5),
        advisor_signal=payload.get("advisor_signal", "Current charter window warrants attention"),
        advisor_justifications=json.dumps(payload.get("why_reasons", [])),
        is_port_compatible=payload.get("is_port_compatible", True),
        status="PENDING_APPROVAL"
    )
    db.add(scenario)
    db.commit()
    db.refresh(scenario)

    req.status = "PENDING_APPROVAL"
    db.commit()

    return {
        "success": True,
        "scenario_id": scenario.id,
        "status": "PENDING_APPROVAL",
        "message": f"Scenario #{scenario.id} saved and queued for Charter Manager approval."
    }

@router.post("/approve")
def approve_charter_fixture(payload: CharterApprovalRequest, db: Session = Depends(get_db)):
    scenario = db.query(CharterScenario).filter(CharterScenario.id == payload.scenario_id).first()
    if not scenario:
        raise HTTPException(status_code=404, detail="Charter scenario not found.")

    count = db.query(CharterApproval).count() + 1
    year = datetime.datetime.now().year
    charter_code = f"CHT-{year}-{count:04d}"

    approval = CharterApproval(
        charter_code=charter_code,
        scenario_id=scenario.id,
        approved_by="Vikramaditya Sharma (Head of Chartering)",
        approval_timestamp=datetime.datetime.utcnow(),
        status="APPROVED",
        comments=payload.comments or "Approved based on favorable freight forecast trend and port draft clearance."
    )
    db.add(approval)
    
    scenario.status = "APPROVED"
    if scenario.requirement:
        scenario.requirement.status = "CHARTERED"

    # Audit log
    audit = AuditLog(
        user_email="charter.manager@sail.in",
        action="CHARTER_FIXTURE_APPROVED",
        entity_type="CHARTER_FIXTURE",
        entity_id=charter_code,
        details=f"Approved fixture for requirement {scenario.requirement.requirement_code if scenario.requirement else 'N/A'} on vessel {scenario.vessel.name if scenario.vessel else 'N/A'}"
    )
    db.add(audit)
    db.commit()

    return {
        "success": True,
        "charter_code": charter_code,
        "approval_id": approval.id,
        "status": "APPROVED",
        "requirement_id": scenario.requirement_id,
        "vessel_id": scenario.vessel_id,
        "message": f"Charter fixture {charter_code} successfully approved. Ready for Shipment Creation."
    }
