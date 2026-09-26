from fastapi import APIRouter
from app.schemas.schemas import WhatIfRequest, WhatIfResponse

router = APIRouter(prefix="/simulation", tags=["What-If Scenario Simulator"])

@router.post("/run", response_model=WhatIfResponse)
def run_simulation(req: WhatIfRequest):
    # Baseline
    base_cost = req.base_cost_cr or 16.43
    base_freight_rate = 24.30
    base_days = 17.0
    base_waiting = 1.2
    base_risk = "Low"

    # Delta impacts
    freight_multiplier = 1.0 + (req.freight_rate_pct_change / 100.0)
    fuel_multiplier = 1.0 + (req.fuel_cost_pct_change / 100.0)
    
    # Speed impact on voyage duration
    speed_factor = 1.0 - (req.vessel_speed_pct_change / 100.0)
    scenario_sailing_days = round(base_days * speed_factor, 1)

    # Port delay impact
    congestion_add = 1.5 if req.port_congestion == "HIGH" else (0.0 if req.port_congestion == "LOW" else 0.5)
    scenario_waiting_days = round(base_waiting + req.port_delay_days + congestion_add, 1)
    scenario_total_duration = round(scenario_sailing_days + scenario_waiting_days, 1)

    # Cost calculation for scenario
    ocean_freight_base = base_cost * 0.94
    ocean_freight_scen = ocean_freight_base * freight_multiplier
    
    demurrage_extra_cr = max(0.0, (scenario_waiting_days - base_waiting) * 0.14)
    fuel_extra_cr = (0.17 * fuel_multiplier) - 0.17

    scenario_total_cost = round(ocean_freight_scen + 0.38 + 0.24 + demurrage_extra_cr + (0.17 * fuel_multiplier), 2)
    cost_delta_cr = round(scenario_total_cost - base_cost, 2)
    cost_delta_pct = round((cost_delta_cr / base_cost) * 100.0, 1)

    # Schedule risk determination
    if req.port_delay_days >= 3 or req.port_congestion == "HIGH" or req.vessel_availability == "DELAYED":
        scenario_risk = "High"
    elif req.port_delay_days >= 1 or req.vessel_speed_pct_change <= -10:
        scenario_risk = "Medium"
    else:
        scenario_risk = "Low"

    insights = []
    if req.freight_rate_pct_change > 5:
        insights.append(f"A +{req.freight_rate_pct_change:.0f}% freight spike adds ₹{cost_delta_cr:.2f} Cr to voyage exposure. Early charter lock-in is strongly recommended.")
    elif req.freight_rate_pct_change < -5:
        insights.append(f"Softening market (-{abs(req.freight_rate_pct_change):.0f}%) yields potential savings of ₹{abs(cost_delta_cr):.2f} Cr if spot fixture timing can be delayed.")

    if req.port_delay_days > 0 or req.port_congestion == "HIGH":
        insights.append(f"Additional {req.port_delay_days:.1f} days waiting triggers ₹{demurrage_extra_cr:.2f} Cr in demurrage exposure. Consider alternate discharge berth.")

    if req.vessel_speed_pct_change < 0:
        insights.append(f"Eco-speed reduction extends sailing by {scenario_sailing_days - base_days:.1f} days but saves bunker consumption.")

    if not insights:
        insights.append("Parameters remain close to base fixture assumptions. Risk and cost variance are well within standard tolerance.")

    return {
        "base": {
            "total_cost_cr": base_cost,
            "eta_date": "28 Oct 2026",
            "voyage_duration_days": base_days,
            "port_waiting_days": base_waiting,
            "schedule_risk": base_risk,
            "freight_exposure_cr": 142.5
        },
        "scenario": {
            "total_cost_cr": scenario_total_cost,
            "eta_date": f"{int(28 + req.port_delay_days + (scenario_sailing_days - base_days))} Oct 2026",
            "voyage_duration_days": scenario_total_duration,
            "port_waiting_days": scenario_waiting_days,
            "schedule_risk": scenario_risk,
            "freight_exposure_cr": round(142.5 + cost_delta_cr, 2)
        },
        "delta": {
            "cost_diff_cr": cost_delta_cr,
            "cost_diff_pct": cost_delta_pct,
            "duration_diff_days": round(scenario_total_duration - (base_days + base_waiting), 1),
            "demurrage_impact_cr": round(demurrage_extra_cr, 2)
        },
        "insights": insights
    }
