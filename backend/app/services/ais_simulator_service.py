import math
import asyncio
import datetime
import json
from typing import Dict, List, Set
from fastapi import WebSocket
from app.database import SessionLocal
from app.models.models import Shipment, Vessel, Alert, ShipmentEvent, GeofenceZone, GeofenceEvent

# Predefined high-fidelity maritime route waypoints
ROUTES_WAYPOINTS = {
    "Hay Point -> Visakhapatnam": [
        [-21.28, 149.30], # Hay Point
        [-18.50, 147.80], # Great Barrier Reef passage
        [-10.60, 142.20], # Torres Strait
        [-8.80, 130.00],  # Timor Sea
        [-8.50, 115.70],  # Lombok Strait
        [-5.80, 105.70],  # Sunda Strait / Indian Ocean
        [2.00, 95.00],    # Northern Sumatra
        [6.00, 90.00],    # Andaman Sea
        [10.82, 87.14],   # Mid Bay of Bengal (Active current location MV STEEL VOYAGER)
        [14.50, 84.80],   # Off Andhra Coast
        [17.68, 83.28]    # Visakhapatnam Port
    ],
    "Richards Bay -> Gangavaram": [
        [-28.80, 32.05],  # Richards Bay
        [-20.00, 40.00],  # Mozambique Channel
        [-5.00, 50.00],   # Western Indian Ocean
        [5.00, 70.00],    # Central Indian Ocean
        [6.00, 80.50],    # South of Sri Lanka
        [12.50, 83.50],   # Bay of Bengal
        [17.62, 83.24]    # Gangavaram Port
    ],
    "Port Hedland -> Paradip": [
        [-20.31, 118.57], # Port Hedland
        [-12.00, 110.00], # North West Cape passage
        [-6.00, 104.00],  # Sunda Strait approach
        [3.00, 93.00],    # Great Channel
        [12.00, 88.00],   # Central Bay of Bengal
        [18.00, 86.80],   # Off Odisha Coast
        [20.26, 86.67]    # Paradip Port
    ],
    "Newcastle -> Haldia": [
        [-32.92, 151.78], # Newcastle
        [-25.00, 154.00], # Coral Sea
        [-10.00, 145.00], # Papua
        [-8.00, 120.00],  # Flores Sea
        [6.00, 92.00],    # Nicobar
        [18.00, 88.50],   # Northern Bay of Bengal
        [22.02, 88.06]    # Haldia Dock Complex
    ],
    "Gladstone -> Dhamra": [
        [-23.84, 151.26], # Gladstone
        [-15.00, 147.00], # Coral Sea
        [-9.50, 135.00],  # Arafura Sea
        [4.00, 94.00],    # Malacca approach
        [15.00, 87.50],   # Bay of Bengal
        [20.80, 86.96]    # Dhamra Port
    ]
}

