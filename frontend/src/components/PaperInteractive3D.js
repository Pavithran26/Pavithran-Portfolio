/**
 * PaperInteractive3D.js
 * Implements the authentic 3D Paper interaction physics directly on Pavithran's portfolio:
 * 1. Pointer-driven specular lighting across paper fibers and text
 * 2. 3D tilt & smooth drag-to-turn inertia physics on the book volume
 * 3. Parallax suspended editorial wordmark in the background
 */

export class PaperInteractive3D {
  constructor() {
    this.events = new AbortController();
    this.mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    this.dragYaw = 0;
    this.dragPitch = 0;
    this.prevYaw = 0;
    this.prevPitch = 0;
    this.velYaw = 0;
    this.velPitch = 0;
    this.dragging = false;
    this.dragStartX = 0;
    this.dragStartY = 0;
    this.release = 0;
    this.lastTime = performance.now();
    this.isReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.initDOM();
    this.bindEvents();
    this.startLoop();
  }

  initDOM() {
    // 1. Inject giant suspended background editorial wordmark if not already present
    if (!document.querySelector('#paper-editorial-bg')) {
      const bg = document.createElement('div');
      bg.id = 'paper-editorial-bg';
      bg.className = 'paper-editorial-bg';
      bg.setAttribute('aria-hidden', 'true');
      bg.innerHTML = '<h1 class="paper-giant-wordmark" id="paper-wordmark">PAVITHRAN</h1>';
      document.body.prepend(bg);
    }

    // 2. Inject subtle grain and depth-of-field overlay
    if (!document.querySelector('#paper-dof-layer')) {
      const dof = document.createElement('div');
      dof.id = 'paper-dof-layer';
      dof.className = 'paper-dof-layer';
      dof.setAttribute('aria-hidden', 'true');
      document.body.prepend(dof);
    }

    if (!document.querySelector('#paper-grain-overlay')) {
      const grain = document.createElement('div');
      grain.id = 'paper-grain-overlay';
      grain.className = 'paper-grain-overlay';
      grain.setAttribute('aria-hidden', 'true');
      document.body.prepend(grain);
    }

    // 3. Inject subtle interaction hint
    if (!document.querySelector('#paper-hint-hud')) {
      const hint = document.createElement('div');
      hint.id = 'paper-hint-hud';
      hint.className = 'paper-hint-hud';
      hint.innerHTML = '<b>Hover</b> to illuminate tactile paper &nbsp;·&nbsp; <b>Click</b> to explore';
      document.body.appendChild(hint);
      setTimeout(() => {
        hint.style.opacity = '0';
      }, 5000);
    }

    this.wordmark = document.querySelector('#paper-wordmark');
    this.lastCard = null;
  }

  bindEvents() {
    const { signal } = this.events;

    // Track mouse pointer across the window
    window.addEventListener('pointermove', (e) => {
      const w = window.innerWidth, h = window.innerHeight;
      this.mouse.tx = (e.clientX / w) * 2 - 1;
      this.mouse.ty = (e.clientY / h) * 2 - 1;

      // Update light coordinates on hovered book volume & cards
      this.updateCardLighting(e.clientX, e.clientY);

      if (this.dragging) {
        const dx = e.clientX - this.dragStartX;
        const dy = e.clientY - this.dragStartY;
        this.dragYaw = this.baseYaw + dx * 0.0035;
        this.dragPitch = Math.max(-0.45, Math.min(0.45, this.basePitch - dy * 0.0035));
      }
    }, { signal, passive: true });

    // Drag-to-tilt interaction on the book volume
    window.addEventListener('pointerdown', (e) => {
      const volume = e.target.closest('.book-volume');
      // Only drag if not clicking an interactive button or select
      if (volume && !e.target.closest('button, a, select, input')) {
        this.dragging = true;
        this.volumeEl = volume;
        volume.classList.add('is-dragging');
        this.dragStartX = e.clientX;
        this.dragStartY = e.clientY;
        this.baseYaw = this.dragYaw;
        this.basePitch = this.dragPitch;
        this.release = 1e9;
      }
    }, { signal });

    window.addEventListener('pointerup', () => {
      if (this.dragging) {
        this.dragging = false;
        this.release = 0.8; // settle time
        if (this.volumeEl) {
          this.volumeEl.classList.remove('is-dragging');
        }
      }
    }, { signal });

    window.addEventListener('pointercancel', () => {
      if (this.dragging) {
        this.dragging = false;
        this.release = 0.8;
        if (this.volumeEl) {
          this.volumeEl.classList.remove('is-dragging');
        }
      }
    }, { signal });
  }

