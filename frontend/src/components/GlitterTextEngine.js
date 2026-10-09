/**
 * GlitterTextEngine.js
 * High-Performance Hardware-Accelerated Glitter Particle Text Engine:
 * - Letter-by-letter glittering particle disintegration / erase effect.
 * - Dynamic letter morphing: current letters dissolve into glowing stardust glitters,
 *   and next letters emerge from shimmering sparkle bursts.
 * - Scroll-driven letter glitter vaporization synchronized with Lenis virtual scroll.
 * - 60Hz/120Hz high-frequency HTML5 2D Canvas with 'lighter' blend mode for luminous neon glow.
 */

export class GlitterTextEngine {
  constructor(options = {}) {
    this.lenis = options.lenis || null;
    this.events = new AbortController();
    this.particles = [];
    this.maxParticles = 600;
    this.rafId = null;
    this.isActive = true;

    // Word rotation sequence for Hero
    this.heroPhrases = [
      "Thoughtful Interfaces.",
      "Dependable Systems.",
      "Autonomous AI & ML Solutions.",
      "High-Performance Architecture.",
      "Next-Gen Visual Experiences."
    ];
    this.currentPhraseIndex = 0;
    this.isMorphing = false;
    this.morphTimer = null;

    this.initCanvas();
    this.initHeroMorph();
    this.initScrollGlitterHeadings();
    this.startLoop();
  }

  initCanvas() {
    // 1. Remove any duplicate canvas
    const old = document.querySelector('#glitter-canvas');
    if (old) old.remove();

    // 2. Create full-screen fixed canvas overlay
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'glitter-canvas';
    this.canvas.className = 'glitter-canvas';
    this.ctx = this.canvas.getContext('2d', { alpha: true, desynchronized: true });

    // Handle high-DPI retina displays
    this.resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.canvas.width = Math.round(this.width * dpr);
      this.canvas.height = Math.round(this.height * dpr);
      this.canvas.style.width = `${this.width}px`;
      this.canvas.style.height = `${this.height}px`;
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    this.resize();
    window.addEventListener('resize', this.resize, { signal: this.events.signal, passive: true });

    // Insert canvas just above background viewport
    document.body.appendChild(this.canvas);
  }

  /**
   * Spawn a burst of sparkling glitter particles from a letter's DOMRect
   */
  spawnGlitterFromRect(rect, count = 12, mode = 'erase') {
    if (!rect || rect.width === 0 || rect.height === 0) return;
    // Don't spawn if element is far off-screen
    if (rect.bottom < -50 || rect.top > window.innerHeight + 50) return;

    const colors = [
      '#ffffff',               // Pure diamond white
      '#00e5ff',               // Energon Cyan
      '#7bf2ff',               // Bright sky cyan
      '#ffd700',               // Golden sparkle
      '#ffaa00',               // Amber glow
      '#ff4d4d'                // Autobot crimson spark
    ];

    for (let i = 0; i < count; i++) {
      if (this.particles.length >= this.maxParticles) {
        this.particles.shift(); // Evict oldest to keep 60fps budget
      }

      const x = rect.left + Math.random() * rect.width;
      const y = rect.top + Math.random() * rect.height;

      // Velocity physics
      const angle = Math.random() * Math.PI * 2;
      const speed = mode === 'erase' ? 1.0 + Math.random() * 3.5 : 0.6 + Math.random() * 2.2;
      const vx = Math.cos(angle) * speed * (0.8 + Math.random() * 0.4);
      const vy = (mode === 'erase' ? -1.2 : -0.4) + Math.sin(angle) * speed * 0.7; // Upward buoyant drift

      const size = 1.5 + Math.random() * 3.8;
      const maxLife = 35 + Math.floor(Math.random() * 35);
      const color = colors[Math.floor(Math.random() * colors.length)];
      const type = Math.random() > 0.4 ? 'star' : (Math.random() > 0.5 ? 'diamond' : 'ember');

      this.particles.push({
        x,
        y,
        vx,
        vy,
        size,
        life: 0,
        maxLife,
        alpha: 1.0,
        color,
        type,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.2,
        sparklePhase: Math.random() * Math.PI * 2,
        sparkleSpeed: 0.15 + Math.random() * 0.25,
        gravity: 0.03
      });
    }
  }

  /**
   * 1. Dynamic Hero Statement Letter-by-Letter Glitter Morph
   */
  initHeroMorph() {
    const introStatement = document.querySelector('.intro-statement');
    if (!introStatement) return;

    // Create the dedicated glitter morph container
    const morphWrap = document.createElement('div');
    morphWrap.className = 'glitter-morph-wrapper';
    morphWrap.innerHTML = `
      <span class="glitter-morph-prefix">CRAFTING //</span>
      <span class="glitter-morph-active" id="glitter-morph-text"></span>
    `;

    // Replace the static text or append below
    introStatement.innerHTML = '';
    introStatement.appendChild(morphWrap);

    this.morphElement = morphWrap.querySelector('#glitter-morph-text');
    this.renderPhrase(this.heroPhrases[0], false);

    // Start auto-cycling timer
    this.scheduleNextMorph();
  }

