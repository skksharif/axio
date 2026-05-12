import { useState } from 'react';
import './Stepper.css';

export function Stepper({ value, onDecrement, onIncrement, onChange }) {
  const [draft, setDraft] = useState(null);

  const commit = (raw) => {
    const n = parseInt(raw ?? '', 10);
    setDraft(null);
    onChange?.(isNaN(n) || n < 0 ? 0 : n);
  };

  const handleChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setDraft(raw);
    const n = parseInt(raw, 10);
    if (!isNaN(n) && n >= 0) onChange?.(n);
  };

  const handleDecrement = () => { setDraft(null); onDecrement?.(); };
  const handleIncrement = () => { setDraft(null); onIncrement?.(); };

  return (
    <div className="stepper">
      <button className="st-btn" onClick={handleDecrement}>−</button>
      {onChange ? (
        <input
          className="st-input"
          inputMode="numeric"
          value={draft !== null ? draft : `$${(value || 0).toLocaleString()}`}
          onChange={handleChange}
          onFocus={(e) => { setDraft(String(value || 0)); e.target.select(); }}
          onBlur={() => commit(draft)}
          onKeyDown={(e) => e.key === 'Enter' && commit(draft)}
        />
      ) : (
        <span className="st-val">{`$${(value || 0).toLocaleString()}`}</span>
      )}
      <button className="st-btn" onClick={handleIncrement}>+</button>
    </div>
  );
}
