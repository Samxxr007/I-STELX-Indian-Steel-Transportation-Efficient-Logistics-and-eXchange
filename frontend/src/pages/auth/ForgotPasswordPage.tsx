import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { Logo } from '../../components/brand/Logo';
import { api } from '../../services/api';
import { Mail, KeyRound, Lock, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Enter Email, 2: Enter OTP, 3: New Password
  const [email, setEmail] = useState('charter.manager@sail.in');
  const [otp, setOtp] = useState('');
  const [demoOtp, setDemoOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.forgotPassword(email);
      setDemoOtp(res.demo_otp || '849201');
      setStep(2);
    } catch (err: any) {
      setError(err.message || 'Failed to request reset OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (otp !== '849201' && otp.length !== 6) {
      setError('Invalid OTP code. Please enter the 6-digit code shown below.');
      return;
    }
    setStep(3);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      await api.resetPassword({ email, otp: otp || '849201', new_password: newPassword });
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Reset failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F8FC] flex items-center justify-center p-4 sm:p-6 lg:p-12 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#CBD5E1] p-8">
        <div className="text-center mb-6">
          <Logo size="md" showText={false} className="justify-center mb-3" />
          <h3 className="font-heading font-extrabold text-2xl text-[#063B68]">
            Reset Password
          </h3>
          <p className="text-xs text-[#64748B] mt-1">
            {step === 1 && 'Enter your official email to receive a security OTP code.'}
            {step === 2 && 'Enter the 6-digit verification code sent to your email.'}
            {step === 3 && 'Choose a strong new password for your account.'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-[#FEECEB] border border-[#FCCECE] flex items-center gap-2 text-xs font-semibold text-[#D92D20]">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                Official Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-sm text-[#102A43] focus:border-[#0867B2] focus:bg-white transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#063B68] hover:bg-[#0867B2] text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-md flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Sending...' : 'Send Security OTP'}</span>
              <ArrowRight className="w-4 h-4 text-[#FF7A00]" />
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="p-3 bg-[#EBF4FC] border border-[#CBD5E1] rounded-lg text-xs text-[#063B68] font-medium">
              Simulation Notice: Demo OTP for {email} is <span className="font-mono font-bold text-[#FF7A00]">{demoOtp || '849201'}</span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                6-Digit OTP Code
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="849201"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-sm font-mono tracking-widest text-[#102A43] focus:border-[#0867B2] focus:bg-white transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#063B68] hover:bg-[#0867B2] text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-md flex items-center justify-center gap-2"
            >
              <span>Verify Code</span>
              <ArrowRight className="w-4 h-4 text-[#FF7A00]" />
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-sm text-[#102A43] focus:border-[#0867B2] focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-sm text-[#102A43] focus:border-[#0867B2] focus:bg-white transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#00843D] hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-md flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{loading ? 'Updating Password...' : 'Save & Sign In'}</span>
            </button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-[#E2E8F0] text-center text-xs text-[#64748B]">
          Remember your password?{' '}
          <NavLink to="/login" className="font-bold text-[#0867B2] hover:underline">
            Sign In
          </NavLink>
        </div>
      </div>
    </div>
  );
};
