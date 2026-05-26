import { useState, useRef } from 'react';
import { useApp } from '@shared/hooks/useApp';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { BtnGhost, BtnRow } from '@/components/common/Button';
import { Eye, EyeOff, ShieldCheck, Lock, Smartphone, Mail, Save, Activity } from 'lucide-react';
import { getStep } from '@shared/constants/screens';
import './CreateAccount.css';

export function CreateAccount() {
  const { next, prev } = useApp();
  const [mobile, setMobile]         = useState('');
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [showPw, setShowPw]         = useState(false);
  const [otp, setOtp]               = useState(['', '', '', '', '', '']);
  const otpRefs = useRef([]);

  function handleOtpInput(i, val) {
    if (!/^\d?$/.test(val)) return;
    const updated = [...otp];
    updated[i] = val;
    setOtp(updated);
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
  }

  function handleOtpKeyDown(i, e) {
    if (e.key === 'Backspace' && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  }

  function handleOtpPaste(e) {
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!digits) return;
    e.preventDefault();
    const updated = [...otp];
    for (let j = 0; j < digits.length; j++) updated[j] = digits[j];
    setOtp(updated);
    otpRefs.current[Math.min(digits.length, 5)]?.focus();
  }

  return (
    <div className="screen-enter ca-screen">
      <ScreenHeader
        eyebrow={`Step ${getStep('signup')} · Account creation`}
        title="Create your"
        titleGradient="account"
        sub={
          <>
            <span className="sh-sub-row">
              <Save size={13} style={{ color: 'var(--hover)' }} />
              <span>Save your application securely.</span>
            </span>
            <span className="sh-sub-row">
              <Activity size={13} style={{ color: 'rgba(16,185,129,0.85)' }} />
              <span>Track your loan progress anytime.</span>
            </span>
          </>
        }
      />

      <div className="ca-grid">

        {/* ── Card 1: Create Account ────────────────────── */}
        <div className="ca-card">

          <div className="ca-head">
            <div className="ca-icon-wrap">
              <Lock size={15} />
            </div>
            <div>
              <h2 className="ca-card-title">Create account</h2>
              <p className="ca-card-sub">Encrypted &amp; secure at every step</p>
            </div>
          </div>

          <div className="ca-trust-badge">
            <ShieldCheck size={12} />
            <span>256-bit SSL · ASIC-compliant · SOC 2 certified</span>
          </div>

          <div className="ca-fields">

            <div className="ca-field">
              <label className="ca-lbl" htmlFor="ca-mobile">Mobile number</label>
              <div className="ca-inp-wrap">
                <Smartphone size={14} className="ca-inp-icon" />
                <input
                  id="ca-mobile"
                  className="ca-inp"
                  placeholder="0400 000 000"
                  value={mobile}
                  onChange={e => setMobile(e.target.value)}
                  inputMode="tel"
                  autoComplete="tel"
                />
              </div>
            </div>

            <div className="ca-field">
              <label className="ca-lbl" htmlFor="ca-email">Email address</label>
              <div className="ca-inp-wrap">
                <Mail size={14} className="ca-inp-icon" />
                <input
                  id="ca-email"
                  className="ca-inp"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="ca-field">
              <label className="ca-lbl" htmlFor="ca-password">Password</label>
              <div className="ca-inp-wrap">
                <Lock size={14} className="ca-inp-icon" />
                <input
                  id="ca-password"
                  className="ca-inp ca-inp--pw"
                  type={showPw ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="ca-eye-btn"
                  onClick={() => setShowPw(p => !p)}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

          </div>

          <button className="ca-cta" onClick={() => {}}>
            Send OTP &amp; create account
          </button>

          <p className="ca-signin-hint">
            Already have an account?{' '}
            <span className="ca-signin-link" role="button" tabIndex={0}>Sign in</span>
          </p>

        </div>

        {/* ── Card 2: OTP Verification ──────────────────── */}
        <div className="ca-card">

          <div className="ca-head">
            <div className="ca-icon-wrap ca-icon-wrap--green">
              <ShieldCheck size={15} />
            </div>
            <div>
              <h2 className="ca-card-title">Verify identity</h2>
              <p className="ca-card-sub">Sent to your registered mobile</p>
            </div>
          </div>

          <p className="ca-otp-desc">
            Enter the <strong>6-digit code</strong> sent to your mobile number
            to secure your account.
          </p>

          <div
            className="ca-otp-inputs"
            onPaste={handleOtpPaste}
            role="group"
            aria-label="One-time password"
          >
            {otp.map((d, i) => (
              <input
                key={i}
                ref={el => (otpRefs.current[i] = el)}
                className={`ca-otp-box${d ? ' ca-otp-box--filled' : ''}`}
                maxLength={1}
                value={d}
                onChange={e => handleOtpInput(i, e.target.value)}
                onKeyDown={e => handleOtpKeyDown(i, e)}
                inputMode="numeric"
                autoComplete={i === 0 ? 'one-time-code' : 'off'}
                aria-label={`Digit ${i + 1} of 6`}
              />
            ))}
          </div>

          <button className="ca-cta" onClick={next}>
            Verify &amp; continue
          </button>

          <div className="ca-resend-row">
            <span className="ca-resend-lbl">Didn't receive a code?</span>
            <button type="button" className="ca-resend-btn">
              Resend in <span className="ca-resend-timer">0:45</span>
            </button>
          </div>

        </div>

      </div>

      <BtnRow>
        <BtnGhost onClick={prev}>← Back</BtnGhost>
      </BtnRow>
    </div>
  );
}
