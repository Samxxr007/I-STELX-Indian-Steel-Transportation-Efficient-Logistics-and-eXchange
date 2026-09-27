import React from 'react';
import { DigitalTwinSensors } from '../../types/digitalTwin';
import {
  Thermometer,
  Droplets,
  Activity,
  DoorClosed,
  DoorOpen,
  Scale,
  Radio
} from 'lucide-react';

interface SensorPanelProps {
  sensors: DigitalTwinSensors;
}

export const SensorPanel: React.FC<SensorPanelProps> = ({ sensors }) => {
  const isHatchOpen = sensors.hatch_status?.toLowerCase().includes('open');

  const sensorCards = [
    {
      title: 'TEMPERATURE',
      value: `${sensors.temperature_c}°C`,
      status: sensors.temperature_c > 35 ? 'HIGH' : 'NORMAL',
      icon: Thermometer,
      color: 'text-[#FF7A00]',
      desc: 'Ambient hold thermal probe'
    },
    {
      title: 'HUMIDITY',
      value: `${sensors.humidity_pct}%`,
      status: sensors.humidity_pct > 70 ? 'ALERT' : 'OPTIMAL',
      icon: Droplets,
      color: sensors.humidity_pct > 70 ? 'text-red-400' : 'text-[#38BDF8]',
      desc: sensors.humidity_pct > 70 ? 'Moisture threshold exceeded' : 'Relative in-hold moisture'
    },
    {
      title: 'VIBRATION',
      value: sensors.vibration,
      status: 'NORMAL',
      icon: Activity,
      color: 'text-[#34D399]',
      desc: 'Hull acoustic & resonance'
    },
    {
      title: 'HATCH STATUS',
      value: sensors.hatch_status,
      status: isHatchOpen ? 'WARNING' : 'SECURE',
      icon: isHatchOpen ? DoorOpen : DoorClosed,
      color: isHatchOpen ? 'text-[#FF7A00]' : 'text-[#38BDF8]',
      desc: isHatchOpen ? 'Hatch covers retracted' : 'Sealed weather-tight'
    },
    {
      title: 'CARGO WEIGHT',
      value: `${sensors.weight_mt?.toLocaleString()} MT`,
      status: 'VERIFIED',
      icon: Scale,
      color: 'text-[#38BDF8]',
      desc: 'Draught survey & load cells'
    }
  ];

  return (
    <div className="space-y-3">
      {/* Notice Banner */}
      <div className="p-3 bg-[#063B68]/40 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-between text-xs text-white shadow-xl">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-[#38BDF8] animate-pulse" />
          <span className="font-extrabold uppercase tracking-wider text-[11px] text-[#FFFFFF]">
            {sensors.data_badge || 'SIMULATED SENSOR DATA'}
          </span>
          <span className="text-[#A0C4E2] hidden sm:inline">
            — Telemetry generated via simulated IoT gateway
          </span>
        </div>
        <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded border border-white/15 text-[#A0C4E2]">
          {sensors.active_devices_count || 5} Devices Active
        </span>
      </div>

      {/* Sensor Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {sensorCards.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="bg-[#063B68]/40 backdrop-blur-md border border-white/20 shadow-xl rounded-xl p-3 sm:p-4 flex flex-col justify-between text-white hover:bg-[#063B68]/55 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#A0C4E2]">
                  {item.title}
                </span>
                <div className={`p-1.5 rounded-lg bg-white/10 border border-white/15 ${item.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <div className="text-base sm:text-lg font-heading font-black text-[#FFFFFF]">
                  {item.value}
                </div>
                <div className="text-[10px] text-[#A0C4E2] mt-0.5 truncate">
                  {item.desc}
                </div>
              </div>

              <div className="pt-2 mt-2 border-t border-white/10 flex items-center justify-between">
                <span className="text-[9px] uppercase font-bold text-[#A0C4E2]">Status:</span>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                    item.status === 'ALERT'
                      ? 'bg-red-500/25 text-red-300 border-red-400/40 animate-pulse'
                      : item.status === 'WARNING'
                      ? 'bg-amber-500/25 text-amber-300 border-amber-400/40'
                      : 'bg-emerald-500/25 text-emerald-300 border-emerald-400/40'
                  }`}
                >
                  {item.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
