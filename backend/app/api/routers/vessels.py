from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.models import Vessel, Port
from app.schemas.schemas import VesselResponse, VesselOptimizeRequest
from app.services.port_compatibility_service import PortCompatibilityService

router = APIRouter(prefix="/vessels", tags=["Vessels & Optimization"])

@router.get("", response_model=List[VesselResponse])
def list_vessels(db: Session = Depends(get_db)):
    return db.query(Vessel).all()

@router.get("/{vessel_id}", response_model=VesselResponse)
def get_vessel(vessel_id: int, db: Session = Depends(get_db)):
    vessel = db.query(Vessel).filter(Vessel.id == vessel_id).first()
    if not vessel:
        raise HTTPException(status_code=404, detail="Vessel not found.")
    return vessel

@router.post("/optimize")
def optimize_vessels(opt_req: VesselOptimizeRequest, db: Session = Depends(get_db)):
    vessels = db.query(Vessel).all()
    dest_port = db.query(Port).filter(Port.name.ilike(f"%{opt_req.destination_port}%")).first()
    if not dest_port:
        dest_port = db.query(Port).filter(Port.is_indian_port == True).first()

    results = []
    for v in vessels:
        # Check capacity fit
        cap_ratio = opt_req.quantity_mt / v.capacity_mt
        cap_ok = 0.75 <= cap_ratio <= 1.15
        
        # Check port compatibility
        port_check = PortCompatibilityService.check_compatibility(dest_port, v) if dest_port else {"is_compatible": True, "status": "COMPATIBLE"}

        # Score calculations
        score = 80.0
        reasons = []
        if cap_ok:
            reasons.append(f"✓ Capacity fit ({v.capacity_mt:,.0f} MT capacity vs {opt_req.quantity_mt:,.0f} MT requirement)")
            score += 10.0
        else:
            if cap_ratio > 1.15:
                reasons.append(f"✕ Capacity insufficient ({v.capacity_mt:,.0f} MT < {opt_req.quantity_mt:,.0f} MT)")
                score -= 30.0
            else:
                reasons.append(f"⚠ Deadfreight risk ({v.capacity_mt:,.0f} MT vs {opt_req.quantity_mt:,.0f} MT)")
                score -= 10.0

        if port_check["is_compatible"]:
            reasons.append(f"✓ Destination compatible ({dest_port.name})")
            score += 10.0
        else:
            reasons.append(f"✕ Destination draft/LOA restriction at {dest_port.name}")
            score -= 40.0

        if v.availability_status == "AVAILABLE":
            reasons.append(f"✓ Available during laycan window ({opt_req.laycan_start})")
            score += 5.0
        else:
            reasons.append(f"⚠ Currently {v.availability_status}")
            score -= 5.0

        score = max(5.0, min(99.0, round(score, 1)))

        results.append({
            "vessel_id": v.id,
            "name": v.name,
            "imo": v.imo,
            "vessel_type": v.vessel_type,
            "dwt": v.dwt,
            "capacity_mt": v.capacity_mt,
            "draft_m": v.draft_m,
            "beam_m": v.beam_m,
            "loa_m": v.loa_m,
            "speed_knots": v.speed_knots,
            "current_location": v.current_location,
            "availability_status": v.availability_status,
            "available_date": v.available_date,
            "daily_charter_rate_usd": v.daily_charter_rate_usd,
            "score": score,
            "port_compatible": port_check["is_compatible"],
            "port_status": port_check["status"],
            "reasons": reasons
        })

    results.sort(key=lambda x: x["score"], reverse=True)
    return {
        "requirement_quantity": opt_req.quantity_mt,
        "destination_port": dest_port.name if dest_port else opt_req.destination_port,
        "optimized_vessels": results
    }
