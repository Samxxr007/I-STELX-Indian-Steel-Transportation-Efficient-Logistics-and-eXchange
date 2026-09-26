# I-STELX
### Indian Steel Transportation, Efficient Logistics & eXchange
**TAGLINE:** Predict • Optimize • Track • Deliver

---

## 1. Overview & Objective

**I-STELX** is an intelligent maritime logistics, vessel-chartering, and fleet control tower web application engineered specifically for dry bulk raw material transportation in the Indian steel sector (Coking Coal, Thermal Coal, Iron Ore, Limestone, Dolomite, Manganese Ore).

The platform supports the complete end-to-end commercial & operational lifecycle:
```
User Registration 
  → Login (RBAC) 
  → Command Center 
  → Create Cargo Requirement 
  → Freight Rate ML Forecast (7d / 15d / 30d with 90% Confidence Bands) 
  → Vessel Selection & Optimization 
  → Port Compatibility Engine (Draft, LOA, Beam, DWT checks) 
  → Landed Cost Accounting (INR Crores & USD/MT) 
  → Explainable AI Charter Advisor 
  → Fixture Approval Workflow 
  → Shipment Creation 
  → Live Vessel Tracking Control Tower 
  → Realtime AIS Telemetry & Geofencing 
  → ETA Intelligence & Delay Prediction 
  → Multi-Risk Alert Center 
  → What-If Sensitivity Simulator 
  → Shipment Completion 
  → Planned vs Actual Audit Analytics & PDF/CSV Export
```

---

## 2. Official Branding & Color Palette

- **PRIMARY:** `#063B68` (Deep maritime navy)
- **SECONDARY:** `#0867B2` (Ocean blue)
- **ACCENT:** `#FF7A00` (Saffron / Industrial orange)
- **SUCCESS:** `#00843D` (Indian green)
- **BACKGROUND:** `#F5F8FC`
- **CARD:** `#FFFFFF`
- **TEXT:** `#102A43`
- **DANGER:** `#D92D20`
- **WARNING:** `#F59E0B`

---

## 3. Technology Stack

- **Frontend:**
  - React 19 + TypeScript + Vite
  - Tailwind CSS v4 design system
  - Lucide React icons
  - Recharts (Time-series freight curves, confidence intervals, cargo distributions, monthly throughput)
  - Leaflet + React-Leaflet + OpenStreetMap Voyager Tiles
  - jsPDF + AutoTable (Executive PDF report generation)
  - React Router v7

- **Backend:**
  - FastAPI (Python 3.13)
  - SQLAlchemy ORM + SQLite (with PostgreSQL compatibility)
  - JWT Authentication (PyJWT) + bcrypt password hashing
  - Machine Learning: Scikit-learn, Pandas, NumPy (Ensemble Ridge + Random Forest with strict chronological time-series splitting, MAE, RMSE, MAPE evaluation)
  - Realtime WebSockets for live AIS telemetry broadcasts & geofence events

---

## 4. Demo User Accounts & RBAC Roles

| Role | Name | Email | Password | Scope of Authority |
|---|---|---|---|---|
| **ADMIN** | Rajiv Menon | `admin@istelx.in` | `Admin@12345` | Full system governance, user approvals, master data, system parameters |
| **Charter Manager** | Vikramaditya Sharma | `charter.manager@sail.in` | `Charter@12345` | Requirements creation, freight ML forecasting, AI Charter Advisor, fixture approval |
| **Logistics Manager** | Ananya Roy Chowdhury | `logistics.manager@sail.in` | `Logistics@12345` | Shipment creation, live fleet control tower, route management, ETA intelligence |
| **Operations Manager** | Sanjay Patnaik | `operations.manager@sail.in` | `Operations@12345` | Port operations, berth queues, geofence monitoring, delay mitigation |
| **Management Viewer** | Pooja Deshmukh | `viewer@istelx.in` | `Viewer@12345` | Executive command center, planned vs actual variance reports, analytics |

*Note: An interactive **Role Switcher** is accessible in the bottom-left sidebar of the application for instant RBAC switching without re-logging.*

---

## 5. Running the Application Locally

### A. Start the Backend API Server:
```bash
cd backend
py -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```
*Backend API docs available at: `http://127.0.0.1:8000/docs`*

### B. Start the Frontend Application:
```bash
cd frontend
npm run dev
```
*Frontend interface available at: `http://localhost:5173/`*

---

## 6. Main Demo Flow

1. **Animated Loading Page (`/`):**
   - Central animated I-STELX logo with pulsing radar rings, hydrodynamic waves, and 0% → 100% intelligence initialization.
2. **Public Landing Page (`/landing`):**
   - Hero maritime visualization, 9-step workflow architecture, and integrated capability highlights.
3. **Secure Sign In (`/login`):**
   - Sign in as Charter Manager or click quick demo account pills.
4. **Command Center (`/dashboard`):**
   - 6 KPI Cards (Active Shipments, Vessels at Sea, Cargo in Transit, Arriving This Week, Freight Exposure, Active Alerts).
   - Interactive Leaflet Vessel Map with real maritime corridors.
   - Live freight trend card and port congestion matrix.
5. **New Cargo Requirement (`/requirements/new`):**
   - Input volume (e.g. 80,000 MT Coking Coal, Hay Point → Visakhapatnam).
   - Click **ANALYZE REQUIREMENT** to execute the 6-step progress pipeline.
6. **AI Charter Advisor (`/charter-advisor`):**
   - Multi-criteria explainable score (88.5/100) with itemized positive drivers & cautions.
   - Click **REQUEST CHARTER APPROVAL** → **EXECUTE APPROVAL** to issue Charter Fixture `CHT-2026-0045`.
7. **Shipment Lifecycle & Control Tower (`/shipments` & `/tracking`):**
   - Click **INITIALIZE SHIPMENT & TRACK VOYAGE** to enter the Control Tower.
   - Track live simulated AIS speed, heading, waypoints, and ETA predictions.
8. **What-If Sensitivity Simulator (`/simulator`):**
   - Test market shocks (±20% freight, ±30% bunker fuel, 0-7 days port delay) with instant Base vs Scenario diff.
9. **Planned vs Actual Audit & PDF Report (`/reports`):**
   - Review benchmark shipment `SHP-2026-0078` variance (Planned ₹16.43 Cr vs Actual ₹16.71 Cr) and export official PDF.
