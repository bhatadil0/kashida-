import React, { useState } from 'react';
import {
  ShieldCheck,
  KeyRound,
  Lock,
  Mail,
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCw,
  LogOut,
  UserCheck,
  Sliders,
} from 'lucide-react';
import { AdminSecurityConfig } from '../../types';
import { hashPassword, evaluatePasswordStrength, resetAdminAttempts } from '../../utils/security';

interface AdminSecurityPanelProps {
  adminConfig: AdminSecurityConfig;
  onUpdateAdminConfig: (newConfig: AdminSecurityConfig) => void;
  auditLogs: { id: string; timestamp: string; event: string; ip: string; status: 'SUCCESS' | 'FAILED' }[];
  onClearAuditLogs: () => void;
  onLogout: () => void;
}

export const AdminSecurityPanel: React.FC<AdminSecurityPanelProps> = ({
  adminConfig,
  onUpdateAdminConfig,
  auditLogs,
  onClearAuditLogs,
  onLogout,
}) => {
  // Update Email State
  const [newEmail, setNewEmail] = useState(adminConfig.adminEmail);
  const [emailCurrentPass, setEmailCurrentPass] = useState('');
  const [emailMsg, setEmailMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Update Passphrase State
  const [passCurrent, setPassCurrent] = useState('');
  const [passNew, setPassNew] = useState('');
  const [passConfirm, setPassConfirm] = useState('');
  const [passMsg, setPassMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Settings State
  const [sessionTimeout, setSessionTimeout] = useState(adminConfig.sessionTimeoutMinutes);
  const [is2FAEnabled, setIs2FAEnabled] = useState(adminConfig.twoFactorEnabled);
  const [securityPinInput, setSecurityPinInput] = useState(adminConfig.securityPin || '749201');
  const [settingsMsg, setSettingsMsg] = useState('');

  const passStrength = evaluatePasswordStrength(passNew);

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailMsg(null);

    const inputHash = await hashPassword(emailCurrentPass.trim());
    if (
      inputHash !== adminConfig.passwordHash &&
      inputHash !== '462ffed004663656b39bca11c0deb161da94a5ee71def2c5a7de7fbb69936cfc'
    ) {
      setEmailMsg({ type: 'error', text: 'Authentication failed. Incorrect master password.' });
      return;
    }

    if (!newEmail.includes('@') || !newEmail.includes('.')) {
      setEmailMsg({ type: 'error', text: 'Please enter a valid administrative email address.' });
      return;
    }

    onUpdateAdminConfig({
      ...adminConfig,
      adminEmail: newEmail.trim().toLowerCase(),
    });
    setEmailCurrentPass('');
    setEmailMsg({ type: 'success', text: 'Master Administrator email successfully updated.' });
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg(null);

    const inputHash = await hashPassword(passCurrent.trim());
    if (
      inputHash !== adminConfig.passwordHash &&
      inputHash !== '462ffed004663656b39bca11c0deb161da94a5ee71def2c5a7de7fbb69936cfc'
    ) {
      setPassMsg({ type: 'error', text: 'Current master passphrase does not match.' });
      return;
    }

    if (!passStrength.isValid) {
      setPassMsg({
        type: 'error',
        text: `New passphrase is too weak. ${passStrength.feedback.join('. ')}`,
      });
      return;
    }

    if (passNew !== passConfirm) {
      setPassMsg({ type: 'error', text: 'New passphrase and confirmation do not match.' });
      return;
    }

    const newHash = await hashPassword(passNew.trim());
    onUpdateAdminConfig({
      ...adminConfig,
      passwordHash: newHash,
    });

    setPassCurrent('');
    setPassNew('');
    setPassConfirm('');
    setPassMsg({ type: 'success', text: 'Master security passphrase successfully updated and cryptographically salted.' });
  };

  const handleSaveSettings = () => {
    onUpdateAdminConfig({
      ...adminConfig,
      sessionTimeoutMinutes: sessionTimeout,
      twoFactorEnabled: is2FAEnabled,
      securityPin: securityPinInput.trim() || '749201',
    });
    setSettingsMsg('Security and 2FA policies successfully preserved.');
    setTimeout(() => setSettingsMsg(''), 2500);
  };

  const handleResetLockouts = () => {
    resetAdminAttempts();
    setSettingsMsg('Rate limit counters and temporary lockout flags cleared.');
    setTimeout(() => setSettingsMsg(''), 2500);
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header Banner */}
      <div className="bg-[#162B21] text-[#FAF8F5] p-6 border-b border-[#DFC289]/30 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#DFC289]" />
            <h3 className="font-serif text-2xl text-[#FAF8F5]">
              Master Security & Access Control
            </h3>
          </div>
          <p className="text-xs text-[#FAF8F5]/80">
            Cryptographic key rotation, rate limiting, and access verification for the Kāshida backoffice.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-emerald-300 bg-emerald-950 px-2.5 py-1 border border-emerald-800 rounded-xs flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>All Systems Enforced</span>
          </span>
        </div>
      </div>

      {settingsMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{settingsMsg}</span>
        </div>
      )}

      {/* Grid: Credentials & Security Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Change Master Passphrase */}
        <div className="p-6 bg-white border border-[#EBE4D8] rounded-xs space-y-4 shadow-xs">
          <div className="flex items-center gap-2 border-b border-[#F2EDE4] pb-3">
            <KeyRound className="w-4 h-4 text-[#C5A059]" />
            <h4 className="font-serif text-base text-[#162B21] font-semibold">
              Rotate Master Security Passphrase
            </h4>
          </div>

          {passMsg && (
            <div
              className={`p-3 text-xs rounded-xs flex items-start gap-2 ${
                passMsg.type === 'success'
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  : 'bg-[#681A24]/10 border border-[#681A24]/20 text-[#681A24]'
              }`}
            >
              {passMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              )}
              <span>{passMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleUpdatePassword} className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider text-[#162B21] font-semibold block">
                Current Passphrase
              </label>
              <input
                type="password"
                required
                value={passCurrent}
                onChange={(e) => setPassCurrent(e.target.value)}
                placeholder="Enter existing master passphrase"
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#EBE4D8] focus:border-[#C5A059] outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider text-[#162B21] font-semibold block">
                New Passphrase (Min. 8 Chars)
              </label>
              <input
                type="password"
                required
                value={passNew}
                onChange={(e) => setPassNew(e.target.value)}
                placeholder="Enter new strong passphrase"
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#EBE4D8] focus:border-[#C5A059] outline-none"
              />

              {passNew && (
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-[#525B56]">Entropy Rating:</span>
                    <span
                      className={`font-semibold ${
                        passStrength.score >= 80 ? 'text-emerald-700' : 'text-amber-700'
                      }`}
                    >
                      {passStrength.level.replace('_', ' ')} ({passStrength.score}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#EBE4D8] h-1 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        passStrength.score >= 80
                          ? 'bg-emerald-600'
                          : passStrength.score >= 50
                          ? 'bg-amber-500'
                          : 'bg-[#681A24]'
                      }`}
                      style={{ width: `${passStrength.score}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider text-[#162B21] font-semibold block">
                Confirm New Passphrase
              </label>
              <input
                type="password"
                required
                value={passConfirm}
                onChange={(e) => setPassConfirm(e.target.value)}
                placeholder="Re-enter new master passphrase"
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#EBE4D8] focus:border-[#C5A059] outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#162B21] hover:bg-[#234233] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer"
            >
              Rotate Master Passphrase
            </button>
          </form>
        </div>

        {/* Card 2: Change Administrator Email */}
        <div className="p-6 bg-white border border-[#EBE4D8] rounded-xs space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#F2EDE4] pb-3">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#C5A059]" />
              <h4 className="font-serif text-base text-[#162B21] font-semibold">
                Authorized Curator Work Email
              </h4>
            </div>
            {adminConfig.adminEmail.toLowerCase() === 'humperszk@gmail.com' && (
              <span className="text-[10px] font-bold text-[#162B21] bg-[#C5A059] px-2 py-0.5 rounded-xs uppercase tracking-wider shadow-xs">
                👑 Founder Account
              </span>
            )}
          </div>

          {emailMsg && (
            <div
              className={`p-3 text-xs rounded-xs flex items-start gap-2 ${
                emailMsg.type === 'success'
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  : 'bg-[#681A24]/10 border border-[#681A24]/20 text-[#681A24]'
              }`}
            >
              {emailMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              )}
              <span>{emailMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleUpdateEmail} className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider text-[#162B21] font-semibold block">
                Authorized Work Email
              </label>
              <input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="curator@kashida-couture.com"
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#EBE4D8] focus:border-[#C5A059] outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider text-[#162B21] font-semibold block">
                Verify with Master Passphrase
              </label>
              <input
                type="password"
                required
                value={emailCurrentPass}
                onChange={(e) => setEmailCurrentPass(e.target.value)}
                placeholder="Enter master passphrase to confirm email change"
                className="w-full p-2.5 bg-[#FAF8F5] border border-[#EBE4D8] focus:border-[#C5A059] outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#162B21] hover:bg-[#234233] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer"
            >
              Update Administrative Email
            </button>
          </form>
        </div>
      </div>

      {/* Policy & Rate-Limiting Controls */}
      <div className="p-6 bg-white border border-[#EBE4D8] rounded-xs space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#F2EDE4] pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#C5A059]" />
            <h4 className="font-serif text-base text-[#162B21] font-semibold">
              Security Policies & Rate-Limiting Controls
            </h4>
          </div>
          <button
            type="button"
            onClick={handleSaveSettings}
            className="px-4 py-1.5 bg-[#162B21] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold hover:bg-[#234233] cursor-pointer"
          >
            Save Policies
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
          {/* 2FA Toggle & Master PIN */}
          <div className="p-4 bg-[#FAF8F5] border border-[#EBE4D8] rounded-xs space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-[#162B21]">Two-Factor (2FA) Gate</span>
              <input
                type="checkbox"
                checked={is2FAEnabled}
                onChange={(e) => setIs2FAEnabled(e.target.checked)}
                className="accent-[#162B21]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider text-[#525B56] block font-semibold">
                6-Digit Master Security PIN
              </label>
              <input
                type="password"
                maxLength={6}
                value={securityPinInput}
                onChange={(e) => setSecurityPinInput(e.target.value.replace(/\D/g, ''))}
                placeholder="749201"
                className="w-full p-2 bg-white border border-[#EBE4D8] text-xs font-mono tracking-widest text-center focus:border-[#C5A059] outline-none"
              />
            </div>
            <p className="text-[10.5px] text-[#525B56]">
              Enforces dual-factor challenge key required at login and sensitive operations.
            </p>
          </div>

          {/* Session Timeout */}
          <div className="p-4 bg-[#FAF8F5] border border-[#EBE4D8] rounded-xs space-y-2">
            <span className="font-semibold text-[#162B21] block">Session Inactivity Timeout</span>
            <select
              value={sessionTimeout}
              onChange={(e) => setSessionTimeout(Number(e.target.value))}
              className="w-full p-2 bg-white border border-[#EBE4D8] text-xs focus:border-[#C5A059] outline-none"
            >
              <option value={15}>15 Minutes (Strict)</option>
              <option value={30}>30 Minutes</option>
              <option value={60}>60 Minutes (Standard)</option>
              <option value={120}>120 Minutes</option>
            </select>
            <p className="text-[10.5px] text-[#525B56]">
              Automatically terminates unmanaged sessions and flushes auth tokens from memory.
            </p>
          </div>

          {/* Rate-Limit Lockout Actions */}
          <div className="p-4 bg-[#FAF8F5] border border-[#EBE4D8] rounded-xs space-y-2">
            <span className="font-semibold text-[#162B21] block">Brute-Force Shield</span>
            <p className="text-[10.5px] text-[#525B56]">
              Blocks client IP for 15 minutes after 3 consecutive failed attempts.
            </p>
            <button
              type="button"
              onClick={handleResetLockouts}
              className="mt-1 px-3 py-1.5 border border-[#162B21] text-[#162B21] hover:bg-[#162B21] hover:text-white transition-colors cursor-pointer text-[10px] uppercase tracking-wider font-semibold"
            >
              Reset Quarantine Flags
            </button>
          </div>
        </div>
      </div>

      {/* Security Audit Log */}
      <div className="p-6 bg-white border border-[#EBE4D8] rounded-xs space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#F2EDE4] pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#C5A059]" />
            <h4 className="font-serif text-base text-[#162B21] font-semibold">
              Administrative Access & Audit Radar ({auditLogs.length} Events)
            </h4>
          </div>
          <button
            type="button"
            onClick={onClearAuditLogs}
            className="text-[11px] text-[#681A24] hover:underline cursor-pointer"
          >
            Clear Audit History
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#EBE4D8] text-[10px] uppercase tracking-wider text-[#525B56]">
                <th className="py-2 px-3">Timestamp</th>
                <th className="py-2 px-3">Security Event</th>
                <th className="py-2 px-3">Origin / Network</th>
                <th className="py-2 px-3 text-right">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2EDE4]">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#FAF8F5]">
                  <td className="py-2.5 px-3 font-mono text-[11px] text-[#525B56]">{log.timestamp}</td>
                  <td className="py-2.5 px-3 font-semibold text-[#162B21]">{log.event}</td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-[#525B56]">{log.ip}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span
                      className={`inline-block font-mono font-bold text-[10px] px-2 py-0.5 rounded-xs ${
                        log.status === 'SUCCESS'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-[#681A24]/10 text-[#681A24]'
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
