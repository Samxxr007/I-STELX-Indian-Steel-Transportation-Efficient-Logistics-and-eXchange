import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../../components/brand/Logo';
import { Shield, Lock, Mail, ArrowRight, CheckCircle2, AlertCircle, Info } from 'lucide-react';

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
    <div className="min-h-screen bg-[#F5F8FC] flex items-center justify-center p-4 sm:p-6 lg:p-12">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-[#CBD5E1] overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* LEFT COLUMN: Official Branding & Maritime Graphic */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#042848] via-[#063B68] to-[#0867B2] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle background radar */}
          <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full border border-white/10 pointer-events-none" />
          <div className="absolute -bottom-8 -right-8 w-48 h-48 rounded-full border border-[#FF7A00]/20 pointer-events-none" />

          <div>
            <Logo size="lg" showText={false} animated={true} />
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-white mt-6 tracking-tight">
              I-STELX
            </h2>
            <p className="text-xs uppercase tracking-widest text-[#FF7A00] font-bold mt-1">
              Maritime Intelligence Command
            </p>
            <p className="text-xs text-[#E2E8F0] mt-4 leading-relaxed">
              Predict freight indices, optimize dry bulk charter fixtures, track vessel voyages, and eliminate demurrage risks.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 space-y-2 text-xs text-[#CBD5E1]">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#00843D]" />
              <span>Enterprise Grade RBAC & Audit Trails</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#FF7A00]" />
              <span>Realtime AIS Telemetry Stream</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Secure Login Form */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-heading font-extrabold text-2xl text-[#063B68]">
                  Secure Sign In
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Enter your official enterprise credentials to access the platform.
                </p>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#EBF4FC] text-[#0867B2] px-2.5 py-1 rounded-full border border-[#CBD5E1]">
                Authorized Access
              </span>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-[#FEECEB] border border-[#FCCECE] flex items-center gap-2 text-xs font-semibold text-[#D92D20]">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                  Official Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@sail.in or admin@istelx.in"
                    className="w-full pl-9 pr-3 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-sm text-[#102A43] focus:outline-hidden focus:border-[#0867B2] focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-sm text-[#102A43] focus:outline-hidden focus:border-[#0867B2] focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-[#475569] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-[#0867B2] focus:ring-0"
                  />
                  <span>Remember my session</span>
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
                className="w-full py-3 bg-[#063B68] hover:bg-[#0867B2] text-white font-bold text-sm rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In to Command Center'}</span>
                <ArrowRight className="w-4 h-4 text-[#FF7A00]" />
              </button>
            </form>

            {/* Quick Demo Credentials Switcher */}
            <div className="mt-6 pt-4 border-t border-[#E2E8F0]">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#64748B] mb-2 uppercase tracking-wider">
                <Info className="w-3.5 h-3.5 text-[#0867B2]" />
                <span>Quick Demo Accounts:</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => handleQuickDemoSelect('charter.manager@sail.in', 'Charter@12345')}
                  className="px-2 py-1 bg-[#F1F5F9] hover:bg-[#EBF4FC] text-[#063B68] font-semibold rounded border border-[#E2E8F0] text-left truncate cursor-pointer"
                >
                  Charter Manager
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoSelect('admin@istelx.in', 'Admin@12345')}
                  className="px-2 py-1 bg-[#F1F5F9] hover:bg-[#EBF4FC] text-[#063B68] font-semibold rounded border border-[#E2E8F0] text-left truncate cursor-pointer"
                >
                  Admin Governance
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoSelect('logistics.manager@sail.in', 'Logistics@12345')}
                  className="px-2 py-1 bg-[#F1F5F9] hover:bg-[#EBF4FC] text-[#063B68] font-semibold rounded border border-[#E2E8F0] text-left truncate cursor-pointer"
                >
                  Logistics Lead
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#E2E8F0] text-center text-xs text-[#64748B]">
            Need official platform credentials?{' '}
            <NavLink to="/register" className="font-bold text-[#0867B2] hover:underline">
              Create Account
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};
