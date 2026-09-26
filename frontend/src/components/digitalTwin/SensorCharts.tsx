import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { SensorReadingHistory } from '../../types/digitalTwin';
import { Activity, Thermometer, Droplets, Scale, BarChart2 } from 'lucide-react';

interface SensorChartsProps {
  history: SensorReadingHistory[];
}

type MetricTab = 'temperature' | 'humidity' | 'vibration' | 'weight';

export const SensorCharts: React.FC<SensorChartsProps> = ({ history }) => {
  const [activeTab, setActiveTab] = useState<MetricTab>('humidity');

  const tabs = [
    { id: 'humidity' as MetricTab, label: 'Humidity (%)', icon: Droplets, color: '#0867B2', unit: '%' },
    { id: 'temperature' as MetricTab, label: 'Temperature (°C)', icon: Thermometer, color: '#FF7A00', unit: '°C' },
    { id: 'vibration' as MetricTab, label: 'Vibration (g)', icon: Activity, color: '#00843D', unit: 'g' },
    { id: 'weight' as MetricTab, label: 'Cargo Weight (MT)', icon: Scale, color: '#063B68', unit: 'MT' }
  ];

  const currentTabConfig = tabs.find((t) => t.id === activeTab) || tabs[0];

  const getDataKey = (tab: MetricTab) => {
    switch (tab) {
      case 'temperature':
        return 'temperature_c';
      case 'humidity':
        return 'humidity_pct';
      case 'vibration':
        return 'vibration_g';
      case 'weight':
        return 'weight_mt';
    }
  };

  return (
    <div className="istelx-card bg-white p-5 border border-[#CBD5E1] shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8F0] pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-[#EBF4FC] text-[#0867B2]">
            <BarChart2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-base text-[#063B68]">
              24-Hour Telemetry Time Series
            </h3>
            <p className="text-xs text-[#64748B]">
              Continuous multi-sensor temporal progression across voyage coordinates
            </p>
          </div>
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex items-center gap-1 bg-[#F1F5F9] p-1 rounded-xl overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSel = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isSel
                    ? 'bg-white text-[#063B68] shadow-xs font-bold'
                    : 'text-[#64748B] hover:text-[#063B68]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" style={{ color: tab.color }} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="metricGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={currentTabConfig.color} stopOpacity={0.35} />
                <stop offset="95%" stopColor={currentTabConfig.color} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={{ stroke: '#CBD5E1' }}
              tick={{ fill: '#64748B', fontSize: 11 }}
            />
            <YAxis
              tickLine={false}
              axisLine={{ stroke: '#CBD5E1' }}
              tick={{ fill: '#64748B', fontSize: 11 }}
              domain={['auto', 'auto']}
              unit={` ${currentTabConfig.unit}`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-[#063B68] text-white p-2.5 rounded-lg shadow-xl border border-[#0867B2] text-xs">
                      <div className="font-mono text-[10px] text-[#94A3B8]">{label} UTC</div>
                      <div className="font-bold text-sm text-[#FF7A00] mt-0.5">
                        {payload[0].value} {currentTabConfig.unit}
                      </div>
                      <div className="text-[10px] text-[#CBD5E1]">
                        {currentTabConfig.label}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey={getDataKey(activeTab)}
              stroke={currentTabConfig.color}
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#metricGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-[11px] text-[#64748B]">
        <span>Sampling Interval: <strong>2 Hours</strong></span>
        <span>Telemetry Buffer: <strong>Last 24 Hours Voyage Data</strong></span>
      </div>
    </div>
  );
};
