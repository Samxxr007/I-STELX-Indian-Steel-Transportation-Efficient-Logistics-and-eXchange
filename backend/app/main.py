import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.database import Base, engine, SessionLocal
from app.services.seed_data_service import seed_database_if_empty
from app.services.ais_simulator_service import AISSimulatorService

# Import routers
from app.api.routers import (
    auth, dashboard, requirements, freight, vessels, ports,
    cost, charter, shipments, tracking, eta, alerts, simulation,
    analytics, admin, digital_twin
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 1. Initialize Tables
    Base.metadata.create_all(bind=engine)
    # 2. Seed Demo Master Data
    db = SessionLocal()
    try:
        seed_database_if_empty(db)
    finally:
        db.close()
    
    # 3. Start AIS Simulator Background Task
    sim_task = asyncio.create_task(AISSimulatorService.run_simulation_loop())
    yield
    sim_task.cancel()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="I-STELX - Intelligent Maritime Logistics & Vessel-Chartering Platform for Indian Steel Sector",
    version="2.4.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
api_v1 = settings.API_V1_STR
app.include_router(auth.router, prefix=api_v1)
app.include_router(dashboard.router, prefix=api_v1)
app.include_router(requirements.router, prefix=api_v1)
app.include_router(freight.router, prefix=api_v1)
app.include_router(vessels.router, prefix=api_v1)
app.include_router(ports.router, prefix=api_v1)
app.include_router(cost.router, prefix=api_v1)
app.include_router(charter.router, prefix=api_v1)
app.include_router(shipments.router, prefix=api_v1)
app.include_router(tracking.router, prefix=api_v1)
app.include_router(eta.router, prefix=api_v1)
app.include_router(alerts.router, prefix=api_v1)
app.include_router(simulation.router, prefix=api_v1)
app.include_router(analytics.router, prefix=api_v1)
app.include_router(admin.router, prefix=api_v1)
app.include_router(digital_twin.router, prefix=api_v1)

@app.get("/")
def root():
    return {
        "platform": "I-STELX",
        "title": "Indian Steel Transportation, Efficient Logistics & eXchange",
        "tagline": "Predict • Optimize • Track • Deliver",
        "status": "OPERATIONAL",
        "version": "2.4.0",
        "notice": settings.SIMULATED_DATA_NOTICE
    }

# WebSockets for live AIS telemetry & alert broadcasting
@app.websocket("/ws/telemetry")
async def websocket_telemetry_endpoint(websocket: WebSocket):
    await websocket.accept()
    AISSimulatorService.register_connection(websocket)
    try:
        while True:
            # Keep connection alive; receives any client pings
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        AISSimulatorService.unregister_connection(websocket)
    except Exception:
        AISSimulatorService.unregister_connection(websocket)

@app.websocket("/ws/vessels/{vessel_id}")
async def websocket_vessel_endpoint(websocket: WebSocket, vessel_id: int):
    await websocket.accept()
    AISSimulatorService.register_connection(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        AISSimulatorService.unregister_connection(websocket)
    except Exception:
        AISSimulatorService.unregister_connection(websocket)

@app.websocket("/ws/alerts")
async def websocket_alerts_endpoint(websocket: WebSocket):
    await websocket.accept()
    AISSimulatorService.register_connection(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        AISSimulatorService.unregister_connection(websocket)
    except Exception:
        AISSimulatorService.unregister_connection(websocket)

@app.websocket("/ws/shipments/{shipment_id}/cargo")
async def websocket_cargo_endpoint(websocket: WebSocket, shipment_id: str):
    await websocket.accept()
    AISSimulatorService.register_connection(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        AISSimulatorService.unregister_connection(websocket)
    except Exception:
        AISSimulatorService.unregister_connection(websocket)