class AISSimulatorService:
    """
    Realtime Maritime AIS & Tracking Simulator
    - Clearly marked as DEMO / SIMULATED AIS
    - Broadcasts live vessel positions, heading, speed, and geofencing triggers to WebSockets
    """
    _active_connections: Set[WebSocket] = set()
    _running: bool = False

    @classmethod
    def register_connection(cls, websocket: WebSocket):
        cls._active_connections.add(websocket)

    @classmethod
    def unregister_connection(cls, websocket: WebSocket):
        cls._active_connections.discard(websocket)

    @classmethod
    def get_route_waypoints(cls, origin: str, destination: str) -> List[List[float]]:
        key = f"{origin} -> {destination}"
        if key in ROUTES_WAYPOINTS:
            return ROUTES_WAYPOINTS[key]
        # Check partial match
        for r_key, pts in ROUTES_WAYPOINTS.items():
            if origin in r_key or destination in r_key:
                return pts
        return ROUTES_WAYPOINTS["Hay Point -> Visakhapatnam"]

    @classmethod
    def interpolate_position(cls, waypoints: List[List[float]], progress_pct: float) -> Dict:
        if not waypoints:
            return {"lat": 12.0, "lng": 85.0, "heading": 310.0}
        
        if progress_pct <= 0:
            return {"lat": waypoints[0][0], "lng": waypoints[0][1], "heading": 0.0}
        if progress_pct >= 100:
            return {"lat": waypoints[-1][0], "lng": waypoints[-1][1], "heading": 0.0}

        num_segments = len(waypoints) - 1
        segment_weight = 100.0 / num_segments
        curr_segment = min(num_segments - 1, int(progress_pct / segment_weight))
        segment_progress = (progress_pct - (curr_segment * segment_weight)) / segment_weight

        p1 = waypoints[curr_segment]
        p2 = waypoints[curr_segment + 1]

        lat = p1[0] + (p2[0] - p1[0]) * segment_progress
        lng = p1[1] + (p2[1] - p1[1]) * segment_progress

        # Calculate heading
        dy = p2[0] - p1[0]
        dx = (p2[1] - p1[1]) * math.cos(math.radians((p1[0] + p2[0]) / 2.0))
        heading_rad = math.atan2(dx, dy)
        heading_deg = (math.degrees(heading_rad) + 360) % 360

        return {
            "lat": round(lat, 5),
            "lng": round(lng, 5),
            "heading": round(heading_deg, 1)
        }

    @classmethod
    async def run_simulation_loop(cls):
        if cls._running:
            return
        cls._running = True

        while True:
            try:
                await asyncio.sleep(4.0)
                db = SessionLocal()
                try:
                    shipments = db.query(Shipment).filter(Shipment.status.in_(["IN TRANSIT", "APPROACHING PORT", "LOADING"])).all()
                    updates = []

                    for s in shipments:
                        if s.status == "IN TRANSIT" or s.status == "APPROACHING PORT":
                            # Increment progress slightly (0.05% per tick for realistic movement)
                            s.progress_pct = round(min(99.5, s.progress_pct + 0.04), 2)
                            
                            waypoints = cls.get_route_waypoints(s.origin_port, s.destination_port)
                            pos = cls.interpolate_position(waypoints, s.progress_pct)
                            
                            s.current_lat = pos["lat"]
                            s.current_lng = pos["lng"]
                            s.current_heading = pos["heading"]
                            
                            # Speed slight natural fluctuation (11.8 to 13.4 knots)
                            s.current_speed_knots = round(12.5 + (math.sin(s.progress_pct * 10) * 0.7), 1)
                            s.remaining_distance_nm = max(10.0, round(s.total_distance_nm * (1.0 - (s.progress_pct / 100.0)), 1))

                            # Geofencing triggers
                            if s.remaining_distance_nm <= 60.0 and s.status != "APPROACHING PORT":
                                s.status = "APPROACHING PORT"
                                evt = ShipmentEvent(
                                    shipment_id=s.id,
                                    event_type="GEOFENCE_APPROACHING",
                                    description=f"Vessel entered 60 NM outer approach geofence for {s.destination_port}",
                                    location_name=f"Approaching {s.destination_port}",
                                    timestamp=datetime.datetime.utcnow().strftime("%d %b %Y, %H:%M UTC"),
                                    severity="INFO"
                                )
                                db.add(evt)

                            # Update vessel current position as well
                            if s.vessel:
                                s.vessel.latitude = s.current_lat
                                s.vessel.longitude = s.current_lng
                                s.vessel.heading = s.current_heading
                                s.vessel.speed_knots = s.current_speed_knots

                            updates.append({
                                "shipment_id": s.id,
                                "shipment_code": s.shipment_code,
                                "vessel_id": s.vessel_id,
                                "vessel_name": s.vessel.name if s.vessel else "Cargo Vessel",
                                "imo": s.vessel.imo if s.vessel else "N/A",
                                "lat": s.current_lat,
                                "lng": s.current_lng,
                                "speed_knots": s.current_speed_knots,
                                "heading": s.current_heading,
                                "progress_pct": s.progress_pct,
                                "remaining_distance_nm": s.remaining_distance_nm,
                                "status": s.status,
                                "is_simulated": True,
                                "timestamp": datetime.datetime.utcnow().isoformat()
                            })

                    db.commit()

                    if updates and cls._active_connections:
                        msg = json.dumps({
                            "type": "AIS_TELEMETRY_UPDATE",
                            "data": updates,
                            "notice": "DEMO / SIMULATED AIS TELEMETRY"
                        })
                        disconnected = []
                        for ws in cls._active_connections:
                            try:
                                await ws.send_text(msg)
                            except Exception:
                                disconnected.append(ws)
                        for ws in disconnected:
                            cls.unregister_connection(ws)

                finally:
                    db.close()
            except Exception as e:
                print(f"[AIS Simulator] Error: {e}")
                await asyncio.sleep(5.0)
