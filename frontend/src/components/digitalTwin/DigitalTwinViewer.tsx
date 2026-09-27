import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { DigitalTwinHold } from '../../types/digitalTwin';
import { BulkCarrierModel, HOLD_POSITIONS } from './BulkCarrierModel';
import { DigitalTwinControls, CameraPreset } from './DigitalTwinControls';
import { Box, Sparkles, Info } from 'lucide-react';

interface DigitalTwinViewerProps {
  holds: DigitalTwinHold[];
  selectedHold: DigitalTwinHold | null;
  onSelectHold: (hold: DigitalTwinHold) => void;
  height?: string;
  isSimulating?: boolean;
  isEdgeToEdge?: boolean;
}

// Camera Smooth Animator helper inside Canvas
const CameraController: React.FC<{
  targetPosition: THREE.Vector3 | null;
  targetLookAt: THREE.Vector3 | null;
  onAnimationEnd: () => void;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
}> = ({ targetPosition, targetLookAt, onAnimationEnd, controlsRef }) => {
  const { camera } = useThree();

  useFrame(() => {
    if (!targetPosition || !targetLookAt) return;

    camera.position.lerp(targetPosition, 0.065);
    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetLookAt, 0.065);
      controlsRef.current.update();
    }

    if (camera.position.distanceTo(targetPosition) < 0.15) {
      onAnimationEnd();
    }
  });

  return null;
};

