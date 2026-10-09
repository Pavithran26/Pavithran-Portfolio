/**
 * ScrollDepthController.js
 * Implements Cinematic 3D Depth & Scroll-Driven Erase / Dissolve:
 * - Elements materialize from space with soft blur-to-sharp focus as they enter the screen.
 * - In the viewing sweet-spot, text and cards are 100% bold, luminous, and pin-sharp.
 * - As elements scroll past towards the top, they smoothly "erase" / dissolve into the background
 *   with subtle depth recession, soft focus falloff, and fading opacity.
 * - Optimized with GPU transform caching and direct Lenis virtual scroll driver.
 */

export class ScrollDepthController {
  constructor(options = {}) {
    this.lenis = options.lenis || null;
    this.events = new AbortController();
    this.elements = new Set();
    this.visibleElements = new Set();
    this.rafId = null;
    this.observer = null;
    this.scrollY = 0;
    this.ticking = false;

    this.init();
  }

  init() {
    // 1. Gather all primary content cards, headers, and text sections
    const selectors = [
      '.intro-identity',
      '.project-destination',
      '.archive-project',
      '.archive-header-banner',
      '#work .space-content > p',
      '#work .space-content > h2',
      '.project-index',
      '.story-group',
      '.space-about .space-content',
      '.space-learning .space-content',
      '.space-contact .space-content'
    ];

    document.querySelectorAll(selectors.join(', ')).forEach(el => {
      this.elements.add(el);
      el.classList.add('scroll-depth-active');
    });

    // 2. IntersectionObserver to only compute math for elements near/in the viewport
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.visibleElements.add(entry.target);
          } else {
            this.visibleElements.delete(entry.target);
            // Reset to neutral state when far off screen to save GPU cycles
            entry.target.style.removeProperty('--depth-y');
            entry.target.style.removeProperty('--depth-scale');
            entry.target.style.removeProperty('--depth-opacity');
            entry.target.style.removeProperty('--depth-blur');
            entry.target.style.removeProperty('--depth-rot-x');
            delete entry.target.dataset.lastDepthY;
          }
        });
        this.requestUpdate();
      },
      { root: null, rootMargin: '25% 0px 25% 0px', threshold: [0, 0.25, 0.5, 0.75, 1.0] }
    );

    this.elements.forEach(el => this.observer.observe(el));

    // 3. Fallback native scroll listener if Lenis is not driving it
    const onScroll = () => {
      if (this.lenis) return;
      this.scrollY = window.scrollY || window.pageYOffset;
      this.requestUpdate();
    };

    window.addEventListener('scroll', onScroll, { signal: this.events.signal, passive: true });
    window.addEventListener('resize', onScroll, { signal: this.events.signal, passive: true });

    this.update();
  }

  onScroll({ scroll }) {
    this.scrollY = scroll;
    this.requestUpdate();
  }

  requestUpdate() {
    if (!this.ticking) {
      this.ticking = true;
      this.rafId = requestAnimationFrame(() => {
        this.update();
        this.ticking = false;
      });
    }
  }

  update() {
    const vh = window.innerHeight;
    const vCenter = vh * 0.5;

    this.visibleElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const elCenter = rect.top + rect.height * 0.5;
      // Relative offset normalized by half the viewport:
      // 0 = center of screen
      // < 0 = scrolling past top
      // > 0 = entering from bottom
      const relY = (elCenter - vCenter) / (vh * 0.55);

      let depthY = 0;
      let depthScale = 1.0;
      let depthOpacity = 1.0;
      let depthBlur = 0;
      let depthRotX = 0;

      if (relY < -0.35) {
        // ─── SCROLL-UP ERASE / DISSOLVE ZONE ───
        const t = Math.min(1, Math.max(0, (-relY - 0.35) / 0.85));
        const eased = t * t; // Smooth quadratic falloff

        depthY = -eased * 32;
        depthScale = 1 - eased * 0.045;
        depthOpacity = Math.max(0.06, 1 - eased * 0.94);
        depthBlur = eased * 6.5;
      } else if (relY > 0.45) {
        // ─── SCROLL-DOWN EMERGE / REVEAL ZONE ───
        const t = Math.min(1, Math.max(0, (relY - 0.45) / 0.85));
        const eased = t * (2 - t); // Ease-out

        depthY = eased * 36;
        depthScale = 1 - eased * 0.04;
        depthOpacity = Math.max(0.12, 1 - eased * 0.88);
        depthBlur = eased * 6.0;
      }

      // Delta thresholding: skip setting styles if change is microscopic (<0.3px)
      const lastY = parseFloat(el.dataset.lastDepthY || '999');
      if (Math.abs(lastY - depthY) > 0.25) {
        el.dataset.lastDepthY = depthY.toFixed(1);
        el.style.setProperty('--depth-y', `${depthY.toFixed(1)}px`);
        el.style.setProperty('--depth-scale', `${depthScale.toFixed(3)}`);
        el.style.setProperty('--depth-opacity', `${depthOpacity.toFixed(3)}`);
        el.style.setProperty('--depth-blur', depthBlur > 0.2 ? `${depthBlur.toFixed(1)}px` : '0px');
      }
    });
  }

  dispose() {
    this.events.abort();
    if (this.rafId) cancelAnimationFrame(this.rafId);
    if (this.observer) this.observer.disconnect();
    this.elements.forEach(el => {
      el.classList.remove('scroll-depth-active');
      el.style.removeProperty('--depth-y');
      el.style.removeProperty('--depth-scale');
      el.style.removeProperty('--depth-opacity');
      el.style.removeProperty('--depth-blur');
      el.style.removeProperty('--depth-rot-x');
      delete el.dataset.lastDepthY;
    });
    this.elements.clear();
    this.visibleElements.clear();
  }
}

