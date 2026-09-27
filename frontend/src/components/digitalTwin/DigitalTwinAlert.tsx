import React from 'react';
import { SensorAlert } from '../../types/digitalTwin';
import { AlertTriangle, ArrowRight } from 'lucide-react';

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
          className="p-4 rounded-xl bg-red-950/40 backdrop-blur-md border border-red-500/40 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:border-red-400 hover:bg-red-950/60 transition-all group text-white"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/80 border border-red-400 text-white flex items-center justify-center flex-shrink-0 animate-pulse shadow-lg shadow-red-600/30">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-sm text-red-300 tracking-wide uppercase">
                  CARGO CONDITION ALERT
                </span>
                <span className="bg-red-500 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-lg border border-red-300">
                  {alert.hold}
                </span>
                <span className="text-[11px] text-[#A0C4E2] font-mono hidden sm:inline">
                  {alert.timestamp}
                </span>
              </div>

              <p className="text-xs text-[#FFFFFF] font-semibold mt-0.5">
                Humidity above configured demo threshold: <span className="font-bold text-red-300">{alert.value}</span> (Threshold: {alert.threshold}).
              </p>
              <p className="text-[11px] text-[#A0C4E2]">
                {alert.message}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs font-bold text-red-300 group-hover:text-white flex items-center gap-1">
              <span>Inspect {alert.hold} in 3D</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
