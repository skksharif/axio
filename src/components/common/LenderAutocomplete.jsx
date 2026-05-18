import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { LENDER_NAMES } from '../../data/lenderNames';
import './LenderAutocomplete.css';

export function LenderAutocomplete({ value = '', onChange, placeholder = 'e.g. CBA' }) {
  const [open, setOpen]         = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const wrapRef     = useRef(null);
  const listRef     = useRef(null);
  const activeRef   = useRef(null);

  const filtered = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q) return [];
    return LENDER_NAMES.filter(l => l.toLowerCase().startsWith(q));
  }, [value]);

  const showDropdown = open && value.trim().length > 0;

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
        setActiveIdx(-1);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Scroll active item into view
  useEffect(() => {
    if (activeRef.current && listRef.current) {
      activeRef.current.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIdx]);

  const select = useCallback((name) => {
    onChange(name);
    setOpen(false);
    setActiveIdx(-1);
  }, [onChange]);

  const handleChange = (e) => {
    onChange(e.target.value);
    setOpen(true);
    setActiveIdx(-1);
  };

  const handleFocus = () => {
    if (value.trim()) setOpen(true);
  };

  const handleKeyDown = (e) => {
    if (!showDropdown) return;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIdx(i => Math.min(i + 1, filtered.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIdx(i => Math.max(i - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIdx >= 0 && filtered[activeIdx]) select(filtered[activeIdx]);
        break;
      case 'Escape':
        setOpen(false);
        setActiveIdx(-1);
        break;
    }
  };

  return (
    <div className="la-wrap" ref={wrapRef}>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck="false"
      />

      {showDropdown && (
        <div className="la-dropdown" ref={listRef} role="listbox">
          {filtered.length === 0 ? (
            <div className="la-empty">No matching lenders found</div>
          ) : (
            filtered.map((name, i) => (
              <div
                key={name}
                ref={i === activeIdx ? activeRef : undefined}
                className={`la-item${i === activeIdx ? ' la-active' : ''}`}
                role="option"
                aria-selected={i === activeIdx}
                onMouseDown={(e) => { e.preventDefault(); select(name); }}
                onMouseEnter={() => setActiveIdx(i)}
              >
                {name}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
