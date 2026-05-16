import { useState, useEffect } from 'react';
import { ShieldCheck, Sparkles } from 'lucide-react';
import './AnikaPanel.css';

export function AnikaPanel({ message, thinkingMs = 800 }) {
  const [phase, setPhase] = useState('thinking'); // 'thinking' | 'streaming' | 'done'
  const [displayed, setDisplayed] = useState('');

  // Transition from thinking → streaming
  useEffect(() => {
    const t = setTimeout(() => setPhase('streaming'), thinkingMs);
    return () => clearTimeout(t);
  }, [thinkingMs]);

  // Character-by-character reveal
  useEffect(() => {
    if (phase !== 'streaming') return;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(message.slice(0, i));
      if (i >= message.length) {
        clearInterval(id);
        setPhase('done');
      }
    }, 14);
    return () => clearInterval(id);
  }, [phase, message]);

  const isThinking = phase === 'thinking';
  const isStreaming = phase === 'streaming';

  return (
    <div className="anika-panel">
      <div className="ap-header">
        <div className="ap-avatar-wrap">
          <div className="ap-avatar-ring" />
          <div className="ap-avatar">
            <Sparkles size={16} />
          </div>
        </div>

        <div className="ap-header-body">
          <div className="ap-name">Anika AI</div>
          <div className="ap-status">
            {isThinking ? (
              <>
                <span>Thinking</span>
                <span className="ap-dots">
                  <span className="ap-dot" />
                  <span className="ap-dot" />
                  <span className="ap-dot" />
                </span>
              </>
            ) : (
              <span className="ap-status-done">Ready</span>
            )}
          </div>
        </div>
      </div>

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

      <div className="ap-footer">
        <div className="ap-footer-divider" />
        <div className="ap-footer-trust">
          <ShieldCheck size={11} />
          <span>Soft enquiry only — zero credit file impact.</span>
        </div>
      </div>
    </div>
  );
}
