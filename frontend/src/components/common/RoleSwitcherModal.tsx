import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { Shield, Anchor, Ship, Activity, Eye, CheckCircle2, X } from 'lucide-react';

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ROLES_INFO: {
  role: UserRole;
  title: string;
  name: string;
  desc: string;
  icon: any;
  badge: string;
}[] = [
  {
    role: 'ADMIN',
    title: 'Enterprise System Governance',
    name: 'Rajiv Menon (Admin)',
    desc: 'Full administrative authority: User registrations approval, role assignments, system health, and master datasets.',
    icon: Shield,
    badge: 'bg-[#D92D20]/10 text-[#D92D20] border-[#D92D20]/30'
  },
  {
    role: 'Charter Manager',
    title: 'Vessel Chartering & Freight',
    name: 'Vikramaditya Sharma',
    desc: 'Creates cargo requirements, runs freight ML forecasts, evaluates AI Charter Advisor advice, and approves fixtures.',
    icon: Anchor,
    badge: 'bg-[#063B68]/10 text-[#063B68] border-[#063B68]/30'
  },
  {
    role: 'Logistics Manager',
    title: 'Inbound Supply Chain & Fleet',
    name: 'Ananya Roy Chowdhury',
    desc: 'Manages shipments, monitors live vessel tracking, assesses ETA intelligence and route disruptions.',
    icon: Ship,
    badge: 'bg-[#0867B2]/10 text-[#0867B2] border-[#0867B2]/30'
  },
  {
    role: 'Operations Manager',
    title: 'Port Terminals & Geofencing',
    name: 'Sanjay Patnaik',
    desc: 'Monitors berth queues, port geofences, demurrage risks, and terminal handling operations.',
    icon: Activity,
    badge: 'bg-[#FF7A00]/10 text-[#FF7A00] border-[#FF7A00]/30'
  },
  {
    role: 'Management Viewer',
    title: 'Executive Oversight & Auditing',
    name: 'Pooja Deshmukh',
    desc: 'Read-only access to high-level command center KPIs, planned vs actual variance reports, and analytics.',
    icon: Eye,
    badge: 'bg-[#00843D]/10 text-[#00843D] border-[#00843D]/30'
  }
];

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({ isOpen, onClose }) => {
  const { user, switchRole } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-[#CBD5E1] w-full max-w-xl overflow-hidden">
        <div className="p-4 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
          <div>
            <h3 className="font-heading font-bold text-base text-[#063B68]">
              Role-Based Access Control (RBAC) Switcher
            </h3>
            <p className="text-xs text-[#64748B]">
              Switch user identity to test role-specific workflows and security boundaries.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#94A3B8] hover:text-[#102A43] hover:bg-[#E2E8F0] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto">
          {ROLES_INFO.map(item => {
            const isCurrent = user?.role === item.role;
            const Icon = item.icon;
            return (
              <div
                key={item.role}
                onClick={() => {
                  switchRole(item.role);
                  onClose();
                }}
                className={`p-3.5 rounded-lg border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                  isCurrent
                    ? 'border-[#0867B2] bg-[#EBF4FC]/50 shadow-xs'
                    : 'border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${isCurrent ? 'bg-[#0867B2] text-white' : 'bg-[#F1F5F9] text-[#063B68]'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-heading font-bold text-sm text-[#102A43]">{item.title}</span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${item.badge}`}>
                        {item.role}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-[#0867B2] mb-1">{item.name}</div>
                    <p className="text-xs text-[#64748B] leading-relaxed">{item.desc}</p>
                  </div>
                </div>

                {isCurrent && (
                  <CheckCircle2 className="w-5 h-5 text-[#00843D] flex-shrink-0 mt-1" />
                )}
              </div>
            );
          })}
        </div>

        <div className="p-3 bg-[#F8FAFC] border-t border-[#E2E8F0] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#063B68] hover:bg-[#0867B2] text-white text-xs font-semibold rounded-md transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
