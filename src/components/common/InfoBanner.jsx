import { Icon } from './Icon';
import './InfoBanner.css';

export function InfoBanner({ icon, children, variant = 'blue', style }) {
  return (
    <div className={`info-banner ${variant}`} style={style}>
      {icon && <span className="icon"><Icon name={icon} size={15} /></span>}
      <span>{children}</span>
    </div>
  );
}
