import { CircleDot } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SCREENS } from '../../constants/screens';
import { getInitials } from '../../utils/format';
import './TopBar.css';

export function TopBar({ onMenuClick }) {
  const { state } = useApp();
  const { currentScreen, firstName, lastName } = state;
  const screen = SCREENS[currentScreen];
  const initials = getInitials(firstName, lastName);

  return (
    <div className="topbar">
      <div className="topbar-left">
        <button className="topbar-hamburger" onClick={onMenuClick} aria-label="Open navigation">
          <span /><span /><span />
        </button>
        <span className="topbar-step">Step {currentScreen + 1} of {SCREENS.length}</span>
        <span className="topbar-divider">·</span>
        <span className="topbar-title">{screen?.label}</span>
      </div>
      <div className="topbar-right">
        <span className="save-indicator">
          <CircleDot size={8} />
          Progress saved
        </span>
        <div className="topbar-avatar">{initials}</div>
      </div>
    </div>
  );
}
