import React from 'react';
import { JourneyTimelineStage } from '../../types/digitalTwin';
import { CheckCircle2, Clock, CircleDot, Circle, MapPin, Milestone } from 'lucide-react';

interface CargoJourneyTimelineProps {
  timeline: JourneyTimelineStage[];
}

export const CargoJourneyTimeline: React.FC<CargoJourneyTimelineProps> = ({ timeline }) => {
  return (
    <div className="istelx-card bg-white p-5 border border-[#CBD5E1] shadow-md">
      <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-[#E6F4EA] text-[#00843D]">
            <Milestone className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-base text-[#063B68]">
              Cargo Journey & Milestone Telemetry
            </h3>
            <p className="text-xs text-[#64748B]">
              End-to-end chain of custody tracking from mine stockpile to blast furnace stockyard
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-semibold text-[#00843D] bg-[#E6F4EA] px-2.5 py-1 rounded-lg">
          ACTIVE VOYAGE LOG
        </span>
      </div>

      {/* Horizontal / Vertical Timeline Flow */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#CBD5E1]">
        {timeline.map((stage, idx) => {
          const isCompleted = stage.status === 'COMPLETED';
          const isInProgress = stage.status === 'IN_PROGRESS';
          const isUpcoming = stage.status === 'UPCOMING';

          return (
            <div key={idx} className="relative group">
              {/* Bullet / Status Indicator Icon */}
              <div
                className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 rounded-full flex items-center justify-center bg-white shadow-xs border-2 transition-all ${
                  isCompleted
                    ? 'border-[#00843D] text-[#00843D]'
                    : isInProgress
                    ? 'border-[#FF7A00] text-[#FF7A00] ring-4 ring-[#FF7A00]/20'
                    : 'border-[#CBD5E1] text-[#94A3B8]'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5 fill-[#00843D] text-white" />
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
                    ? 'border-[#FF7A00] bg-[#FFF8F0] shadow-sm'
                    : isCompleted
                    ? 'border-[#E2E8F0] bg-[#F8FAFC]'
                    : 'border-[#F1F5F9] bg-white opacity-60'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-heading font-bold text-sm ${
                        isInProgress
                          ? 'text-[#FF7A00]'
                          : isCompleted
                          ? 'text-[#063B68]'
                          : 'text-[#64748B]'
                      }`}
                    >
                      {stage.stage}
                    </span>

                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        isCompleted
                          ? 'bg-[#E6F4EA] text-[#00843D]'
                          : isInProgress
                          ? 'bg-[#FFF4E5] text-[#D96500] animate-pulse'
                          : 'bg-[#F1F5F9] text-[#64748B]'
                      }`}
                    >
                      {stage.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-[#64748B] font-mono">
                    <Clock className="w-3 h-3 text-[#0867B2]" />
                    <span>{stage.timestamp}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#475569]">
                  <p className="font-medium">{stage.details}</p>
                  <div className="flex items-center gap-1 text-[11px] text-[#64748B] flex-shrink-0">
                    <MapPin className="w-3 h-3 text-[#0867B2]" />
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
