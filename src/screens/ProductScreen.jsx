import { ShieldCheck, Building2, BadgeCheck, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../components/common/Icon';
import { useApp } from '../context/AppContext';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { BtnPrimary } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { TRUST_STRIP_ITEMS, PROMISE_CARDS, PRODUCTS } from '../data/productData';
import './ProductScreen.css';

export function ProductScreen() {
  const { state, updateState, next } = useApp();
  const selected = state.loanType;

  return (
    <div className="screen-enter">
      <ScreenHeader
        eyebrow="Axio Finance · No broker bias · Soft check only"
        title="Finance for the"
        titleGradient="new generation"
        sub={
          <>
            <span className="sh-sub-row">
              <Building2 size={13} style={{ color: 'var(--hover)' }} />
              <span>Compare 45+ lenders in under 2 minutes.</span>
            </span>
            <span className="sh-sub-row">
              <ShieldCheck size={13} style={{ color: 'rgba(16,185,129,0.85)' }} />
              <span>No credit file impact.</span>
            </span>
            <span className="sh-sub-row">
              <BadgeCheck size={13} style={{ color: 'var(--hover)' }} />
              <span>No broker pressure.</span>
            </span>
            <span className="sh-sub-row">
              <Target size={13} style={{ color: 'rgba(16,185,129,0.85)' }} />
              <span>Just the right deal for you.</span>
            </span>
          </>
        }
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
        {PRODUCTS.map(p => {
          const isSelected = selected === p.id;
          return (
            <div
              key={p.id}
              className={`product-card${isSelected ? ' selected' : ''}`}
            >
              {/* Top-right selection ring */}
              <div className={`pc-ring${isSelected ? ' pc-ring--active' : ''}`} aria-hidden="true">
                <AnimatePresence>
                  {isSelected && (
                    <motion.span
                      className="pc-ring-tick"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 340, damping: 22 }}
                    >
                      <Icon name="Check" size={13} strokeWidth={3} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              <div className="pc-body">
                <div className="pc-icon"><Icon name={p.icon} size={28} /></div>
                <div className="pc-title">{p.title}</div>
                <div className="pc-desc">{p.desc}</div>
                <div className="pc-rate">{p.rate} <span>{p.rateNote}</span></div>
                {p.features.map((f, i) => <div key={i} className="pc-feat">{f}</div>)}
              </div>

              <div className="pc-footer">
                <div className="pc-footer-left">
                  <span className="text-small text-border2">{p.footerNote}</span>
                  <Badge variant={p.badge.cls.replace('badge-', '')}>{p.badge.text}</Badge>
                </div>
                <button
                  className={`pc-apply-btn${isSelected ? ' pc-apply-btn--applied' : ''}`}
                  onClick={() => updateState({ loanType: p.id })}
                >
                  {isSelected ? (
                    <><Icon name="Check" size={12} strokeWidth={2.5} /> Applied</>
                  ) : (
                    'Apply'
                  )}
                </button>
              </div>
            </div>
          );
        })}
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
