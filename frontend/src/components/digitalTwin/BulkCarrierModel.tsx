import React, { Component, ErrorInfo, ReactNode, Suspense, useEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { DigitalTwinHold } from '../../types/digitalTwin';
import { CargoHold } from './CargoHold';

interface BulkCarrierModelProps {
  holds: DigitalTwinHold[];
  selectedHoldNumber: number | null;
  onSelectHold: (hold: DigitalTwinHold) => void;
  onHoverHold: (hold: DigitalTwinHold | null, screenPos?: { x: number; y: number }) => void;
  onModelLoadedState?: (isFallback: boolean) => void;
  xRayMode?: boolean;
}

// Positions for 5 holds along vessel centerline (Fore to Aft)
export const HOLD_POSITIONS: Record<number, [number, number, number]> = {
  1: [0, 0, 9.0],   // Hold 01 (Fore)
  2: [0, 0, 4.5],   // Hold 02
  3: [0, 0, 0.0],   // Hold 03 (Midships)
  4: [0, 0, -4.5],  // Hold 04
  5: [0, 0, -9.0],  // Hold 05 (Aft)
};

/**
 * Procedural Panamax bulk carrier vessel geometry with PBR steel materials.
 * Metalness: 0.6, Roughness: 0.4 on hull plates to catch HDRI reflections and sunlight.
 */
export const FallbackVesselGeometry: React.FC<{
  xRayMode?: boolean;
}> = ({ xRayMode = false }) => {
  return (
    <group name="bulk-carrier-procedural-hull">
      {/* 1. LOWER HULL / KEEL (Red Antifouling Marine Coat) */}
      <mesh position={[0, -0.6, -0.5]} castShadow receiveShadow>
        <boxGeometry args={[4.8, 1.4, 32]} />
        <meshStandardMaterial
          color="#8B0000" // Marine antifouling oxide red
          roughness={0.4}
          metalness={0.6}
          transparent={xRayMode}
          opacity={xRayMode ? 0.3 : 1.0}
        />
      </mesh>

      {/* 2. BULBOUS BOW (Fore Hydrodynamic Nose) */}
      <mesh position={[0, -0.6, 15.6]} castShadow receiveShadow>
        <sphereGeometry args={[1.2, 24, 24]} />
        <meshStandardMaterial
          color="#780000"
          roughness={0.4}
          metalness={0.6}
          transparent={xRayMode}
          opacity={xRayMode ? 0.3 : 1.0}
        />
      </mesh>

      {/* 3. MAIN TOPSIDE HULL (Dark Marine Steel / Deep Navy) */}
      {/* Requirement: MeshStandardMaterial with metalness={0.6} and roughness={0.4} */}
      <mesh position={[0, 0.6, -0.5]} castShadow receiveShadow>
        <boxGeometry args={[5.2, 1.2, 32]} />
        <meshStandardMaterial
          color="#063B68" // I-STELX Primary Fleet Navy
          roughness={0.4}
          metalness={0.6}
          transparent={xRayMode}
          opacity={xRayMode ? 0.35 : 1.0}
        />
      </mesh>

      {/* 4. WATERLINE BOOT-TOPPING STRIPE */}
      <mesh position={[0, 0.0, -0.5]} receiveShadow>
        <boxGeometry args={[5.25, 0.16, 32.1]} />
        <meshStandardMaterial
          color="#E2E8F0"
          roughness={0.35}
          metalness={0.5}
        />
      </mesh>

      {/* 5. BOW SHEER & FORECASTLE DECK (Tapered front) */}
      <mesh position={[0, 1.0, 15.2]} rotation={[0.2, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.6, 1.2, 3.2]} />
        <meshStandardMaterial
          color="#042848"
          roughness={0.4}
          metalness={0.6}
          transparent={xRayMode}
          opacity={xRayMode ? 0.35 : 1.0}
        />
      </mesh>

      {/* Bow Jackstaff & Navigation Post */}
      <mesh position={[0, 2.0, 16.5]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 1.2, 12]} />
        <meshStandardMaterial color="#FFFFFF" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* 6. MAIN CARGO WEATHERDECK */}
      <mesh position={[0, 1.21, -0.5]} receiveShadow>
        <boxGeometry args={[4.9, 0.08, 30.5]} />
        <meshStandardMaterial
          color="#1E293B" // Heavy structural deck plate
          roughness={0.5}
          metalness={0.6}
        />
      </mesh>

      {/* Deck Catwalks & Side Coamings (Port & Starboard) */}
      <mesh position={[-2.3, 1.3, -0.5]} castShadow receiveShadow>
        <boxGeometry args={[0.25, 0.1, 28]} />
        <meshStandardMaterial color="#CBD5E1" roughness={0.4} metalness={0.6} />
      </mesh>
      <mesh position={[2.3, 1.3, -0.5]} castShadow receiveShadow>
        <boxGeometry args={[0.25, 0.1, 28]} />
        <meshStandardMaterial color="#CBD5E1" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* 7. TRANSOM STERN (Aft Hull Profile) */}
      <mesh position={[0, 0.6, -16.2]} castShadow receiveShadow>
        <boxGeometry args={[4.4, 1.6, 1.2]} />
        <meshStandardMaterial
          color="#063B68"
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>

      {/* 8. SUPERSTRUCTURE / BRIDGE TOWER (Aft Accommodation Block) */}
      <group position={[0, 1.25, -13.6]}>
        {/* Tier 1: Deck House */}
        <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.0, 1.6, 3.2]} />
          <meshStandardMaterial color="#F1F5F9" roughness={0.35} metalness={0.4} />
        </mesh>

        {/* Tier 2: Accommodation */}
        <mesh position={[0, 1.8, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.6, 1.0, 2.8]} />
          <meshStandardMaterial color="#E2E8F0" roughness={0.35} metalness={0.4} />
        </mesh>

        {/* Tier 3: Wheelhouse / Navigation Bridge & Bridge Wings */}
        <mesh position={[0, 2.6, 0.2]} castShadow receiveShadow>
          <boxGeometry args={[4.6, 0.7, 2.2]} />
          <meshStandardMaterial color="#CBD5E1" roughness={0.3} metalness={0.5} />
        </mesh>

        {/* Bridge Glazing (Reflective Maritime Glass) */}
        <mesh position={[0, 2.7, 1.31]}>
          <boxGeometry args={[4.2, 0.35, 0.05]} />
          <meshStandardMaterial
            color="#0284C7"
            metalness={0.9}
            roughness={0.1}
            transparent
            opacity={0.8}
          />
        </mesh>

        {/* Radar Mast, Scanner & Satellite Dome */}
        <mesh position={[0, 3.4, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.08, 1.2, 12]} />
          <meshStandardMaterial color="#FFFFFF" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, 4.0, 0]} castShadow>
          <sphereGeometry args={[0.22, 20, 20]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.25} metalness={0.3} />
        </mesh>

        {/* 9. FUNNEL / ENGINE EXHAUST with Fleet Branding */}
        <group position={[0, 2.4, -1.0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.45, 0.55, 1.8, 20]} />
            <meshStandardMaterial color="#042848" roughness={0.4} metalness={0.6} />
          </mesh>
          <mesh position={[0, 0.2, 0]} castShadow>
            <cylinderGeometry args={[0.48, 0.50, 0.4, 20]} />
            <meshStandardMaterial color="#FF7A00" roughness={0.35} metalness={0.5} />
          </mesh>
          <mesh position={[0, 0.92, 0]}>
            <cylinderGeometry args={[0.4, 0.42, 0.08, 20]} />
            <meshStandardMaterial color="#111827" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      </group>

      {/* 10. OCEAN SURFACE WAKE / WATER PLANE (Translucent Deep Maritime) */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[36, 60]} />
        <meshStandardMaterial
          color="#043259"
          roughness={0.15}
          metalness={0.7}
          transparent
          opacity={0.45}
        />
      </mesh>
    </group>
  );
};

