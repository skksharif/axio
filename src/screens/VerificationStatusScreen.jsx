import { Check, MessageSquare, Lock, ShieldCheck, TrendingUp, FileCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BtnPrimary, BtnGhost, BtnRow } from '../components/common/Button';
import './VerificationStatusScreen.css';

const MILESTONES = [
  'Profile complete',
  'Income verified',
  'Documents uploaded',
  'Banks connected',
  'Identity confirmed',
];

const STATS = [
  { label: 'Verification',  value: '100%',    accent: 'green'  },
  { label: 'Risk flags',    value: 'None',     accent: 'green'  },
  { label: 'Lender status', value: 'Active',   accent: 'purple' },
  { label: 'Data access',   value: 'CDR live', accent: 'purple' },
];

const WHAT_CAN_DO = [
  'Track your loan progress',
  'Open Chat with your analyst',
  'Manage your documents',
  'View lender updates',
];

const PORTAL_BENEFITS = [
  'Faster future applications',
  'Secure document storage',
  'Real-time notifications',
  'Ongoing finance management',
];

const BOTTOM_CARDS = [
  {
    icon: <TrendingUp size={20} />,
    title: 'Live Decisioning',
    desc: 'Track lender progress, SLA updates, and approval stages instantly.',
  },
  {
    icon: <MessageSquare size={20} />,
    title: 'Human + AI Support',
    desc: 'Connect directly with your analyst while Anika AI assists in the background.',
  },
  {
    icon: <Lock size={20} />,
    title: 'Open Banking Security',
    desc: 'Encrypted infrastructure designed for secure banking and finance workflows.',
  },
];

export function VerificationStatusScreen() {
  const { next, prev } = useApp();

  return (
    <div className="screen-enter vs-page">

      {/* Hero heading */}
      <h1 className="vs-hero-h1">
        The Future of<br />
        <span className="vs-hero-gradient">Digital Lending</span>
      </h1>

      {/* ── Completion tracker ── */}
      <div className="vs-tracker">
        <div className="vs-tracker-row">
          <div className="vs-tracker-left">
            <ShieldCheck size={14} className="vs-tracker-icon" />
            <span className="vs-tracker-label">Onboarding complete</span>
          </div>
          <span className="vs-tracker-count">{MILESTONES.length} of {MILESTONES.length} steps</span>
        </div>
        <div className="vs-tracker-bar">
          <div className="vs-tracker-fill" />
        </div>
        <div className="vs-tracker-chips">
          {MILESTONES.map((m, i) => (
            <div key={i} className="vs-milestone-chip">
              <Check size={9} strokeWidth={3} />
              {m}
            </div>
          ))}
        </div>
      </div>

      {/* ── Main card ── */}
      <div className="vs-main-card">
        <div className="vs-card-top-row">
          <div className="vs-check-icon-wrap">
            <div className="vs-check-icon">
              <Check size={22} strokeWidth={3} />
            </div>
          </div>
          <div className="vs-active-badge">
            <span className="vs-active-dot" />
            Secure Workspace Activated
          </div>
        </div>

        <h2 className="vs-card-heading">Verification Complete</h2>
        <p className="vs-card-sub">
          Your onboarding has been completed successfully and your secure finance workspace is now active.
        </p>

        {/* Stat chips */}
        <div className="vs-stats-row">
          {STATS.map((s, i) => (
            <div key={i} className={`vs-stat-chip vs-stat-chip--${s.accent}`}>
              <span className="vs-stat-value">{s.value}</span>
              <span className="vs-stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        <p className="vs-card-body">
          Your Axio Portal combines AI-powered lending technology with real-time analyst support to give
          you a smarter finance experience. Monitor your application live, receive lender updates
          instantly, securely manage your documents, and access future finance faster through your
          verified profile and connected financial data.
        </p>

        <div className="vs-two-col">
          <div>
            <div className="vs-col-head">What you can do</div>
            <ul className="vs-bullet-list">
              {WHAT_CAN_DO.map((item, i) => (
                <li key={i}>
                  <span className="vs-bullet-check"><Check size={9} strokeWidth={3} /></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="vs-col-head">Your Portal Benefits</div>
            <ul className="vs-bullet-list">
              {PORTAL_BENEFITS.map((item, i) => (
                <li key={i}>
                  <span className="vs-bullet-check"><Check size={9} strokeWidth={3} /></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom three cards ── */}
      <div className="vs-bottom-grid">
        {BOTTOM_CARDS.map((card, i) => (
          <div key={i} className="vs-bottom-card">
            <div className="vs-bottom-card-header">
              <div className="vs-bottom-icon">{card.icon}</div>
              <div className="vs-bottom-active-pip">
                <span className="vs-pip-dot" />
                Active
              </div>
            </div>
            <div className="vs-bottom-title">{card.title}</div>
            <div className="vs-bottom-desc">{card.desc}</div>
          </div>
        ))}
      </div>

      <BtnRow>
        <BtnGhost onClick={prev}>← Back</BtnGhost>
        <BtnPrimary onClick={next}>Access your portal →</BtnPrimary>
      </BtnRow>
    </div>
  );
}
