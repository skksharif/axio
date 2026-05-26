import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import {
  Shield, ShieldCheck, CheckCircle2, Mail, Smartphone,
  ArrowRight, RefreshCw, Lock, Check, AlertCircle,
  Activity, Car, TrendingUp, FileText, Sparkles,
} from 'lucide-react';
import { getStep } from '../constants/screens';
import './CreateAccount.css';
import '../components/common/ScreenHeader.css';

// ── Brand Icons ────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 21 21" aria-hidden="true">
      <rect x="0" y="0" width="10" height="10" fill="#F25022"/>
      <rect x="11" y="0" width="10" height="10" fill="#7FBA00"/>
      <rect x="0" y="11" width="10" height="10" fill="#00A4EF"/>
      <rect x="11" y="11" width="10" height="10" fill="#FFB900"/>
    </svg>
  );
}

// ── Validation ─────────────────────────────────────────────────────────
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(v) {
  const t = v.trim();
  if (!t) return 'Email is required';
  if (!emailRe.test(t)) return 'Enter a valid email address';
  return null;
}

function validateMobile(v) {
  const d = v.replace(/\s+/g, '');
  if (!d) return 'Mobile number is required';
  if (d.length < 10) return 'Mobile number is too short';
  if (!/^(04|\+614|614)/.test(d)) return 'Enter a valid AU mobile (04xx xxx xxx)';
  return null;
}

function formatMobile(v) {
  const d = v.replace(/\D/g, '').slice(0, 10);
  if (d.length <= 4) return d;
  if (d.length <= 7) return `${d.slice(0, 4)} ${d.slice(4)}`;
  return `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7)}`;
}

// ── Constants ──────────────────────────────────────────────────────────
const STEP_LABELS = ['1. Details', '2. Verify', '3. Documents upload'];
const RESEND_SECS = 30;
const EXPIRY_SECS = 600;

// Paired left/right so CSS grid fills them in the correct column order
const CHECKS = [
  'OTP accepts one digit',                'OTP rejects incomplete code',
  'OTP accepts complete code',            'Email accepts valid address',
  'Email rejects invalid address',        'Mobile accepts valid AU number',
  'OTP strips letters and symbols',       'Email trims spaces',
  'Mobile rejects too short number',      'OTP rejects non-array',
  'Mobile accepts spaced local AU number','OTP rejects short array',
  'Email rejects missing domain',
];

