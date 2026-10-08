/**
 * LiquidCursor.js
 * Atmospheric Liquid Water Bubble Cursor & Character Zoom Lens System.
 * Creates an organic, shimmering liquid water drop with physical velocity stretching,
 * micro-droplet satellite cohesion, real-time expanding ripples, and optical character magnification.
 */

export class LiquidCursor {
  constructor() {
    // Respect touch devices without fine mouse pointers
    if (
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(pointer: coarse)').matches &&
      !window.matchMedia('(pointer: fine)').matches
    ) {
      return;
    }

    this.initDOM();
    this.bindEvents();
    this.startLoop();
  }

  initDOM() {
    // Inject SVG Filter if not present
    if (!document.getElementById('liquidWaterDistort')) {
      const svgDefs = document.createElement('div');
      svgDefs.innerHTML = `
        <svg class="liquid-svg-defs" aria-hidden="true">
          <defs>
            <filter id="liquidWaterDistort" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB">
              <feTurbulence id="liquidTurbulence" type="fractalNoise" baseFrequency="0.032 0.032" numOctaves="2" result="fluidNoise" />
              <feDisplacementMap in="SourceGraphic" in2="fluidNoise" scale="12" xChannelSelector="R" yChannelSelector="G" result="refractedContent" />
              <feColorMatrix
                type="matrix"
                values="
                  1.06 0    0    0   0.02
                  0    1.08 0    0   0.02
                  0    0    1.18 0   0.04
                  0    0    0    1   0"
                in="refractedContent"
                result="prismBoost"
              />
              <feMerge>
                <feMergeNode in="prismBoost" />
              </feMerge>
            </filter>
          </defs>
        </svg>
      `;
      document.body.appendChild(svgDefs.firstElementChild);
    }

    // Inject Cursor Container
    let container = document.getElementById('liquid-cursor-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'liquid-cursor-container';
      container.setAttribute('aria-hidden', 'true');
      container.innerHTML = `
        <div class="satellite-micro-drop"></div>
        <div class="water-drop-cursor">
          <div class="drop-glare-primary"></div>
          <div class="drop-glare-secondary"></div>
          <div class="drop-caustic-crescent"></div>
          <div class="drop-mirror-text"></div>
        </div>
        <div id="liquid-ripples"></div>
      `;
      document.body.appendChild(container);
    }

    this.container = container;
    this.mainDrop = container.querySelector('.water-drop-cursor');
    this.mirrorText = container.querySelector('.drop-mirror-text');
    this.satelliteDrop = container.querySelector('.satellite-micro-drop');
    this.rippleBox = container.querySelector('#liquid-ripples');
    this.turbFilter = document.getElementById('liquidTurbulence');

    this.mouseX = window.innerWidth / 2;
    this.mouseY = window.innerHeight / 2;
    this.dropX = this.mouseX;
    this.dropY = this.mouseY;
    this.satX = this.mouseX;
    this.satY = this.mouseY;

    this.isHovering = false;
    this.isClicking = false;
    this.wobbleTime = 0;
    this.hasMoved = false;
    this.isWindowFocused = true;
    this.lastSampleTime = 0;
    this.lastRippleTime = 0;
  }

  spawnRipple(x, y) {
    if (!this.rippleBox) return;
    const ripple = document.createElement('div');
    ripple.className = 'liquid-ripple-wave';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    this.rippleBox.appendChild(ripple);
    setTimeout(() => {
      ripple.remove();
    }, 750);
  }

  bindEvents() {
    this.onMouseMove = (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
      if (!this.hasMoved) {
        this.hasMoved = true;
        this.dropX = this.mouseX;
        this.dropY = this.mouseY;
        this.satX = this.mouseX;
        this.satY = this.mouseY;
        document.body.classList.add('liquid-cursor-active');
      }

      // Intermittent motion ripples during smooth gliding
      const now = performance.now();
      if (now - this.lastRippleTime > 180) {
        const dx = this.mouseX - this.dropX;
        const dy = this.mouseY - this.dropY;
        if (Math.hypot(dx, dy) > 28) {
          this.spawnRipple(e.clientX, e.clientY);
          this.lastRippleTime = now;
        }
      }
    };

    this.onMouseLeave = () => {
      this.isWindowFocused = false;
      if (this.container) this.container.style.opacity = '0';
    };

    this.onMouseEnter = () => {
      this.isWindowFocused = true;
      if (this.hasMoved && this.container) {
        this.container.style.opacity = '1';
      }
    };

    this.onMouseDown = (e) => {
      this.isClicking = true;
      if (this.mainDrop) this.mainDrop.classList.add('is-clicking');
      this.spawnRipple(e.clientX, e.clientY);
    };

    this.onMouseUp = () => {
      this.isClicking = false;
      if (this.mainDrop) this.mainDrop.classList.remove('is-clicking');
    };

    const hoverSelector =
      'a, button, input, select, textarea, [role="button"], .shelf-hud-badge, .btn-pull-book, .space-project-title, .space-text-link, .reading-tools button, .book-toolbar select, .book-controls button, .cover-open';

    this.onMouseOver = (e) => {
      const target = e.target;
      if (target && target.closest && target.closest(hoverSelector)) {
        this.isHovering = true;
        if (this.mainDrop) this.mainDrop.classList.add('is-hovering');
      }
    };

    this.onMouseOut = (e) => {
      const target = e.target;
      if (target && target.closest && target.closest(hoverSelector)) {
        this.isHovering = false;
        if (this.mainDrop) this.mainDrop.classList.remove('is-hovering');
      }
    };

    window.addEventListener('mousemove', this.onMouseMove, { passive: true });
    document.addEventListener('mouseleave', this.onMouseLeave);
    document.addEventListener('mouseenter', this.onMouseEnter);
    window.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mouseup', this.onMouseUp);
    document.addEventListener('mouseover', this.onMouseOver);
    document.addEventListener('mouseout', this.onMouseOut);
  }

