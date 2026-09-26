from typing import Dict, List
from app.models.models import Vessel, Port

class PortCompatibilityService:
    """
    Port Compatibility Engine
    Evaluates Vessel Draft, LOA, Beam, and DWT against Destination & Origin Port constraints.
    Returns structured pass/fail rationale for enterprise risk auditing.
    """

    @classmethod
    def check_compatibility(cls, port: Port, vessel: Vessel) -> Dict:
        reasons = []
        is_compatible = True
        status = "COMPATIBLE"

        # 1. Draft check (allow 0.5m safety under-keel clearance margin)
        draft_margin = round(port.max_draft_m - vessel.draft_m, 2)
        draft_pass = vessel.draft_m <= port.max_draft_m
        if not draft_pass:
            is_compatible = False
            status = "RESTRICTED"
            reasons.append(f"Draft exceeds limit: Vessel requires {vessel.draft_m}m, Port maximum is {port.max_draft_m}m (deficit: {abs(draft_margin)}m)")
        else:
            reasons.append(f"Draft compliant: Vessel requires {vessel.draft_m}m, Port limit is {port.max_draft_m}m (clearance: {draft_margin}m)")

        # 2. LOA (Length Overall) check
        loa_margin = round(port.max_loa_m - vessel.loa_m, 1)
        loa_pass = vessel.loa_m <= port.max_loa_m
        if not loa_pass:
            is_compatible = False
            status = "RESTRICTED"
            reasons.append(f"LOA exceeds limit: Vessel length {vessel.loa_m}m exceeds berth max {port.max_loa_m}m")
        else:
            reasons.append(f"LOA compliant: Vessel length {vessel.loa_m}m is within berth limit {port.max_loa_m}m")

        # 3. Beam check
        beam_margin = round(port.max_beam_m - vessel.beam_m, 1)
        beam_pass = vessel.beam_m <= port.max_beam_m
        if not beam_pass:
            is_compatible = False
            status = "RESTRICTED"
            reasons.append(f"Beam exceeds limit: Vessel beam {vessel.beam_m}m exceeds channel/crane reach {port.max_beam_m}m")
        else:
            reasons.append(f"Beam compliant: Vessel beam {vessel.beam_m}m fits within crane envelope {port.max_beam_m}m")

        # 4. DWT & Berth limits
        dwt_pass = vessel.dwt <= port.max_dwt
        if not dwt_pass:
            is_compatible = False
            status = "RESTRICTED"
            reasons.append(f"DWT restriction: Vessel DWT {vessel.dwt:,.0f} exceeds port displacement capacity {port.max_dwt:,.0f} MT")
        else:
            reasons.append(f"DWT compliant: Vessel DWT {vessel.dwt:,.0f} within port capacity {port.max_dwt:,.0f} MT")

        summary = f"{'✓ FULLY COMPATIBLE' if is_compatible else '✕ RESTRICTED - NON-COMPLIANT'}: Vessel {vessel.name} ({vessel.vessel_type}) at {port.name}"

        return {
            "port_name": port.name,
            "vessel_name": vessel.name,
            "vessel_type": vessel.vessel_type,
            "is_compatible": is_compatible,
            "status": status,
            "draft_check": {
                "vessel_draft_m": vessel.draft_m,
                "port_max_draft_m": port.max_draft_m,
                "margin_m": draft_margin,
                "passed": draft_pass
            },
            "loa_check": {
                "vessel_loa_m": vessel.loa_m,
                "port_max_loa_m": port.max_loa_m,
                "margin_m": loa_margin,
                "passed": loa_pass
            },
            "beam_check": {
                "vessel_beam_m": vessel.beam_m,
                "port_max_beam_m": port.max_beam_m,
                "margin_m": beam_margin,
                "passed": beam_pass
            },
            "dwt_check": {
                "vessel_dwt": vessel.dwt,
                "port_max_dwt": port.max_dwt,
                "passed": dwt_pass
            },
            "overall_summary": summary,
            "reasons": reasons
        }
