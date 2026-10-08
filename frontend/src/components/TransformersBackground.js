/**
 * TransformersBackground.js
 * Implements Apple / ThreeUI style SCROLL-SCRUBBED Video Playback:
 * - The video DOES NOT play automatically by default.
 * - As the user scrolls down/up, video.currentTime smoothly advances/reverses in exact sync with scroll progress.
 * - Smooth lerping (damping) ensures 60 FPS buttery playback without browser seek stutter.
 * - Calibrated scrub sensitivity maps across active reading folds so the climactic
 *   front tire / celestial wheel animation (14s) is prominently visible right in the front sections!
 * - Interactive HUD with direct scene jump chips (0s Intro, 10s Energy, 14.2s Wheel/Tire Climax),
 *   manual timeline slider, and Vivid Bold contrast toggle.
 */

export class TransformersBackground {
  constructor(videoSrc = '/videos/transformers-optimus-hd.mp4') {
    this.videoSrc = videoSrc;
    this.events = new AbortController();

    this.mode = 'scrub'; // 'scrub' (scroll-controlled) | 'auto' (free play)
    this.isVivid = true;
    this.isSeeking = false;
    this.duration = 17.03;

    this.targetProgress = 0;
    this.currentProgress = 0;
    this.mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    this.scrollY = 0;
    this.rafId = null;

    this.initDOM();
    this.bindEvents();
    this.startLoop();
  }

  initDOM() {
    // 1. Clean any existing instances
    const existing = document.querySelector('#transformers-viewport');
    if (existing) existing.remove();

    const existingHud = document.querySelector('.transformers-hud-controls');
    if (existingHud) existingHud.remove();

    // 2. Create the Viewport Rig
    this.viewport = document.createElement('div');
    this.viewport.id = 'transformers-viewport';
    this.viewport.className = 'transformers-viewport';
    this.viewport.setAttribute('aria-hidden', 'true');

    // 3. Video element configured for frame-accurate scrubbing
    this.video = document.createElement('video');
    this.video.className = 'transformers-bg-video';
    this.video.src = this.videoSrc;
    this.video.autoplay = false;
    this.video.loop = false;
    this.video.muted = true;
    this.video.playsInline = true;
    this.video.preload = 'auto';

    // 4. Subtle Directional Veil (transparent across the stage, soft edge rim)
    this.veil = document.createElement('div');
    this.veil.className = 'transformers-veil';

    this.scanlines = document.createElement('div');
    this.scanlines.className = 'transformers-scanlines';

    this.viewport.appendChild(this.video);
    this.viewport.appendChild(this.veil);
    this.viewport.appendChild(this.scanlines);

    // Prepend to body behind page content
    document.body.prepend(this.viewport);

    // 5. Floating HUD Controls with Scrub Telemetry & Scene Jumpers
    this.hud = document.createElement('aside');
    this.hud.className = 'transformers-hud-controls';
    this.hud.setAttribute('aria-label', 'Cinematic Background Controls');
    this.hud.innerHTML = `
      <div class="tf-hud-badge" title="Scroll-Scrubbed Cybertronian Video">
        <svg class="tf-insignia-icon" viewBox="0 0 100 100">
          <polygon points="50,4 20,24 20,68 34,78 34,60 42,60 42,70 50,74 58,70 58,60 66,60 66,78 80,68 80,24" />
          <polygon points="50,22 36,36 42,46 50,40 58,46 64,36" fill="#fff" />
          <polygon points="45,54 55,54 50,58" fill="#fff" />
          <rect x="28" y="44" width="8" height="12" fill="#fff" />
          <rect x="64" y="44" width="8" height="12" fill="#fff" />
        </svg>
        <span id="tf-scrub-label">SCROLL // SCRUB</span>
      </div>

      <div class="tf-scrub-time" id="tf-time-display">0.0s / 17.0s</div>

      <!-- Quick Scene Jump Buttons -->
      <div class="tf-scene-jumps" role="group" aria-label="Jump to video moments">
        <button type="button" class="tf-scene-chip" data-time="0" title="Jump to Opening">0s Intro</button>
        <button type="button" class="tf-scene-chip" data-time="9.5" title="Jump to Power Surge">9.5s Power</button>
        <button type="button" class="tf-scene-chip highlight" data-time="14.2" title="Jump to Front Tire / Celestial Wheel Climax">14.2s Wheel / Tire ⚡</button>
      </div>

      <!-- Mini Timeline Slider -->
      <input type="range" class="tf-hud-slider" id="tf-scrub-slider" min="0" max="17.03" step="0.1" value="0" title="Drag to seek video manually" />

      <button type="button" class="tf-hud-btn" id="tf-mode-toggle" title="Switch between Scroll-Scrub and Autoplay">
        <span id="tf-mode-icon">📜</span> <span id="tf-mode-text">SCRUB MODE</span>
      </button>

      <button type="button" class="tf-hud-btn active" id="tf-vivid-toggle" title="Toggle background bold vibrancy">
        <span>⚡</span> <span>VIVID BOLD</span>
      </button>
    `;
    document.body.appendChild(this.hud);

    // Initial setup on loaded metadata
    const onMetadata = () => {
      this.duration = this.video.duration || 17.03;
      const slider = this.hud.querySelector('#tf-scrub-slider');
      if (slider) slider.max = this.duration;

      this.video.pause();
      // Paint first frame
      this.video.currentTime = 0.001;
      this.updateTimeDisplay(0);
    };

    if (this.video.readyState >= 1) {
      onMetadata();
    } else {
      this.video.addEventListener('loadedmetadata', onMetadata, { once: true });
    }

    // Unlock seek state when seeking completes
    this.video.addEventListener('seeked', () => {
      this.isSeeking = false;
    });
  }

