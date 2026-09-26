import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { DigitalTwinHold } from '../../types/digitalTwin';
import { BulkCarrierModel, HOLD_POSITIONS } from './BulkCarrierModel';
import { DigitalTwinControls, CameraPreset } from './DigitalTwinControls';
import { StatusBadge } from '../common/StatusBadge';
import { Box, Layers, AlertCircle, Info, Sparkles } from 'lucide-react';

interface DigitalTwinViewerProps {
  holds: DigitalTwinHold[];
  selectedHold: DigitalTwinHold | null;
  onSelectHold: (hold: DigitalTwinHold) => void;
  height?: string;
  isSimulating?: boolean;
}

// Camera Animator helper inside Canvas
const CameraController: React.FC<{
  targetPosition: THREE.Vector3 | null;
  targetLookAt: THREE.Vector3 | null;
  onAnimationEnd: () => void;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
}> = ({ targetPosition, targetLookAt, onAnimationEnd, controlsRef }) => {
  const { camera } = useThree();

  useFrame(() => {
    if (!targetPosition || !targetLookAt) return;

    camera.position.lerp(targetPosition, 0.08);
    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetLookAt, 0.08);
      controlsRef.current.update();
    }

    if (camera.position.distanceTo(targetPosition) < 0.1) {
      onAnimationEnd();
    }
  });

  return null;
};

export const DigitalTwinViewer: React.FC<DigitalTwinViewerProps> = ({
  holds,
  selectedHold,
  onSelectHold,
  height = '560px',
  isSimulating = false
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

  // When a hold is selected, gently move camera focus towards it
  useEffect(() => {
    if (selectedHold) {
      const holdNum = selectedHold.hold_number;
      const pos = HOLD_POSITIONS[holdNum] || [0, 0, 0];
      setAnimTargetPos(new THREE.Vector3(12, 10, pos[2] + 8));
      setAnimTargetLook(new THREE.Vector3(0, 1.5, pos[2]));
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
      className={`relative w-full rounded-2xl overflow-hidden border border-[#CBD5E1] shadow-md bg-gradient-to-b from-[#EBF2FA] to-[#DDE8F4] flex flex-col ${
        isFullscreen ? 'h-screen w-screen p-4' : ''
      }`}
      style={{ height: isFullscreen ? '100vh' : height }}
    >
      {/* 1. TOP OVERLAY HUD: Vessel Identity, Status & 3D Model Badge */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur-md border border-[#CBD5E1] shadow-xs text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00843D] animate-ping" />
            <span className="font-heading font-extrabold text-[#063B68]">
              MV STEEL VOYAGER
            </span>
            <span className="text-[#64748B] font-mono text-[10px]">
              PANAMAX BULK CARRIER • 5 HOLDS
            </span>
          </div>

          {/* Model Status Badge (DEMO 3D MODEL when fallback active) */}
          {isFallbackModel && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#063B68] text-[#FF7A00] font-mono text-[10px] font-bold tracking-wider uppercase border border-[#0867B2] shadow-xs">
              <Box className="w-3.5 h-3.5" />
              <span>DEMO 3D MODEL</span>
            </div>
          )}

          {isSimulating && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FF7A00] text-white text-xs font-bold shadow-xs animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SIMULATION ACTIVE</span>
            </div>
          )}
        </div>

        {/* Quick Legend / Hint */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-white/80 backdrop-blur-xs border border-[#CBD5E1] text-[11px] text-[#475569]">
          <Info className="w-3.5 h-3.5 text-[#0867B2]" />
          <span>Click any hold to inspect • Drag to rotate • Scroll to zoom</span>
        </div>
      </div>

      {/* 2. THREE.JS 3D CANVAS */}
      <div className="flex-1 w-full h-full relative cursor-grab active:cursor-grabbing">
        <Canvas
          shadows
          gl={{ antialias: true, alpha: true }}
          className="w-full h-full"
        >
          {/* Perspective Camera */}
          <PerspectiveCamera
            makeDefault
            fov={45}
            position={[22, 16, 20]}
            near={0.5}
            far={1000}
          />

          {/* Orbit Controls */}
          <OrbitControls
            ref={controlsRef}
            enableDamping
            dampingFactor={0.06}
            minDistance={8}
            maxDistance={80}
            maxPolarAngle={Math.PI / 2 + 0.05} // Allow slight under-deck viewing without flipping
          />

          {/* Camera Smooth Animator */}
          <CameraController
            targetPosition={animTargetPos}
            targetLookAt={animTargetLook}
            onAnimationEnd={() => {
              setAnimTargetPos(null);
              setAnimTargetLook(null);
            }}
            controlsRef={controlsRef}
          />

          {/* Lighting System */}
          <ambientLight intensity={0.9} color="#FFFFFF" />
          
          {/* Main Key Sun Light (Maritime Daylight) */}
          <directionalLight
            position={[25, 35, 18]}
            intensity={1.8}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-near={0.5}
            shadow-camera-far={100}
            shadow-camera-left={-20}
            shadow-camera-right={20}
            shadow-camera-top={20}
            shadow-camera-bottom={-20}
            shadow-bias={-0.0005}
          />

          {/* Secondary Soft Fill / Sky Bounce Light */}
          <directionalLight position={[-15, 20, -15]} intensity={0.6} color="#BAE6FD" />
          
          {/* Sea Surface Reflection Light */}
          <directionalLight position={[0, -10, 0]} intensity={0.3} color="#0284C7" />

          {/* Bulk Carrier with 5 Cargo Holds */}
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

        {/* 3. HOVER 3D TOOLTIP */}
        {hoveredHold && (
          <div
            className="absolute z-30 pointer-events-none bg-[#063B68]/95 backdrop-blur-md border border-[#0867B2] rounded-xl p-3 shadow-2xl text-white min-w-[210px] transform -translate-x-1/2 -translate-y-full transition-transform"
            style={{
              left: tooltipPos ? `${tooltipPos.x}px` : '50%',
              top: tooltipPos ? `${tooltipPos.y - 15}px` : '40%'
            }}
          >
            <div className="flex items-center justify-between border-b border-[#0867B2]/60 pb-1.5 mb-1.5">
              <span className="font-heading font-extrabold text-sm text-[#FF7A00]">
                {hoveredHold.hold_code}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase bg-white/20">
                {hoveredHold.status}
              </span>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-[#94A3B8]">Cargo:</span>
                <span className="font-semibold text-white">{hoveredHold.cargo_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#94A3B8]">Quantity:</span>
                <span className="font-mono font-bold text-white">
                  {hoveredHold.loaded_mt?.toLocaleString()} / {hoveredHold.capacity_mt?.toLocaleString()} MT
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#94A3B8]">Fill Level:</span>
                <span className="font-mono font-bold text-[#38BDF8]">
                  {hoveredHold.utilization_pct}%
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. BOTTOM CONTROLS DOCK */}
      <div className="p-3 z-10">
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
