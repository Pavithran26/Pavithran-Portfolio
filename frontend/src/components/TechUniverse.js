export class TechUniverse {
  constructor(root = document) {
    this.root = root;
    this.events = new AbortController();
    this.hero = root.querySelector('.tech-hero');
    this.universe = root.querySelector('.tech-universe');
    this.projectGalaxy = root.querySelector('.project-constellation');
    if (!this.hero || !this.universe) return;

    const on = (target, type, handler, options = {}) =>
      target?.addEventListener(type, handler, { ...options, signal: this.events.signal });

    on(this.universe, 'click', event => {
      const node = event.target.closest('[data-tech-target]');
      if (!node) return;
      const target = document.querySelector(node.dataset.techTarget);
      if (!target) return;

      this.universe.querySelectorAll('.tech-node').forEach(item => {
        item.classList.toggle('is-selected', item === node);
      });
      this.universe.classList.add('is-focusing');

      window.setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 360);

      window.setTimeout(() => {
        this.universe.classList.remove('is-focusing');
        node.classList.remove('is-selected');
      }, 1300);
    });

    on(this.projectGalaxy, 'click', event => {
      const link = event.target.closest('a[href^="#project-"]');
      if (!link) return;
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      this.projectGalaxy.querySelectorAll('.project-planet').forEach(item => {
        item.classList.toggle('is-selected', item === link);
      });
      this.projectGalaxy.classList.add('is-focusing');
      window.setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
      window.setTimeout(() => {
        this.projectGalaxy.classList.remove('is-focusing');
        link.classList.remove('is-selected');
      }, 1200);
    });

    on(window, 'pointermove', event => {
      if (event.pointerType !== 'mouse' || window.innerWidth < 760) return;
      const bounds = this.hero.getBoundingClientRect();
      if (bounds.bottom < 0 || bounds.top > window.innerHeight) return;
      const x = (event.clientX / window.innerWidth - .5) * 2;
      const y = (event.clientY / window.innerHeight - .5) * 2;
      this.universe.style.setProperty('--tilt-x', `${(y * -4).toFixed(2)}deg`);
      this.universe.style.setProperty('--tilt-y', `${(x * 5).toFixed(2)}deg`);
    }, { passive: true });
  }

  dispose() {
    this.events.abort();
  }
}
