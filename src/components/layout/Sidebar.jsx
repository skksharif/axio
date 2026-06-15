import { Fragment, useMemo, useRef, useEffect } from 'react';
import logo from '../../assets/logo.png';
import { Check } from 'lucide-react';
import { Icon } from '../common/Icon';
import { useApp } from '../../context/AppContext';
import { SCREENS, TRUST_SIDEBAR } from '../../constants/screens';
import './Sidebar.css';

export function Sidebar({ open, onClose }) {
  const { state, goTo } = useApp();
  const { currentScreen, completedScreens } = state;

  const pct = ((currentScreen + 1) / SCREENS.length) * 100;

  const navListRef  = useRef(null);
  const activeItemRef = useRef(null);

  // Auto-scroll the nav-list so the active item stays comfortably in view.
  // Fires on every screen change AND when the mobile sidebar is opened.
  useEffect(() => {
    const el   = activeItemRef.current;
    const list = navListRef.current;
    if (!el || !list) return;

    // Small delay lets React flush the DOM and framer-motion settle before
    // we read getBoundingClientRect, preventing a one-frame stale read.
    const id = setTimeout(() => {
      const elRect   = el.getBoundingClientRect();
      const listRect = list.getBoundingClientRect();
      const listH    = list.clientHeight;
      const elH      = el.offsetHeight;
      const buffer   = 56; // px of breathing room at top & bottom

      const topOk = elRect.top    >= listRect.top    + buffer;
      const botOk = elRect.bottom <= listRect.bottom - buffer;

      if (!topOk || !botOk) {
        // Center the element within the visible list area.
        const currentOffset = elRect.top - listRect.top;         // visual px from list top
        const idealOffset   = (listH - elH) / 2;                 // where we want it
        const delta         = currentOffset - idealOffset;
        list.scrollTo({
          top: Math.max(0, list.scrollTop + delta),
          behavior: 'smooth',
        });
      }
    }, 60);

    return () => clearTimeout(id);
  }, [currentScreen, open]);

  const groups = useMemo(() => {
    const result = [];
    SCREENS.forEach((s, i) => {
      const isActive    = i === currentScreen;
      const isCompleted = completedScreens.includes(i);
      const isLocked    = i > currentScreen && !isCompleted;
      const item        = { screen: s, index: i, isActive, isCompleted, isLocked };
      const last        = result[result.length - 1];
      if (!last || last.label !== s.group) {
        result.push({ label: s.group, items: [item] });
      } else {
        last.items.push(item);
      }
    });
    return result;
  }, [currentScreen, completedScreens]);

  const handleNavClick = (item) => {
    if (!item.isLocked) {
      goTo(item.index);
      onClose?.();
    }
  };

  return (
    <>
      {open && <div className="sidebar-overlay" onClick={onClose} aria-hidden="true" />}

      <div className={`sidebar ${open ? 'mobile-open' : ''}`} role="navigation" aria-label="Journey navigation">

        <div className="sidebar-brand">
          <div className="brand-logo">
            <img src={logo} alt="Lumio Finance" className="brand-icon-img" />
            <div className="brand-text">
              <div className="brand-name">Lumio Finance</div>
              <div className="brand-ai-badge">
                <span className="brand-ai-dot" />
                AI-guided
              </div>
            </div>
          </div>
          <div className="brand-tag">Consumer Quote Journey · Finance for the new generation</div>
        </div>

        <div className="sidebar-progress">
          <div className="sp-head">
            <span className="sp-eyebrow">Journey Progress</span>
            <span className="sp-pct">{Math.round(pct)}%</span>
          </div>

          <div className="sp-counter">
            <div className="sp-counter-main">
              <span className="sp-num">{currentScreen + 1}</span>
              <span className="sp-sep">/</span>
              <span className="sp-total">{SCREENS.length}</span>
            </div>
            <span className="sp-unit">steps completed</span>
          </div>

          <div className="sp-track-wrap">
            <div className="sp-track">
              <div className="sp-fill" style={{ width: `${pct.toFixed(1)}%` }} />
            </div>
            <div className="sp-mark" style={{ left: '25%' }} />
            <div className="sp-mark" style={{ left: '50%' }} />
            <div className="sp-mark" style={{ left: '75%' }} />
          </div>
        </div>

        <nav className="nav-list" ref={navListRef}>
          {groups.map((group, gi) => (
            <div key={gi} className="nav-group">
              <div className="nav-group-header">
                <span className="nav-group-label-text">{group.label}</span>
                <span className="nav-group-rule" />
              </div>

              <div className="nav-group-flow">
                {group.items.map((item, ii) => (
                  <Fragment key={item.index}>
                    <div
                      ref={item.isActive ? activeItemRef : undefined}
                      className={`nav-item${item.isActive ? ' active' : ''}${item.isCompleted ? ' completed' : ''}${item.isLocked ? ' locked' : ''}`}
                      onClick={() => handleNavClick(item)}
                      role="button"
                      tabIndex={item.isLocked ? -1 : 0}
                      onKeyDown={e => e.key === 'Enter' && handleNavClick(item)}
                      aria-current={item.isActive ? 'step' : undefined}
                    >
                      <div className="nav-track">
                        <div className="nav-ind">
                          {item.isCompleted
                            ? <Check size={10} strokeWidth={2.8} />
                            : <span>{item.index + 1}</span>}
                        </div>
                      </div>
                      <span className="nav-label">{item.screen.label}</span>
                      <span className="nav-dot" />
                    </div>

                    {ii < group.items.length - 1 && (
                      <div
                        className={`nav-seg${item.isCompleted ? ' seg-done' : item.isActive ? ' seg-active' : ''}`}
                        aria-hidden="true"
                      />
                    )}
                  </Fragment>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="sidebar-trust">
          {TRUST_SIDEBAR.map((t, i) => (
            <div key={i} className="trust-item">
              <span className="trust-icon"><Icon name={t.icon} size={14} /></span>
              {t.text}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
