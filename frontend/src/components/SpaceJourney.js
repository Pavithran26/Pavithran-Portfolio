import { WorldCamera, cameraAt } from './WorldCamera.js';
import { SPACE_CHAPTERS, clamp, flightPosition, interpolateFlight, createPortfolioRoute, destinationIndex, ambientFlight } from '../data/spaceJourneyData.js';
import { CosmicScenes, createPlanet } from './CosmicScenes.js';
import { FEATURED_PROJECTS } from '../data/projectsData.js';
import { PORTFOLIO_DATA } from '../data/portfolioData.js';
import { technologyIcons } from './TechnologyIcons.js';
import { escapeHtml as html } from '../utils/helpers.js';

const readPreference = key => { try { return localStorage.getItem(key); } catch { return null; } };
const savePreference = (key, value) => { try { localStorage.setItem(key, value); } catch { /* Private browsing can disable storage. */ } };
const random = seed => { let state = seed; return () => { state = (state * 1664525 + 1013904223) >>> 0; return state / 4294967296; }; };
const WORLD_NAMES = ['ocean-world', 'rocky-world', 'ring-world'];
const RIGHT_TOOLS = [[.62, .18], [.82, .22], [.91, .47], [.82, .76], [.63, .80], [.53, .53]];
const LEFT_TOOLS = RIGHT_TOOLS.map(([x, y]) => [1 - x, y]);
// Layout offsets ignore reveal transforms, so resizing cannot move camera stops.
const documentTop = element => {
  let top = 0;
  for (let node = element; node; node = node.offsetParent) top += node.offsetTop;
  return top;
};
const smootherstep = value => {
  const t = clamp(value);
  return t * t * t * (t * (t * 6 - 15) + 10);
};
const CAMERA_INTERRUPT_KEYS = new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ']);

