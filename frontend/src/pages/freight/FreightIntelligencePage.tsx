import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { FreightForecast } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  TrendingUp,
  Filter,
  RefreshCw,
  Cpu,
  ShieldAlert,
  Info,
  Layers,
  Calendar,
  DollarSign,
  Activity
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

export const FreightIntelligencePage: React.FC = () => {
  const [origin, setOrigin] = useState('Hay Point');
  const [destination, setDestination] = useState('Visakhapatnam');
  const [vesselType, setVesselType] = useState('Panamax');
  const [cargoType, setCargoType] = useState('Coking Coal');
  
  const [forecast, setForecast] = useState<FreightForecast | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchForecast = async () => {
    setLoading(true);
    try {
      const data = await api.getFreightForecast(origin, destination, vesselType, cargoType);
      setForecast(data);
    } catch (err) {
      console.error('Error fetching freight forecast:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForecast();
  }, [origin, destination, vesselType, cargoType]);

  // Merge historical and forecast curve for continuous chart
  const chartData = React.useMemo(() => {
    if (!forecast) return [];
    const hist = forecast.historical.map(h => ({
      date: h.date.slice(5),
      actual_rate: h.rate_usd_per_mt,
      bunker: h.bunker_price,
      forecast_rate: null,
      lower_bound: null,
      upper_bound: null
    }));

    // Connect last historical point
    const lastHist = forecast.historical[forecast.historical.length - 1];
    const fore = forecast.forecast_curve.map((f, i) => ({
      date: f.date.slice(5),
      actual_rate: i === 0 ? lastHist.rate_usd_per_mt : null,
      bunker: null,
      forecast_rate: f.forecast_rate,
      lower_bound: f.lower_bound,
      upper_bound: f.upper_bound
    }));

    return [...hist, ...fore];
  }, [forecast]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl lg:text-3xl text-[#063B68] tracking-tight">
            Freight Intelligence & ML Forecasting
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Predict forward dry bulk ocean freight rates using chronological ensemble regression with uncertainty bands.
          </p>
        </div>

        <button
          onClick={fetchForecast}
          className="px-3.5 py-2 bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] text-[#063B68] font-bold text-xs rounded-lg transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Re-train Forecast</span>
        </button>
      </div>

      {/* Filter Panel */}
      <div className="istelx-card p-4 grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#475569] mb-1">
            Origin Port
          </label>
          <select
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="w-full px-3 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-xs font-semibold text-[#063B68] focus:border-[#0867B2] focus:bg-white transition-colors"
          >
            <option value="Hay Point">Hay Point (Australia)</option>
            <option value="Newcastle">Newcastle (Australia)</option>
            <option value="Gladstone">Gladstone (Australia)</option>
            <option value="Port Hedland">Port Hedland (Australia)</option>
            <option value="Richards Bay">Richards Bay (South Africa)</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#475569] mb-1">
            Destination Port
          </label>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full px-3 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-xs font-semibold text-[#063B68] focus:border-[#0867B2] focus:bg-white transition-colors"
          >
            <option value="Visakhapatnam">Visakhapatnam (INVTZ)</option>
            <option value="Paradip">Paradip (INPRT)</option>
            <option value="Haldia">Haldia (INHAL)</option>
            <option value="Dhamra">Dhamra (INDHR)</option>
            <option value="Gangavaram">Gangavaram (INGGV)</option>
            <option value="Chennai">Chennai (INMAA)</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#475569] mb-1">
            Vessel Class
          </label>
          <select
            value={vesselType}
            onChange={(e) => setVesselType(e.target.value)}
            className="w-full px-3 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-xs font-semibold text-[#063B68] focus:border-[#0867B2] focus:bg-white transition-colors"
          >
            <option value="Panamax">Panamax (70-85k DWT)</option>
            <option value="Capesize">Capesize (120-200k DWT)</option>
            <option value="Supramax">Supramax (50-65k DWT)</option>
            <option value="Handysize">Handysize (30-45k DWT)</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#475569] mb-1">
            Cargo Type
          </label>
          <select
            value={cargoType}
            onChange={(e) => setCargoType(e.target.value)}
            className="w-full px-3 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-xs font-semibold text-[#063B68] focus:border-[#0867B2] focus:bg-white transition-colors"
          >
            <option value="Coking Coal">Coking Coal</option>
            <option value="Iron Ore">Iron Ore</option>
            <option value="Thermal Coal">Thermal Coal</option>
            <option value="Limestone">Limestone</option>
          </select>
        </div>
      </div>

      {/* FORECAST METRICS GRID */}
      {forecast && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="istelx-card p-4 bg-white border border-[#CBD5E1]">
            <span className="text-[11px] font-bold uppercase text-[#64748B]">Current Spot Rate</span>
            <div className="font-heading font-extrabold text-3xl text-[#063B68] mt-1">
              ${forecast.current_rate.toFixed(2)}
              <span className="text-xs font-normal text-[#64748B]"> / MT</span>
            </div>
            <div className="text-[11px] font-semibold text-[#00843D] mt-1">
              Live Baltic Index Correlated
            </div>
          </div>

          <div className="istelx-card p-4 bg-white border border-[#CBD5E1]">
            <span className="text-[11px] font-bold uppercase text-[#64748B]">7-Day Forecast</span>
            <div className="font-heading font-extrabold text-3xl text-[#0867B2] mt-1">
              ${forecast.forecast_7d.toFixed(2)}
              <span className="text-xs font-normal text-[#64748B]"> / MT</span>
            </div>
            <div className="text-[11px] font-semibold text-[#0867B2] mt-1">
              {forecast.forecast_7d > forecast.current_rate ? '▲ +' : '▼ -'}
              {Math.abs(((forecast.forecast_7d - forecast.current_rate) / forecast.current_rate) * 100).toFixed(1)}% vs spot
            </div>
          </div>

          <div className="istelx-card p-4 bg-white border border-[#CBD5E1]">
            <span className="text-[11px] font-bold uppercase text-[#64748B]">15-Day Forecast</span>
            <div className="font-heading font-extrabold text-3xl text-[#0867B2] mt-1">
              ${forecast.forecast_15d.toFixed(2)}
              <span className="text-xs font-normal text-[#64748B]"> / MT</span>
            </div>
            <div className="text-[11px] font-semibold text-[#0867B2] mt-1">
              {forecast.forecast_15d > forecast.current_rate ? '▲ +' : '▼ -'}
              {Math.abs(((forecast.forecast_15d - forecast.current_rate) / forecast.current_rate) * 100).toFixed(1)}% vs spot
            </div>
          </div>

          <div className="istelx-card p-4 bg-white border border-[#CBD5E1]">
            <span className="text-[11px] font-bold uppercase text-[#64748B]">30-Day Forecast</span>
            <div className="font-heading font-extrabold text-3xl text-[#FF7A00] mt-1">
              ${forecast.forecast_30d.toFixed(2)}
              <span className="text-xs font-normal text-[#64748B]"> / MT</span>
            </div>
            <div className="text-[11px] font-semibold text-[#FF7A00] mt-1">
              Range: ${forecast.lower_bound_30d} – ${forecast.upper_bound_30d}
            </div>
          </div>

          <div className="istelx-card p-4 bg-[#F8FAFC] border border-[#CBD5E1] flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase text-[#64748B]">Market Direction</span>
              <div className="mt-1">
                <StatusBadge status={forecast.trend + ' TREND'} size="md" />
              </div>
            </div>
            <div className="text-[11px] text-[#475569] font-medium mt-2">
              Model Confidence: <span className="font-bold text-[#063B68]">{(forecast.confidence_score * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>
      )}

      {/* FORECAST TIME SERIES CHART WITH CONFIDENCE BANDS */}
      <div className="istelx-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8F0] pb-3">
          <div>
            <h3 className="font-heading font-bold text-base text-[#063B68]">
              Historical Freight Index & 30-Day Forward Forecast Curve
            </h3>
            <p className="text-xs text-[#64748B]">
              Shaded band represents 90% confidence prediction intervals based on rolling variance and bunker indices.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#063B68]" />
              <span>Historical Spot</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#FF7A00]" />
              <span>ML Forecast</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-2 bg-[#FF7A00]/20 rounded-xs" />
              <span>90% Confidence Interval</span>
            </div>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748B' }} />
              <YAxis domain={['dataMin - 2', 'dataMax + 2']} tick={{ fontSize: 10, fill: '#64748B' }} unit="$" />
              <Tooltip
                contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', fontSize: '11px', border: '1px solid #CBD5E1' }}
                formatter={(val: any) => [`$${Number(val).toFixed(2)} / MT`, '']}
              />
              
              {/* Confidence Band (Upper and Lower bounds) */}
              <Area
                type="monotone"
                dataKey="upper_bound"
                stroke="none"
                fill="#FF7A00"
                fillOpacity={0.15}
                name="Upper Bound (90% CI)"
              />
              <Area
                type="monotone"
                dataKey="lower_bound"
                stroke="none"
                fill="#FFFFFF"
                name="Lower Bound (90% CI)"
              />

              {/* Historical actual curve */}
              <Line
                type="monotone"
                dataKey="actual_rate"
                stroke="#063B68"
                strokeWidth={2.5}
                dot={false}
                name="Historical Actual Rate"
              />

              {/* ML Forecast curve */}
              <Line
                type="monotone"
                dataKey="forecast_rate"
                stroke="#FF7A00"
                strokeWidth={2.5}
                strokeDasharray="4 4"
                dot={{ r: 2, fill: '#FF7A00' }}
                name="Predicted Rate"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* ML MODEL STATS & EVALUATION NOTICE */}
        {forecast && (
          <div className="pt-4 border-t border-[#E2E8F0] grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
              <span className="text-[#64748B] block text-[10px] uppercase font-bold">Model Architecture</span>
              <span className="font-bold text-[#063B68]">{forecast.model_version}</span>
            </div>
            <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
              <span className="text-[#64748B] block text-[10px] uppercase font-bold">Chronological Split Metrics</span>
              <span className="font-mono font-bold text-[#102A43]">
                MAE: ${forecast.metrics.mae} • RMSE: ${forecast.metrics.rmse} • MAPE: {forecast.metrics.mape_pct}%
              </span>
            </div>
            <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
              <span className="text-[#64748B] block text-[10px] uppercase font-bold">Dataset Split Structure</span>
              <span className="font-semibold text-[#00843D]">{forecast.metrics.split_type}</span>
            </div>
            <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
              <span className="text-[#64748B] block text-[10px] uppercase font-bold">Last Model Retrain</span>
              <span className="font-mono text-[#475569]">{forecast.last_updated}</span>
            </div>
          </div>
        )}
      </div>

      {/* DISCLAIMER / GOVERNANCE BANNER */}
      <div className="p-4 rounded-xl bg-[#FFF4E5] border border-[#FFE0B2] flex items-start gap-3 text-xs text-[#7A3E00]">
        <Info className="w-5 h-5 flex-shrink-0 text-[#FF7A00] mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold">Enterprise Decision Support Notice: </span>
          I-STELX freight forecasting is generated via machine learning algorithms trained on synthetic time-series market indicators. Forecasts serve as probabilistic planning benchmarks and are never presented as guaranteed commercial future prices.
        </div>
      </div>
    </div>
  );
};
