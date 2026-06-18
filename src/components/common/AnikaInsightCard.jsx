import { useState, useEffect } from 'react';
import anikaLogo from '../../assets/anika.png';
import './AnikaPanel.css';
import './AnikaInsightCard.css';

const VARIANT_META = {
  warning: { title: 'Attention Required', badge: '⚠', thinking: 'Reviewing application details' },
  error:   { title: 'Action Required',    badge: '⊘', thinking: 'Checking requirements'         },
  info:    { title: 'AI Insight',         badge: '✦', thinking: 'Analyzing information'          },
  success: { title: 'Assessment Complete', badge: '✓', thinking: 'Verifying details'             },
};

export function AnikaInsightCard({
  variant = 'warning',
  title,
  thinkingLabel,
  summary,
  message = '',
  thinkingMs = 650,
  style,
}) {
  const meta = VARIANT_META[variant] ?? VARIANT_META.info;
  const displayTitle   = title         ?? meta.title;
  const thinkingText   = thinkingLabel ?? meta.thinking;

  const [phase,     setPhase]     = useState('thinking');
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    const reduced = typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (reduced || !message) {
      setDisplayed(message);
      setPhase('done');
      return;
    }

    const t = setTimeout(() => setPhase('streaming'), thinkingMs);
    return () => clearTimeout(t);
  }, []);                                          // intentionally run once on mount

  useEffect(() => {
    if (phase !== 'streaming' || !message) {
      if (phase === 'streaming') setPhase('done');
      return;
    }
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(message.slice(0, i));
      if (i >= message.length) { clearInterval(id); setPhase('done'); }
    }, 14);
    return () => clearInterval(id);
  }, [phase, message]);

  const isThinking  = phase === 'thinking';
  const isStreaming = phase === 'streaming';

  return (
    <div className={`anika-panel anic--${variant}`} style={style}>
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="ap-header">
        <div className="ap-avatar-wrap">
          <div className="ap-avatar-ring" />
          <div className="ap-avatar">
            <img src={anikaLogo} alt="Anika AI" className="ap-avatar-logo" />
          </div>
        </div>
        <div className="ap-header-body">
          <div className="ap-name">Anika AI</div>
          <div className="ap-status">
            {isThinking ? (
              <>
                <span>{thinkingText}</span>
                <span className="ap-dots">
                  <span className="ap-dot" />
                  <span className="ap-dot" />
                  <span className="ap-dot" />
                </span>
              </>
            ) : (
              <span className={`anic-status anic-status--${variant}`}>{displayTitle}</span>
            )}
          </div>
        </div>
      </div>

      {/* ── Body ───────────────────────────────────────────────── */}
      <div className="ap-body">
        {isThinking ? (
          <div className="ap-shimmer">
            <div className="ap-shimmer-line ap-shimmer-line--w85" />
            <div className="ap-shimmer-line ap-shimmer-line--w65" />
          </div>
        ) : (
          <p className="ap-message">
            {displayed}
            {isStreaming && <span className="ap-cursor" />}
          </p>
        )}
      </div>

      {/* ── Summary callout ────────────────────────────────────── */}
      {summary && phase === 'done' && (
        <div className={`anic-callout anic-callout--${variant}`}>
          <span className="anic-callout-badge">{meta.badge}</span>
          <span>{summary}</span>
        </div>
      )}
    </div>
  );
}