/** A single persistent sky. Document scroll is the camera, never an input lock. */
export class SpaceJourney {
  constructor(root) {
    this.root = root;
    this.events = new AbortController();
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.motion = readPreference('portfolio-space-motion') !== 'off' && !this.reducedMotion.matches;
    this.appearance = readPreference('portfolio-universe-theme') === 'light' ? 'light' : 'dark';
    this.position = 0;
    this.cameraScroll = window.scrollY;
    this.animationTime = 0;
    this.pointer = { x: 0, y: 0 };
    this.flight = null;
    this.previousScrollBehavior = '';
    this.root.innerHTML = `<canvas class="universe-stars"></canvas>${WORLD_NAMES.map((name, index) => `<img class="world-art world-art-${index}" src="/images/space/${name}.webp" alt="" width="${index === 2 ? 1536 : 1254}" height="${index === 2 ? 1024 : 1254}" decoding="async" ${index === 0 ? 'fetchpriority="high"' : ''} draggable="false">`).join('')}<div class="universe-darkness"></div>`;
    this.canvas = root.querySelector('canvas');
    this.context = this.canvas.getContext('2d', { alpha: true });

    this.worlds = [...root.querySelectorAll('.world-art')];
    this.cosmic = new CosmicScenes();
    this.worldCamera = new WorldCamera(() => this.requestFrame());
    this.overlay = document.querySelector('#orbit-interface');
    this.overlay.innerHTML = SPACE_CHAPTERS.map((chapter, index) => `<div class="orbit-group" data-orbit="${index + 1}" role="group" aria-label="${chapter.name} technologies" aria-hidden="true" inert>${chapter.tools.map(tool => `<button class="orbit-tool" type="button" data-technology="${html(tool.search)}" aria-label="Explore ${html(tool.name)} skills">${technologyIcons(tool.name, { eager: true })}<span class="orbit-tool-name">${html(tool.name)}</span></button>`).join('')}</div>`).join('');
    this.groups = [...this.overlay.children].map(element => ({ element, buttons: [...element.children] }));
    this.route = createPortfolioRoute(FEATURED_PROJECTS, PORTFOLIO_DATA);
    this.chapterPositions = SPACE_CHAPTERS.map(chapter => this.route.findIndex(stop => stop.selector === '#stack-' + chapter.id));
    this.sections = this.route.map(stop => document.querySelector(stop.selector));
    this.nav = [...document.querySelectorAll('.flight-nav a')];
    this.location = document.querySelector('#flight-location');
    this.motionButton = document.querySelector('#motion-toggle');
    this.appearanceButton = document.querySelector('#appearance-toggle');
    const next = random(2608);
    this.stars = Array.from({ length: 650 }, () => ({ x: next() * 2 - 1, y: next() * 2 - 1, z: next(), brightness: .2 + next() * .65, size: .4 + next() * .9 }));
    this.nodes = Array.from({ length: 64 }, (_, index) => {
      const y = 1 - index / 63 * 2, radius = Math.sqrt(1 - y * y), angle = index * Math.PI * (3 - Math.sqrt(5));
      return { x: Math.cos(angle) * radius, y, z: Math.sin(angle) * radius };
    });
    this.edges = this.nodes.flatMap((node, i) => this.nodes.map((other, j) => ({ j, d: Math.hypot(node.x - other.x, node.y - other.y, node.z - other.z) })).filter(other => other.j > i && other.d < .53).map(other => [i, other.j]));
    this.applyAppearance();
    this.applyMotion();
    const on = (target, type, handler, options = {}) => target.addEventListener(type, handler, { ...options, signal: this.events.signal });
    on(window, 'scroll', () => this.requestFrame(), { passive: true });
    on(window, 'wheel', () => this.cancelFlight(), { passive: true });
    on(window, 'touchstart', () => this.cancelFlight(), { passive: true });
    on(window, 'keydown', event => { if (CAMERA_INTERRUPT_KEYS.has(event.key)) this.cancelFlight(); });
    on(window, 'resize', () => { this.cancelFlight(); this.measure(); }, { passive: true });
    on(window, 'pointermove', event => {
      if (!this.motion || this.compact || event.pointerType !== 'mouse') return;
      this.pointer.x = (event.clientX / this.width - .5) * 2;
      this.pointer.y = (event.clientY / this.height - .5) * 2;
      this.requestFrame();
    }, { passive: true });
    on(document, 'visibilitychange', () => { if (document.hidden) { cancelAnimationFrame(this.frame); this.frame = null; this.lastTime = null; } else this.requestFrame(); });
    on(document, 'close', () => { this.lastTime = null; this.requestFrame(); }, { capture: true });
    on(this.reducedMotion, 'change', () => { this.motion = !this.reducedMotion.matches && readPreference('portfolio-space-motion') !== 'off'; this.applyMotion(true); });
    on(this.motionButton, 'click', () => { this.motion = !this.motion; savePreference('portfolio-space-motion', this.motion ? 'on' : 'off'); this.applyMotion(true); });
    on(this.appearanceButton, 'click', () => { this.appearance = this.appearance === 'dark' ? 'light' : 'dark'; savePreference('portfolio-universe-theme', this.appearance); this.applyAppearance(); this.requestFrame(); });
    // Recalculate after fonts and responsive document flow settle, without a poll.
    this.resizeObserver = new ResizeObserver(() => this.measure());
    this.resizeObserver.observe(document.querySelector('#portfolio'));
    document.fonts?.ready.then(() => { if (!this.disposed) this.measure(); });
    this.measure();
    this.position = flightPosition(window.scrollY, this.stops);
    this.requestFrame();
  }

  flyTo(selector, { updateHistory = true } = {}) {
    if (!selector || selector[0] !== '#') return false;
    const element = document.querySelector(selector);
    if (!element || !this.stops?.length) return false;

    const routeIndex = this.route.findIndex(stop => stop.selector === selector);
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const destination = routeIndex >= 0
      ? this.stops[routeIndex]
      : Math.min(maxScroll, documentTop(element));
    const start = window.scrollY;

    if (updateHistory && window.location.hash !== selector) {
      history.pushState(null, '', selector);
    }

    this.cancelFlight(false);

    if (!this.motion || this.reducedMotion.matches || Math.abs(destination - start) < 2) {
      window.scrollTo(0, destination);
      this.cameraScroll = destination;
      this.position = flightPosition(destination, this.stops);
      this.requestFrame();
      return true;
    }

    const screens = Math.abs(destination - start) / Math.max(1, this.height);
    const duration = Math.min(1500, Math.max(760, 720 + Math.log2(1 + screens) * 210));
    this.previousScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    document.documentElement.classList.add('camera-flying');
    this.flight = {
      from: start,
      to: destination,
      startedAt: null,
      duration,
    };
    this.cameraScroll = start;
    this.position = flightPosition(start, this.stops);
    this.lastTime = null;
    this.requestFrame();
    return true;
  }

