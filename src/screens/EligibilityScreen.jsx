import { useState } from 'react';
import { Check, Info, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Icon } from '../components/common/Icon';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { AnikaPanel } from '../components/common/AnikaPanel';
import { BtnPrimary, BtnRow } from '../components/common/Button';
import './EligibilityScreen.css';

const WHY_FEATURES = [
  { icon: 'Smartphone',    title: 'Simple digital process',     desc: 'Apply online, upload documents securely, and track your finance journey from one dashboard.' },
  { icon: 'ShieldCheck',   title: 'Safe & secure',              desc: 'Designed with secure verification, protected document uploads, and privacy-first data handling.' },
  { icon: 'Eye',           title: 'Full transparency',          desc: 'Every lender fee, repayment, comparison rate, and charge is clearly disclosed upfront.' },
  { icon: 'CreditCard',    title: 'Zero credit impact check',   desc: 'Explore lender options using soft checks only, without impacting your credit file.' },
  { icon: 'Bell',          title: 'Stay alert via dashboard',   desc: 'Get real-time updates, document requests, and application progress alerts in one place.' },
  { icon: 'MessageCircle', title: 'Less calls. Less pressure.', desc: 'No pushy sales tactics. Communication is digital, clear, and on your terms.' },
];

const ITEMS = [
  {
    id: 'age',
    icon: 'ShieldCheck',
    title: 'I am at least 18 years old',
    helper: 'Required under Australian lending regulations before applying for credit.',
    why: 'All Australian credit providers are legally required to verify the applicant is aged 18 or over under the National Consumer Credit Protection Act 2009.',
  },
  {
    id: 'income-amount',
    icon: 'Briefcase',
    title: 'I earn at least $25,000 per year',
    helper: 'PAYG, self-employed, contractor, or eligible benefit income accepted.',
    why: 'Lenders use minimum income thresholds to assess whether you can comfortably service loan repayments alongside your existing commitments and living costs.',
  },
  {
    id: 'regular-income',
    icon: 'TrendingUp',
    title: 'I have regular income as my primary source',
    helper: 'Anika AI uses income stability to help match you with suitable lenders.',
    why: 'Regular income — whether from employment, self-employment or eligible Centrelink payments — signals repayment capacity. Irregular income may limit available lenders.',
  },
  {
    id: 'no-defaults',
    icon: 'FileText',
    title: 'I have no bankruptcy or unpaid defaults',
    helper: 'Lenders review your credit history as part of responsible lending checks.',
    why: 'Undisclosed insolvencies or defaults can result in declined applications. Transparency now lets Anika match you only to lenders whose policy aligns with your credit profile.',
  },
  {
    id: 'id',
    icon: 'CreditCard',
    title: 'I have acceptable identification',
    helper: "Driver Licence, Passport, or accepted government-issued ID required.",
    why: 'Identity verification is required under Anti-Money Laundering and Know Your Customer (KYC) regulations. At least one primary photo ID is typically required.',
  },
];

const ANIKA_MSG =
  "I'll quickly check a few key areas to make sure we find lenders and products that suit your profile. It's fast, soft, and won't impact your credit score.";

export function EligibilityScreen() {
  const { state, updateState, next } = useApp();
  const checked = state.checkedEligibility ?? [];
  const [openWhy, setOpenWhy] = useState(null);

  const toggle = (id) => {
    const updated = checked.includes(id)
      ? checked.filter(c => c !== id)
      : [...checked, id];
    updateState({ checkedEligibility: updated });
  };

  const toggleWhy = (id, e) => {
    e.stopPropagation();
    setOpenWhy(prev => prev === id ? null : id);
  };

  const allDone   = ITEMS.every(item => checked.includes(item.id));
  const doneCount = ITEMS.filter(item => checked.includes(item.id)).length;
  const pct       = Math.round((doneCount / ITEMS.length) * 100);

  return (
    <div className="screen-enter">

      {/* 1 ── WHY AXIO ──────────────────────────────────────────── */}
      <div className="elig-why-section">
        <div className="elig-why-intro">
          <div className="screen-eyebrow"><Sparkles size={10} />Why Axio</div>
          <h2 className="elig-why-heading">Simple. Digital. Transparent. Secure.</h2>
          <p className="elig-why-sub">
            A finance experience built to remove confusion, reduce pressure,
            and give customers clearer control from start to finish.
          </p>
        </div>

        <div className="elig-why-grid">
          {WHY_FEATURES.map((f, i) => (
            <div key={i} className="elig-why-card">
              <div className="elig-why-icon"><Icon name={f.icon} size={14} /></div>
              <div className="elig-why-card-title">{f.title}</div>
              <div className="elig-why-card-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 2 ── ANIKA AI ──────────────────────────────────────────── */}
      <AnikaPanel message={ANIKA_MSG} />

      {/* 3 ── ELIGIBILITY REQUIREMENTS ──────────────────────────── */}
      <ScreenHeader
        eyebrow="Step 1 · Eligibility Check"
        title="Before we begin, let's check"
        titleGradient="your eligibility."
        sub="Tick all requirements below to confirm you're ready to apply. Anika AI uses your responses to match you with suitable lenders — zero credit file impact."
      />

      <div className="elig-checklist-wrap">
        <div className="elig-checklist-hd">
          <div className="elig-checklist-title">Eligibility requirements</div>
          <div className="elig-checklist-right">
            <div className={`elig-count${allDone ? ' done' : ''}`}>{doneCount} / {ITEMS.length}</div>
            <div className="elig-prog-bar">
              <div className="elig-prog-fill" style={{ width: `${pct}%` }} />
            </div>
            <span className="elig-prog-pct">{pct}%</span>
          </div>
        </div>

        <div className="elig-list">
          {ITEMS.map(item => {
            const isChecked = checked.includes(item.id);
            const whyOpen   = openWhy === item.id;
            return (
              <div
                key={item.id}
                className={`elig-card${isChecked ? ' on' : ''}`}
                onClick={() => toggle(item.id)}
                role="checkbox"
                aria-checked={isChecked}
                tabIndex={0}
                onKeyDown={e => (e.key === ' ' || e.key === 'Enter') && toggle(item.id)}
              >
                <div className="elig-card-icon"><Icon name={item.icon} size={14} /></div>
                <div className="elig-card-info">
                  <div className="elig-card-title">{item.title}</div>
                  <div className="elig-card-helper">{item.helper}</div>
                  <button
                    className="elig-why-btn"
                    onClick={e => toggleWhy(item.id, e)}
                    aria-expanded={whyOpen}
                  >
                    <Info size={9} strokeWidth={2} />Why we ask this
                  </button>
                  {whyOpen && (
                    <div className="elig-why-body" onClick={e => e.stopPropagation()}>
                      {item.why}
                    </div>
                  )}
                </div>
                <div className="elig-check" aria-hidden="true">
                  <Check size={10} strokeWidth={3} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <BtnRow style={{ justifyContent: 'flex-end' }}>
        <BtnPrimary onClick={next} disabled={!allDone}>
          Continue to product selection →
        </BtnPrimary>
      </BtnRow>

    </div>
  );
}
