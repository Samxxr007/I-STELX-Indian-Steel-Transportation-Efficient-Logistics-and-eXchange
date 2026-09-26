from typing import Dict, List

class CostEngineService:
    """
    Cost Intelligence Engine
    Calculates total landed logistics cost: Ocean Freight, Port Dues, Handling,
    Demurrage Risk Allowance, and Fuel Impact in INR Crores (₹ Cr).
    """

    EXCHANGE_RATE_INR_PER_USD = 86.50

    @classmethod
    def calculate_landed_cost(
        cls,
        quantity_mt: float,
        freight_rate_usd_mt: float,
        origin_port: str,
        destination_port: str,
        vessel_type: str,
        distance_nm: float = 4500.0,
        exchange_rate_inr: float = 86.50,
        port_waiting_days: float = 1.5,
        daily_charter_hire: float = 24000.0
    ) -> Dict:
        rate_usd = freight_rate_usd_mt
        # 1. Base Ocean Freight
        ocean_freight_usd = quantity_mt * rate_usd
        ocean_freight_cr = (ocean_freight_usd * exchange_rate_inr) / 10_000_000.0

        # 2. Port Charges (pilotage, port dues, towage, berth hire)
        # Typically ~ $45,000 for Panamax in Indian Major Ports
        port_charges_usd = 44000.0 if "Panamax" in vessel_type else (68000.0 if "Capesize" in vessel_type else 32000.0)
        port_charges_cr = (port_charges_usd * exchange_rate_inr) / 10_000_000.0

        # 3. Handling & Stevedoring charges (at port) ~ ₹30/MT
        handling_cr = (quantity_mt * 30.0) / 10_000_000.0

        # 4. Demurrage Risk Allowance
        # Daily demurrage ~ $18,000/day for waiting over laytime allowance
        demurrage_usd = max(0.0, (port_waiting_days - 0.5) * 16000.0)
        demurrage_cr = (demurrage_usd * exchange_rate_inr) / 10_000_000.0

        # 5. Fuel / Bunker Impact (VLSFO standard consumption)
        # Average voyage days ~ distance / (12.5 * 24)
        voyage_days = distance_nm / (12.5 * 24.0)
        fuel_ton_day = 28.0 if "Panamax" in vessel_type else (45.0 if "Capesize" in vessel_type else 20.0)
        fuel_cost_usd = voyage_days * fuel_ton_day * 620.0 * 0.03 # bunker adjustment factor
        fuel_other_cr = (fuel_cost_usd * exchange_rate_inr) / 10_000_000.0

        # 6. Other operational & agency costs
        other_cr = 0.17

        # Total
        total_cr = ocean_freight_cr + port_charges_cr + handling_cr + demurrage_cr + fuel_other_cr + other_cr
        total_inr = total_cr * 10_000_000.0
        cost_per_mt_inr = total_inr / quantity_mt if quantity_mt > 0 else 0.0

        assumptions = [
            f"FX Rate applied: 1 USD = ₹{exchange_rate_inr:.2f} INR",
            f"Ocean Freight Rate: ${freight_rate_usd_mt:.2f} / MT ({vessel_type})",
            f"Calculated for cargo volume: {quantity_mt:,.0f} MT",
            f"Estimated voyage distance: {distance_nm:,.0f} NM (~{voyage_days:.1f} sailing days)",
            f"Expected destination waiting time: {port_waiting_days:.1f} days",
            "Port dues and pilotage estimated on standard Indian Major Port tariff (TAMP compliant)",
            "Handling charges based on mechanized conveyor discharge at destination berth"
        ]

        return {
            "ocean_freight_usd": round(ocean_freight_usd, 2),
            "ocean_freight_cr": round(ocean_freight_cr, 2),
            "port_charges_cr": round(port_charges_cr, 2),
            "handling_charges_cr": round(handling_cr, 2),
            "estimated_demurrage_cr": round(demurrage_cr, 2),
            "fuel_bunker_impact_cr": round(fuel_other_cr, 2),
            "other_operational_cr": round(other_cr, 2),
            "total_cost_cr": round(total_cr, 2),
            "cost_per_mt_inr": round(cost_per_mt_inr, 2),
            "assumptions": assumptions
        }
