import React from 'react';
import { DigitalTwinSummary } from '../../types/digitalTwin';
import { Package, CheckCircle2, Anchor, ArrowDownCircle, Boxes, Navigation } from 'lucide-react';

interface CargoSummaryCardsProps {
  summary: DigitalTwinSummary;
}

export const CargoSummaryCards: React.FC<CargoSummaryCardsProps> = ({ summary }) => {
  const cards = [
    {
      title: 'TOTAL CARGO',
      value: `${summary.total_cargo_mt?.toLocaleString() || 0} MT`,
      sub: 'Allocated Voyage Volume',
      icon: Package,
      iconColor: 'text-[#38BDF8]',
      badgeBg: 'bg-[#0867B2]/30 border-sky-400/30'
    },
    {
      title: 'LOADED',
      value: `${summary.loaded_mt?.toLocaleString() || 0} MT`,
      sub: `${summary.utilization_overall_pct || 0}% Total Vessel Fill`,
      icon: CheckCircle2,
      iconColor: 'text-[#34D399]',
      badgeBg: 'bg-emerald-500/20 border-emerald-400/30'
    },
    {
      title: 'ONBOARD',
      value: `${summary.onboard_mt?.toLocaleString() || 0} MT`,
      sub: 'Current In-Hold Cargo',
      icon: Anchor,
      iconColor: 'text-[#38BDF8]',
      badgeBg: 'bg-sky-500/20 border-sky-400/30'
    },
    {
      title: 'DISCHARGED',
      value: `${summary.discharged_mt?.toLocaleString() || 0} MT`,
      sub: 'Discharged at Destination',
      icon: ArrowDownCircle,
      iconColor: 'text-[#FF7A00]',
      badgeBg: 'bg-amber-500/20 border-amber-400/30'
    },
    {
      title: 'HOLDS',
      value: `${summary.holds_loaded_count || 0}/${summary.total_holds || 5}`,
      sub: 'Active Laden Cargo Holds',
      icon: Boxes,
      iconColor: 'text-[#A78BFA]',
      badgeBg: 'bg-indigo-500/20 border-indigo-400/30'
    },
    {
      title: 'VOYAGE PROGRESS',
      value: `${summary.voyage_progress_pct || 0}%`,
      sub: summary.shipment_status || 'IN TRANSIT',
      icon: Navigation,
      iconColor: 'text-[#38BDF8]',
      badgeBg: 'bg-cyan-500/20 border-cyan-400/30'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="bg-[#063B68]/40 backdrop-blur-md border border-white/20 shadow-xl rounded-xl p-3 sm:p-4 flex flex-col justify-between hover:bg-[#063B68]/55 hover:border-white/35 transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#A0C4E2]">
                {card.title}
              </span>
              <div className={`p-1.5 rounded-lg border ${card.badgeBg} ${card.iconColor} shadow-xs group-hover:scale-105 transition-transform`}>
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>
            <div>
              <div className="text-base sm:text-lg lg:text-xl font-heading font-black text-[#FFFFFF] tracking-tight">
                {card.value}
              </div>
              <div className="text-[10px] sm:text-[11px] text-[#A0C4E2] font-medium mt-0.5 truncate">
                {card.sub}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
