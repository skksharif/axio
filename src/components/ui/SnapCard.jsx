import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Icon } from '../common/Icon';
import './SnapCard.css';

export function SnapCard({ id, icon, title, sub, fields }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="snap-card">
      <div className="snap-head" onClick={() => setOpen(p => !p)}>
        <div className="snap-head-left">
          <div className="snap-h-icon"><Icon name={icon} size={18} /></div>
          <div>
            <div className="snap-h-title">{title}</div>
            <div className="snap-h-sub">{sub}</div>
          </div>
        </div>
        <div className="snap-head-right">
          <button className="edit-btn" onClick={e => e.stopPropagation()}>Edit</button>
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
