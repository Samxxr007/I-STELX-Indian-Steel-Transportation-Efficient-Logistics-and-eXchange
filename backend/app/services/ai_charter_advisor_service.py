from typing import Dict, List
from app.models.models import CargoRequirement, Vessel, Port
from app.services.port_compatibility_service import PortCompatibilityService
from app.services.cost_engine_service import CostEngineService
from app.services.freight_ml_service import FreightMLService

class AICharterAdvisorService:
    """
    AI Charter Advisor Engine
    Enterprise Decision Support Engine providing explainable, multi-factor trade-off recommendations
    for bulk cargo fixtures. Never executes commercial commitments automatically.
    """

    @classmethod
    def evaluate_charter_scenario(
        cls,
        req: CargoRequirement,
        vessel: Vessel,
        dest_port: Port,
        freight_data: Dict = None
    ) -> Dict:
        if not freight_data:
            freight_data = FreightMLService.train_and_forecast(
                req.origin_port, req.destination_port, vessel.vessel_type, req.cargo_type
            )

        port_check = PortCompatibilityService.check_compatibility(dest_port, vessel)
        cost_breakdown = CostEngineService.calculate_landed_cost(
            quantity_mt=req.quantity_mt,
            freight_rate_usd_mt=freight_data["current_rate"],
            origin_port=req.origin_port,
            destination_port=req.destination_port,
            vessel_type=vessel.vessel_type,
            port_waiting_days=dest_port.waiting_time_hours / 24.0
        )

        # Multi-factor scoring logic
        score = 80.0
        why_reasons = []
        cautions = []

        # 1. Capacity check
        capacity_ratio = req.quantity_mt / vessel.capacity_mt
        if 0.85 <= capacity_ratio <= 1.05:
            score += 8.0
            why_reasons.append(f"{vessel.vessel_type} capacity ({vessel.capacity_mt:,.0f} MT) perfectly matches requirement volume ({req.quantity_mt:,.0f} MT).")
        elif capacity_ratio < 0.85:
            score -= 6.0
            cautions.append(f"Vessel capacity ({vessel.capacity_mt:,.0f} MT) exceeds cargo requirement ({req.quantity_mt:,.0f} MT), causing deadfreight exposure.")
        else:
            score -= 25.0
            cautions.append(f"Vessel capacity ({vessel.capacity_mt:,.0f} MT) is insufficient for cargo ({req.quantity_mt:,.0f} MT).")

        # 2. Port compatibility check
        if port_check["is_compatible"]:
            score += 8.0
            why_reasons.append(f"Destination constraints passed: Draft ({vessel.draft_m}m vs {dest_port.max_draft_m}m max) and LOA ({vessel.loa_m}m vs {dest_port.max_loa_m}m max) are compliant.")
        else:
            score -= 40.0
            cautions.append(f"Port restriction detected: {'; '.join(port_check['reasons'])}")

        # 3. Freight trend signal
        trend = freight_data.get("trend", "UPWARD")
        if trend == "UPWARD":
            why_reasons.append(f"Freight forecast is trending UPWARD (${freight_data['current_rate']:.2f} -> ${freight_data['forecast_30d']:.2f}/MT over 30d). Fixing now locks in lower base freight.")
            score += 5.0
        elif trend == "DOWNWARD":
            cautions.append(f"Freight market is softening (${freight_data['current_rate']:.2f} -> ${freight_data['forecast_30d']:.2f}/MT). Consider short delay or spot negotiation if laycan permits.")
            score -= 2.0
        else:
            why_reasons.append("Freight market is STABLE with low volatility.")

        # 4. Port congestion
        if dest_port.waiting_time_hours > 20:
            cautions.append(f"High destination port congestion at {dest_port.name} (~{dest_port.waiting_time_hours:.1f} hours waiting). Risk of demurrage costs.")
            score -= 5.0
        else:
            why_reasons.append(f"Moderate destination congestion at {dest_port.name} (~{dest_port.waiting_time_hours:.1f} hours waiting) within standard allowable laytime.")

        # 5. Availability
        if vessel.availability_status == "AVAILABLE":
            why_reasons.append(f"Vessel {vessel.name} is confirmed AVAILABLE and in position for laycan window ({req.laycan_start} to {req.laycan_end}).")
            score += 4.0
        else:
            cautions.append(f"Vessel current status is {vessel.availability_status}; verify positioning ETA before committing.")
            score -= 10.0

        score = max(10.0, min(99.0, round(score, 1)))

        risk_level = "LOW" if score >= 85 and port_check["is_compatible"] else ("MEDIUM" if score >= 65 and port_check["is_compatible"] else "HIGH")
        
        if score >= 80:
            planning_signal = "Current charter window warrants immediate fixture approval."
        elif score >= 60:
            planning_signal = "Conditional recommendation. Review demurrage and fuel sensitivity in What-If simulator."
        else:
            planning_signal = "Not recommended under current parameters due to structural restrictions or cost penalties."

        return {
            "requirement_id": req.id,
            "vessel_id": vessel.id,
            "vessel_name": vessel.name,
            "vessel_type": vessel.vessel_type,
            "cargo_type": req.cargo_type,
            "quantity_mt": req.quantity_mt,
            "route": f"{req.origin_port} -> {req.destination_port}",
            "market_signal": f"{'↑ Upward' if trend == 'UPWARD' else ('↓ Downward' if trend == 'DOWNWARD' else '→ Stable')} (Confidence: {int(freight_data.get('confidence_score', 0.88)*100)}%)",
            "port_compatibility_status": port_check["status"],
            "port_compatible": port_check["is_compatible"],
            "expected_cost_cr": cost_breakdown["total_cost_cr"],
            "cost_breakdown": cost_breakdown,
            "risk_level": risk_level,
            "recommendation_score": score,
            "planning_signal": planning_signal,
            "why_reasons": why_reasons,
            "cautions": cautions,
            "port_details": port_check,
            "disclaimer": "I-STELX AI Charter Advisor provides predictive decision support and operational optimization. It does not automatically execute commercial charter commitments."
        }
