/**
 * Security & Cryptographic Utilities for Kāshida Couture E-Commerce Portal
 * Provides client-side SHA-256 hashing via native Web Crypto API, password strength audit,
 * and rate-limiting lockout protection for high-security administrative and patron portals.
 */

export async function hashPassword(plainText: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const msgBuffer = new TextEncoder().encode(plainText + '_kashida_salt_2026');
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  // Fallback simple hash for non-crypto environments
  let hash = 0;
  for (let i = 0; i < plainText.length; i++) {
    const char = plainText.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `hash_${Math.abs(hash).toString(16)}`;
}

export interface PasswordStrength {
  score: number; // 0 - 100
  level: 'VERY_WEAK' | 'WEAK' | 'MODERATE' | 'STRONG' | 'VERY_STRONG';
  feedback: string[];
  isValid: boolean;
}

export function evaluatePasswordStrength(password: string): PasswordStrength {
  const feedback: string[] = [];
  let score = 0;

  if (!password) {
    return { score: 0, level: 'VERY_WEAK', feedback: ['Password is required'], isValid: false };
  }

  if (password.length >= 8) score += 25;
  else feedback.push('At least 8 characters required');

  if (password.length >= 12) score += 15;

  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
    score += 25;
  } else {
    feedback.push('Include both uppercase and lowercase letters');
  }

  if (/[0-9]/.test(password)) {
    score += 20;
  } else {
    feedback.push('Include at least one numerical digit');
  }

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 15;
  } else {
    feedback.push('Include at least one special character (!@#$%...)');
  }

  let level: PasswordStrength['level'] = 'VERY_WEAK';
  if (score >= 80) level = 'VERY_STRONG';
  else if (score >= 65) level = 'STRONG';
  else if (score >= 50) level = 'MODERATE';
  else if (score >= 25) level = 'WEAK';

  return {
    score: Math.min(100, score),
    level,
    feedback,
    isValid: score >= 50 && password.length >= 8,
  };
}

// Rate Limiting & Lockout Tracker for Admin Portal
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 60 * 1000; // 60 seconds

export interface LockoutState {
  isLocked: boolean;
  remainingSeconds: number;
  attemptsLeft: number;
}

export function checkAdminLockout(): LockoutState {
  if (typeof window === 'undefined') {
    return { isLocked: false, remainingSeconds: 0, attemptsLeft: MAX_FAILED_ATTEMPTS };
  }
  const lockedUntilStr = localStorage.getItem('kashida_admin_locked_until');
  const attempts = Number(localStorage.getItem('kashida_admin_failed_attempts') || '0');

  if (lockedUntilStr) {
    const lockedUntil = Number(lockedUntilStr);
    const now = Date.now();
    if (now < lockedUntil) {
      const remainingSeconds = Math.ceil((lockedUntil - now) / 1000);
      return { isLocked: true, remainingSeconds, attemptsLeft: 0 };
    } else {
      // Lockout expired, reset
      localStorage.removeItem('kashida_admin_locked_until');
      localStorage.setItem('kashida_admin_failed_attempts', '0');
    }
  }

  return {
    isLocked: false,
    remainingSeconds: 0,
    attemptsLeft: Math.max(0, MAX_FAILED_ATTEMPTS - attempts),
  };
}

export function recordFailedAdminAttempt(): LockoutState {
  const current = Number(localStorage.getItem('kashida_admin_failed_attempts') || '0') + 1;
  localStorage.setItem('kashida_admin_failed_attempts', current.toString());

  if (current >= MAX_FAILED_ATTEMPTS) {
    const lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
    localStorage.setItem('kashida_admin_locked_until', lockedUntil.toString());
    return { isLocked: true, remainingSeconds: 60, attemptsLeft: 0 };
  }

  return {
    isLocked: false,
    remainingSeconds: 0,
    attemptsLeft: Math.max(0, MAX_FAILED_ATTEMPTS - current),
  };
}

export function resetAdminAttempts(): void {
  localStorage.removeItem('kashida_admin_failed_attempts');
  localStorage.removeItem('kashida_admin_locked_until');
}