  renderPhrase(text, animateIn = true) {
    if (!this.morphElement) return;
    this.morphElement.innerHTML = '';

    const chars = text.split('');
    chars.forEach((char, index) => {
      const span = document.createElement('span');
      if (char === ' ') {
        span.className = 'glitter-space';
        span.innerHTML = '&nbsp;';
      } else {
        span.className = 'glitter-char' + (animateIn ? ' glitter-char-entering' : '');
        span.textContent = char;
        span.style.setProperty('--char-idx', index);
      }
      this.morphElement.appendChild(span);

      if (animateIn && char !== ' ') {
        // Stagger spawn glitters as letter appears!
        setTimeout(() => {
          if (!this.isActive) return;
          const rect = span.getBoundingClientRect();
          this.spawnGlitterFromRect(rect, 8, 'spawn');
          span.classList.remove('glitter-char-entering');
          span.classList.add('glitter-char-visible');
        }, index * 30);
      } else if (!animateIn) {
        span.classList.add('glitter-char-visible');
      }
    });
  }

  scheduleNextMorph() {
    if (this.morphTimer) clearTimeout(this.morphTimer);
    this.morphTimer = setTimeout(() => {
      this.morphToNextPhrase();
    }, 3800);
  }

  morphToNextPhrase() {
    if (this.isMorphing || !this.morphElement) return;
    this.isMorphing = true;

    const charSpans = Array.from(this.morphElement.querySelectorAll('.glitter-char'));
    const totalChars = charSpans.length;

    if (totalChars === 0) {
      this.isMorphing = false;
      return;
    }

    // Phase 1: Erase current letters with sparkling glitters (staggered cascade)
    let erasedCount = 0;
    charSpans.forEach((span, index) => {
      // Stagger from right to left or left to right
      setTimeout(() => {
        if (!this.isActive) return;
        const rect = span.getBoundingClientRect();
        // Emit sparkling glitter burst from the disappearing letter!
        this.spawnGlitterFromRect(rect, 14, 'erase');

        span.classList.add('glitter-char-erasing');

        erasedCount++;
        if (erasedCount === totalChars) {
          // All letters erased into glitters! Now reveal next phrase:
          setTimeout(() => {
            this.currentPhraseIndex = (this.currentPhraseIndex + 1) % this.heroPhrases.length;
            this.renderPhrase(this.heroPhrases[this.currentPhraseIndex], true);
            this.isMorphing = false;
            this.scheduleNextMorph();
          }, 180);
        }
      }, index * 32);
    });
  }

  /**
   * 2. Scroll-Driven Letter Glitter Dissolve across Section Headings
   */
  initScrollGlitterHeadings() {
    const headings = document.querySelectorAll(
      '#intro-title, #work-title, #about-title, #education-title, #dawn-title, .space-contact h2'
    );

    this.glitterHeadings = [];

    headings.forEach((heading) => {
      // Split heading into chars while preserving HTML em tags
      this.wrapHeadingChars(heading);
      this.glitterHeadings.push({
        element: heading,
        chars: Array.from(heading.querySelectorAll('.glitter-scroll-char'))
      });
    });

    // Listen to Lenis scroll
    if (this.lenis) {
      this.lenis.on('scroll', () => this.updateScrollGlitter());
    } else {
      window.addEventListener('scroll', () => this.updateScrollGlitter(), {
        signal: this.events.signal,
        passive: true
      });
    }

    this.updateScrollGlitter();
  }

