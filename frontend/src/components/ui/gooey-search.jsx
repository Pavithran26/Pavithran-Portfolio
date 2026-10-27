import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

function detectUnsupportedBrowser() {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent.toLowerCase();
  const isSafari =
    ua.includes('safari') &&
    !ua.includes('chrome') &&
    !ua.includes('chromium') &&
    !ua.includes('android') &&
    !ua.includes('firefox');
  return isSafari || ua.includes('crios');
}

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = React.useState(value);
  React.useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const buttonMotionVariants = {
  step1: { x: 0, width: 100 },
  step2: { x: -30, width: 180 },
};

const iconMotionVariants = {
  hidden: { x: -50, opacity: 0 },
  visible: { x: 16, opacity: 1 },
};

const getResultVariants = (index, unsupported) => ({
  initial: { y: 0, scale: 0.3, filter: unsupported ? 'none' : 'blur(10px)' },
  animate: { y: (index + 1) * 50, scale: 1, filter: 'blur(0px)' },
  exit: { y: unsupported ? 0 : -4, scale: 0.8 },
});

const getResultTransition = index => ({
  duration: 0.75,
  delay: index * 0.12,
  type: 'spring',
  bounce: 0.35,
  filter: { ease: 'easeInOut' },
});

function SearchSvgIcon({ isUnsupported }) {
  return (
    <motion.svg
      initial={{ opacity: 0, scale: 0.8, x: -4, filter: isUnsupported ? 'none' : 'blur(5px)' }}
      animate={{ opacity: 1, scale: 1, x: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 0.8, x: -4, filter: isUnsupported ? 'none' : 'blur(5px)' }}
      transition={{ delay: 0.1, duration: 1, type: 'spring', bounce: 0.15 }}
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6588 12.8536 12.8536C12.6588 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="currentColor"
      />
    </motion.svg>
  );
}

function LoadingSvgIcon() {
  const lines = [
    [128, 32, 128, 64],
    [195.88, 60.12, 173.25, 82.75],
    [224, 128, 192, 128],
    [195.88, 195.88, 173.25, 173.25],
    [128, 224, 128, 192],
    [60.12, 195.88, 82.75, 173.25],
    [32, 128, 64, 128],
    [60.12, 60.12, 82.75, 82.75],
  ];
  return (
    <svg
      className="gooey-search-loading"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      aria-label="Loading"
      role="status"
      style={{ width: 20, height: 20 }}
    >
      <rect width="256" height="256" fill="none" />
      {lines.map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={16} />
      ))}
    </svg>
  );
}

function InfoSvgIcon({ index }) {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ delay: index * 0.12 + 0.3 }}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 15 15"
      fill="none"
      aria-hidden="true"
      style={{ width: 18, height: 18, position: 'relative', top: 2, flexShrink: 0 }}
    >
      <path
        d="M7.49991 0.876892C3.84222 0.876892 0.877075 3.84204 0.877075 7.49972C0.877075 11.1574 3.84222 14.1226 7.49991 14.1226C11.1576 14.1226 14.1227 11.1574 14.1227 7.49972C14.1227 3.84204 11.1576 0.876892 7.49991 0.876892ZM1.82707 7.49972C1.82707 4.36671 4.36689 1.82689 7.49991 1.82689C10.6329 1.82689 13.1727 4.36671 13.1727 7.49972C13.1727 10.6327 10.6329 13.1726 7.49991 13.1726C4.36689 13.1726 1.82707 10.6327 1.82707 7.49972ZM8.24992 4.49999C8.24992 4.9142 7.9142 5.24999 7.49992 5.24999C7.08571 5.24999 6.74999 4.9142 6.74999 4.49999C6.74999 4.08578 7.08571 3.74999 7.49992 3.74999C7.9142 3.74999 8.24992 4.08578 8.24992 4.49999ZM6.00003 5.99999H6.50003H7.50003C7.77618 5.99999 8.00003 6.22384 8.00003 6.49999V9.99999H8.50003H9.00003V11H8.50003H7.50003H6.50003H6.00003V9.99999H6.50003H7.00003V6.99999H6.50003H6.00003V5.99999Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </motion.svg>
  );
}

