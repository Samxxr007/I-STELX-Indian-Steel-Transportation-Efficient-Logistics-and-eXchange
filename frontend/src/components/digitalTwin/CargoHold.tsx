import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { DigitalTwinHold } from '../../types/digitalTwin';
import { CargoMaterial } from './CargoMaterial';

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
  const coamingRef = useRef<THREE.Mesh>(null);

  // Clamp fill ratio between 0 and 1
  const capacity = hold.capacity_mt > 0 ? hold.capacity_mt : 17000;
  const loaded = hold.loaded_mt || 0;
  const fillPercentage = Math.min(1, Math.max(0, loaded / capacity));

  // Hold physical dimensions in 3D world units
  const holdWidth = 3.8;  // X (beamwise)
  const holdLength = 3.2; // Z (lengthwise)
  const maxCargoHeight = 2.0; // Y (depth)
  const floorY = 0.3; // Base of the cargo floor relative to vessel deck

  const currentCargoHeight = Math.max(0.02, maxCargoHeight * fillPercentage);
  const cargoCenterY = floorY + currentCargoHeight / 2;

  // Pulse animation for alert hold (e.g. HOLD 03)
  useFrame(({ clock }) => {
    if (hold.has_alert && alertBeaconRef.current) {
      const t = clock.getElapsedTime();
      const scale = 1 + Math.sin(t * 5) * 0.2;
      alertBeaconRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group position={position}>
      {/* 1. Hold Void / Coaming Rim (Clickable Boundary) */}
      <mesh
        ref={coamingRef}
        position={[0, 1.4, 0]}
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
          roughness={0.3}
          emissive={
            hold.has_alert
              ? '#D92D20'
              : isSelected
              ? '#FF7A00'
              : hovered
              ? '#0284C7'
              : '#000000'
          }
          emissiveIntensity={hold.has_alert ? 0.7 : isSelected ? 0.6 : hovered ? 0.4 : 0.0}
        />
      </mesh>

      {/* 2. Hold Inner Cavity Walls (Visual Interior) */}
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[holdWidth, 1.6, holdLength]} />
        <meshStandardMaterial
          color="#0F172A"
          roughness={0.8}
          metalness={0.2}
          side={THREE.BackSide}
          transparent={xRayMode}
          opacity={xRayMode ? 0.4 : 1.0}
        />
      </mesh>

      {/* 3. Cargo Volume (Rises/Decreases according to fillPercentage) */}
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
            <CargoMaterial cargoType={hold.cargo_type || 'Coking Coal'} />
          </mesh>

          {/* Top Bulk Crown / Mound (Pyramidal Taper for realism) */}
          <mesh
            position={[0, currentCargoHeight / 2 + 0.12, 0]}
            rotation={[0, 0, 0]}
            castShadow
          >
            <coneGeometry
              args={[Math.min(holdWidth, holdLength) * 0.44, 0.35 * Math.min(1, fillPercentage * 1.5), 4]}
            />
            <CargoMaterial cargoType={hold.cargo_type || 'Coking Coal'} />
          </mesh>
        </group>
      )}

      {/* 4. Selection Highlight Base Ring */}
      {isSelected && (
        <mesh position={[0, 1.62, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.8, 2.05, 32]} />
          <meshBasicMaterial color="#FF7A00" side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* 5. Active Alert Marker (Beacon above hatch if alert active) */}
      {hold.has_alert && (
        <group position={[0, 2.5, 0]}>
          <mesh ref={alertBeaconRef}>
            <sphereGeometry args={[0.24, 16, 16]} />
            <meshStandardMaterial
              color="#EF4444"
              emissive="#DC2626"
              emissiveIntensity={1.2}
              roughness={0.2}
            />
          </mesh>
          <pointLight color="#EF4444" intensity={2.5} distance={6} />
        </group>
      )}
    </group>
  );
};
