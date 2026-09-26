from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.models import Port, Vessel
from app.schemas.schemas import PortResponse, PortCompatibilityCheckRequest, PortCompatibilityResponse
from app.services.port_compatibility_service import PortCompatibilityService

router = APIRouter(prefix="/ports", tags=["Ports & Compatibility"])

@router.get("", response_model=List[PortResponse])
def list_ports(db: Session = Depends(get_db)):
    return db.query(Port).all()

@router.get("/{port_id}", response_model=PortResponse)
def get_port(port_id: int, db: Session = Depends(get_db)):
    port = db.query(Port).filter(Port.id == port_id).first()
    if not port:
        raise HTTPException(status_code=404, detail="Port not found.")
    return port

@router.post("/check-compatibility", response_model=PortCompatibilityResponse)
def check_port_compatibility(payload: PortCompatibilityCheckRequest, db: Session = Depends(get_db)):
    port = db.query(Port).filter(Port.id == payload.port_id).first()
    vessel = db.query(Vessel).filter(Vessel.id == payload.vessel_id).first()
    if not port or not vessel:
        raise HTTPException(status_code=404, detail="Port or Vessel entity not found.")

    res = PortCompatibilityService.check_compatibility(port, vessel)
    return res
