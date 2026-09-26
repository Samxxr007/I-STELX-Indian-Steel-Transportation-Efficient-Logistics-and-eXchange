import React from 'react';
import { SensorAlert } from '../../types/digitalTwin';
import { AlertTriangle, ArrowRight, BellRing, Droplets } from 'lucide-react';

interface DigitalTwinAlertProps {
  alerts: SensorAlert[];
  onAlertClick: (holdName: string) => void;
}

export const DigitalTwinAlert: React.FC<DigitalTwinAlertProps> = ({ alerts, onAlertClick }) => {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="space-y-2">
      {alerts.map((alert, idx) => (
        <div
          key={idx}
          onClick={() => onAlertClick(alert.hold)}
          className="p-4 rounded-xl bg-gradient-to-r from-[#FFF5F5] to-[#FEECEB] border-2 border-[#FCCECE] shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:border-[#D92D20] transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#D92D20] text-white flex items-center justify-center flex-shrink-0 animate-pulse">
              <AlertTriangle className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-sm text-[#D92D20] tracking-wide uppercase">
                  CARGO CONDITION ALERT
                </span>
                <span className="bg-[#D92D20] text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded">
                  {alert.hold}
                </span>
                <span className="text-[11px] text-[#64748B] font-mono hidden sm:inline">
                  {alert.timestamp}
                </span>
              </div>

              <p className="text-xs text-[#1E293B] font-semibold mt-0.5">
                Humidity above configured demo threshold: <span className="font-bold text-[#D92D20]">{alert.value}</span> (Threshold: {alert.threshold}).
              </p>
              <p className="text-[11px] text-[#64748B]">
                {alert.message}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs font-bold text-[#D92D20] group-hover:underline flex items-center gap-1">
              <span>Inspect {alert.hold} in 3D</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
