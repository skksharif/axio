import { useState } from 'react';
import { ChevronRight, Pencil } from 'lucide-react';
import { Icon } from '../common/Icon';
import { IconBadge } from '../common/IconBadge';
import './SnapCard.css';

export function SnapCard({ id, icon, title, sub, fields, onEdit }) {
  const [open, setOpen] = useState(false);

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit?.();
  };

  return (
    <div className="snap-card">
      <div className="snap-head" onClick={() => setOpen(p => !p)}>
        <div className="snap-head-left">
          <IconBadge name={icon} iconSize={18} />
          <div>
            <div className="snap-h-title">{title}</div>
            <div className="snap-h-sub">{sub}</div>
          </div>
        </div>
        <div className="snap-head-right">
          <button className="edit-btn" onClick={handleEdit} title={`Edit ${title}`}>
            <Pencil size={10} strokeWidth={2.5} />
            Edit
          </button>
          <span className="badge badge-green">Complete</span>
          <span className={`snap-chev ${open ? 'open' : ''}`}>
            <ChevronRight size={16} />
          </span>
        </div>
      </div>
      {open && (
        <div className="snap-body open">
          <div className="snap-grid">
            {fields.map(([key, val, color], i) => (
              <div key={i} className="sf">
                <div className="sf-lbl">{key}</div>
                <div className={`sf-val ${color || ''}`}>{val}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