  finishFlight() {
    if (!this.flight) return;
    this.flight = null;
    document.documentElement.classList.remove('camera-flying');
    document.documentElement.style.scrollBehavior = this.previousScrollBehavior;
    this.previousScrollBehavior = '';
  }

  cancelFlight(sync = true) {
    if (!this.flight) return;
    this.finishFlight();
    if (sync && this.stops?.length) {
      this.cameraScroll = window.scrollY;
      this.position = flightPosition(this.cameraScroll, this.stops);
      this.lastTime = null;
      this.requestFrame();
    }
  }

  applyMotion(preservePosition = false) {
    const anchor = preservePosition
      ? this.sections.filter(section => documentTop(section) <= window.scrollY + 100).at(-1)
      : null;
    const before = anchor?.getBoundingClientRect().top;
    document.body.classList.toggle('space-reading', !this.motion);
    this.motionButton.textContent = this.motion ? 'Motion on' : 'Motion off';
    this.motionButton.setAttribute('aria-pressed', String(this.motion));
    this.motionButton.setAttribute('aria-label', this.motion ? 'Turn motion off and use reading mode' : 'Turn motion on and explore the space journey');
    if (anchor) window.scrollBy({ top: anchor.getBoundingClientRect().top - before, behavior: 'instant' });
    if (this.stops) this.measure();
  }

  applyAppearance() {
    document.documentElement.dataset.appearance = this.appearance;
    this.appearanceButton.innerHTML = `<span aria-hidden="true">◐</span> ${this.appearance === 'dark' ? 'Light' : 'Dark'}`;
    this.appearanceButton.setAttribute('aria-label', `Switch to ${this.appearance === 'dark' ? 'light' : 'dark'} appearance`);
    document.querySelector('meta[name="theme-color"]').content = this.appearance === 'dark' ? '#05080e' : '#e7e9ed';
  }