export const DigitalTwinViewer: React.FC<DigitalTwinViewerProps> = ({
  holds,
  selectedHold,
  onSelectHold,
  height,
  isSimulating = false,
  isEdgeToEdge = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<OrbitControlsImpl>(null);

  const [hoveredHold, setHoveredHold] = useState<DigitalTwinHold | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [isFallbackModel, setIsFallbackModel] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [xRayMode, setXRayMode] = useState(false);

  // Camera animation target
  const [animTargetPos, setAnimTargetPos] = useState<THREE.Vector3 | null>(null);
  const [animTargetLook, setAnimTargetLook] = useState<THREE.Vector3 | null>(null);

  // Handle camera presets
  const handlePresetSelect = (preset: CameraPreset) => {
    switch (preset) {
      case 'ISOMETRIC':
        setAnimTargetPos(new THREE.Vector3(22, 16, 20));
        setAnimTargetLook(new THREE.Vector3(0, 1.5, 0));
        break;
      case 'SIDE':
        setAnimTargetPos(new THREE.Vector3(30, 4, 0));
        setAnimTargetLook(new THREE.Vector3(0, 1.5, 0));
        break;
      case 'TOP':
        setAnimTargetPos(new THREE.Vector3(0.01, 34, 0.01));
        setAnimTargetLook(new THREE.Vector3(0, 0, 0));
        break;
      case 'FRONT':
        setAnimTargetPos(new THREE.Vector3(0, 7, 28));
        setAnimTargetLook(new THREE.Vector3(0, 2.5, 0));
        break;
      case 'RESET':
        handleReset();
        break;
    }
  };

  const handleReset = () => {
    setAnimTargetPos(new THREE.Vector3(22, 16, 20));
    setAnimTargetLook(new THREE.Vector3(0, 1.5, 0));
  };

  // Smooth Camera interpolation: When a user clicks a specific hold (e.g. Hold 03),
  // smoothly fly the camera from the default isometric view to a close-up, angled view inside that hold.
  useEffect(() => {
    if (selectedHold) {
      const holdNum = selectedHold.hold_number;
      const pos = HOLD_POSITIONS[holdNum] || [0, 0, 0];
      // Close-up angled view looking down into that specific hold cavity
      setAnimTargetPos(new THREE.Vector3(7.5, 6.2, pos[2] + 4.2));
      setAnimTargetLook(new THREE.Vector3(0, 1.2, pos[2]));
    }
  }, [selectedHold]);

  const handleSelectHoldNumber = (hNum: number) => {
    const target = holds.find((h) => h.hold_number === hNum);
    if (target) {
      onSelectHold(target);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div
      ref={containerRef}
      className={`${
        isEdgeToEdge && !isFullscreen
          ? 'absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-auto'
          : isFullscreen
          ? 'fixed inset-0 w-screen h-screen z-50 overflow-hidden'
          : 'relative w-full rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-[#03182E]'
      }`}
      style={!isEdgeToEdge && height ? { height } : undefined}
    >
      {/* 1. EDGE-TO-EDGE 3D CANVAS (z-index: 0) */}
      <Canvas
        shadows
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
        className="w-full h-full absolute inset-0 z-0 cursor-grab active:cursor-grabbing"
      >
        {/* Perspective Camera */}
        <PerspectiveCamera
          makeDefault
          fov={42}
          position={[22, 16, 20]}
          near={0.5}
          far={1000}
        />

        {/* Orbit Controls with Damping */}
        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.06}
          minDistance={6}
          maxDistance={85}
          maxPolarAngle={Math.PI / 2 + 0.05} // Allow slight under-deck viewing without flipping
        />

        {/* Camera Smooth Interpolation Animator */}
        <CameraController
          targetPosition={animTargetPos}
          targetLookAt={animTargetLook}
          onAnimationEnd={() => {
            setAnimTargetPos(null);
            setAnimTargetLook(null);
          }}
          controlsRef={controlsRef}
        />

        {/* 3D Realism: HDRI Environment Reflection Map (Preset: City with blur=0.8) */}
        <Suspense fallback={null}>
          <Environment preset="city" background blur={0.8} />
        </Suspense>

        {/* 3D Realism: Key Sunlight Directional Light */}
        {/* Requirement: directionalLight acting as the sun (position={[10, 20, 10]}) with castShadow enabled */}
        <directionalLight
          position={[10, 20, 10]}
          intensity={2.4}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={80}
          shadow-camera-left={-22}
          shadow-camera-right={22}
          shadow-camera-top={22}
          shadow-camera-bottom={-22}
          shadow-bias={-0.0003}
        />

        {/* Subtle Ambient & Maritime Fill Lights */}
        <ambientLight intensity={0.55} color="#E0F2FE" />
        <directionalLight position={[-15, 12, -15]} intensity={0.4} color="#7DD3FC" />
        <directionalLight position={[0, -10, 0]} intensity={0.2} color="#0284C7" />

        {/* Bulk Carrier Vessel with 5 Cargo Holds and 3D HTML Overlays */}
        <BulkCarrierModel
          holds={holds}
          selectedHoldNumber={selectedHold ? selectedHold.hold_number : null}
          onSelectHold={onSelectHold}
          onHoverHold={(h, pos) => {
            setHoveredHold(h);
            if (pos) setTooltipPos(pos);
          }}
          onModelLoadedState={(isFallback) => setIsFallbackModel(isFallback)}
          xRayMode={xRayMode}
        />
      </Canvas>

      {/* 2. TOP HUD: Vessel Identity Tag (Frosted Glass on z-index: 10) */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none hidden sm:flex items-center gap-2">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#063B68]/50 backdrop-blur-md border border-white/20 shadow-xl pointer-events-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00843D] animate-ping" />
          <span className="font-heading font-extrabold text-sm text-white tracking-wide">
            MV STEEL VOYAGER
          </span>
          <span className="text-[#A0C4E2] font-mono text-[10px]">
            PANAMAX • 5 HOLDS
          </span>
        </div>

        {isFallbackModel && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#063B68]/50 backdrop-blur-md border border-white/20 text-[#FF7A00] font-mono text-[10px] font-bold tracking-wider uppercase shadow-xl pointer-events-auto">
            <Box className="w-3.5 h-3.5" />
            <span>DIGITAL TWIN SIM</span>
          </div>
        )}

        {isSimulating && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#FF7A00]/80 backdrop-blur-md border border-amber-300/40 text-white text-xs font-bold shadow-xl animate-pulse pointer-events-auto">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SIMULATION ACTIVE</span>
          </div>
        )}
      </div>

      {/* 3. 3D HOVER TOOLTIP */}
      {hoveredHold && (
        <div
          className="absolute z-20 pointer-events-none bg-[#063B68]/70 backdrop-blur-md border border-white/25 rounded-xl p-3 shadow-2xl text-white min-w-[210px] transform -translate-x-1/2 -translate-y-full transition-transform"
          style={{
            left: tooltipPos ? `${tooltipPos.x}px` : '50%',
            top: tooltipPos ? `${tooltipPos.y - 15}px` : '40%'
          }}
        >
          <div className="flex items-center justify-between border-b border-white/20 pb-1.5 mb-1.5">
            <span className="font-heading font-extrabold text-sm text-[#FF7A00]">
              {hoveredHold.hold_code}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase bg-white/20 text-white">
              {hoveredHold.status}
            </span>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-[#A0C4E2]">Cargo:</span>
              <span className="font-semibold text-white">{hoveredHold.cargo_type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#A0C4E2]">Loaded:</span>
              <span className="font-mono font-bold text-white">
                {hoveredHold.loaded_mt?.toLocaleString()} / {hoveredHold.capacity_mt?.toLocaleString()} MT
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#A0C4E2]">Utilization:</span>
              <span className="font-mono font-bold text-[#38BDF8]">
                {hoveredHold.utilization_pct}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 4. FLOATING CAMERA CONTROLS DOCK (Frosted Glass on z-index: 10) */}
      <div className="absolute bottom-4 left-4 z-10 pointer-events-auto">
        <DigitalTwinControls
          onPresetSelect={handlePresetSelect}
          onReset={handleReset}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
          xRayMode={xRayMode}
          onToggleXRay={() => setXRayMode(!xRayMode)}
          selectedHoldNumber={selectedHold ? selectedHold.hold_number : null}
          onSelectHoldNumber={handleSelectHoldNumber}
        />
      </div>
    </div>
  );
};