  updateCharacterZoom(x, y, now) {
    if (now - this.lastSampleTime < 35 || !this.mirrorText) return;
    this.lastSampleTime = now;

    if (this.isClicking) {
      this.mirrorText.style.opacity = '0';
      return;
    }

    const elem = document.elementFromPoint(x, y);
    if (!elem) {
      this.mirrorText.style.opacity = '0';
      return;
    }

    const tag = elem.tagName.toLowerCase();
    if (
      tag === 'img' ||
      tag === 'canvas' ||
      tag === 'svg' ||
      tag === 'path' ||
      elem.closest('#liquid-cursor-container')
    ) {
      this.mirrorText.style.opacity = '0';
      return;
    }

    const text = (elem.innerText || elem.textContent || '').trim();
    if (text.length > 0) {
      const clean = text.replace(/\s+/g, ' ');
      let snippet = '';

      if (clean.length <= 10) {
        snippet = clean;
      } else {
        const rect = elem.getBoundingClientRect();
        const norm = Math.max(0, Math.min(1, (x - rect.left) / (rect.width || 1)));
        const targetIdx = Math.floor(norm * clean.length);
        const start = Math.max(0, targetIdx - 2);
        const end = Math.min(clean.length, targetIdx + 3);
        snippet = clean.substring(start, end).trim();
      }

      if (snippet && snippet.length > 0 && snippet.length <= 12) {
        this.mirrorText.textContent = snippet;
        this.mirrorText.style.opacity = '0.9';

        const style = window.getComputedStyle(elem);
        const col = style.color;
        if (col && col !== 'rgba(0, 0, 0, 0)' && col !== 'transparent') {
          this.mirrorText.style.color = col;
        } else {
          this.mirrorText.style.color = '#6cd3ff';
        }
      } else {
        this.mirrorText.style.opacity = '0';
      }
    } else {
      this.mirrorText.style.opacity = '0';
    }
  }

  startLoop() {
    const render = (time) => {
      this.animId = requestAnimationFrame(render);

      if (!this.hasMoved || !this.isWindowFocused || !this.mainDrop) return;

      const ease = 0.22;
      const dx = this.mouseX - this.dropX;
      const dy = this.mouseY - this.dropY;
      this.dropX += dx * ease;
      this.dropY += dy * ease;

      const speed = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);

      const maxStretch = 0.38;
      const stretch = Math.min(speed * 0.009, maxStretch);
      const baseScale = this.isHovering ? 1.25 : 1.0;
      const scaleX = baseScale * (1 + stretch);
      const scaleY = baseScale * (1 - stretch * 0.55);

      this.wobbleTime += 0.06;
      let wobbleX = 0;
      let wobbleY = 0;
      if (speed < 2.0) {
        wobbleX = Math.sin(this.wobbleTime * 2.2) * 1.5;
        wobbleY = Math.cos(this.wobbleTime * 2.2) * 1.5;
      }

      this.mainDrop.style.transform = `translate3d(${this.dropX + wobbleX}px, ${
        this.dropY + wobbleY
      }px, 0) translate(-50%, -50%) rotate(${angle}deg) scale(${scaleX}, ${scaleY})`;

      // Counter-rotate text so it stays upright & magnified
      if (this.mirrorText) {
        this.mirrorText.style.transform = `rotate(${-angle}deg) scale(1.38)`;
      }

      // Satellite micro-droplet trailing physics
      if (this.satelliteDrop) {
        const satEase = 0.11;
        this.satX += (this.dropX - this.satX) * satEase;
        this.satY += (this.dropY - this.satY) * satEase;

        const satDist = Math.hypot(this.dropX - this.satX, this.dropY - this.satY);
        if (satDist < 9) {
          this.satelliteDrop.style.opacity = '0';
        } else {
          this.satelliteDrop.style.opacity = Math.min(0.85, (satDist - 8) / 25).toString();
          this.satelliteDrop.style.transform = `translate3d(${this.satX}px, ${this.satY}px, 0) translate(-50%, -50%) scale(${Math.max(
            0.65,
            1 - satDist * 0.004
          )})`;
        }
      }

      // Optical fluid distortion turbulence
      if (this.turbFilter && (speed > 1.2 || Math.random() < 0.08)) {
        const baseFreq = (0.032 + Math.sin(this.wobbleTime) * 0.004).toFixed(4);
        this.turbFilter.setAttribute('baseFrequency', `${baseFreq} ${baseFreq}`);
      }

      this.updateCharacterZoom(this.mouseX, this.mouseY, time);
    };

    this.animId = requestAnimationFrame(render);
  }

  dispose() {
    if (this.animId) cancelAnimationFrame(this.animId);
    window.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseleave', this.onMouseLeave);
    document.removeEventListener('mouseenter', this.onMouseEnter);
    window.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('mouseup', this.onMouseUp);
    document.removeEventListener('mouseover', this.onMouseOver);
    document.removeEventListener('mouseout', this.onMouseOut);
    document.body.classList.remove('liquid-cursor-active');
    if (this.container) this.container.remove();
  }
}
