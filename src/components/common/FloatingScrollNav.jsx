import { useCallback, useEffect, useState } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import './FloatingScrollNav.css';

const MOBILE_QUERY = '(max-width: 900px)';
const BOTTOM_THRESHOLD = 160;

export function FloatingScrollNav({ hidden = false }) {
  const [mode, setMode] = useState(null);

  const updateMode = useCallback(() => {
    if (hidden || !window.matchMedia(MOBILE_QUERY).matches) {
      setMode(null);
      return;
    }

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const viewportHeight = window.innerHeight;
    const pageHeight = document.documentElement.scrollHeight;
    const hasScrollableContent = pageHeight > viewportHeight + 80;

    if (!hasScrollableContent) {
      setMode(null);
      return;
    }

    const distanceFromBottom = pageHeight - (scrollTop + viewportHeight);
    setMode(distanceFromBottom <= BOTTOM_THRESHOLD ? 'top' : 'bottom');
  }, [hidden]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(updateMode);
    window.addEventListener('scroll', updateMode, { passive: true });
    window.addEventListener('resize', updateMode);

    const observer = new ResizeObserver(updateMode);
    observer.observe(document.documentElement);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', updateMode);
      window.removeEventListener('resize', updateMode);
      observer.disconnect();
    };
  }, [updateMode]);

  const handleClick = () => {
    window.scrollTo({
      top: mode === 'top' ? 0 : document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  if (!mode) return null;

  const isTop = mode === 'top';

  return (
    <button
      type="button"
      className="floating-scroll-nav"
      onClick={handleClick}
      aria-label={isTop ? 'Back to top' : 'Go to bottom'}
      title={isTop ? 'Back to top' : 'Go to bottom'}
    >
      {isTop ? <ArrowUp size={18} /> : <ArrowDown size={18} />}
    </button>
  );
}
