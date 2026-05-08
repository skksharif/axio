import { useMemo } from 'react';
import { Check } from 'lucide-react';
import { Icon } from '../common/Icon';
import { useApp } from '../../context/AppContext';
import { SCREENS, TRUST_SIDEBAR } from '../../constants/screens';
import './Sidebar.css';

export function Sidebar({ open, onClose }) {
  const { state, goTo } = useApp();
  const { currentScreen, completedScreens } = state;

  const pct = ((currentScreen + 1) / SCREENS.length) * 100;

  const groups = useMemo(() => {
    const result = [];
    let lastGroup = '';
    SCREENS.forEach((s, i) => {
      if (s.group !== lastGroup) {
        result.push({ type: 'group', label: s.group });
        lastGroup = s.group;
      }
      const isActive = i === currentScreen;
      const isCompleted = completedScreens.includes(i);
      const isLocked = i > currentScreen && !isCompleted;
      result.push({ type: 'item', screen: s, index: i, isActive, isCompleted, isLocked });
    });
    return result;
  }, [currentScreen, completedScreens]);

  function handleNavClick(item) {
    if (!item.isLocked) {
      goTo(item.index);
      onClose?.();
    }
  }

  return (
    <>
      {open && <div className="sidebar-overlay" onClick={onClose} aria-hidden="true" />}

      <div className={`sidebar ${open ? 'mobile-open' : ''}`} role="navigation" aria-label="Journey navigation">
        <div className="sidebar-brand">
          <div className="brand-logo">
            <div className="brand-icon">Ax</div>
            <div className="brand-name">Axio Finance</div>
          </div>
          <div className="brand-tag">Consumer Quote Journey · Finance for the new generation</div>
        </div>

        <div className="sidebar-progress">
          <div className="progress-label">
            <span>Journey progress</span>
            <span>{currentScreen + 1} / {SCREENS.length}</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${pct.toFixed(1)}%` }} />
          </div>
        </div>

        <nav className="nav-list">
          {groups.map((item, idx) =>
            item.type === 'group' ? (
              <div key={`group-${idx}`} className="nav-group-label">{item.label}</div>
            ) : (
              <div
                key={item.index}
                className={`nav-item${item.isActive ? ' active' : ''}${item.isCompleted ? ' completed' : ''}${item.isLocked ? ' locked' : ''}`}
                onClick={() => handleNavClick(item)}
                role="button"
                tabIndex={item.isLocked ? -1 : 0}
                onKeyDown={e => e.key === 'Enter' && handleNavClick(item)}
              >
                <div className="nav-num">
                  {item.isCompleted ? <Check size={11} strokeWidth={2.5} /> : item.index + 1}
                </div>
                <span className="nav-label">{item.screen.label}</span>
                <span className="nav-dot" />
              </div>
            )
          )}
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