/** VengeanceUI GooeySearch motion, adapted to the portfolio's emerald theme and technology catalogue. */
export function GooeySearch({
  items = [],
  onSearch,
  placeholder = 'Type to search...',
  buttonLabel = 'Search',
  onSelect,
  className = '',
  debounceMs = 500,
  maxResults = 4,
}) {
  const uid = React.useId().replace(/:/g, '_');
  const filterId = `gooey-search-${uid}`;
  const inputRef = React.useRef(null);
  const [step, setStep] = React.useState(1);
  const [searchText, setSearchText] = React.useState('');
  const [results, setResults] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const isUnsupported = React.useMemo(() => detectUnsupportedBrowser(), []);
  const debouncedQuery = useDebounce(searchText, debounceMs);

  React.useEffect(() => {
    if (step === 2) inputRef.current?.focus();
  }, [step]);

  React.useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!debouncedQuery.trim()) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        let data;
        if (onSearch) {
          data = await onSearch(debouncedQuery.trim());
        } else {
          await new Promise(resolve => setTimeout(resolve, 300));
          data = items.filter(item => item.toLowerCase().includes(debouncedQuery.trim().toLowerCase()));
        }
        if (!cancelled) setResults((Array.isArray(data) ? data : []).slice(0, maxResults));
      } catch {
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    run();
    return () => { cancelled = true; };
  }, [debouncedQuery, items, onSearch, maxResults]);

  const buttonPadding = isUnsupported ? '5px 10px' : '10px 20px';
  const resultPadding = isUnsupported ? '7.5px 10px' : '12.5px 20px';

  return (
    <div
      className={`gooey-search-root ${className}`.trim()}
      style={{
        '--gooey-foreground': '#c2f970',
        '--gooey-background': '#07110a',
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: '100%',
        color: 'var(--gooey-foreground)',
      }}
    >
      <style>{`
        .gooey-search-loading { animation: gooeySearchSpin .5s linear infinite; transform-origin: center center; }
        @keyframes gooeySearchSpin { to { transform: rotate(180deg); } }
        .gooey-search-input::placeholder { color: var(--gooey-background); opacity: .56; }
        .gooey-search-root, .gooey-search-root * { box-sizing: border-box; }
        .gooey-search-root button { -webkit-tap-highlight-color: transparent; }
        .gooey-search-input { font: 500 14px/1.3 var(--font-body, Arial, sans-serif); }
      `}</style>

      <svg aria-hidden="true" focusable="false" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
        <defs>
          <filter id={filterId}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 18 -15" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <div
        className="gooey-search-motion-stage"
        style={{
          filter: isUnsupported ? 'none' : `url(#${filterId})`,
          cursor: 'pointer',
          maxWidth: '100%',
          position: 'relative',
          minHeight: 46,
        }}
      >
        <AnimatePresence mode="popLayout">
          <motion.div
            key="results-wrapper"
            role="listbox"
            aria-label="Search results"
            style={{ position: 'relative', zIndex: -1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ delay: isUnsupported ? 0.5 : 1.25, duration: 0.5 }}
          >
            <AnimatePresence mode="popLayout">
              {results.map((item, index) => (
                <motion.button
                  key={item}
                  type="button"
                  role="option"
                  aria-selected="false"
                  onClick={() => onSelect?.(item)}
                  onKeyDown={event => event.key === 'Enter' && onSelect?.(item)}
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                  variants={getResultVariants(index, isUnsupported)}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={getResultTransition(index)}
                  style={{
                    appearance: 'none',
                    border: 0,
                    textAlign: 'left',
                    backgroundColor: 'var(--gooey-foreground)',
                    borderRadius: 40,
                    padding: resultPadding,
                    width: '100%',
                    maxWidth: 280,
                    color: 'var(--gooey-background)',
                    position: 'absolute',
                    left: isUnsupported ? 0 : -30,
                    fontSize: 14,
                    cursor: 'pointer',
                    whiteSpace: 'normal',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <InfoSvgIcon index={index} />
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.12 + 0.3 }}
                      style={{ position: 'relative', top: -0.35 }}
                    >
                      {item}
                    </motion.span>
                  </span>
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>

        <motion.button
          type="button"
          variants={buttonMotionVariants}
          initial="step1"
          animate={step === 1 ? 'step1' : 'step2'}
          transition={{ duration: 0.75, type: 'spring', bounce: 0.15 }}
          onClick={() => step === 1 && setStep(2)}
          whileHover={{ scale: step === 2 ? 1 : 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={step === 1 ? 'Open technology search' : 'Technology search input'}
          style={{
            appearance: 'none',
            position: 'relative',
            zIndex: 1,
            display: 'block',
            flexShrink: 0,
            minWidth: 0,
            height: 46,
            backgroundColor: 'var(--gooey-foreground)',
            color: 'var(--gooey-background)',
            cursor: 'pointer',
            letterSpacing: -0.5,
            outline: 'none',
            border: '1px solid rgba(194,249,112,.65)',
            borderRadius: 9999,
            padding: buttonPadding,
            boxShadow: '0 8px 24px rgba(0,0,0,.14)',
            textAlign: 'center',
          }}
        >
          {step === 1 ? (
            <span style={{ pointerEvents: 'none', textAlign: 'center', position: 'relative', left: 4, color: 'var(--gooey-background)', opacity: 0.78, fontSize: 14, display: 'block', fontWeight: 700 }}>
              {buttonLabel}
            </span>
          ) : (
            <input
              ref={inputRef}
              type="text"
              className="gooey-search-input"
              placeholder={placeholder}
              aria-label="Search technologies"
              value={searchText}
              onChange={event => setSearchText(event.target.value)}
              onClick={event => event.stopPropagation()}
              onKeyDown={event => {
                if (event.key === 'Escape') {
                  setStep(1);
                  setSearchText('');
                  setResults([]);
                }
                if (event.key === 'Enter' && results[0]) {
                  event.preventDefault();
                  onSelect?.(results[0]);
                }
              }}
              style={{
                width: '100%',
                minWidth: 0,
                height: 24,
                backgroundColor: 'transparent',
                outline: 'none',
                border: 'none',
                padding: 0,
                color: 'var(--gooey-background)',
                fontSize: 14,
              }}
            />
          )}
        </motion.button>

        <AnimatePresence mode="wait">
          {step === 2 && (
            <motion.div
              key="icon-bubble"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={iconMotionVariants}
              transition={{ delay: 0.1, duration: 0.85, type: 'spring', bounce: 0.15 }}
              style={{
                position: 'absolute',
                zIndex: 2,
                backgroundColor: 'var(--gooey-foreground)',
                width: isUnsupported ? 36 : 46,
                height: isUnsupported ? 36 : 46,
                right: -5,
                top: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 9999,
                color: 'var(--gooey-background)',
                pointerEvents: 'none',
                boxShadow: '0 3px 14px rgba(0,0,0,.14)',
              }}
            >
              {isLoading ? <LoadingSvgIcon /> : <SearchSvgIcon isUnsupported={isUnsupported} />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default GooeySearch;
