import { useState } from 'react';
import { Check, Info } from 'lucide-react';
import { IconBadge } from '../components/common/IconBadge';
import { useApp } from '../context/AppContext';
import { Icon } from '../components/common/Icon';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { AnikaPanel } from '../components/common/AnikaPanel';
import { BtnPrimary, BtnRow } from '../components/common/Button';
import { getStep } from '../constants/screens';
import './EligibilityScreen.css';

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

      {/* 1 ── ANIKA AI ──────────────────────────────────────────── */}
      <AnikaPanel message={ANIKA_MSG} />

      {/* 3 ── ELIGIBILITY REQUIREMENTS ──────────────────────────── */}
      <ScreenHeader
        eyebrow={`Step ${getStep('eligibility')} · Eligibility Check`}
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
                    <IconBadge name={item.icon} iconSize={14} />
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
          Continue →
        </BtnPrimary>
      </BtnRow>

    </div>
  );
}
