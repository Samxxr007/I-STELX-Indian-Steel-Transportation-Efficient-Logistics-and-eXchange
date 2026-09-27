import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../brand/Logo';
import { GlobalSearchModal } from '../common/GlobalSearchModal';
import { NotificationDropdown } from '../common/NotificationDropdown';
import { RoleSwitcherModal } from '../common/RoleSwitcherModal';
import {
  LayoutDashboard,
  PlusCircle,
  TrendingUp,
  Ship,
  Anchor,
  DollarSign,
  Radio,
  Box,
  Package,
  AlertTriangle,
  Brain,
  SlidersHorizontal,
  Clock,
  BarChart3,
  FileSpreadsheet,
  Users,
  Database,
  Settings,
  Search,
  Bell,
  LogOut,
  Shield,
  Menu,
  X,
  Zap,
  ChevronRight,
  Wifi
} from 'lucide-react';

export const AppLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [currentTimeUtc, setCurrentTimeUtc] = useState('');
  const [currentTimeIst, setCurrentTimeIst] = useState('');
  const [showIst, setShowIst] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeUtc(
        now.toISOString().substring(11, 19) + ' UTC'
      );
      setCurrentTimeIst(
        now.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST'
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const navGroups = [
    {
      label: 'COMMAND CENTER',
      items: [
        { name: 'Command Center', path: '/dashboard', icon: LayoutDashboard }
      ]
    },
    {
      label: 'PLANNING & CHARTERING',
      items: [
        { name: 'New Cargo Demand', path: '/requirements/new', icon: PlusCircle, badge: 'New' },
        { name: 'Freight Intelligence', path: '/freight', icon: TrendingUp },
        { name: 'Vessel Optimizer', path: '/vessels', icon: Ship },
        { name: 'Port Compatibility', path: '/ports', icon: Anchor },
        { name: 'Landed Cost Model', path: '/cost', icon: DollarSign }
      ]
    },
    {
      label: 'FLEET OPERATIONS',
      items: [
        { name: 'Live Maritime Tower', path: '/tracking', icon: Radio, pulse: true },
        { name: '3D Cargo Twin', path: '/digital-twin', icon: Box },
        { name: 'Voyage Shipments', path: '/shipments', icon: Package },
        { name: 'Risk & Port Alerts', path: '/alerts', icon: AlertTriangle, alertCount: 3 }
      ]
    },
    {
      label: 'AI & DECISION SUITE',
      items: [
        { name: 'Charter Advisor', path: '/charter-advisor', icon: Brain, badge: 'AI' },
        { name: 'What-If Simulator', path: '/simulator', icon: SlidersHorizontal },
        { name: 'ETA Predictor', path: '/eta', icon: Clock }
      ]
    },
    {
      label: 'INTELLIGENCE & AUDIT',
      items: [
        { name: 'Executive Analytics', path: '/analytics', icon: BarChart3 },
        { name: 'Discharge Reports', path: '/reports', icon: FileSpreadsheet }
      ]
    },
    {
      label: 'GOVERNANCE',
      items: [
        { name: 'Users & Roles', path: '/admin/users', icon: Users },
        { name: 'Master Data Hub', path: '/admin/master-data', icon: Database },
        { name: 'System Settings', path: '/admin/settings', icon: Settings }
      ]
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isDigitalTwin = location.pathname.startsWith('/digital-twin');

  return (
    <div className="flex h-screen bg-[#F5F8FC] overflow-hidden">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-64 bg-gradient-to-b from-[#031D36] via-[#063B68] to-[#042442] text-white flex-shrink-0 z-30 shadow-2xl border-r border-white/10 select-none">
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-white/10 bg-[#02172D]/60 backdrop-blur-md">
          <NavLink to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="p-1 rounded-lg bg-white/5 border border-white/10 group-hover:border-[#FF7A00]/50 transition-colors">
              <Logo size="sm" showText={false} />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-base tracking-wider text-white">
                  I-STELX
                </span>
                <span className="px-1.5 py-0.2 bg-[#FF7A00]/20 border border-[#FF7A00]/40 text-[#FF7A00] text-[9px] font-mono font-bold rounded">
                  v2.4
                </span>
              </div>
              <span className="text-[8px] uppercase tracking-widest text-sky-300 font-bold">
                Maritime Control Tower
              </span>
            </div>
          </NavLink>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {navGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              <div className="px-2.5 text-[9px] font-extrabold tracking-widest uppercase text-slate-400/80 flex items-center justify-between">
                <span>{group.label}</span>
              </div>
              <div className="mt-1 space-y-0.5">
                {group.items.map((item: any) => {
                  const Icon = item.icon;
                  const isActive =
                    location.pathname === item.path ||
                    (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 ${
                        isActive
                          ? 'bg-gradient-to-r from-[#0867B2] to-[#0A7CD4] text-white shadow-md shadow-[#0867B2]/30 font-bold translate-x-0.5'
                          : 'text-slate-200 hover:bg-white/8 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon
                          className={`w-4 h-4 flex-shrink-0 transition-colors ${
                            isActive ? 'text-[#FF7A00]' : 'text-slate-400'
                          }`}
                        />
                        <span className="truncate">{item.name}</span>
                      </div>

                      <div className="flex items-center gap-1 flex-shrink-0 ml-1">
                        {item.pulse && (
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                        )}
                        {item.badge && (
                          <span className="px-1.5 py-0.2 bg-[#FF7A00]/25 text-[#FF7A00] text-[9px] font-bold rounded border border-[#FF7A00]/40">
                            {item.badge}
                          </span>
                        )}
                        {item.alertCount && (
                          <span className="px-1.5 py-0.2 bg-rose-500/25 text-rose-300 text-[9px] font-bold rounded border border-rose-500/40">
                            {item.alertCount}
                          </span>
                        )}
                      </div>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* User Card & Role Switcher */}
        <div className="p-3 bg-[#02172D]/70 border-t border-white/10 flex flex-col gap-2">
          <div
            onClick={() => setRoleModalOpen(true)}
            className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-all border border-white/10 group"
            title="Click to test role permissions"
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#FF7A00] to-amber-500 flex items-center justify-center font-extrabold text-white text-xs flex-shrink-0 shadow-xs">
                {user?.full_name?.charAt(0) || 'U'}
              </div>
              <div className="flex flex-col truncate">
                <span className="text-xs font-bold text-white truncate leading-tight">
                  {user?.full_name || 'User'}
                </span>
                <span className="text-[10px] text-[#FF7A00] font-semibold flex items-center gap-1">
                  <Shield className="w-2.5 h-2.5" />
                  {user?.role || 'Viewer'}
                </span>
              </div>
            </div>
            <Zap className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#FF7A00] transition-colors" />
          </div>

          <div className="flex items-center justify-between px-1">
            <button
              onClick={() => setRoleModalOpen(true)}
              className="text-[11px] text-slate-400 hover:text-white font-medium flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Demo Role</span>
              <ChevronRight className="w-3 h-3" />
            </button>
            <button
              onClick={handleLogout}
              className="text-[11px] text-rose-300 hover:text-rose-200 font-medium flex items-center gap-1 transition-colors cursor-pointer"
            >
              <LogOut className="w-3 h-3" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE SIDEBAR DRAWER */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-72 bg-gradient-to-b from-[#031D36] via-[#063B68] to-[#042442] text-white flex flex-col h-full shadow-2xl border-r border-white/10">
            <div className="p-4 flex items-center justify-between border-b border-white/10 bg-[#02172D]/70">
              <Logo size="sm" />
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {navGroups.map((group, idx) => (
                <div key={idx} className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {group.label}
                  </span>
                  <div className="space-y-1 mt-1">
                    {group.items.map((item: any) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileSidebarOpen(false)}
                        className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-white hover:bg-white/10"
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="w-4 h-4 text-[#FF7A00]" />
                          <span>{item.name}</span>
                        </div>
                        {item.pulse && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        )}
                      </NavLink>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* TOP COMMAND BAR */}
        <header
          className={`h-16 px-4 lg:px-6 flex items-center justify-between z-20 transition-colors ${
            isDigitalTwin
              ? 'bg-[#031D36]/80 backdrop-blur-md border-b border-white/10 text-white'
              : 'bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-2xs text-slate-900'
          }`}
        >
          {/* Left: Mobile Menu & Search */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className={`lg:hidden p-2 rounded-lg transition-colors cursor-pointer ${
                isDigitalTwin ? 'text-white hover:bg-white/10' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Quick Command Palette Launcher */}
            <button
              onClick={() => setSearchOpen(true)}
              className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer w-48 sm:w-72 shadow-2xs group ${
                isDigitalTwin
                  ? 'bg-white/10 hover:bg-white/15 border-white/20 text-[#A0C4E2]'
                  : 'bg-slate-100/80 hover:bg-slate-200/70 border-slate-200 text-slate-600'
              }`}
            >
              <Search className="w-4 h-4 text-[#38BDF8] group-hover:scale-110 transition-transform" />
              <span className="truncate">Search Shipments, Vessels, Ports...</span>
              <kbd
                className={`hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono ml-auto shadow-2xs ${
                  isDigitalTwin ? 'bg-white/10 border border-white/20 text-white' : 'bg-white border border-slate-300 text-slate-500'
                }`}
              >
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right: Telemetry Stream, Clock, Alerts, User Profile */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* Live AIS Stream Indicator */}
            <div
              className={`hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold shadow-2xs border ${
                isDigitalTwin
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-700'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="tracking-tight">AIS Telemetry Active</span>
            </div>

            {/* High-Precision Clock (UTC / IST toggle) */}
            <div
              onClick={() => setShowIst(!showIst)}
              className={`hidden xl:flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-xl border cursor-pointer select-none transition-colors shadow-2xs ${
                isDigitalTwin
                  ? 'bg-white/10 hover:bg-white/15 border-white/20 text-white'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
              }`}
              title="Click to toggle between UTC and IST"
            >
              <Clock className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span className="tabular-nums font-semibold">
                {showIst ? currentTimeIst : currentTimeUtc}
              </span>
            </div>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className={`relative p-2 rounded-xl transition-colors cursor-pointer ${
                  isDigitalTwin ? 'text-white hover:bg-white/10' : 'text-slate-700 hover:text-[#063B68] hover:bg-slate-100'
                }`}
                title="Notifications & Alerts"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
              </button>
              <NotificationDropdown
                isOpen={notificationsOpen}
                onClose={() => setNotificationsOpen(false)}
              />
            </div>

            {/* User Profile Pill */}
            <div
              onClick={() => setRoleModalOpen(true)}
              className={`flex items-center gap-2.5 pl-2.5 py-1 pr-1.5 rounded-xl border transition-all cursor-pointer select-none ${
                isDigitalTwin
                  ? 'hover:bg-white/10 border-white/10'
                  : 'hover:bg-slate-100 border-transparent hover:border-slate-200'
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#063B68] to-[#0867B2] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {user?.full_name?.charAt(0) || 'U'}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className={`text-xs font-bold leading-tight ${isDigitalTwin ? 'text-white' : 'text-slate-900'}`}>
                  {user?.full_name?.split(' ')[0]}
                </span>
                <span className="text-[10px] font-semibold text-[#38BDF8]">
                  {user?.role}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN BODY OUTLET */}
        <main
          className={`${
            isDigitalTwin
              ? 'flex-1 relative overflow-y-auto overflow-x-hidden bg-[#021024]'
              : 'flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#F5F8FC]'
          }`}
        >
          <div className={isDigitalTwin ? 'relative min-h-full' : 'max-w-7xl mx-auto'}>
            <Outlet />
          </div>
        </main>
      </div>

      {/* MODALS */}
      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <RoleSwitcherModal isOpen={roleModalOpen} onClose={() => setRoleModalOpen(false)} />
    </div>
  );
};
