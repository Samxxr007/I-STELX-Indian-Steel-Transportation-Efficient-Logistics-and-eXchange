import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../../components/brand/Logo';
import { Shield, Lock, Mail, ArrowRight, CheckCircle2, AlertCircle, Info, Key, Radio } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('charter.manager@sail.in');
  const [password, setPassword] = useState('Charter@12345');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoSelect = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#02172D] via-[#042442] to-[#063B68] flex items-center justify-center p-4 sm:p-6 lg:p-12 relative overflow-hidden maritime-grid-dark">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0867B2]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-4xl bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10">
        {/* LEFT COLUMN: Official Branding & Maritime Telemetry Graphic */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#02172D] via-[#063B68] to-[#0867B2] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle background radar */}
          <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full border border-white/10 pointer-events-none animate-spin" style={{ animationDuration: '40s' }} />
          <div className="absolute -bottom-8 -right-8 w-48 h-48 rounded-full border border-[#FF7A00]/20 pointer-events-none" />

          <div>
            <div className="p-2 rounded-2xl bg-white/10 border border-white/15 inline-block mb-6 shadow-sm">
              <Logo size="lg" showText={false} animated={true} />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-3xl text-white tracking-wider">
                  I-STELX
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#FF7A00]/25 text-[#FF7A00] font-mono text-[10px] font-bold border border-[#FF7A00]/40">
                  NATIONAL PORTAL
                </span>
              </div>
              <p className="text-[11px] uppercase tracking-widest text-sky-300 font-bold">
                Maritime Logistics Command
              </p>
            </div>

            <p className="text-xs text-slate-300 mt-4 leading-relaxed font-normal">
              Unified vessel chartering decision support, ML freight forecasting, draft compatibility verification, and real-time AIS voyage intelligence for the Indian steel sector.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 space-y-2.5 text-xs text-slate-200">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Multi-Role RBAC & Audit Trails</span>
            </div>
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-[#FF7A00]" />
              <span>Live Satellite AIS Telemetry Active</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Secure Login Form */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between bg-white">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-heading font-extrabold text-2xl text-[#063B68]">
                  Authorized Access
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enter your enterprise credentials to access the command tower.
                </p>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-50 text-[#0867B2] px-3 py-1 rounded-full border border-sky-200">
                Secure Session
              </span>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs font-semibold text-rose-700 animate-in fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Official Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="charter.manager@sail.in or admin@istelx.in"
                    className="w-full pl-10 pr-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-hidden focus:border-[#0867B2] focus:bg-white focus:ring-2 focus:ring-[#0867B2]/15 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-hidden focus:border-[#0867B2] focus:bg-white focus:ring-2 focus:ring-[#0867B2]/15 transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-[#0867B2] focus:ring-0 cursor-pointer"
                  />
                  <span>Keep session active</span>
                </label>
                <NavLink
                  to="/forgot-password"
                  className="text-[#0867B2] font-semibold hover:underline"
                >
                  Forgot Password?
                </NavLink>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-[#063B68] to-[#0867B2] hover:from-[#0867B2] hover:to-[#063B68] text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-[#063B68]/20 hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>{loading ? 'Authenticating Credentials...' : 'Sign In to Command Center'}</span>
                <ArrowRight className="w-4 h-4 text-[#FF7A00]" />
              </button>
            </form>

            {/* Quick Demo Credentials Switcher */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-2.5 uppercase tracking-wider">
                <div className="flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-[#0867B2]" />
                  <span>One-Click Demo Credentials:</span>
                </div>
                <span className="text-[10px] text-slate-400 font-normal">Pre-filled role data</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => handleQuickDemoSelect('charter.manager@sail.in', 'Charter@12345')}
                  className="p-2 bg-slate-50 hover:bg-sky-50 text-[#063B68] hover:text-[#0867B2] font-semibold rounded-lg border border-slate-200 hover:border-sky-300 text-center transition-all cursor-pointer shadow-2xs"
                >
                  Charter Lead
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoSelect('admin@istelx.in', 'Admin@12345')}
                  className="p-2 bg-slate-50 hover:bg-sky-50 text-[#063B68] hover:text-[#0867B2] font-semibold rounded-lg border border-slate-200 hover:border-sky-300 text-center transition-all cursor-pointer shadow-2xs"
                >
                  Admin Hub
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoSelect('logistics.manager@sail.in', 'Logistics@12345')}
                  className="p-2 bg-slate-50 hover:bg-sky-50 text-[#063B68] hover:text-[#0867B2] font-semibold rounded-lg border border-slate-200 hover:border-sky-300 text-center transition-all cursor-pointer shadow-2xs"
                >
                  Logistics Mgr
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            Need enterprise access credentials?{' '}
            <NavLink to="/register" className="font-bold text-[#0867B2] hover:underline">
              Submit Requisition
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};
