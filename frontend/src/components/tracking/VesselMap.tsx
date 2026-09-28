import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Shipment, Port } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Ship, Compass, Gauge, Clock, Anchor, MapPin, AlertTriangle, ExternalLink, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface VesselMapProps {
  shipments: Shipment[];
  ports: Port[];
  selectedShipmentId?: number | null;
  onSelectShipment?: (shipment: Shipment) => void;
  height?: string;
  zoom?: number;
  center?: [number, number];
}

// Custom Leaflet DivIcon for Vessels with directional rotation
const createVesselIcon = (shipment: Shipment, isSelected: boolean) => {
  const heading = shipment.current_heading || 0;
  const isDelayed = shipment.eta_variance_hours > 6.0;
  const color = isDelayed ? '#D92D20' : (shipment.status === 'APPROACHING PORT' ? '#00843D' : '#0867B2');

  const html = `
    <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
      ${isSelected ? `<div style="position: absolute; inset: -4px; border-radius: 50%; border: 2px solid #FF7A00; animation: ping 2s infinite; opacity: 0.6;"></div>` : ''}
      <div style="
        width: 28px; 
        height: 28px; 
        background: ${color}; 
        border: 2px solid #FFFFFF; 
        border-radius: 50%; 
        box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); 
        display: flex; 
        align-items: center; 
        justify-content: center;
        transform: rotate(${heading}deg);
        transition: transform 0.5s ease-out;
      ">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="#FFFFFF">
          <path d="M12 2L4 20L12 16L20 20L12 2Z" />
        </svg>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'vessel-marker-icon',
    iconSize: [34, 34],
    iconAnchor: [17, 17]
  });
};

// Custom Leaflet DivIcon for Ports
const createPortIcon = (port: Port) => {
  const isIndian = port.is_indian_port;
  const bg = isIndian ? '#063B68' : '#64748B';
  const html = `
    <div style="
      background: ${bg}; 
      color: #FFFFFF; 
      border: 2px solid #FFFFFF; 
      border-radius: 4px; 
      padding: 2px 5px; 
      font-size: 9px; 
      font-weight: 700; 
      display: flex; 
      align-items: center; 
      gap: 3px; 
      box-shadow: 0 2px 4px rgba(0,0,0,0.25);
      white-space: nowrap;
    ">
      <span>⚓ ${port.name}</span>
    </div>
  `;
  return L.divIcon({
    html,
    className: 'port-marker-icon',
    iconSize: [80, 20],
    iconAnchor: [40, 10]
  });
};

// Auto-center map helper
const MapAutoPan: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

export const VesselMap: React.FC<VesselMapProps> = ({
  shipments,
  ports,
  selectedShipmentId,
  onSelectShipment,
  height = '540px',
  zoom = 4,
  center = [12.0, 85.0]
}) => {
  const navigate = useNavigate();
  const [activeShipment, setActiveShipment] = useState<Shipment | null>(null);

  useEffect(() => {
    if (selectedShipmentId) {
      const found = shipments.find(s => s.id === selectedShipmentId);
      if (found) setActiveShipment(found);
    } else if (shipments.length > 0 && !activeShipment) {
      setActiveShipment(shipments[0]);
    }
  }, [selectedShipmentId, shipments, activeShipment]);

  return (
    <div className="relative rounded-xl overflow-hidden border border-[#CBD5E1] shadow-md bg-[#E5EEF8]" style={{ height }}>
      {/* Top Banner Notice */}
      <div className="absolute top-3 left-3 z-[1000] bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-[#CBD5E1] shadow-md flex items-center gap-2 text-xs font-semibold text-[#063B68]">
        <span className="w-2 h-2 rounded-full bg-[#00843D] animate-ping" />
        <span className="font-bold">LIVE MARITIME CONTROL TOWER</span>
        <span className="text-[10px] bg-[#EBF4FC] text-[#0867B2] px-2 py-0.5 rounded font-mono">
          DEMO / SIMULATED AIS
        </span>
      </div>

      {/* Map Element */}
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <MapAutoPan center={center} zoom={zoom} />

        {/* Crisp OpenStreetMap / CARTO Voyager Style Tile with Authorized API Key */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url={`https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=${import.meta.env.VITE_CARTO_API_KEY || 'cb1_421o_1_818db85b781f5985b191aea8'}`}
        />

        {/* Port Markers & Geofences */}
        {ports.map((port) => (
          <React.Fragment key={port.id}>
            <Marker
              position={[port.latitude, port.longitude]}
              icon={createPortIcon(port)}
            >
              <Popup>
                <div className="p-1 space-y-1 text-xs">
                  <div className="font-bold text-sm text-[#063B68]">{port.name} Port ({port.code})</div>
                  <div className="text-[#64748B]">{port.country} • Max Draft: <span className="font-semibold text-[#102A43]">{port.max_draft_m}m</span></div>
                  <div className="text-[#64748B]">Berths: <span className="font-semibold">{port.berths_count}</span> • Waiting: <span className="font-semibold text-[#D92D20]">{port.waiting_time_hours}h</span></div>
                  <div className="pt-1">
                    <StatusBadge status={port.current_congestion_level + ' CONGESTION'} />
                  </div>
                </div>
              </Popup>
            </Marker>

            {/* Indian Port Geofence Radii: 60 NM outer boundary (0.75 deg approx) */}
            {port.is_indian_port && (
              <Circle
                center={[port.latitude, port.longitude]}
                radius={90000} // ~50 nautical miles in meters
                pathOptions={{
                  color: '#0867B2',
                  fillColor: '#0867B2',
                  fillOpacity: 0.05,
                  weight: 1,
                  dashArray: '4, 4'
                }}
              />
            )}
          </React.Fragment>
        ))}

        {/* Vessel Route Polylines */}
        {shipments.map((s) => {
          const isSelected = activeShipment?.id === s.id;
          const waypoints = s.route_waypoints && s.route_waypoints.length > 0 ? s.route_waypoints : null;

          if (!waypoints) return null;

          return (
            <Polyline
              key={`route-${s.id}`}
              positions={waypoints}
              pathOptions={{
                color: isSelected ? '#FF7A00' : '#0867B2',
                weight: isSelected ? 3.5 : 2,
                opacity: isSelected ? 0.9 : 0.4,
                dashArray: isSelected ? '6, 6' : undefined
              }}
            />
          );
        })}

        {/* Vessel Markers */}
        {shipments.map((s) => {
          const isSelected = activeShipment?.id === s.id;
          if (typeof s.current_lat !== 'number' || typeof s.current_lng !== 'number') return null;

          return (
            <Marker
              key={`vessel-${s.id}`}
              position={[s.current_lat, s.current_lng]}
              icon={createVesselIcon(s, isSelected)}
              eventHandlers={{
                click: () => {
                  setActiveShipment(s);
                  if (onSelectShipment) onSelectShipment(s);
                }
              }}
            >
              <Popup>
                <div className="p-1.5 space-y-1.5 min-w-[200px]">
                  <div className="flex items-center justify-between border-b pb-1">
                    <span className="font-heading font-bold text-sm text-[#063B68]">
                      {s.vessel_name || 'Vessel'}
                    </span>
                    <span className="text-[10px] font-mono text-[#64748B]">IMO {s.vessel_imo || '9876543'}</span>
                  </div>
                  <div className="text-xs text-[#475569]">
                    <span>Cargo: </span>
                    <span className="font-semibold text-[#102A43]">{s.quantity_mt?.toLocaleString()} MT {s.cargo_type}</span>
                  </div>
                  <div className="text-xs text-[#475569]">
                    <span>Route: </span>
                    <span className="font-semibold">{s.origin_port} → {s.destination_port}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <StatusBadge status={s.status} />
                    <button
                      onClick={() => navigate(`/shipments/${s.id}`)}
                      className="text-[11px] font-bold text-[#0867B2] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Voyage Details</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Selected Vessel Telemetry Floating Card */}
      {activeShipment && (
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:w-96 z-[1000] bg-white/95 backdrop-blur-md rounded-xl p-4 border border-[#CBD5E1] shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#063B68] text-white">
                <Ship className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-[#063B68] leading-tight">
                  {activeShipment.vessel_name || 'MV STEEL VOYAGER'}
                </h4>
                <span className="text-[10px] font-mono text-[#64748B]">
                  {activeShipment.vessel_type || 'Panamax'} • IMO {activeShipment.vessel_imo || '9876543'}
                </span>
              </div>
            </div>
            <StatusBadge status={activeShipment.status} />
          </div>

          {/* Telemetry Grid */}
          <div className="grid grid-cols-3 gap-2 py-2 border-y border-[#E2E8F0] my-2 text-center text-xs">
            <div className="bg-[#F8FAFC] p-1.5 rounded">
              <div className="text-[10px] text-[#64748B] flex items-center justify-center gap-0.5">
                <Gauge className="w-3 h-3 text-[#0867B2]" /> Speed
              </div>
              <div className="font-mono font-bold text-[#102A43]">{activeShipment.current_speed_knots} kts</div>
            </div>
            <div className="bg-[#F8FAFC] p-1.5 rounded">
              <div className="text-[10px] text-[#64748B] flex items-center justify-center gap-0.5">
                <Compass className="w-3 h-3 text-[#00843D]" /> Heading
              </div>
              <div className="font-mono font-bold text-[#102A43]">{activeShipment.current_heading}°</div>
            </div>
            <div className="bg-[#F8FAFC] p-1.5 rounded">
              <div className="text-[10px] text-[#64748B] flex items-center justify-center gap-0.5">
                <Clock className="w-3 h-3 text-[#FF7A00]" /> Progress
              </div>
              <div className="font-mono font-bold text-[#102A43]">{activeShipment.progress_pct}%</div>
            </div>
          </div>

          {/* Voyage Route & ETA */}
          <div className="space-y-1 text-xs mb-3">
            <div className="flex items-center justify-between">
              <span className="text-[#64748B]">Route:</span>
              <span className="font-semibold text-[#102A43]">{activeShipment.origin_port} → {activeShipment.destination_port}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#64748B]">Current ETA:</span>
              <span className="font-semibold text-[#063B68]">{activeShipment.current_eta}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#64748B]">Variance:</span>
              <span className={`font-bold ${activeShipment.eta_variance_hours > 6 ? 'text-[#D92D20]' : 'text-[#00843D]'}`}>
                {activeShipment.eta_variance_hours > 0 ? `+${activeShipment.eta_variance_hours.toFixed(1)}h Delay` : 'On Schedule'}
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate(`/shipments/${activeShipment.id}`)}
            className="w-full py-1.5 bg-[#063B68] hover:bg-[#0867B2] text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Open Comprehensive Voyage Dashboard</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
