from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Shipment

router = APIRouter(prefix="/eta", tags=["ETA Intelligence"])

@router.get("/{shipment_id}")
def get_eta_intelligence(shipment_id: int, db: Session = Depends(get_db)):
    s = db.query(Shipment).filter(Shipment.id == shipment_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Shipment not found.")

    # Calculate ETA metrics
    scheduled_eta = s.scheduled_eta
    current_eta = s.current_eta
    variance_hours = s.eta_variance_hours
    variance_text = f"+{int(variance_hours)}h {int((variance_hours % 1) * 60)}m" if variance_hours > 0 else "On Time"

    status_tag = "Critical Delay" if variance_hours > 24.0 else ("Potential Delay" if variance_hours > 6.0 else "On Time")

    # Historical ETA variation milestones throughout voyage
    eta_history = [
        {"milestone": "Laycan / Departure", "predicted_eta": "28 Oct 08:00", "variance_hrs": 0.0, "reason": "Nominal passage plan"},
        {"milestone": "Torres Strait Transit", "predicted_eta": "28 Oct 10:30", "variance_hrs": 2.5, "reason": "Tidal waiting at prince of wales channel"},
        {"milestone": "Malacca Strait Entry", "predicted_eta": "28 Oct 14:00", "variance_hrs": 6.0, "reason": "Traffic separation scheme speed restriction"},
        {"milestone": "Bay of Bengal Swell", "predicted_eta": "28 Oct 19:45", "variance_hrs": 11.75, "reason": "Monsoon wave resistance (-0.7 knots)"},
        {"milestone": "Current Telemetry", "predicted_eta": "28 Oct 21:30", "variance_hrs": 13.5, "reason": "Destination berth lineup congestion (11.4h)"}
    ]

    return {
        "shipment_id": s.id,
        "shipment_code": s.shipment_code,
        "vessel_name": s.vessel.name if s.vessel else "MV STEEL VOYAGER",
        "origin_port": s.origin_port,
        "destination_port": s.destination_port,
        "scheduled_eta": scheduled_eta,
        "current_eta": current_eta,
        "variance_hours": variance_hours,
        "variance_display": variance_text,
        "status": status_tag,
        "speed_telemetry": {
            "current_speed_knots": s.current_speed_knots,
            "rolling_avg_speed_knots": 12.6,
            "design_speed_knots": 13.5,
            "speed_deficit_pct": -5.2
        },
        "distance_remaining_nm": s.remaining_distance_nm,
        "total_distance_nm": s.total_distance_nm,
        "port_waiting_impact_hours": s.port_waiting_hours,
        "eta_history": eta_history,
        "explanation": f"ETA variance of {variance_text} is driven by a combination of monsoon wave resistance in the central Bay of Bengal (-0.7 kt) and anticipated berth congestion at {s.destination_port}."
    }
