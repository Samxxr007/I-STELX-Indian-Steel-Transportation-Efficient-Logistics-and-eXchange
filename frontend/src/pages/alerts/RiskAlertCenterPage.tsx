import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { AlertItem } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  AlertTriangle,
  ShieldAlert,
  Ship,
  Anchor,
  TrendingUp,
  CheckCircle2,
  CheckCheck,
  Filter,
  Info
} from 'lucide-react';

export const RiskAlertCenterPage: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      const data = await api.getAlerts(categoryFilter, severityFilter);
      setAlerts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [categoryFilter, severityFilter]);

  const handleAcknowledge = async (id: number) => {
    try {
      await api.acknowledgeAlert(id);
      setAlerts(prev => prev.map(a => a.id === id ? { ...a, is_acknowledged: true, is_read: true } : a));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-[#D92D20]" />
            <h1 className="font-heading font-extrabold text-2xl lg:text-3xl text-[#063B68] tracking-tight">
              Maritime Risk & Alert Control Center
            </h1>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Realtime categorized intelligence across Market Risk, Port Queues, Monsoon Weather, Schedule Disruptions, and Geofences.
          </p>
        </div>

        <button
          onClick={async () => {
            await api.acknowledgeAlert(1).catch(() => {});
            setAlerts(prev => prev.map(a => ({ ...a, is_read: true })));
          }}
          className="px-3.5 py-2 bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] text-[#063B68] font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs self-start sm:self-auto"
        >
          <CheckCheck className="w-3.5 h-3.5 text-[#00843D]" />
          <span>Mark All As Read</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="istelx-card p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#F8FAFC]">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#475569] mb-1.5">
            Filter by Risk Category:
          </label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-1.5 bg-white border border-[#CBD5E1] rounded-lg text-xs font-semibold text-[#063B68]"
          >
            <option value="ALL">All Categories</option>
            <option value="Schedule Risk">Schedule Risk</option>
            <option value="Port Risk">Port Risk</option>
            <option value="Market Risk">Market Risk</option>
            <option value="Weather Risk">Weather Risk</option>
            <option value="Operational Risk">Operational Risk</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#475569] mb-1.5">
            Filter by Severity:
          </label>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="w-full px-3 py-1.5 bg-white border border-[#CBD5E1] rounded-lg text-xs font-semibold text-[#063B68]"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="WARNING">Warning</option>
            <option value="MARKET">Market Notice</option>
            <option value="INFO">Info</option>
            <option value="SUCCESS">Success</option>
          </select>
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3">
        {alerts.map(a => (
          <div
            key={a.id}
            className={`istelx-card p-5 space-y-3 rounded-xl border transition-all ${
              !a.is_acknowledged ? 'bg-white border-[#CBD5E1] shadow-xs' : 'bg-[#F8FAFC] opacity-80'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-lg ${
                  a.severity === 'CRITICAL' ? 'bg-[#FEECEB] text-[#D92D20]' : 'bg-[#EBF4FC] text-[#0867B2]'
                }`}>
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-extrabold text-sm text-[#063B68]">
                      {a.category}
                    </span>
                    <StatusBadge status={a.severity} size="sm" />
                  </div>
                  <span className="font-mono text-[10px] text-[#64748B]">{a.timestamp}</span>
                </div>
              </div>

              {!a.is_acknowledged ? (
                <button
                  onClick={() => handleAcknowledge(a.id)}
                  className="px-3 py-1.5 bg-[#063B68] hover:bg-[#0867B2] text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Acknowledge
                </button>
              ) : (
                <span className="text-xs font-semibold text-[#00843D] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Acknowledged
                </span>
              )}
            </div>

            <p className="text-xs font-medium text-[#102A43] leading-relaxed pl-10">
              {a.message}
            </p>

            {a.evidence && (
              <div className="ml-10 p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#475569]">
                <span className="font-bold text-[#063B68]">Evidence & Telemetry: </span>
                {a.evidence}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
