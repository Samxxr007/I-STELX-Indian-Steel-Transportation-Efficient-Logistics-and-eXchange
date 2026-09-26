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
  RefreshCw,
  Compass,
  Zap
} from 'lucide-react';

export const AppLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toUTCString().replace('GMT', 'UTC')
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
      label: 'PLANNING',
      items: [
        { name: 'New Requirement', path: '/requirements/new', icon: PlusCircle },
        { name: 'Freight Intelligence', path: '/freight', icon: TrendingUp },
        { name: 'Vessel Optimizer', path: '/vessels', icon: Ship },
        { name: 'Port Intelligence', path: '/ports', icon: Anchor },
        { name: 'Cost Intelligence', path: '/cost', icon: DollarSign }
      ]
    },
    {
      label: 'OPERATIONS',
      items: [
        { name: 'Live Tracking', path: '/tracking', icon: Radio },
        { name: 'Shipments', path: '/shipments', icon: Package },
        { name: 'Risk & Alerts', path: '/alerts', icon: AlertTriangle }
      ]
    },
    {
      label: 'INTELLIGENCE',
      items: [
        { name: 'Charter Advisor', path: '/charter-advisor', icon: Brain },
        { name: 'What-If Simulator', path: '/simulator', icon: SlidersHorizontal },
        { name: 'ETA Intelligence', path: '/eta', icon: Clock }
      ]
    },
    {
      label: 'ANALYTICS',
      items: [
        { name: 'Analytics', path: '/analytics', icon: BarChart3 },
        { name: 'Reports', path: '/reports', icon: FileSpreadsheet }
      ]
    },
    {
      label: 'ADMINISTRATION',
      items: [
        { name: 'Users & Roles', path: '/admin/users', icon: Users },
        { name: 'Master Data', path: '/admin/master-data', icon: Database },
        { name: 'System Settings', path: '/admin/settings', icon: Settings }
      ]
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-[#F5F8FC] overflow-hidden">
      {/* LEFT SIDEBAR (Desktop) */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#063B68] text-white flex-shrink-0 z-30 shadow-xl border-r border-[#0867B2]/40">
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-[#0867B2]/40 bg-[#042848]">
          <NavLink to="/dashboard" className="flex items-center gap-2.5">
            <Logo size="sm" showText={false} />
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-base tracking-wider text-white">
                I-STELX
              </span>
              <span className="text-[8px] uppercase tracking-widest text-[#FF7A00] font-bold">
                Predict • Optimize • Track
              </span>
            </div>
          </NavLink>
        </div>

        {/* Navigation Items List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {navGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              <span className="px-2.5 text-[10px] font-extrabold tracking-widest uppercase text-[#94A3B8]/70">
                {group.label}
              </span>
              <div className="mt-1 space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                        isActive
                          ? 'bg-[#0867B2] text-white shadow-xs font-bold'
                          : 'text-[#E2E8F0] hover:bg-[#0867B2]/40 hover:text-white'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#FF7A00]' : 'text-[#94A3B8]'}`} />
                      <span>{item.name}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* User Card & Role Switcher */}
        <div className="p-3 bg-[#042848] border-t border-[#0867B2]/40 flex flex-col gap-2">
          <div
            onClick={() => setRoleModalOpen(true)}
            className="flex items-center justify-between p-2 rounded-lg bg-[#063B68] hover:bg-[#0867B2]/60 cursor-pointer transition-colors border border-[#0867B2]/40 group"
            title="Click to change RBAC demo role"
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-[#FF7A00] flex items-center justify-center font-bold text-white text-xs flex-shrink-0">
                {user?.full_name?.charAt(0) || 'U'}
              </div>
              <div className="flex flex-col truncate">
                <span className="text-xs font-bold text-white truncate">{user?.full_name || 'User'}</span>
                <span className="text-[10px] text-[#FF7A00] font-semibold flex items-center gap-1">
                  <Shield className="w-2.5 h-2.5" />
                  {user?.role || 'Viewer'}
                </span>
              </div>
            </div>
            <Zap className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#FF7A00] transition-colors" />
          </div>

          <div className="flex items-center justify-between px-1">
            <button
              onClick={() => setRoleModalOpen(true)}
              className="text-[11px] text-[#94A3B8] hover:text-white font-medium cursor-pointer"
            >
              Switch Role
            </button>
            <button
              onClick={handleLogout}
              className="text-[11px] text-[#D92D20] hover:text-red-400 font-medium flex items-center gap-1 cursor-pointer"
            >
              <LogOut className="w-3 h-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE SIDEBAR DRAWER */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-black/60 backdrop-blur-xs">
          <div className="w-72 bg-[#063B68] text-white flex flex-col h-full shadow-2xl">
            <div className="p-4 flex items-center justify-between border-b border-[#0867B2]">
              <Logo size="sm" />
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1 rounded text-white hover:bg-[#0867B2]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {navGroups.map((group, idx) => (
                <div key={idx} className="space-y-1">
                  <span className="text-[10px] font-bold text-[#94A3B8] uppercase">{group.label}</span>
                  <div className="space-y-1 mt-1">
                    {group.items.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileSidebarOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-md text-xs font-semibold text-white hover:bg-[#0867B2]"
                      >
                        <item.icon className="w-4 h-4 text-[#FF7A00]" />
                        <span>{item.name}</span>
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
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* TOP BAR */}
        <header className="h-16 bg-white border-b border-[#CBD5E1] px-4 lg:px-6 flex items-center justify-between z-20 shadow-2xs">
          {/* Left: Mobile Menu & Search */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-[#063B68] hover:bg-[#F1F5F9] cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Global Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[#F1F5F9] hover:bg-[#E2E8F0] border border-[#CBD5E1] text-xs text-[#64748B] font-medium transition-colors cursor-pointer w-48 sm:w-64"
            >
              <Search className="w-4 h-4 text-[#0867B2]" />
              <span className="truncate">Search Shipments, Vessels...</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 bg-white border border-[#CBD5E1] rounded text-[10px] font-mono text-[#64748B] ml-auto">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right: Operational Status, Live Clock, Notifications, Role Tag */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Live AIS Status Chip */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6F4EA] border border-[#C4E7D0] text-[#00843D] text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-[#00843D] animate-ping" />
              <span>AIS Control Stream Live</span>
            </div>

            {/* UTC Clock */}
            <div className="hidden xl:flex items-center gap-1.5 text-xs font-mono text-[#475569] bg-[#F8FAFC] px-2.5 py-1 rounded border border-[#E2E8F0]">
              <Clock className="w-3.5 h-3.5 text-[#0867B2]" />
              <span>{currentTime || 'Synchronizing UTC...'}</span>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-lg text-[#063B68] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#D92D20] border-2 border-white" />
              </button>
              <NotificationDropdown
                isOpen={notificationsOpen}
                onClose={() => setNotificationsOpen(false)}
              />
            </div>

            {/* User Profile Pill */}
            <div
              onClick={() => setRoleModalOpen(true)}
              className="flex items-center gap-2 pl-2 border-l border-[#E2E8F0] cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-[#063B68] text-white flex items-center justify-center font-bold text-xs">
                {user?.full_name?.charAt(0) || 'U'}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-[#102A43] leading-tight">
                  {user?.full_name?.split(' ')[0]}
                </span>
                <span className="text-[10px] font-semibold text-[#0867B2]">
                  {user?.role}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* BODY OUTLET */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#F5F8FC]">
          <Outlet />
        </main>
      </div>

      {/* MODALS */}
      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <RoleSwitcherModal isOpen={roleModalOpen} onClose={() => setRoleModalOpen(false)} />
    </div>
  );
};
