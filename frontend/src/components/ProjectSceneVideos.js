/** Ambient video playback follows visibility and the global motion control. */
export class ProjectSceneVideos {
  constructor(root) {
    this.events = new AbortController();
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.items = [...root.querySelectorAll('.project-scene-video')].map(video => ({
      video, visible: false, blocked: false, pending: false
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
    }
    on(document, 'pointerup', () => { if (this.items.some(item => item.blocked)) { this.items.forEach(item => { item.blocked = false; }); this.sync(); } });
    on(document, 'visibilitychange', () => this.sync());
    on(this.reduced, 'change', () => this.sync());
    this.modeObserver = new MutationObserver(() => this.sync());
    this.modeObserver.observe(document.body, { attributes: true, attributeFilter: ['class', 'open'], subtree: true });
    this.sync();
  }
  allowed(item) {
    return !this.disposed && item.visible && !item.blocked && !document.hidden && !this.reduced.matches &&
      !document.body.classList.contains('space-reading') && !document.querySelector('dialog[open]');
  }
  sync() {
    if (this.disposed) return;
    for (const item of this.items) {
      const { video } = item;
      if (video.error) continue;
      if (!this.allowed(item)) {
        video.pause();
        continue;
      }
      if (!video.getAttribute('src')) { video.src = video.dataset.src; video.load(); }
      if (!video.paused || item.pending) continue;
      item.pending = true;
      video.play().then(() => {
        item.pending = false;
        if (!this.allowed(item)) video.pause();
      }).catch(error => {
        item.pending = false;
        if (!this.allowed(item)) return;
        if (error.name === 'AbortError') { this.sync(); return; }
        item.blocked = true;
      });
    }
  }
  dispose() {
    this.disposed = true;
    this.events.abort(); this.observer?.disconnect(); this.modeObserver.disconnect();
    this.items.forEach(({ video }) => { video.pause(); video.removeAttribute('src'); video.load(); });
  }
}
