from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Shipment, Vessel, Port

router = APIRouter(prefix="/analytics", tags=["Maritime Analytics & Reports"])

@router.get("/metrics")
def get_analytics_metrics(db: Session = Depends(get_db)):
    # Aggregated fleet performance metrics
    metrics = {
        "total_cargo_moved_mt": 1840000.0,
        "average_freight_cost_usd": 23.85,
        "average_cost_per_mt_inr": 2062.0,
        "average_voyage_duration_days": 17.2,
        "average_port_waiting_hours": 12.6,
        "freight_forecast_accuracy_pct": 94.2,
        "eta_prediction_accuracy_pct": 91.8,
        "vessel_capacity_utilization_pct": 92.5,
        "on_time_arrival_rate_pct": 87.5,
        "demurrage_savings_cr": 4.82
    }

    # Monthly cargo movement
    monthly_cargo = [
        {"month": "Apr 26", "coking_coal": 280, "iron_ore": 140, "limestone": 60, "total": 480},
        {"month": "May 26", "coking_coal": 310, "iron_ore": 150, "limestone": 65, "total": 525},
        {"month": "Jun 26", "coking_coal": 290, "iron_ore": 130, "limestone": 55, "total": 475},
        {"month": "Jul 26", "coking_coal": 340, "iron_ore": 160, "limestone": 70, "total": 570},
        {"month": "Aug 26", "coking_coal": 360, "iron_ore": 175, "limestone": 75, "total": 610},
        {"month": "Sep 26", "coking_coal": 380, "iron_ore": 185, "limestone": 80, "total": 645}
    ]

    # Cost by Route (in ₹ Cr and USD/MT)
    cost_by_route = [
        {"route": "Hay Point -> Visakhapatnam", "volume_mt": 480000, "avg_rate_usd": 24.30, "avg_cost_cr": 16.43, "share_pct": 36},
        {"route": "Port Hedland -> Gangavaram", "volume_mt": 510000, "avg_rate_usd": 18.50, "avg_cost_cr": 28.75, "share_pct": 28},
        {"route": "Newcastle -> Haldia", "volume_mt": 320000, "avg_rate_usd": 25.40, "avg_cost_cr": 18.20, "share_pct": 18},
        {"route": "Richards Bay -> Chennai", "volume_mt": 290000, "avg_rate_usd": 22.80, "avg_cost_cr": 13.10, "share_pct": 12},
        {"route": "Gladstone -> Dhamra", "volume_mt": 240000, "avg_rate_usd": 19.10, "avg_cost_cr": 17.50, "share_pct": 6}
    ]

    # Port Performance & Congestion benchmarks
    port_performance = [
        {"port": "Visakhapatnam", "avg_waiting_hrs": 11.4, "handling_rate_tpd": 28500, "demurrage_incidents": 2},
        {"port": "Paradip", "avg_waiting_hrs": 14.2, "handling_rate_tpd": 31000, "demurrage_incidents": 3},
        {"port": "Haldia", "avg_waiting_hrs": 22.0, "handling_rate_tpd": 14200, "demurrage_incidents": 6},
        {"port": "Dhamra", "avg_waiting_hrs": 5.2, "handling_rate_tpd": 45000, "demurrage_incidents": 0},
        {"port": "Gangavaram", "avg_waiting_hrs": 6.5, "handling_rate_tpd": 42000, "demurrage_incidents": 1},
        {"port": "Chennai", "avg_waiting_hrs": 8.0, "handling_rate_tpd": 22000, "demurrage_incidents": 1}
    ]

    # Planned vs Actual Benchmark Report (SHP-2026-0078)
    planned_vs_actual = {
        "shipment_code": "SHP-2026-0078",
        "vessel_name": "MV STEEL VOYAGER",
        "route": "Hay Point -> Visakhapatnam",
        "cargo": "80,000 MT Coking Coal",
        "planned_cost_cr": 16.43,
        "actual_cost_cr": 16.71,
        "cost_variance_cr": 0.28,
        "cost_variance_pct": "+1.7%",
        "planned_eta": "28 Oct 08:00",
        "actual_arrival": "29 Oct 03:30",
        "eta_delay_hours": 19.5,
        "port_waiting_hours": 11.4,
        "voyage_duration_days": 17.8,
        "planned_duration_days": 16.5,
        "fuel_variance_pct": "+2.1%",
        "status": "COMPLETED & AUDITED",
        "auditor_summary": "Voyage executed within acceptable enterprise commercial thresholds. Demurrage capped at 11.4h waiting."
    }

    return {
        "metrics": metrics,
        "monthly_cargo": monthly_cargo,
        "cost_by_route": cost_by_route,
        "port_performance": port_performance,
        "planned_vs_actual": planned_vs_actual
    }

@router.get("/reports/{report_type}")
def get_report_data(report_type: str):
    # Simulated downloadable data structure for PDF / CSV exporters
    return {
        "report_type": report_type,
        "generated_at": "26 Sep 2026, 12:45 UTC",
        "organization": "Steel Authority of India Limited (SAIL) / I-STELX",
        "title": f"Official {report_type.replace('-', ' ').title()} - Maritime Logistics Intelligence",
        "dataset_notice": "DEMO AUDIT TRAIL / ENTERPRISE RECORD"
    }
