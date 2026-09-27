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
    { id: 'humidity' as MetricTab, label: 'Humidity (%)', icon: Droplets, color: '#38BDF8', unit: '%' },
    { id: 'temperature' as MetricTab, label: 'Temperature (°C)', icon: Thermometer, color: '#FF7A00', unit: '°C' },
    { id: 'vibration' as MetricTab, label: 'Vibration (g)', icon: Activity, color: '#34D399', unit: 'g' },
    { id: 'weight' as MetricTab, label: 'Cargo Weight (MT)', icon: Scale, color: '#A0C4E2', unit: 'MT' }
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
    <div className="bg-[#063B68]/40 backdrop-blur-md border border-white/20 shadow-xl rounded-xl p-4 sm:p-5 text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/15 pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-white/10 border border-white/20 text-[#38BDF8]">
            <BarChart2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-base text-[#FFFFFF]">
              24-Hour Telemetry Time Series
            </h3>
            <p className="text-xs text-[#A0C4E2]">
              Continuous multi-sensor temporal progression across voyage coordinates
            </p>
          </div>
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-1 rounded-xl overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSel = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isSel
                    ? 'bg-[#FF7A00] text-white shadow-md font-bold'
                    : 'text-[#A0C4E2] hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-3.5 h-3.5" style={{ color: isSel ? '#FFFFFF' : tab.color }} />
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
                <stop offset="5%" stopColor={currentTabConfig.color} stopOpacity={0.45} />
                <stop offset="95%" stopColor={currentTabConfig.color} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
              tick={{ fill: '#A0C4E2', fontSize: 11 }}
            />
            <YAxis
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
              tick={{ fill: '#A0C4E2', fontSize: 11 }}
              domain={['auto', 'auto']}
              unit={` ${currentTabConfig.unit}`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-[#031D36]/90 backdrop-blur-md text-white p-2.5 rounded-xl shadow-2xl border border-white/20 text-xs">
                      <div className="font-mono text-[10px] text-[#A0C4E2]">{label} UTC</div>
                      <div className="font-bold text-sm text-[#FF7A00] mt-0.5">
                        {payload[0].value} {currentTabConfig.unit}
                      </div>
                      <div className="text-[10px] text-[#A0C4E2]">
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

      <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-[#A0C4E2]">
        <span>Sampling Interval: <strong className="text-white">2 Hours</strong></span>
        <span>Telemetry Buffer: <strong className="text-white">Last 24 Hours Voyage Data</strong></span>
      </div>
    </div>
  );
};
