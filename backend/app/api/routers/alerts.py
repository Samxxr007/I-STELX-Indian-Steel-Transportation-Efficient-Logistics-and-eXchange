from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.models import Alert

router = APIRouter(prefix="/alerts", tags=["Risk & Alerts Center"])

@router.get("")
def list_alerts(
    category: Optional[str] = Query(None, description="Category filter"),
    severity: Optional[str] = Query(None, description="Severity filter"),
    db: Session = Depends(get_db)
):
    query = db.query(Alert)
    if category and category != "ALL":
        query = query.filter(Alert.category == category)
    if severity and severity != "ALL":
        query = query.filter(Alert.severity == severity)

    alerts = query.order_by(Alert.id.desc()).all()
    return [
        {
            "id": a.id,
            "shipment_id": a.shipment_id,
            "vessel_id": a.vessel_id,
            "category": a.category,
            "severity": a.severity,
            "message": a.message,
            "evidence": a.evidence,
            "is_read": a.is_read,
            "is_acknowledged": a.is_acknowledged,
            "timestamp": a.timestamp.strftime("%d %b %Y, %H:%M UTC") if a.timestamp else "Recently"
        }
        for a in alerts
    ]

@router.post("/{alert_id}/acknowledge")
def acknowledge_alert(alert_id: int, db: Session = Depends(get_db)):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found.")
    alert.is_acknowledged = True
    alert.is_read = True
    db.commit()
    return {"success": True, "alert_id": alert_id, "is_acknowledged": True}

@router.post("/mark-all-read")
def mark_all_read(db: Session = Depends(get_db)):
    db.query(Alert).update({Alert.is_read: True})
    db.commit()
    return {"success": True, "message": "All alerts marked as read."}
