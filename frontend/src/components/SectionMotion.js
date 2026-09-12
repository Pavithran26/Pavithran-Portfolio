/** Scroll storytelling for the portfolio content after the technology worlds. */
export class SectionMotion {
  constructor(root) {
    this.events = new AbortController();
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.scenes = [...root.querySelectorAll('.project-scene')];
    this.sections = [...root.querySelectorAll('.space-section')];
    this.entries = [...root.querySelectorAll('.space-content > h2, .space-content > .space-kicker, .section-intro, .space-projects article, .space-experience article, .space-education article, .space-recognition article, .space-actions, .dawn-questions')];
    this.entries.forEach((entry, index) => {
      entry.dataset.reveal = '';
      entry.style.setProperty('--reveal-delay', `${index % 3 * 65}ms`);
    });
    // Without IntersectionObserver the complete document stays visible.
    if (!('IntersectionObserver' in window)) return;
    this.observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        this.observer.unobserve(entry.target);
      }
    }, { threshold: 0, rootMargin: '0px 0px -35px 0px' });
    this.entries.forEach(entry => this.observer.observe(entry));
    const on = (target, type, handler, options = {}) => target.addEventListener(type, handler, { ...options, signal: this.events.signal });
    on(window, 'scroll', () => this.schedule(), { passive: true });
    on(window, 'resize', () => this.schedule(), { passive: true });
    on(this.reducedMotion, 'change', () => this.updateMode());
    on(document, 'visibilitychange', () => { document.documentElement.classList.toggle('document-hidden', document.hidden); if (!document.hidden) this.schedule(); });
    on(root, 'focusin', event => {
      const entry = event.target.closest('[data-reveal]');
      if (entry) entry.classList.add('is-revealed');
    });
    this.modeObserver = new MutationObserver(() => this.updateMode());
    this.modeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    this.sceneObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.target.classList.toggle('scene-active', entry.isIntersecting));
    }, { rootMargin: '80px' });
    this.scenes.forEach(scene => this.sceneObserver.observe(scene));
    this.updateMode();
  }

  updateMode() {
    const enabled = !this.reducedMotion.matches && !document.body.classList.contains('space-reading');
    if (this.enabled === enabled) return;
    this.enabled = enabled;
    document.documentElement.classList.toggle('story-motion', enabled);
    if (!enabled) {
      cancelAnimationFrame(this.frame);
      this.frame = null;
      this.scenes.forEach(scene => scene.style.removeProperty('--scene-travel'));
      this.sections.forEach(section => {
        section.style.removeProperty('--heading-drift');
        section.style.removeProperty('--timeline-progress');
      });
    } else this.schedule();
  }

  schedule() {
    if (!this.enabled || this.frame != null || document.hidden) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = null;
      const height = window.innerHeight;
      // Read geometry together, then write styles to avoid layout thrashing.
      const positions = this.sections.map(section => ({ section, rect: section.getBoundingClientRect(), timeline: section.querySelector('.space-experience, .space-education') }));
      const frames = positions.map(item => ({ ...item, timelineRect: item.timeline?.getBoundingClientRect() }));
      const sceneFrames = this.scenes.map(scene => ({ scene, rect: scene.getBoundingClientRect() }));
      frames.forEach(({ section, rect, timelineRect }) => {
        if (rect.bottom < 0 || rect.top > height) return;
        const phase = Math.max(0, Math.min(1, (height - rect.top) / (height + rect.height)));
        section.style.setProperty('--heading-drift', `${(phase - .5) * -30}px`);
        if (timelineRect) section.style.setProperty('--timeline-progress', Math.max(0, Math.min(1, (height * .65 - timelineRect.top) / Math.max(1, timelineRect.height))));
      });
      sceneFrames.forEach(({ scene, rect }) => {
        if (rect.bottom < 0 || rect.top > height) return;
        const progress = Math.max(0, Math.min(1, (height - rect.top) / (height + rect.height)));
        scene.style.setProperty('--scene-travel', `${(progress - .5) * -64}px`);
      });
    });
  }

  dispose() {
    this.events.abort();
    this.observer?.disconnect();
    this.modeObserver?.disconnect();
    this.sceneObserver?.disconnect();
    cancelAnimationFrame(this.frame);
    document.documentElement.classList.remove('story-motion', 'document-hidden');
  }
}
