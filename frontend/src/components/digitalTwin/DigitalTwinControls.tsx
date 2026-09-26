import React from 'react';
import { Camera, Eye, Maximize2, Minimize2, RotateCcw, Box, Compass, Layers } from 'lucide-react';

export type CameraPreset = 'ISOMETRIC' | 'SIDE' | 'TOP' | 'FRONT' | 'RESET';

interface DigitalTwinControlsProps {
  onPresetSelect: (preset: CameraPreset) => void;
  onReset: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  xRayMode: boolean;
  onToggleXRay: () => void;
  selectedHoldNumber: number | null;
  onSelectHoldNumber: (holdNumber: number) => void;
}

export const DigitalTwinControls: React.FC<DigitalTwinControlsProps> = ({
  onPresetSelect,
  onReset,
  isFullscreen,
  onToggleFullscreen,
  xRayMode,
  onToggleXRay,
  selectedHoldNumber,
  onSelectHoldNumber
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-white/95 backdrop-blur-md rounded-xl border border-[#CBD5E1] shadow-lg text-xs">
      {/* Camera View Presets */}
      <div className="flex items-center gap-1 overflow-x-auto">
        <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider px-2 hidden sm:inline-flex items-center gap-1">
          <Camera className="w-3.5 h-3.5 text-[#0867B2]" />
          <span>Views:</span>
        </span>

        <button
          onClick={() => onPresetSelect('ISOMETRIC')}
          className="px-2.5 py-1 rounded-md bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#063B68] font-semibold text-[11px] transition-colors cursor-pointer"
          title="Isometric 3D Angle"
        >
          Isometric
        </button>

        <button
          onClick={() => onPresetSelect('SIDE')}
          className="px-2.5 py-1 rounded-md bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#063B68] font-semibold text-[11px] transition-colors cursor-pointer"
          title="Starboard Elevation Profile"
        >
          Side
        </button>

        <button
          onClick={() => onPresetSelect('TOP')}
          className="px-2.5 py-1 rounded-md bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#063B68] font-semibold text-[11px] transition-colors cursor-pointer"
          title="Bird's Eye Deck View"
        >
          Top
        </button>

        <button
          onClick={() => onPresetSelect('FRONT')}
          className="px-2.5 py-1 rounded-md bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#063B68] font-semibold text-[11px] transition-colors cursor-pointer"
          title="Bow Approach View"
        >
          Front
        </button>

        <button
          onClick={onReset}
          className="px-2 py-1 rounded-md bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#64748B] hover:text-[#063B68] transition-colors flex items-center gap-1 cursor-pointer"
          title="Reset Orbit & Position"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="text-[11px] font-medium hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Hold Jump Buttons */}
      <div className="flex items-center gap-1">
        <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider px-1 hidden md:inline">
          Holds:
        </span>
        {[1, 2, 3, 4, 5].map((h) => {
          const isSel = selectedHoldNumber === h;
          return (
            <button
              key={h}
              onClick={() => onSelectHoldNumber(h)}
              className={`w-7 h-7 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center ${
                isSel
                  ? 'bg-[#FF7A00] text-white shadow-xs scale-105'
                  : 'bg-[#F1F5F9] text-[#063B68] hover:bg-[#0867B2] hover:text-white'
              }`}
              title={`Focus Hold 0${h}`}
            >
              H0{h}
            </button>
          );
        })}
      </div>

      {/* View Modes & Fullscreen */}
      <div className="flex items-center gap-1">
        {/* X-Ray / Transparent Hull Mode */}
        <button
          onClick={onToggleXRay}
          className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
            xRayMode
              ? 'bg-[#0867B2] text-white shadow-xs'
              : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
          }`}
          title="Toggle hull transparency to inspect holds interior"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{xRayMode ? 'Solid Hull' : 'X-Ray View'}</span>
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={onToggleFullscreen}
          className="p-1.5 rounded-md bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#063B68] transition-colors cursor-pointer"
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
