import React from 'react';
import { Camera, Maximize2, Minimize2, RotateCcw, Layers } from 'lucide-react';

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
    <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-[#063B68]/60 backdrop-blur-md rounded-xl border border-white/20 shadow-xl text-xs text-white">
      {/* Camera View Presets */}
      <div className="flex items-center gap-1 overflow-x-auto">
        <span className="text-[10px] font-bold text-[#A0C4E2] uppercase tracking-wider px-2 hidden sm:inline-flex items-center gap-1">
          <Camera className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span>Views:</span>
        </span>

        <button
          onClick={() => onPresetSelect('ISOMETRIC')}
          className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#FFFFFF] font-semibold text-[11px] transition-all cursor-pointer border border-white/15"
          title="Isometric 3D Perspective"
        >
          Isometric
        </button>

        <button
          onClick={() => onPresetSelect('SIDE')}
          className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#FFFFFF] font-semibold text-[11px] transition-all cursor-pointer border border-white/15"
          title="Starboard Elevation Profile"
        >
          Side
        </button>

        <button
          onClick={() => onPresetSelect('TOP')}
          className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#FFFFFF] font-semibold text-[11px] transition-all cursor-pointer border border-white/15"
          title="Bird's Eye Deck View"
        >
          Top
        </button>

        <button
          onClick={() => onPresetSelect('FRONT')}
          className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#FFFFFF] font-semibold text-[11px] transition-all cursor-pointer border border-white/15"
          title="Bow Approach View"
        >
          Front
        </button>

        <button
          onClick={onReset}
          className="px-2 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#A0C4E2] hover:text-[#FFFFFF] transition-all flex items-center gap-1 cursor-pointer border border-white/15"
          title="Reset Orbit & Camera Position"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="text-[11px] font-medium hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Hold Jump Buttons */}
      <div className="flex items-center gap-1">
        <span className="text-[10px] font-bold text-[#A0C4E2] uppercase tracking-wider px-1 hidden md:inline">
          Focus:
        </span>
        {[1, 2, 3, 4, 5].map((h) => {
          const isSel = selectedHoldNumber === h;
          return (
            <button
              key={h}
              onClick={() => onSelectHoldNumber(h)}
              className={`w-7 h-7 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center border ${
                isSel
                  ? 'bg-[#FF7A00] text-[#FFFFFF] border-white shadow-md shadow-[#FF7A00]/40 scale-105'
                  : 'bg-white/10 text-[#A0C4E2] hover:bg-white/20 hover:text-[#FFFFFF] border-white/15'
              }`}
              title={`Fly to Hold 0${h}`}
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
          className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
            xRayMode
              ? 'bg-[#0867B2] text-[#FFFFFF] border-sky-400 shadow-md'
              : 'bg-white/10 text-[#A0C4E2] hover:bg-white/20 hover:text-[#FFFFFF] border-white/15'
          }`}
          title="Toggle hull transparency to inspect holds interior"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{xRayMode ? 'Solid Hull' : 'X-Ray View'}</span>
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={onToggleFullscreen}
          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#FFFFFF] border border-white/15 transition-all cursor-pointer"
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