/**
 * Optional GLTF Model Component.
 * Automatically loads `/models/bulk-carrier.glb` if available.
 */
const GLTFCarrier: React.FC<{
  onLoaded: () => void;
}> = ({ onLoaded }) => {
  const gltf = useGLTF('/models/bulk-carrier.glb');
  useEffect(() => {
    if (gltf) {
      gltf.scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          const mesh = child as THREE.Mesh;
          if (mesh.material && (mesh.material as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
            const std = mesh.material as THREE.MeshStandardMaterial;
            std.metalness = 0.6;
            std.roughness = 0.4;
          }
        }
      });
      onLoaded();
    }
  }, [gltf, onLoaded]);

  return <primitive object={gltf.scene} scale={[1, 1, 1]} position={[0, 0, 0]} />;
};

/**
 * Error boundary for GLTF loader
 */
class GLTFErrorBoundary extends Component<
  { fallback: ReactNode; onError?: () => void; children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.info('GLB model not present, seamlessly switching to fallback geometry:', error.message);
    if (this.props.onError) {
      this.props.onError();
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export const BulkCarrierModel: React.FC<BulkCarrierModelProps> = ({
  holds,
  selectedHoldNumber,
  onSelectHold,
  onHoverHold,
  onModelLoadedState,
  xRayMode = false
}) => {
  const [usingFallback, setUsingFallback] = useState(true);

  useEffect(() => {
    if (onModelLoadedState) {
      onModelLoadedState(usingFallback);
    }
  }, [usingFallback, onModelLoadedState]);

  return (
    <group name="bulk-carrier-vessel-root">
      {/* 3D Vessel Body */}
      <GLTFErrorBoundary
        fallback={<FallbackVesselGeometry xRayMode={xRayMode} />}
        onError={() => setUsingFallback(true)}
      >
        <Suspense fallback={<FallbackVesselGeometry xRayMode={xRayMode} />}>
          {usingFallback ? (
            <FallbackVesselGeometry xRayMode={xRayMode} />
          ) : (
            <GLTFCarrier onLoaded={() => setUsingFallback(false)} />
          )}
        </Suspense>
      </GLTFErrorBoundary>

      {/* Interactive 5 Cargo Holds with dynamic fill levels */}
      {holds.map((hold) => {
        const holdNum = hold.hold_number || 1;
        const pos = HOLD_POSITIONS[holdNum] || [0, 0, 0];
        const isSelected = selectedHoldNumber === holdNum;

        return (
          <CargoHold
            key={hold.hold_id || holdNum}
            hold={hold}
            position={pos}
            isSelected={isSelected}
            onSelect={onSelectHold}
            onHover={onHoverHold}
            xRayMode={xRayMode}
          />
        );
      })}
    </group>
  );
};
