import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const SERVICES = [
  'Engenharia de Software & Sistemas',
  'Páginas Web Corporativas',
  'Otimização de Performance & Cloud',
  'E-Commerce de Alta Performance',
  'Governança, Manutenção & Suporte',
];

// Native <select> options are unstyleable cross-browser (white text on a
// white popup in some browsers/OSes) — this replicates the same field with
// a real <button> + <ul role="listbox">, fully themeable and keyboard
// operable. The list is rendered through a portal into document.body and
// positioned with `fixed` coordinates measured from the button, so it
// isn't clipped by the form card's `overflow:hidden` (needed there for its
// own decorative corner glows).
export default function ServiceSelect({ id, value, onChange }) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() => Math.max(SERVICES.indexOf(value), 0));
  const [coords, setCoords] = useState(null);
  const rootRef = useRef(null);
  const btnRef = useRef(null);
  const listRef = useRef(null);
  const optionRefs = useRef([]);

  const measure = () => {
    const r = btnRef.current?.getBoundingClientRect();
    if (!r) return;
    setCoords({ top: r.bottom + 8, left: r.left, width: r.width });
  };

  useLayoutEffect(() => {
    if (!open) return;
    measure();
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onDocDown = (e) => {
      if (rootRef.current?.contains(e.target)) return;
      if (listRef.current?.contains(e.target)) return;
      setOpen(false);
    };
    const onScrollOrResize = () => measure();
    document.addEventListener('mousedown', onDocDown);
    window.addEventListener('scroll', onScrollOrResize, true);
    window.addEventListener('resize', onScrollOrResize);
    return () => {
      document.removeEventListener('mousedown', onDocDown);
      window.removeEventListener('scroll', onScrollOrResize, true);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [open]);

  useEffect(() => {
    // `coords` (not just `open`) has to be a dependency here: the list only
    // renders (and its <li> refs only exist) once `measure()` has set
    // coordinates, which happens a render cycle after `open` flips true.
    // Depending on `[open, activeIndex]` alone fired this too early, while
    // optionRefs.current was still empty, so focus silently stayed on the
    // button and arrow keys never reached the options.
    if (open && coords && activeIndex >= 0) optionRefs.current[activeIndex]?.focus();
  }, [open, activeIndex, coords]);

  const selectOption = (opt) => {
    onChange(opt);
    setOpen(false);
    btnRef.current?.focus();
  };

  const onBtnKeyDown = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen(true);
      setActiveIndex((i) => (i < 0 ? 0 : i));
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const onOptionKeyDown = (e, i) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(Math.min(i + 1, SERVICES.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(Math.max(i - 1, 0));
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      selectOption(SERVICES[i]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      btnRef.current?.focus();
    } else if (e.key === 'Tab') {
      setOpen(false);
    }
  };

  return (
    <div className="fselect" ref={rootRef} data-open={open}>
      <button
        type="button"
        id={id}
        className="fselect-btn"
        ref={btnRef}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onBtnKeyDown}
      >
        <span className={value ? 'fselect-value' : 'fselect-placeholder'}>
          {value || 'Selecione um serviço'}
        </span>
        <svg className="fselect-chevron" viewBox="0 0 12 8"><path d="M1 1l5 5 5-5" /></svg>
      </button>

      {open && coords && createPortal(
        <ul
          className="fselect-list"
          role="listbox"
          aria-labelledby={id}
          ref={listRef}
          style={{ top: coords.top, left: coords.left, width: coords.width }}
        >
          {SERVICES.map((opt, i) => (
            <li
              key={opt}
              role="option"
              aria-selected={value === opt}
              tabIndex={-1}
              ref={(el) => { optionRefs.current[i] = el; }}
              className={`fselect-option${i === activeIndex ? ' active' : ''}${value === opt ? ' selected' : ''}`}
              onMouseEnter={() => setActiveIndex(i)}
              onClick={() => selectOption(opt)}
              onKeyDown={(e) => onOptionKeyDown(e, i)}
            >
              {opt}
            </li>
          ))}
        </ul>,
        document.body,
      )}

      {/* Keeps the selected value submittable/inspectable the same way a
          native <select> would be, for anything reading the form directly. */}
      <input type="hidden" name="fservice" value={value} readOnly />
    </div>
  );
}
