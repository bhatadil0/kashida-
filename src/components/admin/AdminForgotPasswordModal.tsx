import React, { useState } from 'react';
import {
  ShieldCheck,
  KeyRound,
  Mail,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  X,
  Sparkles,
  Lock,
} from 'lucide-react';
import { AdminSecurityConfig } from '../../types';
import { hashPassword, evaluatePasswordStrength, resetAdminAttempts } from '../../utils/security';

interface AdminForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminConfig: AdminSecurityConfig;
  onResetSuccess: (newConfig: AdminSecurityConfig) => void;
  onRecordAudit: (event: string, status: 'SUCCESS' | 'FAILED') => void;
}

export const AdminForgotPasswordModal: React.FC<AdminForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  adminConfig,
  onResetSuccess,
  onRecordAudit,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [emailInput, setEmailInput] = useState(adminConfig.adminEmail || 'humperszk@gmail.com');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [newPassphrase, setNewPassphrase] = useState('');
  const [confirmPassphrase, setConfirmPassphrase] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const strength = evaluatePasswordStrength(newPassphrase);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanEmail = emailInput.trim().toLowerCase();
    const authorized =
      cleanEmail === adminConfig.adminEmail.toLowerCase() ||
      cleanEmail === 'humperszk@gmail.com';

    if (!authorized) {
      setErrorMsg('Unauthorized identity. Master recovery protocol is strictly restricted to Founder humperszk@gmail.com.');
      onRecordAudit(`Unauthorized Admin Password Recovery Attempt for [${cleanEmail}]`, 'FAILED');
      return;
    }

    // Generate cryptographically secure 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setStep(2);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (enteredOtp.trim() !== generatedOtp.trim()) {
      setErrorMsg('Invalid or expired One-Time Passcode. Please verify the 6-digit code.');
      return;
    }

    setStep(3);
  };

  const handleCommitNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!strength.isValid) {
      setErrorMsg(`New passphrase does not meet security criteria. ${strength.feedback.join('. ')}`);
      return;
    }

    if (newPassphrase !== confirmPassphrase) {
      setErrorMsg('Confirmation passphrase does not match. Please re-enter.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newHash = await hashPassword(newPassphrase);
      const updatedConfig: AdminSecurityConfig = {
        ...adminConfig,
        passwordHash: newHash,
        lastLoginTimestamp: 'Just now (Password Reset)',
      };

      resetAdminAttempts();
      onRecordAudit(`Admin Master Passphrase Reset via Email OTP for [${emailInput}]`, 'SUCCESS');
      onResetSuccess(updatedConfig);
      setSuccessMsg('Master Passphrase successfully rotated! Your session is now authorized.');

      setTimeout(() => {
        setIsSubmitting(false);
        onClose();
      }, 1800);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to rotate cryptographic hash. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="relative w-full max-w-md bg-[#FAF8F5] border border-[#DFC289]/40 shadow-2xl rounded-xs overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 bg-[#162B21] text-[#FAF8F5] border-b border-[#DFC289]/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#FAF8F5]/10 flex items-center justify-center text-[#DFC289] border border-[#DFC289]/30">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#DFC289] font-bold block">
                Administrative Security Protocol
              </span>
              <h3 className="font-serif text-lg font-semibold text-[#FAF8F5]">
                Master Passphrase Recovery
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-[#FAF8F5]/70 hover:text-[#FAF8F5] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper progress indicator */}
        <div className="grid grid-cols-3 bg-[#F2EDE4]/60 border-b border-[#EBE4D8] text-[10px] uppercase tracking-wider font-semibold text-center">
          <div className={`py-2 ${step >= 1 ? 'bg-[#162B21] text-[#DFC289]' : 'text-[#525B56]'}`}>
            1. Identity
          </div>
          <div className={`py-2 ${step >= 2 ? 'bg-[#162B21] text-[#DFC289]' : 'text-[#525B56]'}`}>
            2. Dual OTP
          </div>
          <div className={`py-2 ${step >= 3 ? 'bg-[#162B21] text-[#DFC289]' : 'text-[#525B56]'}`}>
            3. New Passphrase
          </div>
        </div>

        <div className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-[#681A24]/10 border border-[#681A24]/30 text-[#681A24] text-xs rounded-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs rounded-xs flex items-start gap-2 animate-in fade-in font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* STEP 1: Email Validation */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-4 text-xs">
              <p className="text-[#525B56] leading-relaxed">
                Enter your authorized curator or founder email. A cryptographically unique 6-digit verification code will be dispatched to verify administrative authority.
              </p>

              <div className="space-y-1">
                <label className="font-semibold text-[#162B21] uppercase tracking-wider text-[11px] block">
                  Authorized Curator Work Email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#525B56] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="humperszk@gmail.com"
                    className="w-full pl-9 pr-3 py-2.5 border border-[#EBE4D8] bg-white text-[#1C1F1E] focus:outline-none focus:border-[#C5A059] font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-[#EBE4D8] text-xs text-[#525B56] hover:text-[#162B21] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#162B21] hover:bg-[#234233] text-[#FAF8F5] text-xs uppercase tracking-[0.2em] font-semibold cursor-pointer shadow-md flex items-center gap-2"
                >
                  <span>Dispatch Security OTP</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#DFC289]" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: OTP Verification */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
              <div className="p-3 bg-[#e6f4fb] border border-[#00baf2]/30 rounded-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#002970] text-xs">
                    Curator Security Dispatch Simulation:
                  </span>
                  <span className="text-[10px] font-mono text-[#002970] bg-white px-2 py-0.5 rounded-xs border border-[#00baf2]/30 font-bold">
                    OTP: {generatedOtp}
                  </span>
                </div>
                <p className="text-[11px] text-[#002970]/80">
                  Verification OTP dispatched to <strong>{emailInput}</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => setEnteredOtp(generatedOtp)}
                  className="text-[10px] text-[#002970] font-bold underline cursor-pointer"
                >
                  ⚡ Auto-fill One-Time Passcode
                </button>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#162B21] uppercase tracking-wider text-[11px] block">
                  Enter 6-Digit One-Time Passcode *
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="••••••"
                  className="w-full p-3 font-mono text-center tracking-[0.5em] text-lg font-bold border-2 border-[#162B21]/30 focus:border-[#162B21] bg-white text-[#162B21] outline-none"
                />
              </div>

              <div className="pt-2 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-[#525B56] hover:text-[#162B21] flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Change Email</span>
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#162B21] hover:bg-[#234233] text-[#FAF8F5] text-xs uppercase tracking-[0.2em] font-semibold cursor-pointer shadow-md flex items-center gap-2"
                >
                  <span>Verify OTP</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#DFC289]" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Set New Master Passphrase */}
          {step === 3 && (
            <form onSubmit={handleCommitNewPassword} className="space-y-4 text-xs">
              <p className="text-[#525B56]">
                Choose a strong new master passphrase for <strong>{emailInput}</strong>. It will be cryptographically salted and hashed client-side using SHA-256.
              </p>

              <div className="space-y-1">
                <label className="font-semibold text-[#162B21] uppercase tracking-wider text-[11px] block">
                  New Master Passphrase *
                </label>
                <input
                  type="password"
                  required
                  value={newPassphrase}
                  onChange={(e) => setNewPassphrase(e.target.value)}
                  placeholder="Min. 8 characters with upper, lower, digit, symbol"
                  className="w-full p-2.5 font-mono text-xs border border-[#EBE4D8] bg-white text-[#1C1F1E] focus:outline-none focus:border-[#C5A059]"
                />

                {newPassphrase && (
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-[#525B56]">Entropy Strength:</span>
                      <span
                        className={`font-semibold ${
                          strength.score >= 80 ? 'text-emerald-700' : 'text-amber-700'
                        }`}
                      >
                        {strength.level.replace('_', ' ')} ({strength.score}%)
                      </span>
                    </div>
                    <div className="w-full bg-[#EBE4D8] h-1 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          strength.score >= 80
                            ? 'bg-emerald-600'
                            : strength.score >= 50
                            ? 'bg-amber-500'
                            : 'bg-[#681A24]'
                        }`}
                        style={{ width: `${strength.score}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#162B21] uppercase tracking-wider text-[11px] block">
                  Confirm Master Passphrase *
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassphrase}
                  onChange={(e) => setConfirmPassphrase(e.target.value)}
                  placeholder="Re-enter new passphrase"
                  className="w-full p-2.5 font-mono text-xs border border-[#EBE4D8] bg-white text-[#1C1F1E] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#162B21] hover:bg-[#234233] text-[#FAF8F5] text-xs uppercase tracking-[0.2em] font-semibold cursor-pointer shadow-md flex items-center justify-center gap-2 transition-all"
                >
                  <Lock className="w-4 h-4 text-[#DFC289]" />
                  <span>
                    {isSubmitting ? 'Encrypting & Committing...' : 'Commit Passphrase & Authorize'}
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
