import { CircleDot, Sun, Moon } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SCREENS } from '../../constants/screens';
import { getInitials } from '../../utils/format';
import { useTheme } from '../../hooks/useTheme';
import './TopBar.css';

export function TopBar({ onMenuClick }) {
  const { state } = useApp();
  const { currentScreen, firstName, lastName } = state;
  const screen = SCREENS[currentScreen];
  const initials = getInitials(firstName, lastName);
  const { theme, toggleTheme } = useTheme();

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
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        >
          {theme === 'dark'
            ? <Sun size={16} strokeWidth={2} />
            : <Moon size={16} strokeWidth={2} />}
        </button>
        <div className="topbar-avatar">{initials}</div>
      </div>
    </div>
  );
}
