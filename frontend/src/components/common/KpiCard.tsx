import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

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
      className={`istelx-card istelx-card-hover p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden group ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      {/* Top subtle highlight accent line on hover */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#0867B2]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col min-w-0">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 truncate">
            {title}
          </span>
          <span className="font-heading font-extrabold text-2xl lg:text-3xl text-[#063B68] tracking-tight tabular-nums leading-tight">
            {value}
          </span>
        </div>
        <div
          className={`p-2.5 rounded-xl ${bgColor} ${iconColor} flex-shrink-0 border border-black/5 shadow-2xs group-hover:scale-105 transition-transform duration-200`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(subtitle || change) && (
        <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs gap-2">
          {subtitle && (
            <span className="text-slate-500 font-medium truncate text-[11px]">{subtitle}</span>
          )}
          {change && (
            <span
              className={`inline-flex items-center gap-0.5 font-bold text-[10px] px-2 py-0.5 rounded-full border shadow-2xs flex-shrink-0 ${
                isPositive
                  ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                  : 'text-rose-700 bg-rose-50 border-rose-200'
              }`}
            >
              {isPositive ? (
                <TrendingUp className="w-3 h-3 text-emerald-600" />
              ) : (
                <TrendingDown className="w-3 h-3 text-rose-600" />
              )}
              <span>{change}</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
};
