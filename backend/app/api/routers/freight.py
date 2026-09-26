from fastapi import APIRouter, Query
from app.services.freight_ml_service import FreightMLService
from app.schemas.schemas import FreightForecastResponse

router = APIRouter(prefix="/freight", tags=["Freight Intelligence"])

@router.get("/forecast", response_model=FreightForecastResponse)
def get_freight_forecast(
    origin: str = Query("Hay Point", description="Origin Port"),
    destination: str = Query("Visakhapatnam", description="Destination Port"),
    vessel_type: str = Query("Panamax", description="Vessel Type"),
    cargo_type: str = Query("Coking Coal", description="Cargo Type")
):
    result = FreightMLService.train_and_forecast(origin, destination, vessel_type, cargo_type)
    return result

@router.get("/benchmarks")
def get_freight_benchmarks():
    routes = [
        {"route": "Hay Point -> Visakhapatnam", "vessel": "Panamax", "cargo": "Coking Coal", "current": 24.30, "change": "+3.8%", "trend": "UPWARD"},
        {"route": "Port Hedland -> Paradip", "vessel": "Capesize", "cargo": "Iron Ore", "current": 18.50, "change": "+1.2%", "trend": "UPWARD"},
        {"route": "Richards Bay -> Chennai", "vessel": "Supramax", "cargo": "Thermal Coal", "current": 22.80, "change": "-0.9%", "trend": "DOWNWARD"},
        {"route": "Newcastle -> Haldia", "vessel": "Panamax", "cargo": "Coking Coal", "current": 25.40, "change": "+4.1%", "trend": "UPWARD"},
        {"route": "Gladstone -> Dhamra", "vessel": "Capesize", "cargo": "Coking Coal", "current": 19.10, "change": "+0.5%", "trend": "STABLE"}
    ]
    return {"benchmarks": routes, "bunker_vlsfo_usd": 624.50, "bdi_baltic_dry_index": 1845}
