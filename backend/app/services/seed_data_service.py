import datetime
import json
from sqlalchemy.orm import Session
from app.core.security import get_password_hash
from app.models.models import (
    User, Port, Vessel, CargoRequirement, Shipment, ShipmentEvent,
    Alert, Notification, FreightRate, FreightForecast, CharterScenario, CharterApproval
)

def seed_database_if_empty(db: Session):
    # Check if users already exist
    if db.query(User).count() > 0:
        return

    print("[I-STELX] Initializing and seeding enterprise maritime master database...")

    # 1. Users with distinct RBAC roles
    users = [
        User(
            full_name="Rajiv Menon (Admin)",
            email="admin@istelx.in",
            phone="+91 98200 11223",
            organization="I-STELX Maritime Authority",
            department="Enterprise Systems & Governance",
            designation="Chief Technology & Logistics Officer",
            role="ADMIN",
            hashed_password=get_password_hash("Admin@12345"),
            status="APPROVED",
            is_active=True
        ),
        User(
            full_name="Vikramaditya Sharma",
            email="charter.manager@sail.in",
            phone="+91 98112 33445",
            organization="Steel Authority of India Limited (SAIL)",
            department="Raw Materials & Maritime Chartering",
            designation="Head of Vessel Chartering",
            role="Charter Manager",
            hashed_password=get_password_hash("Charter@12345"),
            status="APPROVED",
            is_active=True
        ),
        User(
            full_name="Ananya Roy Chowdhury",
            email="logistics.manager@sail.in",
            phone="+91 97480 55667",
            organization="Steel Authority of India Limited (SAIL)",
            department="Inbound Raw Material Logistics",
            designation="Senior Logistics Director",
            role="Logistics Manager",
            hashed_password=get_password_hash("Logistics@12345"),
            status="APPROVED",
            is_active=True
        ),
        User(
            full_name="Sanjay Patnaik",
            email="operations.manager@sail.in",
            phone="+91 94370 77889",
            organization="Steel Authority of India Limited (SAIL)",
            department="Port Operations & Terminal Coordination",
            designation="Operations Lead - East Coast Ports",
            role="Operations Manager",
            hashed_password=get_password_hash("Operations@12345"),
            status="APPROVED",
            is_active=True
        ),
        User(
            full_name="Pooja Deshmukh",
            email="viewer@istelx.in",
            phone="+91 98220 99001",
            organization="Ministry of Steel / Planning Board",
            department="Supply Chain Oversight",
            designation="Strategic Analyst",
            role="Management Viewer",
            hashed_password=get_password_hash("Viewer@12345"),
            status="APPROVED",
            is_active=True
        )
    ]
    db.add_all(users)
    db.commit()

    # 2. Ports (Indian Major & Private Ports + Key International Dry Bulk Origins)
    ports = [
        # Indian Ports
        Port(
            name="Visakhapatnam",
            code="INVTZ",
            country="India",
            is_indian_port=True,
            latitude=17.6868,
            longitude=83.2842,
            max_draft_m=14.5,
            max_loa_m=250.0,
            max_beam_m=35.0,
            max_dwt=120000.0,
            berths_count=14,
            current_congestion_level="MEDIUM",
            waiting_time_hours=11.4,
            port_status="OPERATIONAL",
            operational_notes="Deep outer harbor allows baby Capesize with tidal assistance; General Cargo Berth 13.5m."
        ),
        Port(
            name="Paradip",
            code="INPRT",
            country="India",
            is_indian_port=True,
            latitude=20.2644,
            longitude=86.6713,
            max_draft_m=14.5,
            max_loa_m=260.0,
            max_beam_m=38.0,
            max_dwt=130000.0,
            berths_count=16,
            current_congestion_level="MEDIUM",
            waiting_time_hours=14.2,
            port_status="OPERATIONAL",
            operational_notes="Mechanized coal berth operational. Average discharge rate 25,000 MT/day."
        ),
        Port(
            name="Haldia",
            code="INHAL",
            country="India",
            is_indian_port=True,
            latitude=22.0232,
            longitude=88.0645,
            max_draft_m=8.5,
            max_loa_m=190.0,
            max_beam_m=28.0,
            max_dwt=45000.0,
            berths_count=8,
            current_congestion_level="HIGH",
            waiting_time_hours=22.0,
            port_status="OPERATIONAL",
            operational_notes="Strict river Hooghly draft restriction (max 8.5m). Requires top-drop or Handysize only."
        ),
        Port(
            name="Dhamra",
            code="INDHR",
            country="India",
            is_indian_port=True,
            latitude=20.8032,
            longitude=86.9621,
            max_draft_m=18.0,
            max_loa_m=330.0,
            max_beam_m=50.0,
            max_dwt=200000.0,
            berths_count=6,
            current_congestion_level="LOW",
            waiting_time_hours=5.2,
            port_status="OPERATIONAL",
            operational_notes="Deepwater private port capable of receiving fully laden Capesize bulk carriers."
        ),
        Port(
            name="Gangavaram",
            code="INGGV",
            country="India",
            is_indian_port=True,
            latitude=17.6251,
            longitude=83.2429,
            max_draft_m=18.5,
            max_loa_m=330.0,
            max_beam_m=50.0,
            max_dwt=200000.0,
            berths_count=9,
            current_congestion_level="LOW",
            waiting_time_hours=6.5,
            port_status="OPERATIONAL",
            operational_notes="Deepwater port catering directly to Vizag Steel Plant (RINL) with direct conveyor connectivity."
        ),
        Port(
            name="Chennai",
            code="INMAA",
            country="India",
            is_indian_port=True,
            latitude=13.0827,
            longitude=80.2907,
            max_draft_m=15.0,
            max_loa_m=280.0,
            max_beam_m=42.0,
            max_dwt=140000.0,
            berths_count=12,
            current_congestion_level="LOW",
            waiting_time_hours=8.0,
            port_status="OPERATIONAL",
            operational_notes="Modern bulk handling berth with clean air regulations; dust suppression required."
        ),
        Port(
            name="Mormugao",
            code="INMRM",
            country="India",
            is_indian_port=True,
            latitude=15.4124,
            longitude=73.8018,
            max_draft_m=14.1,
            max_loa_m=235.0,
            max_beam_m=32.5,
            max_dwt=85000.0,
            berths_count=7,
            current_congestion_level="MEDIUM",
            waiting_time_hours=10.0,
            port_status="OPERATIONAL",
            operational_notes="Major iron ore export hub and coal import gateway on the Western seaboard."
        ),
        # International dry bulk export terminals
        Port(
            name="Hay Point",
            code="AUHPT",
            country="Australia",
            is_indian_port=False,
            latitude=-21.2842,
            longitude=149.3005,
            max_draft_m=19.5,
            max_loa_m=350.0,
            max_beam_m=55.0,
            max_dwt=250000.0,
            berths_count=5,
            current_congestion_level="LOW",
            waiting_time_hours=8.5,
            port_status="OPERATIONAL",
            operational_notes="Primary Australian metallurgical/coking coal export hub in Bowen Basin."
        ),
        Port(
            name="Newcastle",
            code="AUNTL",
            country="Australia",
            is_indian_port=False,
            latitude=-32.9283,
            longitude=151.7817,
            max_draft_m=15.2,
            max_loa_m=300.0,
            max_beam_m=48.0,
            max_dwt=180000.0,
            berths_count=8,
            current_congestion_level="MEDIUM",
            waiting_time_hours=18.0,
            port_status="OPERATIONAL",
            operational_notes="Largest coal exporting terminal on Australia East Coast."
        ),
        Port(
            name="Port Hedland",
            code="AUPHE",
            country="Australia",
            is_indian_port=False,
            latitude=-20.3128,
            longitude=118.5753,
            max_draft_m=19.8,
            max_loa_m=340.0,
            max_beam_m=58.0,
            max_dwt=260000.0,
            berths_count=10,
            current_congestion_level="LOW",
            waiting_time_hours=6.0,
            port_status="OPERATIONAL",
            operational_notes="World leading bulk iron ore export port with high-speed automated ship loaders."
        ),
        Port(
            name="Richards Bay",
            code="ZARCB",
            country="South Africa",
            is_indian_port=False,
            latitude=-28.8000,
            longitude=32.0500,
            max_draft_m=17.5,
            max_loa_m=330.0,
            max_beam_m=50.0,
            max_dwt=210000.0,
            berths_count=6,
            current_congestion_level="HIGH",
            waiting_time_hours=26.0,
            port_status="OPERATIONAL",
            operational_notes="Richards Bay Coal Terminal (RBCT); occasional rail delivery bottlenecks."
        )
    ]
    db.add_all(ports)
    db.commit()

    # 3. Vessels (Handysize, Supramax, Panamax, Capesize)
    vessels = [
        Vessel(
            name="MV STEEL VOYAGER",
            imo="9876543",
            vessel_type="Panamax",
            dwt=82000.0,
            capacity_mt=80000.0,
            draft_m=13.2,
            beam_m=32.2,
            loa_m=225.0,
            speed_knots=12.8,
            current_location="Bay of Bengal (En Route)",
            latitude=10.821,
            longitude=87.142,
            heading=312.0,
            availability_status="IN_TRANSIT",
            available_date="2026-11-02",
            daily_charter_rate_usd=23500.0,
            fuel_consumption_tpd=27.8,
            year_built=2021,
            flag="India"
        ),
        Vessel(
            name="MV BHARAT GAURAV",
            imo="9712044",
            vessel_type="Capesize",
            dwt=180000.0,
            capacity_mt=175000.0,
            draft_m=17.8,
            beam_m=45.0,
            loa_m=292.0,
            speed_knots=13.5,
            current_location="Singapore Roads (Anchorage)",
            latitude=1.280,
            longitude=103.850,
            heading=45.0,
            availability_status="AVAILABLE",
            available_date="2026-10-01",
            daily_charter_rate_usd=34000.0,
            fuel_consumption_tpd=46.5,
            year_built=2019,
            flag="India"
        ),
        Vessel(
            name="MV ODISHA PRIDE",
            imo="9654123",
            vessel_type="Supramax",
            dwt=58000.0,
            capacity_mt=56000.0,
            draft_m=12.2,
            beam_m=32.2,
            loa_m=190.0,
            speed_knots=12.4,
            current_location="Paradip Anchorage",
            latitude=20.210,
            longitude=86.720,
            heading=90.0,
            availability_status="AVAILABLE",
            available_date="2026-09-28",
            daily_charter_rate_usd=19500.0,
            fuel_consumption_tpd=22.0,
            year_built=2018,
            flag="India"
        ),
        Vessel(
            name="MV KALINGA SEAWAY",
            imo="9845112",
            vessel_type="Panamax",
            dwt=81500.0,
            capacity_mt=79000.0,
            draft_m=13.4,
            beam_m=32.2,
            loa_m=228.0,
            speed_knots=12.6,
            current_location="Malacca Strait",
            latitude=3.100,
            longitude=100.500,
            heading=320.0,
            availability_status="IN_TRANSIT",
            available_date="2026-10-18",
            daily_charter_rate_usd=24200.0,
            fuel_consumption_tpd=28.2,
            year_built=2020,
            flag="Marshall Islands"
        ),
        Vessel(
            name="MV VIZAG TRADER",
            imo="9923411",
            vessel_type="Capesize",
            dwt=182000.0,
            capacity_mt=178000.0,
            draft_m=18.1,
            beam_m=45.0,
            loa_m=295.0,
            speed_knots=13.0,
            current_location="Off Andhra Coast",
            latitude=16.800,
            longitude=84.200,
            heading=330.0,
            availability_status="IN_TRANSIT",
            available_date="2026-10-08",
            daily_charter_rate_usd=35500.0,
            fuel_consumption_tpd=48.0,
            year_built=2022,
            flag="India"
        ),
        Vessel(
            name="MV GANGA PIONEER",
            imo="9512399",
            vessel_type="Handysize",
            dwt=38000.0,
            capacity_mt=36000.0,
            draft_m=10.1,
            beam_m=28.5,
            loa_m=180.0,
            speed_knots=12.0,
            current_location="Haldia Berth 4",
            latitude=22.020,
            longitude=88.060,
            heading=0.0,
            availability_status="AVAILABLE",
            available_date="2026-09-30",
            daily_charter_rate_usd=16000.0,
            fuel_consumption_tpd=17.5,
            year_built=2017,
            flag="Liberia"
        ),
        Vessel(
            name="MV DECCAN ENTERPRISE",
            imo="9781290",
            vessel_type="Panamax",
            dwt=83000.0,
            capacity_mt=81000.0,
            draft_m=13.3,
            beam_m=32.2,
            loa_m=229.0,
            speed_knots=12.7,
            current_location="Chennai Anchorage",
            latitude=13.120,
            longitude=80.350,
            heading=180.0,
            availability_status="AVAILABLE",
            available_date="2026-10-02",
            daily_charter_rate_usd=23800.0,
            fuel_consumption_tpd=28.0,
            year_built=2020,
            flag="India"
        ),
        Vessel(
            name="MV MAHANADI TITAN",
            imo="9934188",
            vessel_type="Capesize",
            dwt=179000.0,
            capacity_mt=174000.0,
            draft_m=17.9,
            beam_m=45.0,
            loa_m=290.0,
            speed_knots=13.2,
            current_location="Port Hedland Berth",
            latitude=-20.310,
            longitude=118.570,
            heading=0.0,
            availability_status="COMMITTED",
            available_date="2026-10-24",
            daily_charter_rate_usd=33500.0,
            fuel_consumption_tpd=47.0,
            year_built=2021,
            flag="Panama"
        ),
        Vessel(
            name="MV CHOLA NAVIGATOR",
            imo="9687102",
            vessel_type="Supramax",
            dwt=63000.0,
            capacity_mt=61000.0,
            draft_m=12.8,
            beam_m=32.2,
            loa_m=199.0,
            speed_knots=12.5,
            current_location="Southern Indian Ocean",
            latitude=-12.500,
            longitude=65.000,
            heading=35.0,
            availability_status="IN_TRANSIT",
            available_date="2026-10-15",
            daily_charter_rate_usd=20500.0,
            fuel_consumption_tpd=24.0,
            year_built=2019,
            flag="India"
        ),
        Vessel(
            name="MV BENGAL CARRIER",
            imo="9481234",
            vessel_type="Handysize",
            dwt=34000.0,
            capacity_mt=32000.0,
            draft_m=9.8,
            beam_m=27.0,
            loa_m=175.0,
            speed_knots=11.8,
            current_location="Kolkata Outer Roads",
            latitude=21.500,
            longitude=88.200,
            heading=0.0,
            availability_status="AVAILABLE",
            available_date="2026-10-04",
            daily_charter_rate_usd=15200.0,
            fuel_consumption_tpd=16.0,
            year_built=2016,
            flag="India"
        ),
        Vessel(
            name="MV ANDHRA EXPRESS",
            imo="9812903",
            vessel_type="Panamax",
            dwt=82500.0,
            capacity_mt=80500.0,
            draft_m=13.2,
            beam_m=32.2,
            loa_m=225.0,
            speed_knots=12.9,
            current_location="Lombok Strait (En Route)",
            latitude=-8.500,
            longitude=115.700,
            heading=295.0,
            availability_status="IN_TRANSIT",
            available_date="2026-10-22",
            daily_charter_rate_usd=24000.0,
            fuel_consumption_tpd=27.5,
            year_built=2021,
            flag="India"
        ),
        Vessel(
            name="MV COROMANDEL STAR",
            imo="9700341",
            vessel_type="Supramax",
            dwt=57500.0,
            capacity_mt=55000.0,
            draft_m=12.0,
            beam_m=32.2,
            loa_m=189.0,
            speed_knots=12.3,
            current_location="Krishnapatnam Anchorage",
            latitude=14.250,
            longitude=80.150,
            heading=90.0,
            availability_status="AVAILABLE",
            available_date="2026-10-01",
            daily_charter_rate_usd=19800.0,
            fuel_consumption_tpd=22.5,
            year_built=2018,
            flag="Singapore"
        )
    ]
    db.add_all(vessels)
    db.commit()

    # 4. Cargo Requirements
    reqs = [
        CargoRequirement(
            requirement_code="REQ-2026-0012",
            cargo_type="Coking Coal",
            quantity_mt=80000.0,
            origin_country="Australia",
            origin_port="Hay Point",
            destination_port="Visakhapatnam",
            delivery_date="2026-10-28",
            laycan_start="2026-10-05",
            laycan_end="2026-10-14",
            preferred_vessel_type="Panamax",
            notes="High grade prime hard coking coal for Vizag Blast Furnace #3 blend.",
            status="CHARTERED",
            created_by="charter.manager@sail.in"
        ),
        CargoRequirement(
            requirement_code="REQ-2026-0014",
            cargo_type="Iron Ore",
            quantity_mt=170000.0,
            origin_country="Australia",
            origin_port="Port Hedland",
            destination_port="Gangavaram",
            delivery_date="2026-10-18",
            laycan_start="2026-09-28",
            laycan_end="2026-10-06",
            preferred_vessel_type="Capesize",
            notes="Pilbara high-grade fines for sintering plant.",
            status="CHARTERED",
            created_by="charter.manager@sail.in"
        ),
        CargoRequirement(
            requirement_code="REQ-2026-0018",
            cargo_type="Thermal Coal",
            quantity_mt=75000.0,
            origin_country="Australia",
            origin_port="Newcastle",
            destination_port="Haldia",
            delivery_date="2026-11-04",
            laycan_start="2026-10-10",
            laycan_end="2026-10-18",
            preferred_vessel_type="Panamax",
            notes="Captive power plant fuel supply. Note Haldia draft constraint requires top-drop or lightering.",
            status="CHARTERED",
            created_by="charter.manager@sail.in"
        ),
        CargoRequirement(
            requirement_code="REQ-2026-0021",
            cargo_type="Limestone",
            quantity_mt=55000.0,
            origin_country="Oman",
            origin_port="Salalah",
            destination_port="Paradip",
            delivery_date="2026-11-12",
            laycan_start="2026-10-15",
            laycan_end="2026-10-22",
            preferred_vessel_type="Supramax",
            notes="Flux quality limestone for Steel Melting Shop converter refining.",
            status="ANALYZED",
            created_by="charter.manager@sail.in"
        ),
        CargoRequirement(
            requirement_code="REQ-2026-0025",
            cargo_type="Coking Coal",
            quantity_mt=175000.0,
            origin_country="Australia",
            origin_port="Gladstone",
            destination_port="Dhamra",
            delivery_date="2026-11-20",
            laycan_start="2026-10-20",
            laycan_end="2026-10-28",
            preferred_vessel_type="Capesize",
            notes="Deep draft Capesize shipment into Dhamra port.",
            status="DRAFT",
            created_by="charter.manager@sail.in"
        )
    ]
    db.add_all(reqs)
    db.commit()

    # 5. Shipments (Live control tower & active voyages)
    steel_voyager = db.query(Vessel).filter(Vessel.imo == "9876543").first()
    vizag_trader = db.query(Vessel).filter(Vessel.imo == "9923411").first()
    kalinga_seaway = db.query(Vessel).filter(Vessel.imo == "9845112").first()
    chola_nav = db.query(Vessel).filter(Vessel.imo == "9687102").first()
    andhra_exp = db.query(Vessel).filter(Vessel.imo == "9812903").first()

    shipments = [
        Shipment(
            shipment_code="SHP-2026-0089",
            requirement_id=1,
            vessel_id=steel_voyager.id,
            cargo_type="Coking Coal",
            quantity_mt=80000.0,
            origin_port="Hay Point",
            destination_port="Visakhapatnam",
            departure_time="11 Oct 2026, 04:30 UTC",
            scheduled_eta="28 Oct 08:00",
            current_eta="28 Oct 21:30",
            eta_variance_hours=13.5,
            status="IN TRANSIT",
            progress_pct=68.0,
            current_lat=10.821,
            current_lng=87.142,
            current_speed_knots=12.8,
            current_heading=312.0,
            total_distance_nm=4650.0,
            remaining_distance_nm=1488.0,
            planned_cost_cr=16.43,
            actual_cost_cr=16.62,
            planned_duration_days=17.0,
            actual_duration_days=17.5,
            port_waiting_hours=11.4,
            risk_level="MEDIUM",
            route_waypoints_json=json.dumps([
                [-21.28, 149.30], [-18.50, 147.80], [-10.60, 142.20], [-8.80, 130.00],
                [-8.50, 115.70], [-5.80, 105.70], [2.00, 95.00], [6.00, 90.00],
                [10.82, 87.14], [14.50, 84.80], [17.68, 83.28]
            ])
        ),
        Shipment(
            shipment_code="SHP-2026-0085",
            requirement_id=2,
            vessel_id=vizag_trader.id,
            cargo_type="Iron Ore",
            quantity_mt=170000.0,
            origin_port="Port Hedland",
            destination_port="Gangavaram",
            departure_time="02 Oct 2026, 12:00 UTC",
            scheduled_eta="18 Oct 06:00",
            current_eta="18 Oct 07:30",
            eta_variance_hours=1.5,
            status="APPROACHING PORT",
            progress_pct=92.0,
            current_lat=16.800,
            current_lng=84.200,
            current_speed_knots=13.0,
            current_heading=330.0,
            total_distance_nm=3850.0,
            remaining_distance_nm=308.0,
            planned_cost_cr=28.75,
            actual_cost_cr=28.80,
            planned_duration_days=15.5,
            actual_duration_days=15.6,
            port_waiting_hours=6.5,
            risk_level="LOW",
            route_waypoints_json=json.dumps([
                [-20.31, 118.57], [-12.00, 110.00], [-6.00, 104.00], [3.00, 93.00],
                [12.00, 88.00], [16.80, 84.20], [17.62, 83.24]
            ])
        ),
        Shipment(
            shipment_code="SHP-2026-0092",
            requirement_id=3,
            vessel_id=kalinga_seaway.id,
            cargo_type="Thermal Coal",
            quantity_mt=75000.0,
            origin_port="Newcastle",
            destination_port="Haldia",
            departure_time="14 Oct 2026, 09:15 UTC",
            scheduled_eta="04 Nov 14:00",
            current_eta="05 Nov 18:00",
            eta_variance_hours=28.0,
            status="IN TRANSIT",
            progress_pct=42.0,
            current_lat=3.100,
            current_lng=100.500,
            current_speed_knots=12.6,
            current_heading=320.0,
            total_distance_nm=5100.0,
            remaining_distance_nm=2958.0,
            planned_cost_cr=18.20,
            actual_cost_cr=18.90,
            planned_duration_days=21.0,
            actual_duration_days=22.2,
            port_waiting_hours=22.0,
            risk_level="CRITICAL",
            route_waypoints_json=json.dumps([
                [-32.92, 151.78], [-25.00, 154.00], [-10.00, 145.00], [-8.00, 120.00],
                [3.10, 100.50], [6.00, 92.00], [18.00, 88.50], [22.02, 88.06]
            ])
        ),
        Shipment(
            shipment_code="SHP-2026-0094",
            vessel_id=chola_nav.id,
            cargo_type="Coking Coal",
            quantity_mt=60000.0,
            origin_port="Richards Bay",
            destination_port="Chennai",
            departure_time="08 Oct 2026, 18:00 UTC",
            scheduled_eta="27 Oct 10:00",
            current_eta="27 Oct 14:00",
            eta_variance_hours=4.0,
            status="IN TRANSIT",
            progress_pct=54.0,
            current_lat=-12.500,
            current_lng=65.000,
            current_speed_knots=12.5,
            current_heading=35.0,
            total_distance_nm=4400.0,
            remaining_distance_nm=2024.0,
            planned_cost_cr=13.10,
            actual_cost_cr=13.18,
            planned_duration_days=18.5,
            actual_duration_days=18.7,
            port_waiting_hours=8.0,
            risk_level="LOW",
            route_waypoints_json=json.dumps([
                [-28.80, 32.05], [-20.00, 40.00], [-12.50, 65.00], [5.00, 75.00],
                [10.00, 80.00], [13.08, 80.29]
            ])
        ),
        Shipment(
            shipment_code="SHP-2026-0096",
            vessel_id=andhra_exp.id,
            cargo_type="Coking Coal",
            quantity_mt=80000.0,
            origin_port="Hay Point",
            destination_port="Paradip",
            departure_time="16 Oct 2026, 06:00 UTC",
            scheduled_eta="02 Nov 12:00",
            current_eta="02 Nov 16:00",
            eta_variance_hours=4.0,
            status="IN TRANSIT",
            progress_pct=31.0,
            current_lat=-8.500,
            current_lng=115.700,
            current_speed_knots=12.9,
            current_heading=295.0,
            total_distance_nm=4720.0,
            remaining_distance_nm=3256.8,
            planned_cost_cr=16.85,
            actual_cost_cr=16.92,
            planned_duration_days=17.2,
            actual_duration_days=17.4,
            port_waiting_hours=14.2,
            risk_level="LOW",
            route_waypoints_json=json.dumps([
                [-21.28, 149.30], [-10.60, 142.20], [-8.50, 115.70], [6.00, 92.00],
                [16.00, 87.00], [20.26, 86.67]
            ])
        ),
        # Completed benchmark shipment for Planned vs Actual Analytics
        Shipment(
            shipment_code="SHP-2026-0078",
            vessel_id=steel_voyager.id,
            cargo_type="Coking Coal",
            quantity_mt=80000.0,
            origin_port="Hay Point",
            destination_port="Visakhapatnam",
            departure_time="02 Sep 2026, 08:00 UTC",
            scheduled_eta="19 Sep 2026, 08:00",
            current_eta="20 Sep 2026, 03:30",
            eta_variance_hours=19.5,
            status="COMPLETED",
            progress_pct=100.0,
            current_lat=17.6868,
            current_lng=83.2842,
            current_speed_knots=0.0,
            current_heading=0.0,
            total_distance_nm=4650.0,
            remaining_distance_nm=0.0,
            planned_cost_cr=16.43,
            actual_cost_cr=16.71,
            planned_duration_days=16.5,
            actual_duration_days=17.8,
            port_waiting_hours=11.4,
            risk_level="LOW",
            route_waypoints_json=json.dumps([])
        )
    ]
    db.add_all(shipments)
    db.commit()

    # 6. Shipment Events for Voyage Timeline
    s1 = db.query(Shipment).filter(Shipment.shipment_code == "SHP-2026-0089").first()
    events = [
        ShipmentEvent(
            shipment_id=s1.id,
            event_type="FIXTURE_APPROVED",
            description="Charter fixture approved under CHT-2026-0045 for MV STEEL VOYAGER at $24.30/MT.",
            location_name="SAIL Commercial HQ, New Delhi",
            timestamp="05 Oct 2026, 11:30 UTC",
            severity="SUCCESS"
        ),
        ShipmentEvent(
            shipment_id=s1.id,
            event_type="BERTHED_LOADING",
            description="Vessel safely berthed at Hay Point Coal Terminal Berth #2. Loading commenced.",
            location_name="Hay Point, Australia",
            timestamp="10 Oct 2026, 14:00 UTC",
            severity="INFO"
        ),
        ShipmentEvent(
            shipment_id=s1.id,
            event_type="DEPARTED",
            description="Loaded 80,000 MT prime hard coking coal. Bills of lading signed, voyage commenced.",
            location_name="Hay Point, Australia",
            timestamp="11 Oct 2026, 04:30 UTC",
            severity="INFO"
        ),
        ShipmentEvent(
            shipment_id=s1.id,
            event_type="WAYPOINT_CROSSED",
            description="Navigated Torres Strait waypoint under mandatory pilotage.",
            location_name="Torres Strait (10.6°S, 142.2°E)",
            timestamp="14 Oct 2026, 19:20 UTC",
            severity="INFO"
        ),
        ShipmentEvent(
            shipment_id=s1.id,
            event_type="WEATHER_DELAY_NOTICE",
            description="Encountered monsoon swell in eastern Bay of Bengal. Speed adjusted from 13.5 to 12.8 knots.",
            location_name="Bay of Bengal (10.8°N, 87.1°E)",
            timestamp="22 Oct 2026, 08:45 UTC",
            severity="WARNING"
        )
    ]
    db.add_all(events)

    # 7. Enterprise Alerts
    alerts = [
        Alert(
            shipment_id=s1.id,
            vessel_id=steel_voyager.id,
            category="Schedule Risk",
            severity="CRITICAL",
            message="ETA delayed > 13.5 hours for MV STEEL VOYAGER due to Bay of Bengal weather & Vizag berth lineup.",
            evidence="Sailing speed dropped to 12.8 knots; Visakhapatnam Port queue currently reports 11.4h average waiting time.",
            is_read=False,
            is_acknowledged=False
        ),
        Alert(
            shipment_id=3,
            vessel_id=kalinga_seaway.id,
            category="Port Risk",
            severity="CRITICAL",
            message="Haldia Port congestion spike: Waiting time increased to 22.0 hours. River Hooghly draft restriction 8.5m.",
            evidence="Dock master bulletin reports lock gate scheduled maintenance; demurrage exposure estimated at ₹0.35 Cr.",
            is_read=False,
            is_acknowledged=False
        ),
        Alert(
            category="Market Risk",
            severity="MARKET",
            message="Pacific Panamax spot index increased +4.2% week-on-week ($24.30 -> $25.20/MT).",
            evidence="BDI Panamax time-charter average gained 850 points driven by Australian coal export tender volumes.",
            is_read=False,
            is_acknowledged=False
        ),
        Alert(
            shipment_id=2,
            vessel_id=vizag_trader.id,
            category="Operational Risk",
            severity="INFO",
            message="MV VIZAG TRADER entered Gangavaram 60 NM outer approach geofence zone.",
            evidence="Telemetry confirms 13.0 knots speed on 330° heading. Berth #3 cleared for direct mechanized unloader discharge.",
            is_read=True,
            is_acknowledged=True
        ),
        Alert(
            shipment_id=6,
            vessel_id=steel_voyager.id,
            category="Operational Risk",
            severity="SUCCESS",
            message="Shipment SHP-2026-0078 successfully completed at Visakhapatnam Port. All 80,000 MT discharged.",
            evidence="Final outturn certificate issued. Total landed variance within 1.7% of baseline target.",
            is_read=True,
            is_acknowledged=True
        )
    ]
    db.add_all(alerts)

    # 8. Notifications
    notifications = [
        Notification(
            title="Charter Fixture CHT-2026-0045 Approved",
            message="Head of Chartering approved fixture for 80,000 MT Coking Coal on MV STEEL VOYAGER.",
            category="Charter"
        ),
        Notification(
            title="Bay of Bengal Weather Advisory",
            message="Monsoon swell warning issued for shipping corridor between 85°E and 90°E.",
            category="Risk"
        ),
        Notification(
            title="Port Congestion Update",
            message="Visakhapatnam queue normalized to 11.4h waiting; Haldia remains constrained at 22.0h.",
            category="Port"
        )
    ]
    db.add_all(notifications)
    db.commit()

    print("[I-STELX] Database seeded successfully with enterprise maritime demo dataset.")