  bindEvents() {
    const signal = this.events.signal;

    // Mouse coordinates for 3D parallax
    window.addEventListener('pointermove', (e) => {
      this.mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      this.mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { signal, passive: true });

    // Track scroll position:
    // Calibrated so that in the top sections (Hero + Featured Projects ~ 2400px of scrolling),
    // the video traverses its full 17s transformation arc, bringing the front tire/wheel right into view!
    const onScroll = () => {
      const currentY = window.scrollY || window.pageYOffset;
      this.scrollY = currentY;

      if (this.mode === 'scrub') {
        const cycleDistance = Math.max(window.innerHeight * 2.8, 2400);
        const rawProgress = (currentY % cycleDistance) / cycleDistance;
        this.targetProgress = Math.min(1, Math.max(0, rawProgress));
      }
    };

    window.addEventListener('scroll', onScroll, { signal, passive: true });
    window.addEventListener('resize', onScroll, { signal, passive: true });
    onScroll();

    // Mode Toggle (Scrub vs Autoplay)
    const modeBtn = this.hud.querySelector('#tf-mode-toggle');
    const modeIcon = this.hud.querySelector('#tf-mode-icon');
    const modeText = this.hud.querySelector('#tf-mode-text');
    const scrubLabel = this.hud.querySelector('#tf-scrub-label');

    modeBtn?.addEventListener('click', () => {
      if (this.mode === 'scrub') {
        // Switch to autoplay
        this.mode = 'auto';
        this.video.loop = true;
        this.video.play();
        modeBtn.classList.add('active');
        if (modeIcon) modeIcon.textContent = '▶';
        if (modeText) modeText.textContent = 'AUTO PLAY';
        if (scrubLabel) scrubLabel.textContent = 'TRANSFORMERS // PLAY';
      } else {
        // Switch back to scroll scrub
        this.mode = 'scrub';
        this.video.pause();
        this.video.loop = false;
        modeBtn.classList.remove('active');
        if (modeIcon) modeIcon.textContent = '📜';
        if (modeText) modeText.textContent = 'SCRUB MODE';
        if (scrubLabel) scrubLabel.textContent = 'SCROLL // SCRUB';
        onScroll();
      }
    }, { signal });

    // Vivid Bold Contrast Toggle
    const vividBtn = this.hud.querySelector('#tf-vivid-toggle');
    vividBtn?.addEventListener('click', () => {
      this.isVivid = !this.isVivid;
      vividBtn.classList.toggle('active', this.isVivid);
      if (this.isVivid) {
        this.video.style.filter = 'contrast(1.22) brightness(1.08) saturate(1.35)';
      } else {
        this.video.style.filter = 'contrast(1.08) brightness(1.0) saturate(1.15)';
      }
    }, { signal });

    // Scene Jump Chips
    const sceneChips = this.hud.querySelectorAll('.tf-scene-chip');
    sceneChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const time = parseFloat(chip.dataset.time || '0');
        this.seekToTime(time);
      }, { signal });
    });

    // Range Slider Scrubbing
    const slider = this.hud.querySelector('#tf-scrub-slider');
    slider?.addEventListener('input', (e) => {
      const time = parseFloat(e.target.value);
      this.seekToTime(time);
    }, { signal });
  }

  seekToTime(time) {
    if (!this.video || !this.duration) return;
    const clamped = Math.max(0, Math.min(this.duration, time));
    this.targetProgress = clamped / this.duration;
    this.currentProgress = this.targetProgress;
    this.video.currentTime = clamped;
    this.updateTimeDisplay(clamped);

    const slider = this.hud.querySelector('#tf-scrub-slider');
    if (slider) slider.value = clamped;
  }

  updateTimeDisplay(currentTime) {
    const display = this.hud?.querySelector('#tf-time-display');
    if (display) {
      const cur = currentTime.toFixed(1);
      const dur = (this.duration || 17.03).toFixed(1);
      display.textContent = `${cur}s / ${dur}s`;
    }

    const slider = this.hud?.querySelector('#tf-scrub-slider');
    if (slider && document.activeElement !== slider) {
      slider.value = currentTime;
    }
  }

  startLoop() {
    const loop = () => {
      // 1. Lerp mouse for subtle 3D parallax
      this.mouse.x += (this.mouse.tx - this.mouse.x) * 0.05;
      this.mouse.y += (this.mouse.ty - this.mouse.y) * 0.05;

      const shiftX = Math.round(this.mouse.x * 10);
      const shiftY = Math.round(this.mouse.y * 6);
      const scrollScale = (1.02 + Math.min(0.03, (this.scrollY / 6000))).toFixed(3);

      if (this.video) {
        this.video.style.transform = `scale(${scrollScale}) translate3d(${shiftX}px, ${shiftY}px, 0)`;
      }

      // 2. Scroll-Scrubbing Logic (when in 'scrub' mode)
      if (this.mode === 'scrub' && this.video && this.duration > 0) {
        // Smooth lerp progress towards target scroll position
        this.currentProgress += (this.targetProgress - this.currentProgress) * 0.14;

        const targetTime = this.currentProgress * this.duration;

        // Seek video if delta is significant and not currently busy seeking
        if (!this.isSeeking && Math.abs(this.video.currentTime - targetTime) > 0.02) {
          this.isSeeking = true;
          this.video.currentTime = targetTime;
          this.updateTimeDisplay(targetTime);
        }
      } else if (this.mode === 'auto' && this.video) {
        this.updateTimeDisplay(this.video.currentTime);
      }

      this.rafId = requestAnimationFrame(loop);
    };

    this.rafId = requestAnimationFrame(loop);
  }

  dispose() {
    this.events.abort();
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.viewport?.remove();
    this.hud?.remove();
  }
}
