import { useState } from 'react';
import './RangeSlider.css';

export function RangeSlider({ label, value, displayValue, min, max, step, onChange, minLabel, maxLabel, accentColor, prefix }) {
  const [draft, setDraft] = useState(null);

  const commit = (raw) => {
    const n = parseInt(raw ?? '', 10);
    if (isNaN(n)) { setDraft(null); return; }
    const snapped = Math.round(Math.min(max, Math.max(min, n)) / step) * step;
    onChange(snapped);
    setDraft(null);
  };

  const handleChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setDraft(raw);
    const n = parseInt(raw, 10);
    if (!isNaN(n) && n >= min && n <= max) {
      onChange(Math.round(n / step) * step);
    }
  };

  const hasSideInput = prefix !== undefined;

  return (
    <div className="range-wrap">
      <div className="range-header">
        <span className="range-label">{label}</span>
        {!hasSideInput && (
          <span className="range-val">{displayValue}</span>
        )}
      </div>

      <div className={hasSideInput ? 'range-body-row' : undefined}>
        <div className={hasSideInput ? 'range-track-wrap' : undefined}>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={e => onChange(Number(e.target.value))}
            style={accentColor ? { accentColor } : undefined}
          />
          {(minLabel || maxLabel) && (
            <div className="range-minmax">
              <span>{minLabel}</span>
              <span>{maxLabel}</span>
            </div>
          )}
        </div>

        {hasSideInput && (
          <div className="range-side-input">
            <div className="range-field">
              <span className="range-field-prefix">{prefix}</span>
              <input
                className="range-field-input"
                inputMode="numeric"
                placeholder="0"
                value={draft ?? value.toLocaleString()}
                onChange={handleChange}
                onFocus={e => { setDraft(String(value)); e.target.select(); }}
                onBlur={() => commit(draft)}
                onKeyDown={e => e.key === 'Enter' && commit(draft)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
