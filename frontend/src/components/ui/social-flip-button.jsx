import React from 'react';

/**
 * SocialFlipButton
 * Accessible, dependency-free adaptation of the VengeanceUI social flip idea.
 * Each tile flips from an identifying letter to a real platform glyph on hover/focus.
 */
function SocialGlyph({ name }) {
  const common = {
    viewBox: '0 0 24 24',
    width: 19,
    height: 19,
    fill: 'currentColor',
    'aria-hidden': true,
    focusable: 'false',
  };

  switch (name) {
    case 'github':
      return <svg {...common}><path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.1c-3.1.67-3.76-1.32-3.76-1.32-.5-1.28-1.24-1.62-1.24-1.62-1.02-.7.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15 1 .1.75 2.21 3.24 1.67.1-.72.39-1.21.7-1.49-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.44-2.22 1.15-3.01-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.06 1.15a10.6 10.6 0 0 1 5.57 0c2.12-1.44 3.06-1.15 3.06-1.15.61 1.54.23 2.68.11 2.96.72.79 1.15 1.79 1.15 3.01 0 4.29-2.62 5.24-5.11 5.51.4.35.76 1.03.76 2.08v3.09c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z"/></svg>;
    case 'linkedin':
      return <svg {...common}><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V8.99h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.48v6.27ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V8.99h3.56v11.46ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z"/></svg>;
    case 'leetcode':
      return <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m15.5 3-8 8a4.2 4.2 0 0 0 0 6l3 3a4.2 4.2 0 0 0 6 0l2-2"/><path d="m11 7 6 6"/><path d="M8 18h10"/></svg>;
    case 'hackerrank':
      return <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M7 4H4v16h3"/><path d="m10 8 4 4-4 4"/><path d="M17 4h3v16h-3"/></svg>;
    case 'codechef':
      return <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13.5h14l-1.3 6H6.3L5 13.5Z"/><path d="M8 13.5v-3a4 4 0 0 1 8 0v3"/><path d="M3 21h18"/></svg>;
    case 'geeksforgeeks':
      return <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 5h5v5H5zM14 14h5v5h-5z"/><path d="m10 7 4 3 0 4M7 10v4h7M14 17h-4"/></svg>;
    case 'youtube':
      return <svg {...common}><path d="M23.5 6.2a3 3 0 0 0-2.12-2.13C19.51 3.55 12 3.55 12 3.55s-7.51 0-9.38.52A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.12 2.13c1.87.52 9.38.52 9.38.52s7.51 0 9.38-.52a3 3 0 0 0 2.12-2.13A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8ZM9.55 15.56V8.44L15.82 12l-6.27 3.56Z"/></svg>;
    case 'email':
      return <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2.5" y="4.5" width="19" height="15" rx="2"/><path d="m3 6 9 7 9-7"/></svg>;
    default:
      return <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m8 6-6 6 6 6M16 6l6 6-6 6"/></svg>;
  }
}

function SocialFlipNode({ item, index }) {
  const className = 'social-flip-tile';
  const contents = (
    <>
      <span className="social-flip-face social-flip-front" aria-hidden="true">{item.letter}</span>
      <span className="social-flip-face social-flip-back" aria-hidden="true"><SocialGlyph name={item.icon} /></span>
      <span className="social-flip-tooltip" aria-hidden="true">{item.label}</span>
    </>
  );

  return (
    <a
      className={className}
      href={item.href}
      target={item.external ? '_blank' : undefined}
      rel={item.external ? 'noopener noreferrer' : undefined}
      aria-label={item.label}
      title={item.label}
      style={{ '--social-flip-index': index }}
    >
      <span className="social-flip-inner">{contents}</span>
    </a>
  );
}

export default function SocialFlipButton({ items = [], className = '' }) {
  if (!items.length) return null;

  return (
    <nav className={`social-flip-group ${className}`} aria-label="Social and developer profiles">
      {items.map((item, index) => <SocialFlipNode item={item} index={index} key={item.label} />)}
    </nav>
  );
}
