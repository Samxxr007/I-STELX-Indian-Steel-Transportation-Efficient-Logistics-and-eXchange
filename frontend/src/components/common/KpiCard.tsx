import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  iconColor?: string;
  bgColor?: string;
  onClick?: () => void;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  change,
  isPositive = true,
  icon: Icon,
  iconColor = 'text-[#063B68]',
  bgColor = 'bg-[#EBF4FC]',
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`istelx-card istelx-card-hover p-4 flex flex-col justify-between relative overflow-hidden ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1">
            {title}
          </span>
          <span className="font-heading font-extrabold text-2xl lg:text-3xl text-[#063B68] tracking-tight">
            {value}
          </span>
        </div>
        <div className={`p-2.5 rounded-lg ${bgColor} ${iconColor} flex-shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(subtitle || change) && (
        <div className="mt-3 pt-2.5 border-t border-[#F1F5F9] flex items-center justify-between text-xs">
          {subtitle && <span className="text-[#64748B] font-medium">{subtitle}</span>}
          {change && (
            <span
              className={`font-semibold px-1.5 py-0.5 rounded ${
                isPositive ? 'text-[#00843D] bg-[#E6F4EA]' : 'text-[#D92D20] bg-[#FEECEB]'
              }`}
            >
              {change}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
