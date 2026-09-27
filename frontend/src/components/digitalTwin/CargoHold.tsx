import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { DigitalTwinHold } from '../../types/digitalTwin';
import { CargoMaterial } from './CargoMaterial';
import { AlertTriangle } from 'lucide-react';

interface CargoHoldProps {
  hold: DigitalTwinHold;
  position: [number, number, number];
  isSelected: boolean;
  onSelect: (hold: DigitalTwinHold) => void;
  onHover: (hold: DigitalTwinHold | null, screenPos?: { x: number; y: number }) => void;
  xRayMode?: boolean;
}

export const CargoHold: React.FC<CargoHoldProps> = ({
  hold,
  position,
  isSelected,
  onSelect,
  onHover,
  xRayMode = false
}) => {
  const [hovered, setHovered] = useState(false);
  const alertBeaconRef = useRef<THREE.Mesh>(null);
  const internalLightRef = useRef<THREE.PointLight>(null);

  // Clamp fill ratio between 0 and 1
  const capacity = hold.capacity_mt > 0 ? hold.capacity_mt : 17000;
  const loaded = hold.loaded_mt || 0;
  const fillPercentage = Math.min(1, Math.max(0, loaded / capacity));
  const utilizationPct = hold.utilization_pct || Math.round(fillPercentage * 100);

  // Hold physical dimensions in 3D world units
  const holdWidth = 3.8;  // X (beamwise)
  const holdLength = 3.2; // Z (lengthwise)
  const maxCargoHeight = 2.0; // Y (depth)
  const floorY = 0.3; // Base of the cargo floor relative to vessel deck

  const currentCargoHeight = Math.max(0.04, maxCargoHeight * fillPercentage);
  const cargoCenterY = floorY + currentCargoHeight / 2;

  // Pulse animation for alert states (ominous glow and alert beacon)
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (hold.has_alert) {
      if (alertBeaconRef.current) {
        const scale = 1 + Math.sin(t * 5) * 0.25;
        alertBeaconRef.current.scale.set(scale, scale, scale);
      }
      if (internalLightRef.current) {
        internalLightRef.current.intensity = 2.8 + Math.sin(t * 6) * 1.4;
      }
    }
  });

  return (
    <group position={position}>
      {/* 1. Hold Coaming Rim / Hatch Coaming */}
      <mesh
        position={[0, 1.4, 0]}
        castShadow
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          onSelect(hold);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          onHover(hold, { x: e.clientX, y: e.clientY });
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          onHover(null);
        }}
      >
        <boxGeometry args={[holdWidth + 0.3, 0.4, holdLength + 0.3]} />
        <meshStandardMaterial
          color={
            hold.has_alert
              ? '#D92D20'
              : isSelected
              ? '#FF7A00'
              : hovered
              ? '#38BDF8'
              : '#1E293B'
          }
          metalness={0.7}
          roughness={0.35}
          emissive={
            hold.has_alert
              ? '#DC2626'
              : isSelected
              ? '#FF7A00'
              : hovered
              ? '#0284C7'
              : '#000000'
          }
          emissiveIntensity={hold.has_alert ? 0.75 : isSelected ? 0.6 : hovered ? 0.4 : 0.0}
        />
      </mesh>

      {/* 2. Hold Inner Cavity Bulkheads */}
      <mesh position={[0, 0.8, 0]} receiveShadow>
        <boxGeometry args={[holdWidth, 1.6, holdLength]} />
        <meshStandardMaterial
          color="#0B132B"
          roughness={0.7}
          metalness={0.5}
          side={THREE.BackSide}
          transparent={xRayMode}
          opacity={xRayMode ? 0.4 : 1.0}
        />
      </mesh>

      {/* 3. Cargo Volume with PBR Rock/Gravel Material */}
      {fillPercentage > 0.005 && (
        <group position={[0, cargoCenterY, 0]}>
          {/* Main Cargo Block */}
          <mesh
            castShadow
            receiveShadow
            onClick={(e) => {
              e.stopPropagation();
              onSelect(hold);
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHovered(true);
              onHover(hold, { x: e.clientX, y: e.clientY });
            }}
            onPointerOut={(e) => {
              e.stopPropagation();
              setHovered(false);
              onHover(null);
            }}
          >
            <boxGeometry args={[holdWidth * 0.94, currentCargoHeight, holdLength * 0.94]} />
            <CargoMaterial
              cargoType={hold.cargo_type || 'Coking Coal'}
              hasAlert={hold.has_alert}
            />
          </mesh>

          {/* Top Bulk Crown / Mound (Pyramidal Peak) */}
          <mesh
            position={[0, currentCargoHeight / 2 + 0.12, 0]}
            castShadow
            receiveShadow
          >
            <coneGeometry
              args={[Math.min(holdWidth, holdLength) * 0.44, 0.35 * Math.min(1, fillPercentage * 1.5), 4]}
            />
            <CargoMaterial
              cargoType={hold.cargo_type || 'Coking Coal'}
              hasAlert={hold.has_alert}
            />
          </mesh>
        </group>
      )}

      {/* 4. Selection Highlight Base Ring */}
      {isSelected && (
        <mesh position={[0, 1.62, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.75, 2.05, 36]} />
          <meshBasicMaterial color="#FF7A00" side={THREE.DoubleSide} transparent opacity={0.85} />
        </mesh>
      )}

      {/* 5. Alert State: Subtle Red Point Light Inside Hold Mesh (Makes coal glow ominously) */}
      {hold.has_alert && (
        <pointLight
          ref={internalLightRef}
          position={[0, cargoCenterY + 0.3, 0]}
          color="#EF4444"
          intensity={3.2}
          distance={5.5}
          decay={2}
          castShadow
        />
      )}

      {/* 6. 3D HTML OVERLAYS (Anchored directly in 3D Scene above each hold) */}
      <Html
        position={[0, 2.5, 0]}
        center
        distanceFactor={26}
        className="pointer-events-auto select-none"
      >
        <div className="flex flex-col items-center gap-1">
          {/* Pulsing ⚠ Tag physically above hold if Alert active */}
          {hold.has_alert && (
            <div
              onClick={() => onSelect(hold)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white font-black text-xs border border-red-300 shadow-2xl animate-bounce cursor-pointer whitespace-nowrap hover:scale-105 transition-transform"
              title="Click to focus warning hold"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-200 fill-amber-200 animate-pulse" />
              <span className="tracking-wider">ALERT: {hold.hold_code}</span>
            </div>
          )}

          {/* Contextual Hold Identification Tag (matching screenshot design) */}
          <button
            onClick={() => onSelect(hold)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl backdrop-blur-md transition-all shadow-xl cursor-pointer ${
              isSelected
                ? 'bg-[#FF7A00]/90 text-white border-2 border-white ring-4 ring-[#FF7A00]/40 scale-105'
                : hold.has_alert
                ? 'bg-[#7F1D1D]/90 text-white border border-red-400'
                : hovered
                ? 'bg-[#063B68]/90 text-white border border-[#38BDF8]'
                : 'bg-[#063B68]/75 text-white border border-white/20 hover:border-white/50'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                hold.has_alert
                  ? 'bg-red-400 animate-ping'
                  : isSelected
                  ? 'bg-white'
                  : 'bg-emerald-400'
              }`}
            />
            <span className="font-heading font-extrabold text-xs tracking-wide">
              {hold.hold_code}
            </span>
            <span className="font-mono text-[11px] font-bold text-[#A0C4E2]">
              {utilizationPct}%
            </span>
          </button>
        </div>
      </Html>
    </group>
  );
};
