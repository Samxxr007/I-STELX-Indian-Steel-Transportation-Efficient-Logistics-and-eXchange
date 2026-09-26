import React from 'react';
import { DigitalTwinSensors } from '../../types/digitalTwin';
import {
  Thermometer,
  Droplets,
  Activity,
  DoorClosed,
  DoorOpen,
  Scale,
  Cpu,
  Info,
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
      bg: 'bg-[#FFF4E5]',
      border: 'border-[#FFE0B2]',
      desc: 'Ambient hold thermal probe'
    },
    {
      title: 'HUMIDITY',
      value: `${sensors.humidity_pct}%`,
      status: sensors.humidity_pct > 70 ? 'ALERT' : 'OPTIMAL',
      icon: Droplets,
      color: sensors.humidity_pct > 70 ? 'text-[#D92D20]' : 'text-[#0867B2]',
      bg: sensors.humidity_pct > 70 ? 'bg-[#FEECEB]' : 'bg-[#EBF4FC]',
      border: sensors.humidity_pct > 70 ? 'border-[#FCCECE]' : 'border-[#CFE2F9]',
      desc: sensors.humidity_pct > 70 ? 'Moisture threshold exceeded' : 'Relative in-hold moisture'
    },
    {
      title: 'VIBRATION',
      value: sensors.vibration,
      status: 'NORMAL',
      icon: Activity,
      color: 'text-[#00843D]',
      bg: 'bg-[#E6F4EA]',
      border: 'border-[#C4E7D0]',
      desc: 'Hull acoustic & resonance'
    },
    {
      title: 'HATCH STATUS',
      value: sensors.hatch_status,
      status: isHatchOpen ? 'WARNING' : 'SECURE',
      icon: isHatchOpen ? DoorOpen : DoorClosed,
      color: isHatchOpen ? 'text-[#FF7A00]' : 'text-[#063B68]',
      bg: isHatchOpen ? 'bg-[#FFF4E5]' : 'bg-[#F1F5F9]',
      border: isHatchOpen ? 'border-[#FFE0B2]' : 'border-[#CBD5E1]',
      desc: isHatchOpen ? 'Hatch covers retracted' : 'Sealed weather-tight'
    },
    {
      title: 'CARGO WEIGHT',
      value: `${sensors.weight_mt?.toLocaleString()} MT`,
      status: 'VERIFIED',
      icon: Scale,
      color: 'text-[#063B68]',
      bg: 'bg-[#F8FAFC]',
      border: 'border-[#CBD5E1]',
      desc: 'Draught survey & load cells'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Notice Banner */}
      <div className="p-3 bg-[#EBF4FC] border border-[#CFE2F9] rounded-xl flex items-center justify-between text-xs text-[#063B68]">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-[#0867B2] animate-pulse" />
          <span className="font-extrabold uppercase tracking-wider text-[11px]">
            {sensors.data_badge || 'SIMULATED SENSOR DATA'}
          </span>
          <span className="text-[#64748B] hidden sm:inline">
            — Telemetry readings generated via simulated IoT gateway for demonstration purposes.
          </span>
        </div>
        <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-[#CBD5E1] text-[#475569]">
          {sensors.active_devices_count || 5} Devices Active
        </span>
      </div>

      {/* Sensor Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {sensorCards.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className={`istelx-card p-4 border ${item.border} bg-white flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#64748B]">
                  {item.title}
                </span>
                <div className={`p-1.5 rounded-lg ${item.bg} ${item.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <div className="text-lg font-heading font-black text-[#102A43]">
                  {item.value}
                </div>
                <div className="text-[10px] text-[#64748B] mt-0.5 truncate">
                  {item.desc}
                </div>
              </div>

              <div className="pt-2 mt-2 border-t border-[#F1F5F9] flex items-center justify-between">
                <span className="text-[9px] uppercase font-bold text-[#94A3B8]">Status:</span>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    item.status === 'ALERT'
                      ? 'bg-[#FEECEB] text-[#D92D20]'
                      : item.status === 'WARNING'
                      ? 'bg-[#FFF4E5] text-[#D96500]'
                      : 'bg-[#E6F4EA] text-[#00843D]'
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
