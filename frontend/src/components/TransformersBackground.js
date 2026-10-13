/**
 * TransformersBackground.js
 * Continuous background playback is the default. Seeking a compressed video
 * on every scroll frame repeatedly invokes the decoder and causes visible
 * stutter on long-GOP media. Scroll-scrubbing remains opt-in for experiments.
 */
export class TransformersBackground {
  constructor(videoSrc = '/videos/Muzan-meets-Ubuyashiki-SnapYT.App.webm', options = {}) {
    this.videoSrc = videoSrc;
    this.lenis = options.lenis || null;
    this.events = new AbortController();
    this.mode = options.mode || 'auto'; // 'auto' (smooth continuous playback) | 'scrub'
    this.isLoaded = false;
    this.isSeeking = false;
    this.pendingTime = null;
    this.seekSafetyTimer = null;
    this.duration = 0;
    this.targetProgress = 0;
    this.currentProgress = 0;
    this.scrollVelocity = 0;
    this.scrollY = 0;
    this.mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    this.rafId = null;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.initDOM();
    this.bindEvents();
    this.startLoop();
  }

  initDOM() {
    document.querySelector('#transformers-viewport')?.remove();
    document.querySelector('.transformers-hud-controls')?.remove();

    this.viewport = document.createElement('div');
    this.viewport.id = 'transformers-viewport';
    this.viewport.className = 'transformers-viewport';
    this.viewport.setAttribute('aria-hidden', 'true');

    this.video = document.createElement('video');
    this.video.className = 'transformers-bg-video';
    this.video.autoplay = this.mode === 'auto' && !this.reducedMotion;
    this.video.loop = this.mode === 'auto';
    this.video.muted = true;
    this.video.defaultMuted = true;
    this.video.playsInline = true;
    this.video.preload = 'metadata';
    this.video.disablePictureInPicture = true;
    this.video.setAttribute('muted', '');
    this.video.setAttribute('playsinline', '');
    this.video.setAttribute('webkit-playsinline', '');
    this.video.setAttribute('preload', 'metadata');

    this.veil = document.createElement('div');
    this.veil.className = 'transformers-veil';
    this.viewport.append(this.video, this.veil);
    document.body.prepend(this.viewport);

    this.video.addEventListener('error', () => {
      this.isLoaded = false;
      this.viewport.classList.add('is-video-fallback');
    }, { once: true, signal: this.events.signal });

    this.video.addEventListener('loadeddata', () => {
      this.viewport.classList.remove('is-video-fallback');
    }, { once: true, signal: this.events.signal });

    this.video.addEventListener('loadedmetadata', () => {
      this.duration = Number.isFinite(this.video.duration) ? this.video.duration : 0;
      this.isLoaded = true;
      if (this.mode === 'scrub') {
        this.video.pause();
        this.video.currentTime = 0;
      } else {
        this.playIfAllowed();
      }
    }, { once: true, signal: this.events.signal });

    this.video.addEventListener('canplay', () => {
      if (this.mode === 'auto') this.playIfAllowed();
    }, { signal: this.events.signal });

    this.video.addEventListener('seeked', () => {
      if (this.mode === 'scrub') this.onFrameDecoded();
    }, { signal: this.events.signal });

    this.video.src = this.videoSrc;
    this.video.load();
  }

  playIfAllowed() {
    if (!this.video || this.mode !== 'auto' || this.reducedMotion || document.hidden) return;
    if (!this.video.paused) return;
    const playback = this.video.play();
    if (playback && typeof playback.catch === 'function') {
      playback.catch(() => {
        // Keep the designed dark fallback if autoplay is blocked; never block page use.
        this.viewport?.classList.add('is-video-fallback');
      });
    }
  }

