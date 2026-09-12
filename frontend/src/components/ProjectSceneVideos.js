/** Lazy-load and play only visible scenes; preserve explicit per-scene pause. */
export class ProjectSceneVideos {
  constructor(root) {
    this.events = new AbortController();
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.items = [...root.querySelectorAll('.project-scene-video')].map(video => ({
      video, button: video.closest('figure').querySelector('.scene-playback'), visible: false, paused: false, pending: false
    }));
    const on = (target, event, fn) => target.addEventListener(event, fn, { signal: this.events.signal });
    this.observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
      for (const entry of entries) {
        const item = this.items.find(item => item.video === entry.target);
        if (item) item.visible = entry.isIntersecting;
      }
      this.sync();
    }, { threshold: .15 }) : null;
    for (const item of this.items) {
      item.video.muted = true;
      this.observer?.observe(item.video);
      if (!this.observer) item.visible = true;
      on(item.button, 'click', () => { item.paused = !item.video.paused; this.sync(); });
      on(item.video, 'error', () => { item.button.textContent = 'Scene unavailable'; item.button.disabled = true; });
    }
    on(document, 'visibilitychange', () => this.sync());
    on(this.reduced, 'change', () => this.sync());
    this.modeObserver = new MutationObserver(() => this.sync());
    this.modeObserver.observe(document.body, { attributes: true, attributeFilter: ['class', 'open'], subtree: true });
    this.sync();
  }
  allowed(item) {
    return !this.disposed && item.visible && !item.paused && !document.hidden && !this.reduced.matches &&
      !document.body.classList.contains('space-reading') && !document.querySelector('dialog[open]');
  }
  sync() {
    if (this.disposed) return;
    for (const item of this.items) {
      const { video, button } = item;
      const motionOff = this.reduced.matches || document.body.classList.contains('space-reading');
      if (video.error) continue;
      button.disabled = motionOff;
      if (!this.allowed(item)) {
        video.pause();
        button.textContent = motionOff ? 'Motion off' : 'Play scene';
        button.setAttribute('aria-label', 'Play project scene');
        continue;
      }
      if (!video.getAttribute('src')) { video.src = video.dataset.src; video.load(); }
      button.textContent = 'Pause scene';
      button.setAttribute('aria-label', 'Pause project scene');
      if (!video.paused || item.pending) continue;
      item.pending = true;
      video.play().then(() => {
        item.pending = false;
        if (!this.allowed(item)) video.pause();
      }).catch(error => {
        item.pending = false;
        if (!this.allowed(item)) return;
        if (error.name === 'AbortError') { this.sync(); return; }
        item.paused = true;
        button.textContent = 'Play scene';
        button.setAttribute('aria-label', 'Play project scene');
      });
    }
  }
  dispose() {
    this.disposed = true;
    this.events.abort(); this.observer?.disconnect(); this.modeObserver.disconnect();
    this.items.forEach(({ video }) => { video.pause(); video.removeAttribute('src'); video.load(); });
  }
}
