import { IconBadge } from '../common/IconBadge';
import './DocItem.css';

export function DocItem({ icon, name, sub, actionLabel, actionPrimary, onAction }) {
  return (
    <div className="doc-item">
      {typeof icon === 'string' ? (
        <IconBadge name={icon} iconSize={18} />
      ) : (
        <IconBadge iconSize={18}>{icon}</IconBadge>
      )}
      <div className="doc-info">
        <div className="doc-name">{name}</div>
        <div className="doc-sub">{sub}</div>
      </div>
      <div className="doc-action">
        <button
          className={actionPrimary ? 'ob-btn' : ''}
          onClick={onAction}
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
}
