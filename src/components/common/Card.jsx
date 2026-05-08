import { Icon } from './Icon';
import './Card.css';

export function Card({ children, className = '', style }) {
  return (
    <div className={`card ${className}`} style={style}>
      {children}
    </div>
  );
}

export function CardTitle({ icon, children }) {
  return (
    <div className="card-title">
      {icon && (
        <div className="card-icon">
          <Icon name={icon} size={18} />
        </div>
      )}
      {children}
    </div>
  );
}
