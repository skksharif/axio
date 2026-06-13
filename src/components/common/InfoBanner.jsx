import { IconBadge } from './IconBadge';
import './InfoBanner.css';

const VARIANT_BADGE_CLASS = {
  blue: 'icon-badge--accent',
  green: 'icon-badge--status-green',
  yellow: 'icon-badge--status-yellow',
  red: 'icon-badge--status-red',
};

export function InfoBanner({ icon, children, variant = 'blue', style }) {
  const badgeClass = VARIANT_BADGE_CLASS[variant] ?? 'icon-badge--muted';

  return (
    <div className={`info-banner ${variant}`} style={style}>
      {icon && (
        <IconBadge
          name={icon}
          size="sm"
          iconSize={15}
          className={`info-banner-icon ${badgeClass}`}
        />
      )}
      <span>{children}</span>
    </div>
  );
}