  bindEvents() {
    const signal = this.events.signal;
    window.addEventListener('pointermove', (event) => {
      if (event.pointerType && event.pointerType !== 'mouse') return;
      this.mouse.tx = (event.clientX / Math.max(1, window.innerWidth) - 0.5) * 2;
      this.mouse.ty = (event.clientY / Math.max(1, window.innerHeight) - 0.5) * 2;
    }, { signal, passive: true });

    const onScroll = () => {
      if (this.lenis || this.mode !== 'scrub') return;
      const currentY = window.scrollY || window.pageYOffset;
      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      this.scrollY = currentY;
      this.targetProgress = Math.min(1, Math.max(0, currentY / maxScroll));
    };
    window.addEventListener('scroll', onScroll, { signal, passive: true });
    window.addEventListener('resize', onScroll, { signal, passive: true });
    onScroll();

    document.addEventListener('visibilitychange', () => {
      if (this.mode !== 'auto' || !this.video) return;
      if (document.hidden) this.video.pause();
      else this.playIfAllowed();
    }, { signal });

    const onMotionPreference = (event) => {
      this.reducedMotion = event.matches;
      if (!this.video || this.mode !== 'auto') return;
      if (this.reducedMotion) this.video.pause();
      else this.playIfAllowed();
    };
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    motionQuery.addEventListener?.('change', onMotionPreference, { signal });
  }

  onScroll({ scroll, limit, progress, velocity } = {}) {
    if (this.mode !== 'scrub') return;
    this.scrollY = scroll || 0;
    this.scrollVelocity = velocity || 0;
    if (typeof progress === 'number' && Number.isFinite(progress)) {
      this.targetProgress = Math.min(1, Math.max(0, progress));
    } else if (typeof limit === 'number' && limit > 0) {
      this.targetProgress = Math.min(1, Math.max(0, this.scrollY / limit));
    }
  }

  onFrameDecoded() {
    this.isSeeking = false;
    if (this.seekSafetyTimer) {
      clearTimeout(this.seekSafetyTimer);
      this.seekSafetyTimer = null;
    }
    if (this.pendingTime !== null) {
      const nextTime = this.pendingTime;
      this.pendingTime = null;
      this.dispatchSeek(nextTime);
    }
  }

  dispatchSeek(targetTime) {
    if (!this.video || !this.isLoaded || this.mode !== 'scrub') return;
    if (this.isSeeking || this.video.seeking) {
      this.pendingTime = targetTime;
      return;
    }
    if (Math.abs(this.video.currentTime - targetTime) < 0.025) return;
    this.isSeeking = true;
    this.video.currentTime = targetTime;
    if (this.seekSafetyTimer) clearTimeout(this.seekSafetyTimer);
    this.seekSafetyTimer = setTimeout(() => this.onFrameDecoded(), 250);
  }

  seekToTime(time) {
    if (!this.video || !this.duration || this.mode !== 'scrub') return;
    const clamped = Math.max(0, Math.min(this.duration, time));
    this.targetProgress = clamped / this.duration;
    this.currentProgress = this.targetProgress;
    this.dispatchSeek(clamped);
  }

  startLoop() {
    const loop = () => {
      this.mouse.x += (this.mouse.tx - this.mouse.x) * 0.08;
      this.mouse.y += (this.mouse.ty - this.mouse.y) * 0.08;
      const shiftX = (this.mouse.x * 4).toFixed(1);
      const shiftY = (this.mouse.y * 3).toFixed(1);
      if (this.video) {
        this.video.style.transform = `translate3d(${shiftX}px, ${shiftY}px, 0) scale(1.025)`;
      }

      // Seeking compressed video at 60+ times/second overloads the decoder.
      // Only the optional scrub mode seeks; normal background playback stays native.
      if (this.mode === 'scrub' && this.video && this.duration > 0) {
        this.currentProgress += (this.targetProgress - this.currentProgress) * 0.12;
        this.dispatchSeek(Math.max(0, Math.min(this.duration, this.currentProgress * this.duration)));
      }
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }

  dispose() {
    this.events.abort();
    if (this.rafId) cancelAnimationFrame(this.rafId);
    if (this.seekSafetyTimer) clearTimeout(this.seekSafetyTimer);
    this.video?.pause();
    if (this.video) {
      this.video.removeAttribute('src');
      this.video.load();
    }
    this.viewport?.remove();
  }
}
