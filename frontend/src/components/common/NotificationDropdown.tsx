import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, AlertTriangle, Ship, Compass, ShieldAlert, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';
import { AlertItem } from '../../types';
import { useNavigate } from 'react-router-dom';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ isOpen, onClose }) => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [activeTab, setActiveTab] = useState<'ALL' | 'CRITICAL' | 'RISK'>('ALL');
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      api.getAlerts().then(setAlerts).catch(console.error);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = alerts.filter(a => {
    if (activeTab === 'CRITICAL') return a.severity === 'CRITICAL';
    if (activeTab === 'RISK') return a.category.includes('Risk');
    return true;
  });

  const handleMarkAllRead = async () => {
    await api.acknowledgeAlert(1).catch(() => {});
    setAlerts(prev => prev.map(a => ({ ...a, is_read: true })));
  };

  return (
    <div className="absolute right-0 top-12 z-50 w-88 sm:w-96 bg-white rounded-xl shadow-2xl border border-[#CBD5E1] overflow-hidden">
      {/* Header */}
      <div className="p-3.5 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#063B68]" />
          <span className="font-heading font-bold text-sm text-[#063B68]">Maritime Operational Alerts</span>
          <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-[#D92D20] text-white">
            {alerts.filter(a => !a.is_read).length}
          </span>
        </div>
        <button
          onClick={handleMarkAllRead}
          className="text-xs text-[#0867B2] hover:underline flex items-center gap-1 font-medium cursor-pointer"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          <span>Mark all read</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-[#E2E8F0] bg-white px-3 pt-2 text-xs">
        {(['ALL', 'CRITICAL', 'RISK'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 px-3 font-semibold border-b-2 cursor-pointer transition-colors ${
              activeTab === tab
                ? 'border-[#0867B2] text-[#0867B2]'
                : 'border-transparent text-[#64748B] hover:text-[#102A43]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-[#F1F5F9]">
        {filtered.length === 0 ? (
          <div className="p-6 text-center text-xs text-[#64748B]">
            No unread notifications in this category.
          </div>
        ) : (
          filtered.map(a => (
            <div
              key={a.id}
              onClick={() => {
                navigate('/alerts');
                onClose();
              }}
              className={`p-3 hover:bg-[#F8FAFC] cursor-pointer transition-colors ${
                !a.is_read ? 'bg-[#EBF4FC]/40' : ''
              }`}
            >
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 flex-shrink-0">
                  {a.severity === 'CRITICAL' ? (
                    <ShieldAlert className="w-4 h-4 text-[#D92D20]" />
                  ) : a.category === 'Market Risk' ? (
                    <AlertTriangle className="w-4 h-4 text-[#FF7A00]" />
                  ) : (
                    <Ship className="w-4 h-4 text-[#0867B2]" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#063B68]">
                      {a.category}
                    </span>
                    <span className="text-[10px] text-[#94A3B8] font-mono">{a.timestamp}</span>
                  </div>
                  <p className="text-xs text-[#102A43] font-medium leading-snug">{a.message}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-2.5 bg-[#F8FAFC] border-t border-[#E2E8F0] text-center">
        <button
          onClick={() => {
            navigate('/alerts');
            onClose();
          }}
          className="text-xs text-[#0867B2] font-semibold hover:underline flex items-center justify-center gap-1 cursor-pointer w-full"
        >
          <span>Open Full Risk & Alert Control Center</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
