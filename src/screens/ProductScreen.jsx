import { ShieldCheck } from 'lucide-react';
import { Icon } from '../components/common/Icon';
import { useApp } from '../context/AppContext';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { BtnPrimary } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { TRUST_STRIP_ITEMS, PROMISE_CARDS, PRODUCTS } from '../data/productData';
import './ProductScreen.css';

export function ProductScreen() {
  const { state, updateState, next } = useApp();

  return (
    <div className="screen-enter">
      <ScreenHeader
        eyebrow="Axio Finance · No broker bias · Soft check only"
        title="Finance for the"
        titleGradient="new generation"
        sub="Compare 45+ lenders in under 2 minutes. No credit file impact. No broker pressure. Just the right deal for you."
      />

      <div className="trust-strip">
        {TRUST_STRIP_ITEMS.map((t, i) => (
          <div key={i} className="trust-item">
            <div className="trust-icon-big"><Icon name={t.icon} size={22} /></div>
            <div className="trust-val">{t.val}</div>
            <div className="trust-lbl">{t.lbl}</div>
          </div>
        ))}
      </div>

      <div className="choice-grid-2 mb-24">
        {PRODUCTS.map(p => (
          <div
            key={p.id}
            className={`product-card ${state.loanType === p.id ? 'selected' : ''}`}
            onClick={() => updateState({ loanType: p.id })}
          >
            <div className="pc-body">
              <div className="pc-icon"><Icon name={p.icon} size={28} /></div>
              <div className="pc-title">{p.title}</div>
              <div className="pc-desc">{p.desc}</div>
              <div className="pc-rate">{p.rate} <span>{p.rateNote}</span></div>
              {p.features.map((f, i) => <div key={i} className="pc-feat">{f}</div>)}
            </div>
            <div className="pc-footer">
              <span className="text-small text-border2">{p.footerNote}</span>
              <Badge variant={p.badge.cls.replace('badge-', '')}>{p.badge.text}</Badge>
            </div>
          </div>
        ))}
      </div>

      <div className="promise-grid">
        {PROMISE_CARDS.map((c, i) => (
          <div key={i} className="promise-card">
            <div className="promise-icon"><Icon name={c.icon} size={22} /></div>
            <div className="promise-title">{c.title}</div>
            <div className="promise-text">{c.text}</div>
          </div>
        ))}
      </div>

      <div className="cta-bar">
        <div>
          <div className="cta-title">Ready to find your rate?</div>
          <div className="cta-sub">Takes under 2 minutes · soft check only · no commitment</div>
        </div>
        <BtnPrimary onClick={next}>Get started — it's free →</BtnPrimary>
      </div>
      <div className="no-credit-note">
        <ShieldCheck size={14} /> Checking your rate will <strong className="text-strong">not</strong> affect your credit score
      </div>
    </div>
  );
}