  measure() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.compact = this.width < 760;
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - this.height);
    this.stops = this.sections.map((section, index) => index ? Math.min(maxScroll, documentTop(section) + (this.route[index].offset || 0) * this.height) : 0);
    const ratio = Math.min(window.devicePixelRatio || 1, this.compact ? 1.25 : 1.6);
    if (this.canvas.width !== Math.round(this.width * ratio) || this.canvas.height !== Math.round(this.height * ratio)) {
      this.canvas.width = Math.round(this.width * ratio);
      this.canvas.height = Math.round(this.height * ratio);
      this.context?.setTransform(ratio, 0, 0, ratio, 0, 0);
    }
    this.worldCamera.measure(this.width, this.height, this.route, this.stops);
    this.requestFrame();
  }

  requestFrame() {
    if (this.frame == null && !document.hidden && !this.disposed) this.frame = requestAnimationFrame(time => this.render(time));
  }

  render(time) {
    this.frame = null;
    // Paint at the display refresh rate; 30fps throttling desynchronised native scroll.
    this.lastPaint = time;
    const elapsed = Math.min(64, Math.max(1, time - (this.lastTime || time - 16)));
    this.lastTime = time;
    const actualScroll = window.scrollY;
    let target;

    if (this.flight) {
      if (this.flight.startedAt == null) this.flight.startedAt = time;
      const progress = clamp((time - this.flight.startedAt) / this.flight.duration);
      const eased = smootherstep(progress);
      const flightScroll = this.flight.from + (this.flight.to - this.flight.from) * eased;

      this.cameraScroll = flightScroll;
      target = flightPosition(flightScroll, this.stops);
      this.position = target;

      if (Math.abs(window.scrollY - flightScroll) > .25) window.scrollTo(0, flightScroll);

      if (progress >= 1) {
        window.scrollTo(0, this.flight.to);
        this.cameraScroll = this.flight.to;
        target = flightPosition(this.cameraScroll, this.stops);
        this.position = target;
        this.finishFlight();
      }
    } else {
      // Manual scrolling keeps a small amount of damping. The previous implementation
      // assigned actualScroll directly here, which bypassed the intended smoothing and
      // made the camera snap on every wheel/touch update.
      const smoothing = this.motion ? 1 - Math.exp(-elapsed / (this.compact ? 105 : 85)) : 1;
      this.cameraScroll += (actualScroll - this.cameraScroll) * smoothing;
      if (Math.abs(actualScroll - this.cameraScroll) < .25) this.cameraScroll = actualScroll;
      target = flightPosition(this.cameraScroll, this.stops);
      this.position = this.motion ? this.position + (target - this.position) * (1 - Math.exp(-elapsed / 125)) : target;
      if (Math.abs(target - this.position) < .001) this.position = target;
    }
    const modalOpen = Boolean(document.querySelector('dialog[open]'));
    if (this.motion && !modalOpen) this.animationTime += elapsed;
    // All scenery is anchored in world coordinates. Only the shared camera moves.
    this.worlds.forEach(world => { world.style.display = 'none'; });
    const camera = cameraAt(this.cameraScroll, this.stops, this.width);
    document.documentElement.style.setProperty('--camera-x', `${this.motion && !this.compact ? -camera.x : 0}px`);
    const visualScroll = this.flight ? this.cameraScroll : window.scrollY;
    document.documentElement.style.setProperty('--camera-y', `${this.motion ? visualScroll - this.cameraScroll : 0}px`);
    const active = destinationIndex(visualScroll + this.height * .2, this.stops);
    if (this.active !== active) {
      this.active = active;
      this.location.textContent = this.route[active].label;
      this.location.title = this.route[active].label;
      this.nav.forEach(link => { if (link.getAttribute('href') === this.route[active].nav) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); });
      document.body.classList.toggle('beyond-journey', active > this.chapterPositions.at(-1));
    }
    this.positionTools();
    this.worldCamera.draw(this.context, this.motion ? this.cameraScroll : 0, this.appearance === 'light');
    // Idle during modal reading and in hidden tabs. Native close resumes the sky.
    if (this.flight || (this.motion && !modalOpen && (Math.abs(target - this.position) > .001 || this.cameraScroll !== window.scrollY))) this.requestFrame();
  }

  positionTools() {
    this.groups.forEach(({ element, buttons }, index) => {
      const distance = Math.abs(this.position - this.chapterPositions[index]);
      const opacity = this.motion ? clamp((.48 - distance) / .25) : 0;
      const interactive = opacity > .65;
      element.style.opacity = opacity;
      element.inert = !interactive;
      element.setAttribute('aria-hidden', String(!interactive));
      element.classList.toggle('is-active', interactive);
      const positions = index === 1 ? LEFT_TOOLS : RIGHT_TOOLS;
      buttons.forEach((button, toolIndex) => {
        const [x, y] = this.compact ? [.18 + toolIndex % 3 * .32, .68 + Math.floor(toolIndex / 3) * .14] : positions[toolIndex];
        button.style.left = `${x * 100}%`;
        button.style.top = `${y * 100}%`;
        button.style.setProperty('--orbit-drift', `${(this.position - this.chapterPositions[index]) * 50}px`);
      });
    });
  }

  drawSky(pose, time) {
    const ctx = this.context;
    if (!ctx) return;
    const { width: w, height: h } = this;
    const pointer = this.motion ? this.pointer : { x: 0, y: 0 };
    const light = this.appearance === 'light';
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = light ? '#29364b' : '#d9e8ff';
    for (let i = 0; i < this.stars.length; i++) {
      const star = this.stars[i];
      const depth = ((star.z - pose.stars * .014) % 1 + 1) % 1;
      const projection = .35 + depth * 1.7;
      const x = w * .5 + star.x * w / projection + pointer.x * depth * 7;
      const y = h * .5 + star.y * h / projection + pointer.y * depth * 7;
      if (x < 0 || x > w || y < 0 || y > h) continue;
      ctx.globalAlpha = star.brightness * Math.min(1, depth * 7) * (.83 + Math.sin(time * .0002 + i) * .17);
      ctx.beginPath(); ctx.arc(x, y, Math.max(.35, star.size / projection), 0, Math.PI * 2); ctx.fill();
    }
    this.cosmic.draw(ctx, pose, time, w, h, this.compact, light);
    if (pose.neural > .01) {
      const angle = time * .000028 + pose.stars * .08;
      const radius = Math.min(w * (this.compact ? .31 : .19), h * .32);
      const cx = w * (this.compact ? .5 : .73), cy = h * (this.compact ? .61 : .49);
      // A continuously morphing metallic core receives orbiting knowledge signals.
      ctx.save(); ctx.translate(cx, cy);
      const coreRadius = radius * .52;
      const phase = this.motion ? time * .00055 : 0;
      const halo = ctx.createRadialGradient(0, 0, coreRadius * .3, 0, 0, coreRadius * 1.8);
      halo.addColorStop(0, '#8bdfff66'); halo.addColorStop(.5, '#5a83c92a'); halo.addColorStop(1, '#5376dd00');
      ctx.globalAlpha = pose.neural; ctx.fillStyle = halo;
      ctx.fillRect(-coreRadius * 2, -coreRadius * 2, coreRadius * 4, coreRadius * 4);
      const metal = ctx.createLinearGradient(-coreRadius, -coreRadius, coreRadius, coreRadius);
      [[0, '#e7f8ff'], [.2, '#728aa6'], [.38, '#f3ffff'], [.48, '#53647e'], [.62, '#152b46'], [.8, '#8abbd6'], [1, '#d7ceff']].forEach(([stop, color]) => metal.addColorStop(stop, color));
      ctx.beginPath();
      for (let step = 0; step <= 120; step++) {
        const a = step / 120 * Math.PI * 2;
        const r = coreRadius * (1 + .12 * Math.sin(a * 3 + phase) + .065 * Math.cos(a * 5 - phase * 1.3));
        const x = Math.cos(a) * r, y = Math.sin(a) * r;
        if (step === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath(); ctx.fillStyle = metal; ctx.fill();
      ctx.strokeStyle = '#bceaff'; ctx.lineWidth = 1.4; ctx.stroke();
      for (let i = 0; i < 12; i++) {
        const progress = ((phase * .3 + i / 12) % 1);
        const angle = i * 2.4 + phase * .12;
        const r = radius * (1 - progress * .5);
        const x = Math.cos(angle) * r, y = Math.sin(angle) * r;
        ctx.globalAlpha = pose.neural * Math.sin(progress * Math.PI);
        ctx.strokeStyle = i % 2 ? '#9fe6fa' : '#c6b8f0'; ctx.lineWidth = 1;
        if (i % 3 === 0) {
          ctx.strokeRect(x - 5, y - 7, 10, 14);
          ctx.beginPath(); ctx.moveTo(x - 3, y - 2); ctx.lineTo(x + 3, y - 2); ctx.moveTo(x - 3, y + 2); ctx.lineTo(x + 2, y + 2); ctx.stroke();
        } else { ctx.fillStyle = '#c5ecff'; ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fill(); }
      }
      ctx.restore();
      const points = this.nodes.map(node => {
        const x = node.x * Math.cos(angle) - node.z * Math.sin(angle);
        const z = node.x * Math.sin(angle) + node.z * Math.cos(angle);
        const scale = 2.8 / (2.8 - z * .5);
        return { x: cx + x * radius * scale, y: cy + node.y * radius * scale, z };
      });
      ctx.strokeStyle = light ? '#475e83' : '#8b9fc9'; ctx.lineWidth = .65;
      for (const [a, b] of this.edges) {
        ctx.globalAlpha = pose.neural * (.12 + (points[a].z + 1) * .14);
        ctx.beginPath(); ctx.moveTo(points[a].x, points[a].y); ctx.lineTo(points[b].x, points[b].y); ctx.stroke();
      }
      points.forEach((point, index) => {
        ctx.globalAlpha = pose.neural * (.4 + (point.z + 1) * .3);
        ctx.fillStyle = light ? '#263f6d' : index % 4 === 0 ? '#c6b8f0' : '#b8d8fa';
        ctx.beginPath(); ctx.arc(point.x, point.y, index % 9 === 0 ? 3 : 1.5, 0, Math.PI * 2); ctx.fill();
      });
    }
    ctx.globalAlpha = 1;
  }

  dispose() {
    this.disposed = true;
    this.cancelFlight(false);
    cancelAnimationFrame(this.frame);
    this.events.abort();
    this.resizeObserver.disconnect();
    document.documentElement.style.removeProperty('--camera-x');
    document.documentElement.style.removeProperty('--camera-y');
    this.overlay.innerHTML = '';
  }
}
