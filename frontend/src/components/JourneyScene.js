import { STACK_CHAPTERS, clamp } from '../data/stackJourney.js';
import { createJourneyGeometry, getJourneyView, createProjector, transformPoint } from './journeyGeometry.js';

/** A scroll-driven camera with an equivalent Canvas fallback when WebGL is unavailable. */
export class JourneyScene {
  constructor(mount, { motion = true } = {}) {
    this.mount = mount;
    this.motion = motion;
    this.position = 0;
    this.pointer = { x: 0, y: 0 };
    this.time = 0;
    this.visible = false;
    this.disposed = false;
    this.events = new AbortController();
    this.geometry = STACK_CHAPTERS.map((_, i) => createJourneyGeometry(i));
  }

  async init() {
    this.canvas = document.createElement('canvas');
    this.canvas.setAttribute('aria-hidden', 'true');
    this.mount.appendChild(this.canvas);
    let context;
    try { if (this.motion) context = this.canvas.getContext('webgl2', { alpha: true, antialias: true, powerPreference: 'low-power' }); } catch { /* Use Canvas below. */ }
    if (context) {
      try {
        const { WebGLJourneyRenderer } = await import('./WebGLJourneyRenderer.js');
        if (this.disposed) { context.getExtension('WEBGL_lose_context')?.loseContext(); return; }
        this.renderer = new WebGLJourneyRenderer(this.canvas, context, this.geometry);
        this.mount.dataset.renderer = 'webgl';
      } catch { context.getExtension('WEBGL_lose_context')?.loseContext(); this.useCanvas(); }
    } else this.useCanvas();
    if (this.disposed) return;
    this.resize();
    const signal = this.events.signal;
    this.mount.closest('.journey-stage').addEventListener('pointermove', event => {
      if (!this.motion || event.pointerType === 'touch') return;
      const rect = this.mount.getBoundingClientRect();
      this.pointer.x = clamp((event.clientX - rect.left) / rect.width * 2 - 1, -1, 1);
      this.pointer.y = clamp(-((event.clientY - rect.top) / rect.height * 2 - 1), -1, 1);
      this.requestRender();
    }, { passive: true, signal });
    this.mount.closest('.journey-stage').addEventListener('pointerleave', () => {
      this.pointer = { x: 0, y: 0 }; this.requestRender();
    }, { passive: true, signal });
    document.addEventListener('visibilitychange', () => this.requestRender(), { signal });
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.mount);
    this.visibilityObserver = new IntersectionObserver(entries => {
      this.visible = entries.some(entry => entry.isIntersecting);
      this.requestRender();
    });
    this.visibilityObserver.observe(this.mount);
    this.canvas.addEventListener('webglcontextlost', event => {
      event.preventDefault();
      if (this.disposed || !this.renderer) return;
      this.renderer.dispose(); this.renderer = null;
      this.useCanvas(); this.resize(); this.requestRender();
    }, { signal });
  }

  useCanvas() {
    // A canvas cannot switch context types; replace it before requesting 2D.
    const replacement = document.createElement('canvas');
    replacement.setAttribute('aria-hidden', 'true');
    this.canvas.replaceWith(replacement);
    this.canvas = replacement;
    this.context = this.canvas.getContext('2d', { alpha: true });
    if (!this.context) throw new Error('Canvas is unavailable');
    this.mount.dataset.renderer = 'canvas';
  }

  resize() {
    if (this.disposed) return;
    const rect = this.mount.getBoundingClientRect();
    this.width = Math.max(1, rect.width); this.height = Math.max(1, rect.height);
    this.dpr = Math.min(window.devicePixelRatio || 1, 1.7);
    if (this.renderer) this.renderer.resize(this.width, this.height, this.dpr);
    else {
      this.canvas.width = Math.round(this.width * this.dpr);
      this.canvas.height = Math.round(this.height * this.dpr);
      this.context.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    }
    this.requestRender();
  }

  setPosition(value) {
    const next = clamp(value, 0, STACK_CHAPTERS.length - 1);
    if (next === this.position) return;
    this.position = next; this.requestRender();
  }

  setMotion(enabled) {
    this.motion = enabled;
    if (!enabled) { this.pointer = { x: 0, y: 0 }; this.time = 0; }
    this.requestRender();
  }

  requestRender() {
    this.dirty = true;
    if (this.frame || this.disposed) return;
    this.frame = requestAnimationFrame(timestamp => this.render(timestamp));
  }

  render(timestamp) {
    this.frame = null;
    if (this.disposed || document.hidden || !this.visible) { this.lastTime = null; return; }
    const delta = this.lastTime === null || this.lastTime === undefined ? 0 : Math.min((timestamp - this.lastTime) / 1000, .05);
    this.lastTime = timestamp;
    if (this.motion) this.time += delta;
    // Ambient motion runs at 30 fps; direct scroll updates render immediately.
    if (this.dirty || !this.lastDraw || timestamp - this.lastDraw > 32) {
      const view = getJourneyView(this.position, this.pointer, this.motion ? this.time : 0);
      if (this.renderer) this.renderer.draw(view, this.time);
      else this.drawCanvas(view);
      this.lastDraw = timestamp; this.dirty = false;
    }
    if (this.motion) this.frame = requestAnimationFrame(next => this.render(next));
  }

  drawCanvas(view) {
    const ctx = this.context, project = createProjector(view, this.width, this.height);
    ctx.clearRect(0, 0, this.width, this.height);
    this.geometry.forEach((geometry, index) => {
      const pose = view.poses[index];
      if (pose.opacity < .005) return;
      const color = STACK_CHAPTERS[index].accent;
      ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 1;
      const projected = point => project(transformPoint(point, pose));
      geometry.paths.forEach(path => {
        ctx.globalAlpha = pose.opacity * (path.kind === 'soft' ? .21 : path.kind === 'trace' ? .87 : .54);
        ctx.beginPath();
        let connected = false;
        path.points.forEach(point => {
          const p = projected(point);
          if (!p) { connected = false; return; }
          if (connected) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y);
          connected = true;
        });
        ctx.stroke();
      });
      ctx.globalAlpha = pose.opacity * .9;
      geometry.nodes.forEach(point => {
        const p = projected(point);
        if (!p) return;
        const size = clamp(18 / p.depth, 1, 3.4);
        ctx.fillRect(p.x - size / 2, p.y - size / 2, size, size);
      });
      geometry.field.forEach((point, i) => {
        const wave = this.motion ? Math.sin(this.time * .6 + point[0] + point[2]) * .08 : 0;
        const p = projected([point[0], point[1] + wave, point[2]]);
        if (!p) return;
        ctx.globalAlpha = pose.opacity * (.13 + .32 * ((i % 7) / 7));
        ctx.fillRect(p.x, p.y, 1.3, 1.3);
      });
    });
    ctx.globalAlpha = 1;
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.frame);
    this.events.abort(); this.resizeObserver?.disconnect(); this.visibilityObserver?.disconnect();
    this.renderer?.dispose(); this.canvas?.remove();
  }
}
