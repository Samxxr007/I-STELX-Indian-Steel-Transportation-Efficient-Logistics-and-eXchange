import React, { useState } from 'react';
import { Settings, Shield, Bell, Database, Radio, Cpu, Check, Info } from 'lucide-react';

export const SystemSettingsPage: React.FC = () => {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    aisSimulationInterval: 3,
    mlModelRetrainCron: 'Daily at 00:00 UTC',
    geofenceOuterRadiusNM: 50,
    geofenceAnchorageRadiusNM: 15,
    emailAlertsEnabled: true,
    strictChronologicalSplit: true,
    demurrageRatePerDayUSD: 16000,
    fxRateINRUSD: 86.50
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <div className="flex items-center gap-2">
          <Settings className="w-6 h-6 text-[#063B68]" />
          <h1 className="font-heading font-extrabold text-2xl lg:text-3xl text-[#063B68] tracking-tight">
            System Settings & Engine Parameters
          </h1>
        </div>
        <p className="text-xs text-[#64748B] mt-0.5">
          Configure telemetry broadcast intervals, ML training pipelines, geofencing radii, and default commercial tariffs.
        </p>
      </div>

      {saved && (
        <div className="p-3 bg-[#E6F4EA] border border-[#C4E7D0] rounded-lg text-xs font-bold text-[#00843D] flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>System configuration parameters saved and updated across cluster.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Telemetry & AIS */}
        <div className="istelx-card p-6 space-y-4 bg-white">
          <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-3 text-[#063B68]">
            <Radio className="w-4 h-4 text-[#0867B2]" />
            <h3 className="font-heading font-bold text-sm">Realtime AIS Simulation & Broadcast</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold uppercase text-[#475569] mb-1">
                Telemetry Broadcast Interval (Seconds)
              </label>
              <input
                type="number"
                min={1}
                max={60}
                value={settings.aisSimulationInterval}
                onChange={(e) => setSettings({ ...settings, aisSimulationInterval: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded text-xs font-bold text-[#063B68]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-[#475569] mb-1">
                Outer Geofence Approach Radius (NM)
              </label>
              <input
                type="number"
                min={10}
                max={100}
                value={settings.geofenceOuterRadiusNM}
                onChange={(e) => setSettings({ ...settings, geofenceOuterRadiusNM: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded text-xs font-bold text-[#063B68]"
              />
            </div>
          </div>
        </div>

        {/* ML & Freight Models */}
        <div className="istelx-card p-6 space-y-4 bg-white">
          <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-3 text-[#063B68]">
            <Cpu className="w-4 h-4 text-[#FF7A00]" />
            <h3 className="font-heading font-bold text-sm">Machine Learning & Forecast Governance</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-lg border">
              <div>
                <div className="font-bold text-[#102A43]">Strict Chronological Time-Series Splitting</div>
                <div className="text-[11px] text-[#64748B]">Enforces non-shuffled train/validation/test split for time series validity.</div>
              </div>
              <input
                type="checkbox"
                checked={settings.strictChronologicalSplit}
                onChange={(e) => setSettings({ ...settings, strictChronologicalSplit: e.target.checked })}
                className="rounded text-[#0867B2]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-[#475569] mb-1">
                  Default Foreign Exchange Rate (INR / USD)
                </label>
                <input
                  type="number"
                  step={0.1}
                  value={settings.fxRateINRUSD}
                  onChange={(e) => setSettings({ ...settings, fxRateINRUSD: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded text-xs font-bold text-[#063B68]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-[#475569] mb-1">
                  Daily Demurrage Benchmark ($ / Day)
                </label>
                <input
                  type="number"
                  step={500}
                  value={settings.demurrageRatePerDayUSD}
                  onChange={(e) => setSettings({ ...settings, demurrageRatePerDayUSD: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded text-xs font-bold text-[#D92D20]"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#063B68] hover:bg-[#0867B2] text-white font-bold text-xs rounded-lg transition-colors shadow-md cursor-pointer"
          >
            Save Configuration Changes
          </button>
        </div>
      </form>
    </div>
  );
};
