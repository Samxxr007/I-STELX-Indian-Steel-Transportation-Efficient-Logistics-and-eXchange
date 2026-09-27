import React from 'react';
import { JourneyTimelineStage } from '../../types/digitalTwin';
import { CheckCircle2, Clock, CircleDot, Circle, MapPin, Milestone } from 'lucide-react';

interface CargoJourneyTimelineProps {
  timeline: JourneyTimelineStage[];
}

export const CargoJourneyTimeline: React.FC<CargoJourneyTimelineProps> = ({ timeline }) => {
  return (
    <div className="bg-[#063B68]/40 backdrop-blur-md border border-white/20 shadow-xl rounded-xl p-4 sm:p-5 text-white">
      <div className="flex items-center justify-between border-b border-white/15 pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-white/10 border border-white/20 text-[#34D399]">
            <Milestone className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-base text-[#FFFFFF]">
              Cargo Journey & Milestone Telemetry
            </h3>
            <p className="text-xs text-[#A0C4E2]">
              End-to-end chain of custody tracking from mine stockpile to blast furnace stockyard
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-semibold text-[#34D399] bg-emerald-500/20 border border-emerald-400/30 px-2.5 py-1 rounded-lg">
          ACTIVE VOYAGE LOG
        </span>
      </div>

      {/* Vertical Timeline Flow */}
      <div className="relative pl-6 sm:pl-8 space-y-4 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/20">
        {timeline.map((stage, idx) => {
          const isCompleted = stage.status === 'COMPLETED';
          const isInProgress = stage.status === 'IN_PROGRESS';

          return (
            <div key={idx} className="relative group">
              {/* Bullet / Status Indicator Icon */}
              <div
                className={`absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full flex items-center justify-center bg-[#063B68] shadow-md border-2 transition-all ${
                  isCompleted
                    ? 'border-emerald-400 text-emerald-400'
                    : isInProgress
                    ? 'border-[#FF7A00] text-[#FF7A00] ring-4 ring-[#FF7A00]/30'
                    : 'border-white/30 text-white/40'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-500 text-white" />
                ) : isInProgress ? (
                  <CircleDot className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Circle className="w-2.5 h-2.5" />
                )}
              </div>

              {/* Stage Content */}
              <div
                className={`p-3.5 rounded-xl border transition-all ${
                  isInProgress
                    ? 'border-[#FF7A00] bg-white/15 shadow-lg'
                    : isCompleted
                    ? 'border-white/10 bg-white/5'
                    : 'border-white/5 bg-white/2 opacity-60'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-heading font-bold text-sm ${
                        isInProgress
                          ? 'text-[#FF7A00]'
                          : isCompleted
                          ? 'text-[#FFFFFF]'
                          : 'text-[#A0C4E2]'
                      }`}
                    >
                      {stage.stage}
                    </span>

                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        isCompleted
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                          : isInProgress
                          ? 'bg-[#FF7A00]/25 text-[#FF7A00] border border-[#FF7A00]/40 animate-pulse'
                          : 'bg-white/10 text-[#A0C4E2] border border-white/15'
                      }`}
                    >
                      {stage.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-[#A0C4E2] font-mono">
                    <Clock className="w-3 h-3 text-[#38BDF8]" />
                    <span>{stage.timestamp}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#A0C4E2]">
                  <p className="font-medium text-[#E2E8F0]">{stage.details}</p>
                  <div className="flex items-center gap-1 text-[11px] text-[#A0C4E2] flex-shrink-0">
                    <MapPin className="w-3 h-3 text-[#38BDF8]" />
                    <span>{stage.location}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
