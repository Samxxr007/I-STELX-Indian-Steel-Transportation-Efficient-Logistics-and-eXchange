from fastapi import APIRouter
from app.schemas.schemas import CostCalculateRequest, CostBreakdownResponse
from app.services.cost_engine_service import CostEngineService

router = APIRouter(prefix="/cost", tags=["Cost Intelligence"])

@router.post("/calculate", response_model=CostBreakdownResponse)
def calculate_cost(req: CostCalculateRequest):
    breakdown = CostEngineService.calculate_landed_cost(
        quantity_mt=req.quantity_mt,
        freight_rate_usd_mt=req.freight_rate_usd_mt,
        origin_port=req.origin_port,
        destination_port=req.destination_port,
        vessel_type=req.vessel_type,
        distance_nm=req.distance_nm or 4500.0,
        exchange_rate_inr=req.exchange_rate_inr or 86.50,
        port_waiting_days=req.port_waiting_days or 1.5
    )
    return breakdown
