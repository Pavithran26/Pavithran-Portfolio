/**
 * MagneticCards.js
 * Subtle 3D tilt + magnetic hover for project cards and interactive pills.
 * Respects prefers-reduced-motion.
 */
export function initMagneticCards(selector = '.project-destination, .skill-grid article, .reading-tools button, .live-preview-tab') {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduce.matches) return;

  const elements = document.querySelectorAll(selector);
  if (!elements.length) return;

  const maxTilt = 7;
  const maxLift = 6;

  elements.forEach(el => {
    if (el.dataset.magneticBound) return;
    el.dataset.magneticBound = '1';
    el.classList.add('magnetic-card');

    let raf = 0;
    let rect = null;

    const onEnter = () => {
      rect = el.getBoundingClientRect();
      el.classList.add('is-magnetic-active');
    };

    const onMove = (e) => {
      if (e.pointerType === 'touch') return;
      if (!rect) rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const px = (x / rect.width) - 0.5;
      const py = (y / rect.height) - 0.5;

      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rotY = px * maxTilt;
        const rotX = -py * maxTilt;
        el.style.transform = `perspective(900px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(${(-Math.abs(py) * maxLift).toFixed(1)}px)`;
        el.style.setProperty('--mx', `${(px * 50 + 50).toFixed(1)}%`);
        el.style.setProperty('--my', `${(py * 50 + 50).toFixed(1)}%`);
      });
    };

    const onLeave = () => {
      if (raf) cancelAnimationFrame(raf);
      el.style.transform = '';
      el.classList.remove('is-magnetic-active');
      rect = null;
    };

    el.addEventListener('pointerenter', onEnter, { passive: true });
    el.addEventListener('pointermove', onMove, { passive: true });
    el.addEventListener('pointerleave', onLeave, { passive: true });
  });
}
