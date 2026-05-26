import { Check, MessageSquare, Lock } from 'lucide-react';
import { useApp } from '@shared/hooks/useApp';
import { BtnPrimary, BtnGhost, BtnRow } from '@/components/common/Button';
import './VerificationStatusScreen.css';

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
    icon: <Check size={22} strokeWidth={2.5} />,
    title: 'Live Decisioning',
    desc: 'Track lender progress, SLA updates, and approval stages instantly.',
  },
  {
    icon: <MessageSquare size={22} />,
    title: 'Human + AI Support',
    desc: 'Connect directly with your analyst while Anika AI assists in the background.',
  },
  {
    icon: <Lock size={22} />,
    title: 'Open Banking Security',
    desc: 'Encrypted infrastructure designed for secure banking and finance workflows.',
  },
];

export function VerificationStatusScreen() {
  const { next, prev } = useApp();

  return (
    <div className="screen-enter vs-page">

      {/* ── Main card ── */}
      <div className="vs-main-card">
        <div className="vs-top-row">
          <div className="vs-check-icon">
            <Check size={22} strokeWidth={3} />
          </div>
          <div className="vs-active-badge">
            <span className="vs-active-dot" />
            Secure Workspace Activated
          </div>
        </div>

        <div className="vs-card-grid">
          <div className="vs-card-left">
            <h2 className="vs-card-heading">Verification Complete</h2>
            <p className="vs-card-sub">
              Your onboarding has been completed successfully and your secure
              finance workspace is now active.
            </p>
            <p className="vs-card-body">
              Your Axio Portal combines AI-powered lending technology with
              real-time analyst support to give you a smarter finance experience.
              Monitor your application live, receive lender updates instantly,
              securely manage your documents, and access future finance faster
              through your verified profile and connected financial data.
            </p>
          </div>

          <div>
            <div className="vs-col-head">What you can do</div>
            <ul className="vs-bullet-list">
              {WHAT_CAN_DO.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>

          <div>
            <div className="vs-col-head">Your Portal Benefits</div>
            <ul className="vs-bullet-list">
              {PORTAL_BENEFITS.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom three cards ── */}
      <div className="vs-bottom-grid">
        {BOTTOM_CARDS.map((card, i) => (
          <div key={i} className="vs-bottom-card">
            <div className="vs-bottom-icon">{card.icon}</div>
            <div className="vs-bottom-title">{card.title}</div>
            <div className="vs-bottom-desc">{card.desc}</div>
            <div className="vs-learn-more">Learn more →</div>
          </div>
        ))}
      </div>

      <BtnRow>
        <BtnGhost onClick={prev}>← Back</BtnGhost>
        <BtnPrimary onClick={next}>Continue →</BtnPrimary>
      </BtnRow>
    </div>
  );
}
