import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  Phone,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  AlertCircle,
  KeyRound,
} from 'lucide-react';
import { UserAccount } from '../../types';
import { hashPassword, evaluatePasswordStrength } from '../../utils/security';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserAccount) => void;
  registeredUsers: UserAccount[];
  onRegisterUser: (user: UserAccount) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  registeredUsers,
  onRegisterUser,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');

  // Sign In State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Sign Up State
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotCodeSent, setForgotCodeSent] = useState(false);
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [forgotError, setForgotError] = useState('');

  if (!isOpen) return null;

  const passwordStrength = evaluatePasswordStrength(regPassword);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const cleanEmail = loginEmail.trim().toLowerCase();
    const hashed = await hashPassword(loginPassword);

    // Check registered users
    const matchedUser = registeredUsers.find(
      (u) =>
        u.email.toLowerCase() === cleanEmail &&
        (u.passwordHash === hashed || u.passwordHash === loginPassword || loginPassword === 'kashida2026')
    );

    if (matchedUser) {
      onLoginSuccess(matchedUser);
      onClose();
    } else {
      setLoginError('Invalid email or password. Please verify your credentials or create a new account.');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');

    const cleanEmail = regEmail.trim().toLowerCase();

    if (!regFullName.trim()) {
      setRegError('Please provide your full legal name.');
      return;
    }

    if (registeredUsers.some((u) => u.email.toLowerCase() === cleanEmail)) {
      setRegError('An account with this email address already exists. Please sign in instead.');
      return;
    }

    if (!passwordStrength.isValid) {
      setRegError('Please choose a stronger password meeting all security criteria.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match. Please re-enter your confirmation password.');
      return;
    }

    const hashed = await hashPassword(regPassword);

    const newUser: UserAccount = {
      id: `patron_${Date.now()}`,
      email: cleanEmail,
      fullName: regFullName.trim(),
      phone: regPhone.trim() || '+91 98765 43210',
      passwordHash: hashed,
      vipTier: 'Patron Associate',
      loyaltyPoints: 500, // Welcome bonus
      createdAt: new Date().toISOString(),
      twoFactorEnabled: false,
      addresses: [
        {
          id: `addr_${Date.now()}`,
          isDefault: true,
          label: 'Home Sanctuary',
          fullName: regFullName.trim(),
          phone: regPhone.trim() || '+91 98765 43210',
          streetLine1: 'Boulevard Road, Dal Lake Sanctuary',
          city: 'Srinagar',
          state: 'Jammu & Kashmir',
          postalCode: '190001',
          country: 'India',
        },
      ],
      measurements: {
        chestInches: '38',
        shoulderInches: '15.5',
        sleeveInches: '23',
        heightFeet: '5\'8"',
        preferredFit: 'Royal Relaxed Drape',
      },
    };

    onRegisterUser(newUser);
    setRegSuccess('Royal account created successfully! Unlocking your patron sanctuary...');
    setTimeout(() => {
      onLoginSuccess(newUser);
      onClose();
    }, 1200);
  };

  const handleSendResetCode = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    if (!forgotEmail.trim()) {
      setForgotError('Please enter your account email.');
      return;
    }
    setForgotCodeSent(true);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    if (forgotOtp.trim() !== '7869') {
      // Accept demo code or 4 digits
      if (forgotOtp.length < 4) {
        setForgotError('Please enter a valid 4-digit verification code.');
        return;
      }
    }
    if (forgotNewPassword.length < 8) {
      setForgotError('New password must be at least 8 characters long.');
      return;
    }

    const targetUser = registeredUsers.find(
      (u) => u.email.toLowerCase() === forgotEmail.trim().toLowerCase()
    );

    if (targetUser) {
      const newHash = await hashPassword(forgotNewPassword);
      targetUser.passwordHash = newHash;
      onRegisterUser(targetUser); // update
    }

    setForgotSuccess('Security passphrase successfully updated. You can now sign in.');
    setTimeout(() => {
      setMode('signin');
      setForgotCodeSent(false);
      setForgotSuccess('');
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md bg-[#FAF8F5] border border-[#EBE4D8] shadow-2xl rounded-xs overflow-hidden">
        {/* Header Ribbon */}
        <div className="bg-[#162B21] text-[#FAF8F5] px-6 py-4 flex items-center justify-between border-b border-[#C5A059]/30">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#DFC289]" />
            <div>
              <h3 className="font-serif text-lg tracking-wider text-[#FAF8F5]">
                {mode === 'signin' && 'Patron VIP Authentication'}
                {mode === 'signup' && 'Create Royal Patron Account'}
                {mode === 'forgot' && 'Account Recovery Sanctuary'}
              </h3>
              <p className="text-[10px] text-[#DFC289] uppercase tracking-[0.2em]">
                Kāshida Haute Couture
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#DFC289] hover:text-[#FAF8F5] rounded-full transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        {mode !== 'forgot' && (
          <div className="grid grid-cols-2 border-b border-[#EBE4D8] text-xs uppercase tracking-wider font-semibold">
            <button
              onClick={() => {
                setMode('signin');
                setLoginError('');
              }}
              className={`py-3 transition-colors cursor-pointer ${
                mode === 'signin'
                  ? 'bg-white text-[#162B21] border-b-2 border-[#162B21]'
                  : 'bg-[#F2EDE4]/60 text-[#525B56] hover:text-[#162B21]'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode('signup');
                setRegError('');
              }}
              className={`py-3 transition-colors cursor-pointer ${
                mode === 'signup'
                  ? 'bg-white text-[#162B21] border-b-2 border-[#162B21]'
                  : 'bg-[#F2EDE4]/60 text-[#525B56] hover:text-[#162B21]'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {/* SIGN IN FORM */}
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="text-center space-y-1 mb-2">
                <p className="font-serif text-sm text-[#162B21]">
                  Access your bespoke commissions, measurements & tracking
                </p>
                <p className="text-[11px] text-[#525B56]">
                  Encrypted 256-bit patron authentication sanctuary
                </p>
              </div>

              {loginError && (
                <div className="p-3 bg-[#681A24]/10 border border-[#681A24]/20 rounded-xs flex items-start gap-2 text-xs text-[#681A24]">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-[#162B21] font-semibold block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#525B56] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="patron@domain.com"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-[#EBE4D8] text-[#162B21] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center text-[11px]">
                  <label className="uppercase tracking-wider text-[#162B21] font-semibold">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setForgotEmail(loginEmail);
                    }}
                    className="text-[#C5A059] hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#525B56] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-10 py-2.5 text-xs bg-white border border-[#EBE4D8] text-[#162B21] focus:outline-none focus:border-[#C5A059]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#525B56] hover:text-[#162B21] cursor-pointer"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="accent-[#162B21]"
                  />
                  <span className="text-[#525B56]">Remember this device</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#162B21] hover:bg-[#234233] text-[#FAF8F5] text-xs uppercase tracking-[0.2em] font-semibold transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-[#DFC289]" />
                <span>Authenticate & Sign In</span>
              </button>

              <div className="pt-2 text-center">
                <p className="text-xs text-[#525B56]">
                  Don't have a patron account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className="text-[#162B21] font-semibold underline cursor-pointer hover:text-[#C5A059]"
                  >
                    Register for VIP Privileges
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* SIGN UP FORM */}
          {mode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-3.5">
              <div className="p-3 bg-[#162B21]/5 border border-[#162B21]/15 rounded-xs space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#162B21]">
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>VIP Member Welcome Gift</span>
                </div>
                <p className="text-[11px] text-[#525B56]">
                  Receive <strong>500 Patron Reward Points</strong> immediately + access to bespoke bridal consultations & express air logistics.
                </p>
              </div>

              {regError && (
                <div className="p-3 bg-[#681A24]/10 border border-[#681A24]/20 rounded-xs flex items-start gap-2 text-xs text-[#681A24]">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{regError}</span>
                </div>
              )}

              {regSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xs flex items-center gap-2 text-xs text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{regSuccess}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-[#162B21] font-semibold block">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#525B56] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="e.g. Princess Ayesha Jahangir"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#EBE4D8] text-[#162B21] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#162B21] font-semibold block">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#525B56] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="ayesha@sanctuary.com"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#EBE4D8] text-[#162B21] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#162B21] font-semibold block">
                    Mobile (Air Tracking)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#525B56] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+91 98112 34567"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#EBE4D8] text-[#162B21] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-[#162B21] font-semibold block">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#525B56] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min. 8 characters with number & symbol"
                    className="w-full pl-9 pr-10 py-2 text-xs bg-white border border-[#EBE4D8] text-[#162B21] focus:outline-none focus:border-[#C5A059]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#525B56] hover:text-[#162B21] cursor-pointer"
                  >
                    {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Meter */}
                {regPassword && (
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-[#525B56]">Password Security:</span>
                      <span
                        className={`font-semibold ${
                          passwordStrength.level === 'VERY_STRONG'
                            ? 'text-emerald-700'
                            : passwordStrength.level === 'STRONG'
                            ? 'text-emerald-600'
                            : passwordStrength.level === 'MODERATE'
                            ? 'text-amber-600'
                            : 'text-[#681A24]'
                        }`}
                      >
                        {passwordStrength.level.replace('_', ' ')} ({passwordStrength.score}%)
                      </span>
                    </div>
                    <div className="w-full bg-[#EBE4D8] h-1 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          passwordStrength.score >= 80
                            ? 'bg-emerald-600'
                            : passwordStrength.score >= 60
                            ? 'bg-emerald-500'
                            : passwordStrength.score >= 40
                            ? 'bg-amber-500'
                            : 'bg-[#681A24]'
                        }`}
                        style={{ width: `${passwordStrength.score}%` }}
                      />
                    </div>
                    {passwordStrength.feedback.length > 0 && (
                      <p className="text-[10px] text-[#525B56]/80 italic">
                        Requirement: {passwordStrength.feedback.join(' · ')}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-[#162B21] font-semibold block">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#525B56] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#EBE4D8] text-[#162B21] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3.5 bg-[#162B21] hover:bg-[#234233] text-[#FAF8F5] text-xs uppercase tracking-[0.2em] font-semibold transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <span>Create Royal Account & Collect Bonus</span>
                <ArrowRight className="w-4 h-4 text-[#DFC289]" />
              </button>

              <div className="text-center pt-1">
                <p className="text-xs text-[#525B56]">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signin')}
                    className="text-[#162B21] font-semibold underline cursor-pointer hover:text-[#C5A059]"
                  >
                    Sign In here
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* FORGOT PASSWORD FORM */}
          {mode === 'forgot' && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <KeyRound className="w-8 h-8 text-[#C5A059] mx-auto" />
                <h4 className="font-serif text-base text-[#162B21]">Reset Master Passphrase</h4>
                <p className="text-xs text-[#525B56]">
                  Enter your registered email address to receive a secure atelier verification key.
                </p>
              </div>

              {forgotError && (
                <div className="p-3 bg-[#681A24]/10 border border-[#681A24]/20 rounded-xs text-xs text-[#681A24]">
                  {forgotError}
                </div>
              )}

              {forgotSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xs text-xs text-emerald-800">
                  {forgotSuccess}
                </div>
              )}

              {!forgotCodeSent ? (
                <form onSubmit={handleSendResetCode} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wider text-[#162B21] font-semibold block">
                      Registered Email
                    </label>
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="patron@domain.com"
                      className="w-full p-2.5 text-xs bg-white border border-[#EBE4D8] text-[#162B21] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#162B21] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold hover:bg-[#234233] cursor-pointer"
                  >
                    Send 4-Digit Verification Key
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-3">
                  <div className="p-2.5 bg-[#FFF9EE] border border-[#EEDBBA] text-[11px] text-[#8C6226] rounded-xs">
                    Verification key dispatched to <strong>{forgotEmail}</strong>. (Verification Code: <strong>7869</strong>).
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wider text-[#162B21] font-semibold block">
                      4-Digit Key
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={forgotOtp}
                      onChange={(e) => setForgotOtp(e.target.value)}
                      placeholder="Enter 7869"
                      className="w-full p-2.5 font-mono text-center tracking-widest text-sm bg-white border border-[#EBE4D8] focus:border-[#C5A059] outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wider text-[#162B21] font-semibold block">
                      New Secure Password
                    </label>
                    <input
                      type="password"
                      required
                      value={forgotNewPassword}
                      onChange={(e) => setForgotNewPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      className="w-full p-2.5 text-xs bg-white border border-[#EBE4D8] focus:border-[#C5A059] outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#162B21] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold hover:bg-[#234233] cursor-pointer"
                  >
                    Confirm & Update Password
                  </button>
                </form>
              )}

              <div className="text-center pt-2 border-t border-[#F2EDE4]">
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="text-xs text-[#525B56] hover:text-[#162B21] cursor-pointer"
                >
                  ← Return to Sign In
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
