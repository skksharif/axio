import { IconBadge } from './IconBadge';
import './Card.css';

export function Card({ children, className = '', style }) {
  return (
    <div className={`card ${className}`} style={style}>
      {children}
    </div>
  );
}

export function CardTitle({ icon, children, iconWrapperClass = '', iconSize = 18 }) {
  return (
    <div className="card-title">
      {icon && (
        <IconBadge name={icon} iconSize={iconSize} />
      )}
      {children}
    </div>
  );
}
