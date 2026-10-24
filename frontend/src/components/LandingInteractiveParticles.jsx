import { useEffect, useState } from 'react';
import InteractiveParticles from './ui/interactive-particles.tsx';

const escapeXml = (value) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');

function measureTextElement(element) {
  if (!element) return null;
  const range = document.createRange();
  range.selectNodeContents(element);
  const bounds = range.getBoundingClientRect();
  range.detach?.();
  if (!bounds.width || !bounds.height) return null;

  const style = window.getComputedStyle(element);
  return {
    text: element.textContent.trim().replace(/\s+/g, ' '),
    x: bounds.left + bounds.width / 2,
    y: bounds.bottom - Math.max(2, parseFloat(style.fontSize) * 0.12),
    width: bounds.width,
    fontSize: parseFloat(style.fontSize) || 24,
    fontWeight: style.fontWeight || '500',
    fontFamily: style.fontFamily || 'sans-serif',
    fontStyle: style.fontStyle || 'normal',
  };
}

/**
 * Build the particle mask from the actual visible title and role coordinates.
 * This means the effect follows the existing content instead of drawing a
 * second, separately positioned "Pavithran S / FDE" title behind it.
 */
function createTextMask(width, height, heading, role) {
  const text = (item) => item ? `
    <text x="${item.x.toFixed(2)}" y="${item.y.toFixed(2)}"
      text-anchor="middle"
      font-size="${item.fontSize.toFixed(2)}"
      font-weight="${escapeXml(item.fontWeight)}"
      font-family="${escapeXml(item.fontFamily)}"
      font-style="${escapeXml(item.fontStyle)}"
      textLength="${item.width.toFixed(2)}"
      lengthAdjust="spacingAndGlyphs"
      fill="#ffffff">${escapeXml(item.text)}</text>` : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="100%" height="100%" fill="#000000"/>
    ${text(heading)}
    ${text(role)}
  </svg>`;
}

/**
 * Cursor-reactive VengeanceUI particles applied to the existing landing title.
 * No image picker or upload interaction is exposed.
 */
export function LandingInteractiveParticles() {
  const [src, setSrc] = useState(null);

  useEffect(() => {
    const choice = document.getElementById('experience-choice');
    const heading = document.getElementById('experience-choice-title');
    const role = document.getElementById('experience-choice-description');
    if (!choice || !heading || !role) return undefined;

    let frame = 0;
    let lastSignature = '';

    const scheduleMaskUpdate = () => {
      if (choice.hidden) return;
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (choice.hidden) return;

        const width = Math.max(1, window.innerWidth || document.documentElement.clientWidth);
        const height = Math.max(1, window.innerHeight || document.documentElement.clientHeight);
        const headingText = measureTextElement(heading);
        const roleText = measureTextElement(role);
        if (!headingText || !roleText) return;

        const signature = JSON.stringify({ width, height, headingText, roleText });
        if (signature === lastSignature) return;
        lastSignature = signature;

        const svg = createTextMask(width, height, headingText, roleText);
        setSrc(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`);
      });
    };

    const observer = new MutationObserver(scheduleMaskUpdate);
    observer.observe(choice, { attributes: true, attributeFilter: ['hidden', 'class'] });

    const resizeObserver = new ResizeObserver(scheduleMaskUpdate);
    resizeObserver.observe(heading);
    resizeObserver.observe(role);
    resizeObserver.observe(choice);
    window.addEventListener('resize', scheduleMaskUpdate, { passive: true });

    // Wait for the actual display font so the particle mask tracks the final glyph bounds.
    document.fonts?.ready?.then(scheduleMaskUpdate).catch(() => {});
    scheduleMaskUpdate();

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('resize', scheduleMaskUpdate);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <InteractiveParticles
      src={src || undefined}
      allowUpload={false}
      background="transparent"
      color="#8cf0b0"
      size={1.25}
      randomness={2.2}
      depth={2.1}
      touchRadius={0.16}
      maxDimension={480}
      threshold={34}
      className="fde-interactive-particles"
    />
  );
}

export default LandingInteractiveParticles;
