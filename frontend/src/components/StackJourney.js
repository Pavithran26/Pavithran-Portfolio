import { STACK_CHAPTERS, clamp, smoothstep, positionForProgress, progressForChapter } from '../data/stackJourney.js';
import { escapeHtml as html } from '../utils/helpers.js';
import { technologyIcons } from './TechnologyIcons.js';

export class StackJourney {
  constructor(root, { onInspect, onTechnology, motion = true } = {}) {
    this.root = root;
    this.onInspect = onInspect;
    this.onTechnology = onTechnology;
    this.motion = motion;
    this.position = 0;
    this.active = -1;
    this.linear = false;
    this.disposed = false;
    this.events = new AbortController();
    this.compactQuery = window.matchMedia('(max-height: 650px), (max-width: 759px) and (max-height: 700px), (max-width: 359px)');
    this.render();
    this.attachEvents();
    this.setMotion(motion);
    this.sceneObserver = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { this.sceneObserver.disconnect(); this.loadScene(); }
    }, { rootMargin: '100px' });
    this.sceneObserver.observe(root);
  }

  render() {
    this.root.innerHTML = `
      <h1 class="visually-hidden" id="stack-title">Pavithran S. — from frontend to applied AI</h1>
      <div class="journey-stage">
        <div class="journey-atmosphere" aria-hidden="true"><img src="/images/engineering-core.webp" alt="" width="1536" height="1024" decoding="async"></div>
        <div class="journey-scene" id="journey-scene" aria-hidden="true"></div>
        <div class="journey-shade" aria-hidden="true"></div>
        <div class="journey-topline"><span class="eyebrow">PAVITHRAN S. / SOFTWARE ENGINEER</span><div><button class="journey-all-skills" type="button" data-dialog="skills">All skills <span aria-hidden="true">↗</span></button><button id="motion-toggle" class="motion-toggle" type="button" aria-pressed="true">Motion on</button></div></div>
        <div class="journey-panels">
          ${STACK_CHAPTERS.map((chapter, index) => `
            <article class="journey-chapter" id="stack-${chapter.id}" data-chapter="${index}" style="--chapter-accent: ${chapter.accent}" aria-labelledby="chapter-title-${index}">
              <div class="chapter-copy">
                <p class="eyebrow chapter-eyebrow"><span>${chapter.number}</span> / ${html(chapter.eyebrow)}</p>
                <h2 id="chapter-title-${index}">${html(chapter.heading[0])}<br><span>${html(chapter.heading[1])}</span></h2>
                <p class="chapter-tagline">${html(chapter.tagline)}</p>
                <p class="chapter-description">${html(chapter.description)}</p>
                <div class="chapter-specs">${chapter.groups.map(group => `<div><h3>${html(group.label)}</h3><ul class="chapter-tool-list">${group.items.map(item => `<li>${technologyIcons(item, { eager: true })}<span>${html(item)}</span></li>`).join('')}</ul></div>`).join('')}</div>
                <button class="chapter-inspect text-link" type="button" data-inspect-chapter="${index}">${html(chapter.detail)} <span aria-hidden="true">↗</span></button>
              </div>
              <div class="chapter-technologies" aria-label="${html(chapter.name)} technologies">
                <div class="chapter-scene-label eyebrow" aria-hidden="true">${chapter.number} / ${html(chapter.sceneLabel)}</div>
                ${chapter.highlights.map((tech, techIndex) => `<button class="technology-callout tech-slot-${techIndex}" type="button" data-technology="${html(tech.search)}" style="--card-order:${techIndex}" aria-label="Explore ${html(tech.name)}"><span class="technology-mark">${technologyIcons(tech.name, { eager: true })}</span><span class="technology-copy"><strong>${html(tech.name)}</strong><small>${html(tech.role)}</small></span><span class="technology-arrow" aria-hidden="true">↗</span></button>`).join('')}
                <p class="chapter-application"><span class="eyebrow">IN PRACTICE</span>${html(chapter.application)}</p>
              </div>
            </article>`).join('')}
        </div>
        <div class="journey-footer">
          <div class="journey-scroll-cue"><span aria-hidden="true">↓</span><div><span class="eyebrow">SCROLL THROUGH MY STACK</span><span id="chapter-next">Next: backend & logic</span></div></div>
          <nav class="chapter-nav" aria-label="Technology journey">${STACK_CHAPTERS.map((chapter, index) => `<button type="button" data-jump-chapter="${index}" aria-label="Go to ${html(chapter.name)}"><span class="chapter-nav-number">${chapter.number}</span><span>${html(chapter.name)}</span><span class="chapter-progress" aria-hidden="true"><i></i></span></button>`).join('')}</nav>
          <a class="journey-skip" href="#work">Explore the work <span aria-hidden="true">↗</span></a>
        </div>
      </div>`;
    this.viewport = this.root.querySelector('.journey-stage');
    this.panels = [...this.root.querySelectorAll('[data-chapter]')];
    this.buttons = [...this.root.querySelectorAll('[data-jump-chapter]')];
    this.nextLabel = this.root.querySelector('#chapter-next');
    this.motionButton = this.root.querySelector('#motion-toggle');
    this.motionButton.addEventListener('click', () => this.root.dispatchEvent(new CustomEvent('journey-motion-toggle', { bubbles: true })));
  }

  attachEvents() {
    const signal = this.events.signal;
    this.root.addEventListener('click', event => {
      const target = event.target.closest('[data-jump-chapter], [data-inspect-chapter], [data-technology]');
      if (!target) return;
      if (target.dataset.jumpChapter !== undefined) this.jumpTo(Number(target.dataset.jumpChapter));
      if (target.dataset.inspectChapter !== undefined) this.onInspect?.(STACK_CHAPTERS[Number(target.dataset.inspectChapter)]);
      if (target.dataset.technology) this.onTechnology?.(target.dataset.technology);
    }, { signal });
    window.addEventListener('scroll', () => this.scheduleUpdate(), { passive: true, signal });
    window.addEventListener('resize', () => this.handleResize(), { passive: true, signal });
    window.addEventListener('hashchange', () => this.followHash(), { signal });
    this.compactQuery.addEventListener('change', () => this.handleResize(), { signal });
    this.root.querySelector('.chapter-nav').addEventListener('keydown', event => {
      const index = this.buttons.indexOf(event.target.closest('button'));
      if (index < 0) return;
      let next;
      if (event.key === 'ArrowRight') next = Math.min(index + 1, this.buttons.length - 1);
      if (event.key === 'ArrowLeft') next = Math.max(index - 1, 0);
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = this.buttons.length - 1;
      if (next !== undefined) { event.preventDefault(); this.buttons[next].focus({ preventScroll: true }); this.jumpTo(next); }
    }, { signal });
    // Defer initial anchor positioning until the surrounding content has been rendered.
    this.initialFrame = requestAnimationFrame(() => this.followHash());
  }

  updateLayout() {
    const wasLinear = this.linear;
    this.linear = !this.motion || this.compactQuery.matches;
    this.root.classList.toggle('journey-linear', this.linear);
    this.root.dataset.mode = this.linear ? 'reading' : 'cinematic';
    this.scene?.setMotion(this.motion && !this.linear);
    if (wasLinear !== this.linear) this.active = -1;
  }

  handleResize() {
    const index = Math.max(0, this.active), previousMode = this.linear;
    const rect = this.root.getBoundingClientRect();
    const inside = rect.top <= 0 && rect.bottom > window.innerHeight;
    this.updateLayout();
    if (inside && previousMode !== this.linear) this.jumpTo(index, true);
    this.scheduleUpdate();
  }

  setMotion(enabled) {
    const previousIndex = Math.max(0, this.active);
    const rect = this.root.getBoundingClientRect();
    const inside = rect.top <= 0 && rect.bottom > window.innerHeight;
    const changed = this.motion !== enabled;
    this.motion = enabled;
    this.motionButton.textContent = `Motion ${enabled ? 'on' : 'off'}`;
    this.motionButton.setAttribute('aria-pressed', String(enabled));
    this.updateLayout();
    this.scene?.setMotion(enabled && !this.linear);
    this.update();
    if (changed && inside) this.jumpTo(previousIndex, true);
  }

  followHash() {
    const chapter = STACK_CHAPTERS.findIndex(item => window.location.hash === `#stack-${item.id}`);
    if (chapter !== -1) this.jumpTo(chapter, true);
  }

  jumpTo(index, instant = false) {
    if (!Number.isInteger(index) || index < 0 || index >= this.panels.length) return;
    let top;
    if (this.linear) top = this.panels[index].getBoundingClientRect().top + window.scrollY - 94;
    else {
      const start = this.root.getBoundingClientRect().top + window.scrollY;
      const travel = Math.max(0, this.root.offsetHeight - this.viewport.offsetHeight);
      top = start + travel * progressForChapter(index);
    }
    window.scrollTo({ top: Math.max(0, top), behavior: this.motion && !instant ? 'smooth' : 'instant' });
  }

  scheduleUpdate() {
    if (this.frame || this.disposed) return;
    this.frame = requestAnimationFrame(() => { this.frame = null; this.update(); });
  }

  update() {
    if (this.disposed) return;
    const rect = this.root.getBoundingClientRect();
    const travel = Math.max(1, this.root.offsetHeight - this.viewport.offsetHeight);
    const progress = clamp(-rect.top / travel);
    let position = positionForProgress(progress);
    if (this.linear) {
      const distances = this.panels.map(panel => Math.abs(panel.getBoundingClientRect().top - window.innerHeight * .25));
      position = distances.indexOf(Math.min(...distances));
    }
    this.position = position;
    const active = Math.round(position);
    this.panels.forEach((panel, index) => {
      const distance = Math.abs(position - index);
      const opacity = this.linear ? 1 : 1 - smoothstep(.08, .49, distance);
      panel.style.setProperty('--chapter-opacity', opacity.toFixed(3));
      panel.style.setProperty('--chapter-shift', `${this.linear ? 0 : (index - position) * 64}px`);
      panel.style.setProperty('--chapter-depth', `${this.linear ? 0 : -distance * 100}px`);
      panel.style.visibility = this.linear || distance < .53 ? 'visible' : 'hidden';
      panel.inert = !this.linear && index !== active;
      panel.setAttribute('aria-hidden', String(!this.linear && index !== active));
      panel.classList.toggle('is-current', index === active);
    });
    this.buttons.forEach((button, index) => {
      if (index === active) button.setAttribute('aria-current', 'step'); else button.removeAttribute('aria-current');
      const fill = this.linear ? (index <= active ? 1 : 0) : clamp(progress * STACK_CHAPTERS.length - index);
      button.querySelector('i').style.transform = `scaleX(${fill})`;
    });
    if (active !== this.active) {
      this.active = active;
      const chapter = STACK_CHAPTERS[active];
      this.root.dataset.activeChapter = chapter.id;
      this.root.style.setProperty('--journey-accent', chapter.accent);
      this.nextLabel.textContent = chapter.next;
    }
    this.scene?.setPosition(position);
  }

  async loadScene() {
    if (this.sceneLoading || this.disposed) return;
    this.sceneLoading = true;
    try {
      const { JourneyScene } = await import('./JourneyScene.js');
      if (this.disposed) return;
      this.scene = new JourneyScene(this.root.querySelector('#journey-scene'), { motion: this.motion && !this.linear });
      await this.scene.init();
      if (this.disposed) { this.scene.dispose(); return; }
      this.scene.setPosition(this.position);
      this.root.classList.add('scene-ready');
    } catch {
      this.scene?.dispose(); this.scene = null;
      // Every chapter and tool remains usable independently of graphics support.
      this.root.classList.add('scene-unavailable');
    }
  }

  dispose() {
    this.disposed = true; this.events.abort(); this.sceneObserver?.disconnect();
    cancelAnimationFrame(this.frame); cancelAnimationFrame(this.initialFrame); this.scene?.dispose();
  }
}
