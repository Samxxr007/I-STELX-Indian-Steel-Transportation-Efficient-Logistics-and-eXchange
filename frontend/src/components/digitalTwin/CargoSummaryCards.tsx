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
      iconColor: 'text-[#0867B2]',
      bg: 'bg-[#EBF4FC]',
      borderColor: 'border-[#CFE2F9]'
    },
    {
      title: 'LOADED',
      value: `${summary.loaded_mt?.toLocaleString() || 0} MT`,
      sub: `${summary.utilization_overall_pct || 0}% Total Vessel Fill`,
      icon: CheckCircle2,
      iconColor: 'text-[#00843D]',
      bg: 'bg-[#E6F4EA]',
      borderColor: 'border-[#C4E7D0]'
    },
    {
      title: 'ONBOARD',
      value: `${summary.onboard_mt?.toLocaleString() || 0} MT`,
      sub: 'Current In-Hold Cargo',
      icon: Anchor,
      iconColor: 'text-[#063B68]',
      bg: 'bg-[#F1F5F9]',
      borderColor: 'border-[#CBD5E1]'
    },
    {
      title: 'DISCHARGED',
      value: `${summary.discharged_mt?.toLocaleString() || 0} MT`,
      sub: 'Discharged at Destination',
      icon: ArrowDownCircle,
      iconColor: 'text-[#FF7A00]',
      bg: 'bg-[#FFF4E5]',
      borderColor: 'border-[#FFE0B2]'
    },
    {
      title: 'HOLDS',
      value: `${summary.holds_loaded_count || 0}/${summary.total_holds || 5}`,
      sub: 'Active Laden Cargo Holds',
      icon: Boxes,
      iconColor: 'text-[#6366F1]',
      bg: 'bg-[#EEF2FF]',
      borderColor: 'border-[#E0E7FF]'
    },
    {
      title: 'VOYAGE PROGRESS',
      value: `${summary.voyage_progress_pct || 0}%`,
      sub: summary.shipment_status || 'IN TRANSIT',
      icon: Navigation,
      iconColor: 'text-[#0284C7]',
      bg: 'bg-[#E0F2FE]',
      borderColor: 'border-[#BAE6FD]'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`istelx-card p-3 sm:p-4 border ${card.borderColor} bg-white flex flex-col justify-between hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#64748B]">
                {card.title}
              </span>
              <div className={`p-1.5 rounded-lg ${card.bg} ${card.iconColor}`}>
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>
            <div>
              <div className="text-base sm:text-lg lg:text-xl font-heading font-black text-[#102A43] tracking-tight">
                {card.value}
              </div>
              <div className="text-[10px] text-[#64748B] font-medium mt-0.5 truncate">
                {card.sub}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
