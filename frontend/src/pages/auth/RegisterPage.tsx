import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { Logo } from '../../components/brand/Logo';
import { api } from '../../services/api';
import {
  User,
  Mail,
  Phone,
  Building,
  Briefcase,
  Shield,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    organization: 'Steel Authority of India Limited (SAIL)',
    department: 'Raw Materials Logistics',
    designation: 'Senior Charter Specialist',
    role: 'Charter Manager',
    password: '',
    confirmPassword: '',
    agreeTerms: true
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validatePassword = (pass: string) => {
    return (
      pass.length >= 8 &&
      /[A-Z]/.test(pass) &&
      /[a-z]/.test(pass) &&
      /[0-9]/.test(pass) &&
      /[^A-Za-z0-9]/.test(pass)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.agreeTerms) {
      setError('You must agree to the Terms of Service and Maritime Data Governance Policy.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!validatePassword(form.password)) {
      setError('Password must contain at least 8 characters, including uppercase, lowercase, a number, and a special character.');
      return;
    }

    setLoading(true);
    try {
      await api.register({
        full_name: form.fullName,
        email: form.email,
        phone: form.phone,
        organization: form.organization,
        department: form.department,
        designation: form.designation,
        role: form.role,
        password: form.password
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please verify your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F8FC] flex items-center justify-center p-4 sm:p-6 lg:p-12 font-sans">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-[#CBD5E1] overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* LEFT COLUMN: Official Branding & Context */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#042848] via-[#063B68] to-[#0867B2] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-6">
            <Logo size="lg" showText={false} animated={true} />
            <div>
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
                Join I-STELX
              </h2>
              <p className="text-xs uppercase tracking-widest text-[#FF7A00] font-bold mt-1">
                Intelligent Steel Maritime Logistics Platform
              </p>
            </div>

            <p className="text-xs text-[#E2E8F0] leading-relaxed">
              Connect to India's dedicated raw material dry bulk logistics command center. Access ML freight predictions, vessel compatibility engines, and live tracking.
            </p>

            <div className="space-y-3 pt-4 border-t border-white/15 text-xs text-[#CBD5E1]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00843D]" />
                <span>Steel sector bulk raw materials optimization</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00843D]" />
                <span>Explainable AI Charter Advisor decision support</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00843D]" />
                <span>Automated port draft and berth compatibility validation</span>
              </div>
            </div>
          </div>

          <div className="pt-8 text-[11px] text-[#94A3B8]">
            Note: Self-registration for ADMIN role is disabled. System governance privileges require approval from CTO & Authority administrators.
          </div>
        </div>

        {/* RIGHT COLUMN: Registration Form */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between">
          {success ? (
            <div className="my-auto py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#E6F4EA] text-[#00843D] flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-heading font-extrabold text-2xl text-[#063B68]">
                Account Created Successfully
              </h3>
              <p className="text-xs text-[#475569] max-w-md mx-auto leading-relaxed">
                Your enterprise account has been registered and initialized. You can now sign in to access the command center.
              </p>
              <div className="pt-4">
                <button
                  onClick={() => navigate('/login')}
                  className="px-6 py-3 bg-[#063B68] hover:bg-[#0867B2] text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-md inline-flex items-center gap-2"
                >
                  <span>Proceed to Sign In</span>
                  <ArrowRight className="w-4 h-4 text-[#FF7A00]" />
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <h3 className="font-heading font-extrabold text-2xl text-[#063B68]">
                  Create Official Account
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Enter your official organization details for identity verification.
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-[#FEECEB] border border-[#FCCECE] flex items-center gap-2 text-xs font-semibold text-[#D92D20]">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#475569] mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={form.fullName}
                        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                        placeholder="e.g. Ramesh Chandra"
                        className="w-full pl-8 pr-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-xs text-[#102A43] focus:border-[#0867B2] focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#475569] mb-1">
                      Official Email *
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="name@sail.in"
                        className="w-full pl-8 pr-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-xs text-[#102A43] focus:border-[#0867B2] focus:bg-white transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#475569] mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-3" />
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+91 98XXX XXXXX"
                        className="w-full pl-8 pr-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-xs text-[#102A43] focus:border-[#0867B2] focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#475569] mb-1">
                      Organization *
                    </label>
                    <div className="relative">
                      <Building className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={form.organization}
                        onChange={(e) => setForm({ ...form, organization: e.target.value })}
                        className="w-full pl-8 pr-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-xs text-[#102A43] focus:border-[#0867B2] focus:bg-white transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#475569] mb-1">
                      Department
                    </label>
                    <input
                      type="text"
                      required
                      value={form.department}
                      onChange={(e) => setForm({ ...form, department: e.target.value })}
                      className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-xs text-[#102A43] focus:border-[#0867B2] focus:bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#475569] mb-1">
                      Designation
                    </label>
                    <input
                      type="text"
                      required
                      value={form.designation}
                      onChange={(e) => setForm({ ...form, designation: e.target.value })}
                      className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-xs text-[#102A43] focus:border-[#0867B2] focus:bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#475569] mb-1">
                      Requested Role *
                    </label>
                    <select
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                      className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-xs font-semibold text-[#063B68] focus:border-[#0867B2] focus:bg-white transition-colors"
                    >
                      <option value="Charter Manager">Charter Manager</option>
                      <option value="Logistics Manager">Logistics Manager</option>
                      <option value="Operations Manager">Operations Manager</option>
                      <option value="Management Viewer">Management Viewer</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#475569] mb-1">
                      Password *
                    </label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-3" />
                      <input
                        type="password"
                        required
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        placeholder="••••••••"
                        className="w-full pl-8 pr-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-xs text-[#102A43] focus:border-[#0867B2] focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#475569] mb-1">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-3" />
                      <input
                        type="password"
                        required
                        value={form.confirmPassword}
                        onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                        placeholder="••••••••"
                        className="w-full pl-8 pr-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-xs text-[#102A43] focus:border-[#0867B2] focus:bg-white transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-[#64748B] bg-[#F8FAFC] p-2 rounded border border-[#E2E8F0]">
                  Requirements: Min 8 chars, uppercase, lowercase, number, and special character.
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={form.agreeTerms}
                    onChange={(e) => setForm({ ...form, agreeTerms: e.target.checked })}
                    className="rounded text-[#0867B2] focus:ring-0"
                  />
                  <label htmlFor="terms" className="text-xs text-[#475569] cursor-pointer">
                    I agree to the <span className="text-[#0867B2] font-semibold">Terms of Service</span> and{' '}
                    <span className="text-[#0867B2] font-semibold">Maritime Security & Privacy Policy</span>.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#063B68] hover:bg-[#0867B2] text-white font-bold text-xs rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <span>{loading ? 'Creating Account...' : 'CREATE ENTERPRISE ACCOUNT'}</span>
                  <ArrowRight className="w-4 h-4 text-[#FF7A00]" />
                </button>
              </form>

              <div className="mt-4 pt-3 border-t border-[#E2E8F0] text-center text-xs text-[#64748B]">
                Already registered?{' '}
                <NavLink to="/login" className="font-bold text-[#0867B2] hover:underline">
                  Sign In
                </NavLink>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