// ── OTP Input Component ────────────────────────────────────────────────
function OTPInput({ value, onChange, label, sentTo, icon: Icon, resendTimer, onResend }) {
  const refs = useRef([]);

  const handleChange = (i, v) => {
    const digit = v.replace(/\D/g, '').slice(-1);
    const next = [...value];
    next[i] = digit;
    onChange(next);
    if (digit && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace') {
      if (value[i]) {
        const next = [...value]; next[i] = ''; onChange(next);
      } else if (i > 0) {
        const next = [...value]; next[i - 1] = ''; onChange(next);
        refs.current[i - 1]?.focus();
      }
    }
    if (e.key === 'ArrowLeft' && i > 0) refs.current[i - 1]?.focus();
    if (e.key === 'ArrowRight' && i < 5) refs.current[i + 1]?.focus();
  };

  const handlePaste = e => {
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!digits) return;
    e.preventDefault();
    const next = Array(6).fill('');
    for (let j = 0; j < digits.length; j++) next[j] = digits[j];
    onChange(next);
    refs.current[Math.min(digits.length, 5)]?.focus();
  };

  const isComplete = value.every(Boolean);

  return (
    <div className="ca-otp-group">
      <div className="ca-otp-group-head">
        <div className="ca-otp-group-left">
          <div className="ca-otp-group-icon">
            <Icon size={13} />
          </div>
          <div>
            <div className="ca-otp-group-label">{label}</div>
            <div className="ca-otp-group-dest">{sentTo}</div>
          </div>
        </div>
        <button
          className={`ca-resend-action${resendTimer > 0 ? ' ca-resend-wait' : ' ca-resend-ready'}`}
          type="button"
          onClick={resendTimer === 0 ? onResend : undefined}
          disabled={resendTimer > 0}
          aria-label={resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend code'}
        >
          {resendTimer > 0 ? `${resendTimer}s` : 'Resend'}
        </button>
      </div>

      <div
        className={`ca-otp-boxes${isComplete ? ' ca-otp-boxes--done' : ''}`}
        onPaste={handlePaste}
        role="group"
        aria-label={label}
      >
        {value.map((d, i) => (
          <input
            key={i}
            ref={el => (refs.current[i] = el)}
            className={`ca-otp-box${d ? ' ca-otp-box--filled' : ''}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            autoComplete={i === 0 ? 'one-time-code' : 'off'}
            aria-label={`Digit ${i + 1} of 6`}
          />
        ))}
      </div>
    </div>
  );
}

// ── Validation Checklist ───────────────────────────────────────────────
function ValidationPanel() {
  return (
    <div className="ca-val-panel">
      <div className="ca-val-head">
        <span className="ca-val-title">BUILT-IN VALIDATION CHECKS</span>
        <span className="ca-val-badge">Passed</span>
      </div>
      <div className="ca-val-grid">
        {CHECKS.map((text, i) => (
          <div key={i} className="ca-val-item">
            <CheckCircle2 size={12} />
            <span>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Security Card ──────────────────────────────────────────────────────
function SecurityCard() {
  return (
    <div className="ca-security">
      <div className="ca-security-icon">
        <Shield size={15} />
      </div>
      <div>
        <div className="ca-security-title">Security-first onboarding</div>
        <div className="ca-security-text">
          Email and mobile OTP verification help keep customer accounts and finance updates protected.
        </div>
      </div>
    </div>
  );
}

// ── Step footer shared between all steps ───────────────────────────────
function StepFooter() {
  return (
    <>
      <ValidationPanel />
      <SecurityCard />
      <p className="ca-legal">
        By continuing, you agree to receive account, verification and application
        updates by email and SMS. Your information is encrypted and used only to
        manage your finance journey. Your digital security is our priority.
      </p>
    </>
  );
}

// ── Left panel data ────────────────────────────────────────────────────
const PANEL_FEAT_CARDS = [
  {
    icon: Activity,
    title: 'Live tracking',
    desc: 'Real-time application status at every stage of review',
  },
  {
    icon: FileText,
    title: 'Secure documents',
    desc: 'Encrypted upload and instant identity verification',
  },
  {
    icon: TrendingUp,
    title: 'Lender rates',
    desc: 'Live comparisons from 127+ active Australian lenders',
  },
  {
    icon: Car,
    title: 'Marketplace',
    desc: 'Finance-ready vehicles matched to your approval profile',
  },
];



// ── Left content panel ─────────────────────────────────────────────────
function BrandPanel() {
  return (
    <motion.aside
      className="ca-panel"
      initial={{ opacity: 0, x: 18 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.36, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Hero block */}
      <div className="ca-panel-hero-block">
        <h2 className="ca-panel-hero">
          Your personal finance dashboard,{' '}
          <span className="ca-panel-hero-accent">built for the modern borrower.</span>
        </h2>
        <p className="ca-panel-desc">
          Track your application in real time, receive live lender updates,
          upload secure documents, and access Australia's most personalised
          finance marketplace — all in one place.
        </p>
      </div>

      {/* 2 × 2 feature grid */}
      <div className="ca-panel-grid">
        {PANEL_FEAT_CARDS.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="ca-panel-feat-card">
            <div className="ca-panel-feat-icon"><Icon size={15} /></div>
            <div className="ca-panel-feat-title">{title}</div>
            <div className="ca-panel-feat-desc">{desc}</div>
          </div>
        ))}
      </div>



      {/* Trust row */}
      <div className="ca-panel-trust">
        <div className="ca-pt"><ShieldCheck size={11} />256-bit SSL</div>
        <div className="ca-pt"><Check size={11} />ASIC regulated</div>
        <div className="ca-pt"><Lock size={11} />Privacy compliant</div>
      </div>

    </motion.aside>
  );
}

// ── Main Export ────────────────────────────────────────────────────────
export function CreateAccount() {
  const { next } = useApp();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const mobileInputRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);

  const [emailOtp, setEmailOtp]     = useState(Array(6).fill(''));
  const [mobileOtp, setMobileOtp]   = useState(Array(6).fill(''));
  const [emailResend, setEmailResend]   = useState(0);
  const [mobileResend, setMobileResend] = useState(0);
  const [expiry, setExpiry]         = useState(EXPIRY_SECS);
  const [otpError, setOtpError]     = useState('');
  const [verifying, setVerifying]   = useState(false);

  // Start all timers when entering step 2
  useEffect(() => {
    if (step !== 2) return;
    setExpiry(EXPIRY_SECS);
    setEmailResend(RESEND_SECS);
    setMobileResend(RESEND_SECS);
    const tick = setInterval(() => {
      setExpiry(s => Math.max(0, s - 1));
      setEmailResend(s => Math.max(0, s - 1));
      setMobileResend(s => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(tick);
  }, [step]);

  const fmtExpiry = s =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const handleSend = () => {
    const eErr = validateEmail(email);
    const mErr = validateMobile(mobile);
    if (eErr || mErr) { setErrors({ email: eErr, mobile: mErr }); return; }
    setErrors({});
    setSending(true);
    setTimeout(() => { setSending(false); setStep(2); }, 650);
  };

  const handleVerify = () => {
    const ed = emailOtp.every(Boolean);
    const md = mobileOtp.every(Boolean);
    if (!ed || !md) {
      setOtpError(
        ed  ? 'Please complete the mobile verification code'
        : md ? 'Please complete the email verification code'
             : 'Please enter both verification codes'
      );
      return;
    }
    setOtpError('');
    setVerifying(true);
    setTimeout(() => { setVerifying(false); setStep(3); }, 900);
  };

  const handleResendEmail = () => {
    setEmailOtp(Array(6).fill(''));
    setEmailResend(RESEND_SECS);
  };

  const handleResendMobile = () => {
    setMobileOtp(Array(6).fill(''));
    setMobileResend(RESEND_SECS);
  };

  const slide = {
    initial: { opacity: 0, x: 22 },
    animate: { opacity: 1, x: 0 },
    exit:    { opacity: 0, x: -22 },
    transition: { duration: 0.22, ease: [0.4, 0, 0.2, 1] },
  };

  // Display mobile with +61 prefix in confirm card (mobile state = raw digits)
  const displayMobile = mobile
    ? `+61 ${formatMobile(mobile).replace(/^0/, '')}`
    : '+61 412 345 678';

  return (
    <div className="screen-enter ca-wrap">
      <div className="ca-screen">

      {/* ── Page header ───────────────────────────────────────── */}
      <div className="ca-page-head">
        <div className="ca-page-head-left">
          <div className="screen-eyebrow">
            <Sparkles size={10} />
            Step {getStep('signup')} · Create account
          </div>
          <h1 className="ca-page-title">Create account / Login</h1>
        </div>
        <div className="ca-safe-badge">
          <ShieldCheck size={11} />
          Safe &amp; secure
        </div>
      </div>

      {/* ── Step tabs ─────────────────────────────────────────── */}
      <div className="ca-tabs" role="tablist" aria-label="Registration steps">
        {STEP_LABELS.map((label, i) => {
          const n = i + 1;
          const active = step === n;
          const done   = step > n;
          const locked = step < n;
          return (
            <button
              key={n}
              role="tab"
              aria-selected={active}
              aria-current={active ? 'step' : undefined}
              className={`ca-tab${active ? ' ca-tab--active' : ''}${done ? ' ca-tab--done' : ''}${locked ? ' ca-tab--locked' : ''}`}
              onClick={() => done && setStep(n)}
              disabled={locked}
            >
              {done && <Check size={11} strokeWidth={3} />}
              {label}
            </button>
          );
        })}
      </div>

      {/* ── Animated step content ─────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div key={step} {...slide} className="ca-step">

          {/* ══════════════ STEP 1 — DETAILS ══════════════ */}
          {step === 1 && (
            <div className="ca-col">
              <div className="ca-card">

                {/* Social login */}
                <div className="ca-social">
                  <button className="ca-social-btn" type="button">
                    <GoogleIcon />
                    Continue with Google
                  </button>
                  <button className="ca-social-btn" type="button">
                    <MicrosoftIcon />
                    Continue with Outlook
                  </button>
                </div>

                {/* Divider */}
                <div className="ca-divider"><span>OR USE OTP</span></div>

                {/* Email */}
                <div className="ca-field">
                  <label className="ca-lbl" htmlFor="ca-email">Email address</label>
                  <div className={`ca-inp-wrap${errors.email ? ' ca-inp-wrap--err' : ''}`}>
                    <Mail size={14} className="ca-inp-icon" />
                    <input
                      id="ca-email"
                      className="ca-inp"
                      type="email"
                      placeholder="moss@example.com"
                      value={email}
                      autoComplete="email"
                      onChange={e => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors(p => ({ ...p, email: null }));
                      }}
                    />
                  </div>
                  {errors.email && (
                    <span className="ca-err"><AlertCircle size={11} />{errors.email}</span>
                  )}
                </div>

                {/* Mobile */}
                <div className="ca-field">
                  <label className="ca-lbl" htmlFor="ca-mobile">Mobile number</label>
                  <div className={`ca-inp-wrap${errors.mobile ? ' ca-inp-wrap--err' : ''}`}>
                    <Smartphone size={14} className="ca-inp-icon" />
                    <input
                      id="ca-mobile"
                      ref={mobileInputRef}
                      className="ca-inp"
                      type="tel"
                      inputMode="tel"
                      placeholder="+61 412 345 678"
                      value={formatMobile(mobile)}
                      autoComplete="tel"
                      onChange={e => {
                        const input = e.target;
                        const cursorPos = input.selectionStart;
                        // Count how many digits sat before the cursor in the modified value
                        const digitsBeforeCursor = input.value.slice(0, cursorPos).replace(/\D/g, '').length;
                        const newRaw = input.value.replace(/\D/g, '').slice(0, 10);
                        setMobile(newRaw);
                        // Restore cursor to the matching digit position after re-render
                        requestAnimationFrame(() => {
                          const el = mobileInputRef.current;
                          if (!el) return;
                          const formatted = formatMobile(newRaw);
                          let counted = 0;
                          let pos = formatted.length;
                          for (let i = 0; i < formatted.length; i++) {
                            if (counted === digitsBeforeCursor) { pos = i; break; }
                            if (/\d/.test(formatted[i])) counted++;
                          }
                          el.setSelectionRange(pos, pos);
                        });
                        if (errors.mobile) setErrors(p => ({ ...p, mobile: null }));
                      }}
                    />
                  </div>
                  {errors.mobile && (
                    <span className="ca-err"><AlertCircle size={11} />{errors.mobile}</span>
                  )}
                </div>

                {/* Info box */}
                <div className="ca-otp-info">
                  <div className="ca-otp-info-icon"><Shield size={13} /></div>
                  <p className="ca-otp-info-text">
                    We will send a 6-digit code to both your email and mobile at the same time.
                    Once verified, you will unlock secure access to your Axio Finance dashboard,
                    real time updates, secure messaging, documents, and your personalised finance journey.
                  </p>
                </div>

                {/* CTA */}
                <button
                  className={`ca-cta${sending ? ' ca-cta--loading' : ''}`}
                  type="button"
                  onClick={handleSend}
                  disabled={sending}
                >
                  {sending
                    ? <><RefreshCw size={14} className="ca-spin" />Sending codes…</>
                    : <>Send both OTP codes<ArrowRight size={14} /></>
                  }
                </button>

              </div>
              <StepFooter />
            </div>
          )}

          {/* ══════════════ STEP 2 — VERIFY ══════════════ */}
          {step === 2 && (
            <div className="ca-col">
              <div className="ca-card">

                {/* Confirm details */}
                <div className="ca-confirm-head">
                  <span className="ca-confirm-title">Confirm your details</span>
                </div>
                <div className="ca-confirm-row">
                  <div className="ca-confirm-cell">
                    <span className="ca-confirm-lbl">Email</span>
                    <span className="ca-confirm-val">{email || 'moss@example.com'}</span>
                  </div>
                  <div className="ca-confirm-cell">
                    <span className="ca-confirm-lbl">Mobile</span>
                    <span className="ca-confirm-val">{displayMobile}</span>
                  </div>
                </div>
                <button className="ca-edit-link" type="button" onClick={() => setStep(1)}>
                  Wrong details? Edit before verifying
                </button>

                {/* Dual OTP sections */}
                <div className="ca-otp-sections">
                  <OTPInput
                    label="Email verification code"
                    sentTo={`Sent to ${email || 'moss@example.com'}`}
                    value={emailOtp}
                    onChange={setEmailOtp}
                    icon={Mail}
                    resendTimer={emailResend}
                    onResend={handleResendEmail}
                  />
                  <OTPInput
                    label="Mobile verification code"
                    sentTo={`Sent to ${displayMobile}`}
                    value={mobileOtp}
                    onChange={setMobileOtp}
                    icon={Smartphone}
                    resendTimer={mobileResend}
                    onResend={handleResendMobile}
                  />
                </div>

                {/* Expiry + badge */}
                <div className="ca-expiry-row">
                  <span className="ca-expiry-left">
                    <RefreshCw size={12} className={expiry > 0 ? 'ca-spin-slow' : ''} />
                    Codes expire in&nbsp;<strong>{fmtExpiry(expiry)}</strong>
                  </span>
                  <span className="ca-2step">2-step verification</span>
                </div>

                {/* OTP error */}
                {otpError && (
                  <div className="ca-otp-err">
                    <AlertCircle size={13} />{otpError}
                  </div>
                )}

                {/* CTA */}
                <button
                  className={`ca-cta${verifying ? ' ca-cta--loading' : ''}`}
                  type="button"
                  onClick={handleVerify}
                  disabled={verifying}
                >
                  {verifying
                    ? <><RefreshCw size={14} className="ca-spin" />Verifying…</>
                    : <>Verify email &amp; mobile<Lock size={14} /></>
                  }
                </button>

              </div>
              <StepFooter />
            </div>
          )}

          {/* ══════════════ STEP 3 — SUCCESS ══════════════ */}
          {step === 3 && (
            <div className="ca-col">
              <div className="ca-card ca-card--success">

                <motion.div
                  className="ca-success-icon"
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.08 }}
                >
                  <CheckCircle2 size={34} />
                </motion.div>

                <motion.div
                  className="ca-success-body"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.26, delay: 0.28 }}
                >
                  <h2 className="ca-success-title">Account verified!</h2>
                  <p className="ca-success-text">
                    Your email and mobile number have been confirmed.
                    You can now continue your Axio Finance journey by uploading your documents.
                  </p>
                </motion.div>

                <motion.button
                  className="ca-cta"
                  type="button"
                  onClick={next}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, delay: 0.44 }}
                >
                  Go to documents uploads
                  <ArrowRight size={14} />
                </motion.button>

              </div>
              <StepFooter />
            </div>
          )}

        </motion.div>
      </AnimatePresence>
      </div>{/* end ca-screen */}
      <BrandPanel />
    </div>
  );
}
