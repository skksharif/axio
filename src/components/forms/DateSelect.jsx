import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { DayPicker } from 'react-day-picker';
import { CalendarDays, X } from 'lucide-react';
import 'react-day-picker/style.css';
import './DateSelect.css';

const FMT = new Intl.DateTimeFormat('en-AU', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

export function DateSelect({ value = null, onChange, yearRange }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const popupRef = useRef(null);
  const [yrFrom, yrTo] = yearRange ?? [1940, new Date().getFullYear()];
  const midYear = Math.floor((yrFrom + yrTo) / 2);

  const openPicker = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) {
      setPos({ top: rect.bottom + 6, left: rect.left });
    }
    setOpen(true);
  };

  // Flip horizontally if popup would overflow viewport right edge
  useEffect(() => {
    if (!open || !popupRef.current) return;
    const pr = popupRef.current.getBoundingClientRect();
    const overflow = pr.right - (window.innerWidth - 8);
    if (overflow > 0) {
      setPos(p => ({ ...p, left: Math.max(8, p.left - overflow) }));
    }
  }, [open]);

  // Close on outside click or scroll
  useEffect(() => {
    if (!open) return;
    const close = e => {
      if (
        !triggerRef.current?.contains(e.target) &&
        !popupRef.current?.contains(e.target)
      ) setOpen(false);
    };
    const onScroll = () => setOpen(false);
    document.addEventListener('mousedown', close);
    window.addEventListener('scroll', onScroll, { passive: true, capture: true });
    return () => {
      document.removeEventListener('mousedown', close);
      window.removeEventListener('scroll', onScroll, { capture: true });
    };
  }, [open]);

  const handleSelect = d => {
    onChange?.(d ?? null);
    if (d) setOpen(false);
  };

  const handleClear = e => {
    e.stopPropagation();
    onChange?.(null);
  };

  return (
    <div className="dp">
      <button
        type="button"
        ref={triggerRef}
        className={`dp__trigger${value ? ' dp__trigger--set' : ''}`}
        onClick={openPicker}
      >
        <CalendarDays size={15} className="dp__cal-icon" />
        <span className="dp__label">
          {value ? FMT.format(value) : 'Select date'}
        </span>
        {value && (
          <span
            className="dp__clear"
            role="button"
            tabIndex={-1}
            onClick={handleClear}
          >
            <X size={13} />
          </span>
        )}
      </button>

      {open && createPortal(
        <div
          className="dp__popup"
          ref={popupRef}
          style={{ top: pos.top, left: pos.left }}
        >
          <DayPicker
            mode="single"
            selected={value ?? undefined}
            onSelect={handleSelect}
            captionLayout="dropdown"
            startMonth={new Date(yrFrom, 0)}
            endMonth={new Date(yrTo, 11)}
            defaultMonth={value ?? new Date(midYear, 0)}
          />
        </div>,
        document.body
      )}
    </div>
  );
}