  wrapHeadingChars(heading) {
    if (heading.dataset.glitterWrapped) return;
    heading.dataset.glitterWrapped = 'true';

    const nodes = Array.from(heading.childNodes);
    heading.innerHTML = '';

    nodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        const frag = document.createDocumentFragment();
        text.split('').forEach(char => {
          if (char === ' ') {
            const sp = document.createElement('span');
            sp.className = 'glitter-space';
            sp.innerHTML = '&nbsp;';
            frag.appendChild(sp);
          } else {
            const cSpan = document.createElement('span');
            cSpan.className = 'glitter-scroll-char';
            cSpan.textContent = char;
            frag.appendChild(cSpan);
          }
        });
        heading.appendChild(frag);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        // Recursively or wrap inside element (like <em>)
        const innerText = node.textContent;
        const newEl = node.cloneNode(false);
        innerText.split('').forEach(char => {
          if (char === ' ') {
            const sp = document.createElement('span');
            sp.className = 'glitter-space';
            sp.innerHTML = '&nbsp;';
            newEl.appendChild(sp);
          } else {
            const cSpan = document.createElement('span');
            cSpan.className = 'glitter-scroll-char';
            cSpan.textContent = char;
            newEl.appendChild(cSpan);
          }
        });
        heading.appendChild(newEl);
      }
    });
  }

  updateScrollGlitter() {
    const vh = window.innerHeight;
    const eraseThreshold = vh * 0.18; // When heading is in top 18% of screen

    this.glitterHeadings.forEach(({ element, chars }) => {
      const rect = element.getBoundingClientRect();
      const top = rect.top;

      if (top < eraseThreshold && top > -rect.height - 80) {
        // Heading is in top erase zone!
        // Calculate progress 0 (just entering erase zone) to 1 (fully scrolled past)
        const progress = Math.min(1, Math.max(0, (eraseThreshold - top) / (eraseThreshold + rect.height * 0.8)));

        chars.forEach((charSpan, idx) => {
          const charThreshold = idx / chars.length;
          const isErased = progress > charThreshold;

          if (isErased && !charSpan.dataset.glitterErased) {
            charSpan.dataset.glitterErased = 'true';
            charSpan.classList.add('glitter-scroll-erased');
            // Trigger glitter burst!
            const charRect = charSpan.getBoundingClientRect();
            this.spawnGlitterFromRect(charRect, 10, 'erase');
          } else if (!isErased && charSpan.dataset.glitterErased) {
            // Scrolling back down: restore letter with sparkle!
            delete charSpan.dataset.glitterErased;
            charSpan.classList.remove('glitter-scroll-erased');
            const charRect = charSpan.getBoundingClientRect();
            this.spawnGlitterFromRect(charRect, 6, 'spawn');
          }
        });
      } else if (top >= eraseThreshold) {
        // Normal visible zone: ensure all chars visible
        chars.forEach(charSpan => {
          if (charSpan.dataset.glitterErased) {
            delete charSpan.dataset.glitterErased;
            charSpan.classList.remove('glitter-scroll-erased');
          }
        });
      }
    });
  }

  /**
   * 3. Hardware-Accelerated Animation & Particle Physics Loop
   */
  startLoop() {
    const loop = () => {
      if (!this.isActive) return;

      this.ctx.clearRect(0, 0, this.width, this.height);

      if (this.particles.length > 0) {
        // Use 'lighter' blend mode for luminous neon stardust glitters
        this.ctx.globalCompositeOperation = 'lighter';

        for (let i = this.particles.length - 1; i >= 0; i--) {
          const p = this.particles[i];

          p.life++;
          p.x += p.vx;
          p.y += p.vy;
          p.vy += p.gravity;
          p.vx *= 0.98; // Air resistance
          p.rotation += p.rotSpeed;
          p.sparklePhase += p.sparkleSpeed;

          // Twinkle alpha curve: base life fade modulated by sharp sparkle sine oscillation
          const lifeProgress = p.life / p.maxLife;
          const baseAlpha = Math.max(0, 1 - lifeProgress);
          const twinkle = 0.5 + 0.5 * Math.sin(p.sparklePhase);
          p.alpha = baseAlpha * twinkle;

          if (p.life >= p.maxLife || p.alpha <= 0.01) {
            this.particles.splice(i, 1);
            continue;
          }

          // Draw Star, Diamond Flake, or Ember
          if (p.type === 'star') {
            this.drawStar(p.x, p.y, p.size * (1 + 0.3 * twinkle), p.size * 0.28, p.rotation, p.alpha, p.color);
          } else if (p.type === 'diamond') {
            this.drawDiamond(p.x, p.y, p.size * 0.9, p.rotation, p.alpha, p.color);
          } else {
            this.drawEmber(p.x, p.y, p.size * 0.65, p.alpha, p.color);
          }
        }

        this.ctx.globalCompositeOperation = 'source-over';
      }

      this.rafId = requestAnimationFrame(loop);
    };

    this.rafId = requestAnimationFrame(loop);
  }

  drawStar(x, y, radius, innerRadius, rotation, alpha, color) {
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.rotate(rotation);
    this.ctx.fillStyle = color;
    this.ctx.globalAlpha = Math.min(1, alpha);
    this.ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      this.ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
      const halfAngle = angle + Math.PI / 4;
      this.ctx.lineTo(Math.cos(halfAngle) * innerRadius, Math.sin(halfAngle) * innerRadius);
    }
    this.ctx.closePath();
    this.ctx.fill();

    // Central bright glow core
    this.ctx.fillStyle = '#ffffff';
    this.ctx.beginPath();
    this.ctx.arc(0, 0, innerRadius * 0.8, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  }

  drawDiamond(x, y, size, rotation, alpha, color) {
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.rotate(rotation);
    this.ctx.fillStyle = color;
    this.ctx.globalAlpha = Math.min(1, alpha);
    this.ctx.beginPath();
    this.ctx.moveTo(0, -size);
    this.ctx.lineTo(size * 0.7, 0);
    this.ctx.lineTo(0, size);
    this.ctx.lineTo(-size * 0.7, 0);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.restore();
  }

  drawEmber(x, y, radius, alpha, color) {
    this.ctx.save();
    this.ctx.fillStyle = color;
    this.ctx.globalAlpha = Math.min(1, alpha);
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  }

  dispose() {
    this.isActive = false;
    this.events.abort();
    if (this.rafId) cancelAnimationFrame(this.rafId);
    if (this.morphTimer) clearTimeout(this.morphTimer);
    this.canvas?.remove();
    this.particles = [];
  }
}