  updateCardLighting(clientX, clientY) {
    const volume = document.querySelector('.book-volume');
    if (volume) {
      const rect = volume.getBoundingClientRect();
      const lx = clientX - rect.left;
      const ly = clientY - rect.top;
      volume.style.setProperty('--light-x', `${lx}px`);
      volume.style.setProperty('--light-y', `${ly}px`);

      // Update visible active book leaves
      const leaves = volume.querySelectorAll('.book-leaf:not([hidden])');
      leaves.forEach((leaf) => {
        const lRect = leaf.getBoundingClientRect();
        leaf.style.setProperty('--page-light-x', `${clientX - lRect.left}px`);
        leaf.style.setProperty('--page-light-y', `${clientY - lRect.top}px`);
      });
    }

    // Update hovered project / experience cards
    const card = document.elementFromPoint(clientX, clientY)?.closest(
      '.project-destination, .archive-project, .space-experience article, .education-milestone'
    );

    if (this.lastCard && this.lastCard !== card) {
      this.lastCard.style.transform = '';
    }
    this.lastCard = card;

    if (card) {
      const cRect = card.getBoundingClientRect();
      card.style.setProperty('--card-light-x', `${clientX - cRect.left}px`);
      card.style.setProperty('--card-light-y', `${clientY - cRect.top}px`);

      // 3D paper tilt on hovered card
      if (!this.isReduced && cRect.width > 0 && cRect.height > 0) {
        const relX = (clientX - cRect.left) / cRect.width - 0.5;
        const relY = (clientY - cRect.top) / cRect.height - 0.5;
        card.style.transform = `perspective(1000px) rotateX(${(-relY * 4.5).toFixed(2)}deg) rotateY(${(relX * 4.5).toFixed(2)}deg) translateY(-3px)`;
      }
    }
  }

  startLoop() {
    const frame = (now) => {
      if (this.events.signal.aborted) return;
      const dt = Math.min((now - this.lastTime) / 1000, 0.05);
      this.lastTime = now;

      // Mouse smoothing
      this.mouse.x += (this.mouse.tx - this.mouse.x) * Math.min(1, dt * 6.0);
      this.mouse.y += (this.mouse.ty - this.mouse.y) * Math.min(1, dt * 6.0);

      // Drag inertia physics (from ThreeUI 3D Paper)
      if (this.dragging) {
        const k = Math.min(1, dt * 14);
        this.velYaw += ((this.dragYaw - this.prevYaw) / Math.max(dt, 1e-3) - this.velYaw) * k;
        this.velPitch += ((this.dragPitch - this.prevPitch) / Math.max(dt, 1e-3) - this.velPitch) * k;
        this.velYaw = Math.max(-5, Math.min(5, this.velYaw));
        this.velPitch = Math.max(-3, Math.min(3, this.velPitch));
      } else {
        this.dragYaw += this.velYaw * dt;
        this.dragPitch = Math.max(-0.45, Math.min(0.45, this.dragPitch + this.velPitch * dt));
        const decay = Math.pow(0.02, dt);
        this.velYaw *= decay;
        this.velPitch *= decay;
        this.release = Math.max(0, this.release - dt);
        if (this.release <= 0) {
          // Smoothly spring return home to 0
          const k = Math.min(1, dt * 3.5);
          this.dragYaw += (0 - this.dragYaw) * k;
          this.dragPitch += (0 - this.dragPitch) * k;
        }
      }
      this.prevYaw = this.dragYaw;
      this.prevPitch = this.dragPitch;

      // Apply 3D tilt to the book volume
      const volume = document.querySelector('.book-volume');
      if (volume && !this.isReduced) {
        const tiltX = (this.dragYaw * 28 + this.mouse.x * 5.5).toFixed(2);
        const tiltY = (-this.dragPitch * 24 - this.mouse.y * 4.2).toFixed(2);
        volume.style.transform = `perspective(1400px) rotateY(${tiltX}deg) rotateX(${tiltY}deg)`;
      }

      // Parallax on the suspended giant editorial wordmark
      if (this.wordmark && !this.isReduced) {
        const wx = (this.mouse.x * -24).toFixed(1);
        const wy = (this.mouse.y * -14).toFixed(1);
        this.wordmark.style.transform = `translate(${wx}px, calc(-5% + ${wy}px))`;
      }

      requestAnimationFrame(frame);
    };

    requestAnimationFrame(frame);
  }

  dispose() {
    this.events.abort();
    document.querySelector('#paper-editorial-bg')?.remove();
    document.querySelector('#paper-dof-layer')?.remove();
    document.querySelector('#paper-grain-overlay')?.remove();
    document.querySelector('#paper-hint-hud')?.remove();
  }
}
