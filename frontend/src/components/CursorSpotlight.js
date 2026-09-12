/** A small, card-local hover light; no idle render loop or touch tracking. */
export class CursorSpotlight {
  constructor(root) {
    this.events = new AbortController();
    this.pointer = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 760px)');
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.items = [...root.querySelectorAll('.project-scene, .archive-project')].map(element => {
      const light = document.createElement('span');
      light.className = 'cursor-spotlight-light';
      light.setAttribute('aria-hidden', 'true');
      element.classList.add('cursor-spotlight');
      element.appendChild(light);
      return { element, light, frame: null };
    });
    const on = (target, name, fn, extra = {}) => target.addEventListener(name, fn, { ...extra, signal: this.events.signal });
    for (const item of this.items) {
      const move = event => {
        if (event.pointerType !== 'mouse' || !this.enabled()) return;
        item.x = event.clientX; item.y = event.clientY;
        if (item.frame !== null) return;
        item.frame = requestAnimationFrame(() => {
          item.frame = null;
          if (!this.enabled()) return;
          const box = item.element.getBoundingClientRect();
          item.light.style.setProperty('--light-x', `${Math.max(0, Math.min(box.width, item.x - box.left))}px`);
          item.light.style.setProperty('--light-y', `${Math.max(0, Math.min(box.height, item.y - box.top))}px`);
          item.element.classList.add('spotlight-active');
        });
      };
      on(item.element, 'pointerenter', move, { passive: true });
      on(item.element, 'pointermove', move, { passive: true });
      on(item.element, 'pointerleave', () => this.clear(item));
      on(item.element, 'pointercancel', () => this.clear(item));
    }
    const reset = () => this.items.forEach(item => this.clear(item));
    on(this.pointer, 'change', reset); on(this.reduced, 'change', reset);
    on(window, 'blur', reset); on(window, 'scroll', reset, { passive: true });
    on(document, 'visibilitychange', reset);
    this.mode = new MutationObserver(reset);
    this.mode.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }
  enabled() {
    try { if (localStorage.getItem('portfolio-space-motion') === 'off') return false; } catch { /* Storage can be unavailable in private browsing. */ }
    return this.pointer.matches && !this.reduced.matches && !document.hidden &&
      !document.body.classList.contains('space-reading') && !document.querySelector('dialog[open]');
  }
  clear(item) {
    if (item.frame !== null) cancelAnimationFrame(item.frame);
    item.frame = null;
    item.element.classList.remove('spotlight-active');
  }
  dispose() {
    this.events.abort(); this.mode.disconnect();
    this.items.forEach(item => { this.clear(item); item.light.remove(); item.element.classList.remove('cursor-spotlight'); });
  }
}
