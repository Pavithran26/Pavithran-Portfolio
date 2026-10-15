import { educationCharacter } from './components/EducationCharacter.js';
import { CursorSpotlight } from './components/CursorSpotlight.js';
import './style.css';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { PORTFOLIO_DATA as profile } from './data/portfolioData.js';
import { FEATURED_PROJECTS as featuredProjects, PROJECTS_DATA } from './data/projectsData.js';
import { SPACE_CHAPTERS as chapters } from './data/spaceJourneyData.js';
import { PortfolioDialogs } from './components/PortfolioDialogs.js';
import { projectVisual, PROJECT_SCENES } from './components/ProjectVisuals.js';
import { technologyIcons } from './components/TechnologyIcons.js';
import { getClaraEyeAvatarHtml } from './components/ClaraWidget.js';
import { escapeHtml as html } from './utils/helpers.js';
import { TransformersBackground } from './components/TransformersBackground.js';
import { ScrollDepthController } from './components/ScrollDepthController.js';
import { GlitterTextEngine } from './components/GlitterTextEngine.js';
import { FramerMotionPhysics } from './utils/FramerMotionPhysics.js';


const root = document.querySelector('#portfolio');
root.innerHTML = `
  <section class="space-intro" id="top" aria-labelledby="intro-title">
    <div class="intro-identity">
      <p class="space-kicker">TAMIL NADU, INDIA · FORWARD DEPLOYED ENGINEER (FDE)</p>
      <h1 id="intro-title">Pavithran <em>S</em></h1>
      <p class="intro-statement">Thoughtful interfaces.<br>Dependable systems.<br>A little intelligence in between.</p>
      <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
        <a class="intro-enter" href="#work">Explore my work <span aria-hidden="true">↓</span></a>
      </div>
    </div>
    <p class="intro-caption">A SMALL PART OF<br>A MUCH BIGGER UNIVERSE</p>
  </section>

  <section class="space-work space-section" id="work" aria-labelledby="work-title">
    <div class="space-content work-wide-content">
      <p class="space-kicker">IDEAS, BUILT INTO REAL THINGS</p>
      <h2 id="work-title">Selected <em>work & projects.</em></h2>
      <p class="section-intro">Different problems. The same relentless curiosity. Every application below was architected, written, and deployed to solve tangible challenges.</p>

      <nav class="project-index" aria-label="Browse featured projects">
        ${featuredProjects.map(project => `<a href="#project-${project.id}">${html(project.title)}</a>`).join('')}
        <button class="space-text-link" type="button" data-dialog="dossier" style="margin-left: 8px; color: var(--tf-energon); font-weight: 500;">All 16 Projects Dossier ↗</button>
      </nav>

      <!-- Featured Flagship Showcase -->
      <div class="space-projects">
        ${featuredProjects.map(project => `
          <article id="project-${project.id}" class="project-destination" data-card-project="${project.id}">
            <div class="project-copy">
              <button class="space-project-title" type="button" data-project="${project.id}">
                <span>${html(project.title)}</span><span aria-hidden="true">↗</span>
              </button>
              <p class="project-tagline">${html(project.tagline)}</p>
              <p class="project-summary">${html(project.overview)}</p>
              <div class="project-links">
                <button class="space-text-link" type="button" data-project="${project.id}">Explore technical dossier ↗</button>
                ${project.liveUrl ? `<a class="space-text-link" href="${html(project.liveUrl)}" target="_blank" rel="noopener noreferrer">Visit live app ↗</a>` : ''}
              </div>
            </div>
          </article>
        `).join('')}
      </div>

      <section class="live-preview-lab" aria-labelledby="live-preview-title">
        <p class="space-kicker">LIVE APP WALKTHROUGH</p>
        <h3 id="live-preview-title">Step inside the <em>live work.</em></h3>
        <p class="live-preview-intro">Explore the real deployed apps without leaving this page. Previews load only when you ask, so Normal mode stays quick and lightweight.</p>
        <div class="live-preview-tabs" role="group" aria-label="Choose a live project to preview">
          <button type="button" class="live-preview-tab is-active" data-preview-select="clansure" aria-pressed="true">ClanSure</button>
          <button type="button" class="live-preview-tab" data-preview-select="gt-companion" aria-pressed="false">GT Companion</button>
          <button type="button" class="live-preview-tab" data-preview-select="prismiq" aria-pressed="false">PrismIQ</button>
        </div>
        <div class="live-preview-shell">
          <div class="live-preview-toolbar">
            <div><span class="live-preview-status-dot" aria-hidden="true"></span><strong id="live-preview-name">ClanSure</strong><span class="live-preview-caption">LIVE ENVIRONMENT</span></div>
            <div class="live-preview-toolbar-actions">
              <a id="live-preview-open" class="space-text-link" href="https://clansure.vercel.app/" target="_blank" rel="noopener noreferrer">Open full app ↗</a>
              <button id="live-preview-toggle" class="live-preview-load" type="button" data-live-preview aria-expanded="false" aria-controls="live-preview-frame">Load preview</button>
            </div>
          </div>
          <div id="live-preview-frame" class="live-preview-frame-wrap" hidden></div>
          <p class="live-preview-help">If a live app refuses to display inside the frame, use <strong>Open full app</strong>. Each app controls whether other websites may embed it, and sign-in popups or third-party cookies may work better in a separate tab.</p>
        </div>
      </section>
    </div>
  </section>

  <section class="space-about space-section" id="about" aria-labelledby="about-title">
    <div class="space-content">
      <p class="space-kicker">THE PERSON BEHIND THE WORK</p>
      <h2 id="about-title">Always curious.<br><em>Still building.</em></h2>
      <p class="section-intro">I'm Pavithran S, a Forward Deployed Engineer (FDE) from Tamil Nadu. I like making complicated things feel simple, from the first interaction to the systems underneath.</p>
      <div class="space-experience" id="experience">
        ${profile.experience.map((job, index) => `
          <article id="experience-${index}">
            <p class="space-kicker">${html(job.period)}</p>
            <h3>${html(job.role)}</h3>
            <p class="experience-company">${html(job.company)} · ${html(job.location)}</p>
            <p>${html(job.responsibilities[0])}</p>
          </article>
        `).join('')}
      </div>
      <div class="space-actions">
        <button class="space-text-link" type="button" data-dialog="dossier">The full story <span aria-hidden="true">↗</span></button>
        <button class="space-text-link" type="button" data-dialog="skills">All skills & tools <span aria-hidden="true">↗</span></button>
        <a class="space-text-link" href="#education">Education & training <span aria-hidden="true">↓</span></a>
      </div>
    </div>
  </section>

  ${chapters.map((chapter, index) => `
    <section class="world-section world-section-${chapter.side}" id="stack-${chapter.id}" data-world-section="${index + 1}" aria-labelledby="world-title-${chapter.id}">
      <div class="world-copy">
        <p class="space-kicker">${chapter.orbit}</p>
        <h2 id="world-title-${chapter.id}">${chapter.headline}</h2>
        <p class="world-tagline">${html(chapter.tagline)}</p>
        <p class="world-description">${html(chapter.description)}</p>
        <button class="space-text-link" type="button" data-inspect-world="${index}">Explore this part of my work <span aria-hidden="true">↗</span></button>
        <div class="reading-tools" aria-label="${chapter.name} technologies">
          ${chapter.tools.map(tool => `<button type="button" data-technology="${html(tool.search)}">${technologyIcons(tool.name)}<span>${html(tool.name)}</span></button>`).join('')}
        </div>
      </div>
    </section>
  `).join('')}

  <div id="journey-finish" aria-hidden="true"></div>

  <section class="space-learning space-section" id="education" aria-labelledby="education-title">
    <div class="space-content">
      <p class="space-kicker">THE FOUNDATIONS</p>
      <h2 id="education-title">Learning,<br><em>layer by layer.</em></h2>
      <div class="space-education">
        ${profile.education.map((education, index) => `
          <article id="education-${index}" class="education-milestone">
            <div class="education-copy">
              <p class="space-kicker">${html(education.period)}</p>
              <h3>${html(education.degree)}</h3>
              <p class="experience-company">${html(education.institution)}</p>
              <p>${html(education.highlights)}</p>
            </div>
          </article>
        `).join('')}
      </div>
      <h3 class="story-subheading" id="recognition" style="margin-top: 48px; font-family: var(--font-display); font-size: 2.2rem; font-weight: 400;">Training & recognition</h3>
      <div class="space-recognition">
        ${profile.training.map(item => `
          <article>
            <p class="space-kicker">${html(item.date)}</p>
            <h3>${html(item.title)}</h3>
            <p>${html(item.organization)} · ${html(item.description)}</p>
            <p class="training-certificate">Certificate: ${html(item.certificate)}</p>
          </article>
        `).join('')}
        ${profile.achievements.map(item => `
          <article>
            <p class="space-kicker">${html(item.date)}</p>
            <h3>${html(item.title)}</h3>
            <p>${html(item.organization)}</p>
            <p>${html(item.description)}</p>
          </article>
        `).join('')}
      </div>
      <div style="margin-top: 24px;">
        <a class="space-text-link" href="${profile.links.certifications}" target="_blank" rel="noopener noreferrer">View certificate gallery <span aria-hidden="true">↗</span></a>
      </div>
    </div>
  </section>

  <section class="space-dawn space-section" id="dawn" aria-labelledby="dawn-title">
    <div class="space-content">
      <p class="space-kicker">A CONVERSATION, IF YOU'RE CURIOUS</p>
      <h2 id="dawn-title">Meet <em>DAWN.</em></h2>
      <p class="section-intro">An AI guide grounded in my real projects, codebase architectures, and technical experience. Ask a question and explore the work interactively.</p>
      <div class="space-actions">
        <button type="button" class="space-text-link" data-dialog="dawn">Open conversation with DAWN <span aria-hidden="true">↗</span></button>
      </div>
    </div>
  </section>

  <footer class="space-contact space-section" id="contact">
    <div class="space-content">
      <p class="space-kicker">THE NEXT CHAPTER</p>
      <h2>Let's make<br><em>something matter.</em></h2>
      <a class="space-email" href="mailto:${html(profile.email)}">${html(profile.email)} <span aria-hidden="true">↗</span></a>
      <div class="space-socials">
        <a href="${profile.links.github}" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
        <a href="${profile.links.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
        <a href="${profile.links.leetcode}" target="_blank" rel="noopener noreferrer">LeetCode ↗</a>
        <a href="${profile.links.hackerrank}" target="_blank" rel="noopener noreferrer">HackerRank ↗</a>
        <a href="${profile.links.codechef}" target="_blank" rel="noopener noreferrer">CodeChef ↗</a>
        <a href="${profile.links.geeksforgeeks}" target="_blank" rel="noopener noreferrer">GeeksforGeeks ↗</a>
        <a href="${profile.links.youtube}" target="_blank" rel="noopener noreferrer">YouTube ↗</a>
        <button type="button" id="copy-email">Copy email</button>
      </div>
      <p id="copy-feedback" role="status"></p>
      <div class="space-colophon">
        <span>© ${new Date().getFullYear()} ${html(profile.name)} · Forward Deployed Engineer (FDE)</span>
        <button type="button" data-dialog="terminal">Developer terminal ↗</button>
        <a href="#top">Back to the beginning ↑</a>
      </div>
    </div>
  </footer>
`;

// ─── INITIALIZE LENIS ULTRA-SMOOTH VIRTUAL SCROLL ENGINE ───────────
const lenis = new Lenis({
  duration: 1.35,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential deceleration curve
  orientation: 'vertical',
  gestureOrientation: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 0.95,
  touchMultiplier: 1.4,
  infinite: false,
});

// Initially pause scrolling while the speedometer on-load sequence is running
lenis.stop();

let spotlight = null;
let transformersBg = null;
let scrollDepth = null;
let glitterEngine = null;
let motionPhysics = null;
let experienceMode = null;
let animationScrollListenerBound = false;

document.querySelector('#liquid-cursor-container')?.remove();
document.querySelector('.liquid-svg-defs')?.remove();

// Heavy visuals are created only after the visitor explicitly chooses Animation mode.
function initializeAnimationExperience() {
  if (experienceMode !== 'animation') return;

  spotlight = spotlight || new CursorSpotlight(root);
  transformersBg = transformersBg || new TransformersBackground('/videos/Muzan-meets-Ubuyashiki-SnapYT.App.webm', { lenis });
  scrollDepth = scrollDepth || new ScrollDepthController({ lenis });
  glitterEngine = glitterEngine || new GlitterTextEngine({ lenis });
  motionPhysics = motionPhysics || new FramerMotionPhysics();

  if (!animationScrollListenerBound) {
    lenis.on('scroll', (e) => {
      transformersBg?.onScroll(e);
      scrollDepth?.onScroll(e);
    });
    animationScrollListenerBound = true;
  }

  const dawnVideo = document.querySelector('#dawn-eye .dawn-katana-video');
  if (dawnVideo && !dawnVideo.getAttribute('src')) {
    dawnVideo.setAttribute('src', dawnVideo.dataset.src || '/videos/katana-blade.mp4');
    dawnVideo.load();
    dawnVideo.play().catch(() => {});
  }
}

// Master hardware-synchronized animation loop
let lenisRafId = null;
function rafLoop(time) {
  lenis.raf(time);
  lenisRafId = requestAnimationFrame(rafLoop);
}
lenisRafId = requestAnimationFrame(rafLoop);

const eyeButton = document.querySelector('#dawn-eye');

const dialogs = new PortfolioDialogs();
const events = new AbortController();
const on = (target, type, handler, options = {}) => {
  if (target) target.addEventListener(type, handler, { signal: events.signal, ...options });
};

// Build explicit horizontal story stages for Projects, Work, Studies, and recognition.
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const horizontalRailDefinitions = [
  ['.space-projects', 'PROJECTS'],
  ['.space-experience', 'WORK EXPERIENCE'],
  ['.space-education', 'STUDIES'],
  ['.space-recognition', 'TRAINING & RECOGNITION'],
];
const horizontalStoryRails = [];
const horizontalStoryStages = [];
const horizontalStoryClamp = (value, min, max) => Math.max(min, Math.min(max, value));
let horizontalStoryFrame = null;
let horizontalStoryResizeObserver = null;

function updatePinnedHorizontalStoryProgress() {
  if (horizontalStoryFrame !== null) return;
  horizontalStoryFrame = requestAnimationFrame(() => {
    horizontalStoryFrame = null;
    if (window.innerWidth < 760 || prefersReducedMotion) return;
    horizontalStoryStages.forEach(({ stage, rail, toolbar }) => {
      if (!stage.classList.contains('is-scroll-pinned')) return;
      const maxScroll = Math.max(0, rail.scrollWidth - rail.clientWidth);
      if (maxScroll <= 1) return;
      const toolbarTop = parseFloat(getComputedStyle(toolbar).top) || 76;
      const stageTop = stage.getBoundingClientRect().top;
      const progress = horizontalStoryClamp((toolbarTop - stageTop) / maxScroll, 0, 1);
      const nextLeft = maxScroll * progress;
      if (Math.abs(rail.scrollLeft - nextLeft) > 1.5) rail.scrollLeft = nextLeft;
    });
  });
}

function sizeHorizontalStoryStages() {
  const canPin = window.innerWidth >= 760 && !prefersReducedMotion;
  horizontalStoryStages.forEach(({ stage, rail, toolbar }) => {
    stage.classList.toggle('is-scroll-pinned', canPin);
    if (!canPin) {
      stage.style.removeProperty('height');
      rail.style.removeProperty('scroll-snap-type');
      return;
    }
    rail.style.scrollSnapType = 'x mandatory';
    const railHeight = rail.getBoundingClientRect().height;
    const toolbarHeight = toolbar.getBoundingClientRect().height;
    const gap = 12;
    const horizontalTravel = Math.max(0, rail.scrollWidth - rail.clientWidth);
    const nextHeight = Math.ceil(toolbarHeight + gap + railHeight + horizontalTravel);
    if (Math.abs((parseFloat(stage.style.height) || 0) - nextHeight) > 2) {
      stage.style.height = `${nextHeight}px`;
    }
  });
  updatePinnedHorizontalStoryProgress();
}

function scheduleHorizontalStoryLayout() {
  requestAnimationFrame(() => {
    sizeHorizontalStoryStages();
    requestAnimationFrame(() => {
      sizeHorizontalStoryStages();
      updatePinnedHorizontalStoryProgress();
    });
  });
}

horizontalRailDefinitions.forEach(([selector, label]) => {
  root.querySelectorAll(selector).forEach(rail => {
    rail.classList.add('horizontal-story-rail');
    rail.setAttribute('role', 'region');
    rail.setAttribute('aria-label', `${label} — scroll sideways to explore`);
    rail.setAttribute('tabindex', '0');

    // The stage's extra page height turns ordinary vertical scrolling into
    // horizontal progress, so dragging the browser scrollbar also works.
    const stage = document.createElement('div');
    stage.className = 'horizontal-story-stage';
    const toolbar = document.createElement('div');
    toolbar.className = 'horizontal-rail-toolbar';
    const labelNode = document.createElement('span');
    labelNode.className = 'horizontal-rail-toolbar-label';
    labelNode.textContent = window.innerWidth >= 760 && !prefersReducedMotion
      ? `${label}  /  SCROLL VERTICALLY TO MOVE SIDEWAYS`
      : `${label}  /  SWIPE OR SCROLL SIDEWAYS`;

    const controls = document.createElement('span');
    controls.className = 'horizontal-rail-controls';
    controls.setAttribute('role', 'group');
    controls.setAttribute('aria-label', `${label} controls`);
    const makeControl = (direction, text, accessibleLabel) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = text;
      button.setAttribute('aria-label', accessibleLabel);
      button.title = accessibleLabel;
      on(button, 'click', () => {
        const maxScroll = Math.max(0, rail.scrollWidth - rail.clientWidth);
        if (maxScroll <= 1) return;
        const desiredLeft = horizontalStoryClamp(
          rail.scrollLeft + direction * Math.max(220, rail.clientWidth * 0.78),
          0,
          maxScroll
        );
        if (stage.classList.contains('is-scroll-pinned')) {
          const toolbarTop = parseFloat(getComputedStyle(toolbar).top) || 76;
          const stageDocumentTop = window.scrollY + stage.getBoundingClientRect().top;
          const desiredProgress = desiredLeft / maxScroll;
          const desiredPageY = stageDocumentTop - toolbarTop + desiredProgress * maxScroll;
          lenis.scrollTo(desiredPageY, {
            duration: 0.78,
            easing: (t) => 1 - Math.pow(1 - t, 3)
          });
        } else {
          rail.scrollTo({ left: desiredLeft, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        }
      });
      controls.appendChild(button);
    };
    makeControl(-1, '←', `Previous ${label.toLowerCase()}`);
    makeControl(1, '→', `Next ${label.toLowerCase()}`);
    toolbar.append(labelNode, controls);

    rail.parentNode.insertBefore(stage, rail);
    stage.append(toolbar, rail);
    horizontalStoryRails.push(rail);
    horizontalStoryStages.push({ stage, rail, toolbar });

    // Mobile and reduced-motion users keep native swipe/trackpad horizontal scroll.
    // Desktop pinned stages let the page wheel drive the horizontal story naturally.
    on(rail, 'wheel', event => {
      if (event.ctrlKey || event.metaKey) return;
      if (stage.classList.contains('is-scroll-pinned') && window.innerWidth >= 760 && !prefersReducedMotion) return;
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      if (!delta) return;
      const maxScroll = rail.scrollWidth - rail.clientWidth;
      if (maxScroll <= 1) return;
      const atStart = rail.scrollLeft <= 1;
      const atEnd = rail.scrollLeft >= maxScroll - 1;
      if ((delta < 0 && atStart) || (delta > 0 && atEnd)) return;
      event.preventDefault();
      event.stopPropagation();
      rail.scrollLeft = horizontalStoryClamp(rail.scrollLeft + delta * 1.08, 0, maxScroll);
    }, { passive: false });
  });
});

if (!prefersReducedMotion && 'IntersectionObserver' in window) {
  const sideScrollEntries = horizontalStoryRails.flatMap(rail =>
    [...rail.children].filter(child => child.matches('article'))
  );
  if (sideScrollEntries.length) {
    sideScrollEntries.forEach((card, index) => {
      card.classList.add('side-scroll-entry');
      card.style.setProperty('--side-entry-x', index % 2 === 0 ? '-42px' : '42px');
    });
    const sideScrollObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-side-revealed');
        sideScrollObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px -3% 0px -3%' });
    sideScrollEntries.forEach(card => sideScrollObserver.observe(card));
    document.documentElement.classList.add('has-side-scroll-reveals');
  }
}

if ('ResizeObserver' in window) {
  horizontalStoryResizeObserver = new ResizeObserver(() => scheduleHorizontalStoryLayout());
  horizontalStoryStages.forEach(({ rail, toolbar }) => {
    horizontalStoryResizeObserver.observe(rail);
    horizontalStoryResizeObserver.observe(toolbar);
  });
}
on(window, 'scroll', updatePinnedHorizontalStoryProgress, { passive: true });
on(window, 'resize', scheduleHorizontalStoryLayout, { passive: true });
scheduleHorizontalStoryLayout();



// Lenis smooth anchor navigation for all internal jump links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  on(anchor, 'click', (e) => {
    const href = anchor.getAttribute('href');
    if (href && href.startsWith('#') && href.length > 1) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const horizontalRail = target.closest('.horizontal-story-rail');
        if (horizontalRail) {
          const railRect = horizontalRail.getBoundingClientRect();
          const targetRect = target.getBoundingClientRect();
          const targetLeft = horizontalRail.scrollLeft + targetRect.left - railRect.left;
          const centeredLeft = targetLeft - (horizontalRail.clientWidth - targetRect.width) / 2;
          horizontalRail.scrollTo({ left: Math.max(0, Math.min(horizontalRail.scrollWidth - horizontalRail.clientWidth, centeredLeft)), behavior: 'smooth' });
          lenis.scrollTo(horizontalRail, {
            offset: -40,
            duration: 1.15,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
          });
        } else {
          lenis.scrollTo(target, {
            offset: -40,
            duration: 1.4,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
          });
        }
      }
    }
  });
});

// Pause Lenis when dialog modals open, resume when closed
const dialogEl = document.querySelector('.portfolio-dialog');
if (dialogEl) {
  const dialogObserver = new MutationObserver(() => {
    if (dialogEl.hasAttribute('open')) {
      lenis.stop();
    } else {
      lenis.start();
    }
  });
  dialogObserver.observe(dialogEl, { attributes: true, attributeFilter: ['open'] });
}

// Click delegation for dialogs, projects, skills, chapters, DAWN
const livePreviewApps = {
  clansure: { title: 'ClanSure', url: 'https://clansure.vercel.app/' },
  'gt-companion': { title: 'GT Companion', url: 'https://gt-companion.vercel.app/' },
  prismiq: { title: 'PrismIQ', url: 'https://prismiq26.vercel.app/' },
};
let activeLivePreview = 'clansure';

on(document, 'click', event => {
  const action = event.target.closest('[data-dialog], [data-project], [data-ask], [data-technology], [data-inspect-world], [data-preview-select], [data-live-preview]');
  if (!action) return;

  if (action.dataset.previewSelect) {
    const id = action.dataset.previewSelect;
    if (!livePreviewApps[id]) return;
    activeLivePreview = id;
    document.querySelectorAll('[data-preview-select]').forEach(button => {
      const selected = button.dataset.previewSelect === id;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    const app = livePreviewApps[id];
    const name = document.querySelector('#live-preview-name');
    const openLink = document.querySelector('#live-preview-open');
    const holder = document.querySelector('#live-preview-frame');
    const toggle = document.querySelector('#live-preview-toggle');
    if (name) name.textContent = app.title;
    if (openLink) openLink.href = app.url;
    const iframe = holder?.querySelector('iframe');
    if (iframe) {
      iframe.src = app.url;
      iframe.title = app.title + ' live preview';
    } else if (toggle) {
      toggle.textContent = 'Load preview';
      toggle.setAttribute('aria-expanded', 'false');
    }
    return;
  }

  if (action.hasAttribute('data-live-preview')) {
    const holder = document.querySelector('#live-preview-frame');
    if (!holder) return;
    const existing = holder.querySelector('iframe');
    if (existing) {
      holder.replaceChildren();
      holder.hidden = true;
      action.textContent = 'Load preview';
      action.setAttribute('aria-expanded', 'false');
    } else {
      const app = livePreviewApps[activeLivePreview];
      if (!app) return;
      const iframe = document.createElement('iframe');
      iframe.className = 'live-preview-frame';
      iframe.src = app.url;
      iframe.title = app.title + ' live preview';
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      iframe.setAttribute('allowfullscreen', '');
      iframe.allow = 'fullscreen; clipboard-read; clipboard-write';
      holder.replaceChildren(iframe);
      holder.hidden = false;
      action.textContent = 'Hide preview';
      action.setAttribute('aria-expanded', 'true');
    }
    return;
  }

  if (action.dataset.dialog) dialogs.open(action.dataset.dialog);
  else if (action.dataset.project) dialogs.openProject(action.dataset.project);
  else if (action.dataset.ask) dialogs.openDawn(action.dataset.ask);
  else if (action.dataset.technology) dialogs.openSkills(action.dataset.technology);
  else if (action.dataset.inspectWorld !== undefined) dialogs.openChapter(chapters[Number(action.dataset.inspectWorld)]);
});

// Follow cursor on DAWN eye in the header
on(window, 'pointermove', event => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || event.pointerType !== 'mouse' || !eyeButton) return;
  const iris = eyeButton.querySelector('.clara-eye-iris');
  if (!iris) return;
  const box = eyeButton.getBoundingClientRect();
  const dx = event.clientX - box.left - box.width / 2;
  const dy = event.clientY - box.top - box.height / 2;
  const distance = Math.max(1, Math.hypot(dx, dy));
  iris.style.transform = `translate(${dx / distance * 5}px, ${dy / distance * 5}px)`;
});

// Keyboard shortcut: backtick/tilde to open terminal
on(document, 'keydown', event => {
  if (event.key !== '`' || event.ctrlKey || event.metaKey || event.altKey || event.target.closest('input, textarea, select, [contenteditable="true"]') || document.querySelector('dialog[open]')) return;
  event.preventDefault();
  dialogs.openTerminal();
});

// Appearance toggle (Light / Dark mode)
const appearanceToggle = document.querySelector('#appearance-toggle');
if (appearanceToggle) {
  on(appearanceToggle, 'click', () => {
    const isLight = document.body.classList.toggle('light-appearance');
    appearanceToggle.innerHTML = isLight ? '<span aria-hidden="true">◑</span> Dark' : '<span aria-hidden="true">◐</span> Light';
  });
}

// Mobile menu toggle
const menu = document.querySelector('#mobile-menu');
const menuToggle = document.querySelector('#menu-toggle');
if (menu && menuToggle) {
  on(menuToggle, 'click', () => {
    menu.showModal();
    menuToggle.setAttribute('aria-expanded', 'true');
    queueMicrotask(() => document.querySelector('#menu-close')?.focus());
  });
  on(document.querySelector('#menu-close'), 'click', () => menu.close());
  on(menu, 'close', () => { menuToggle.setAttribute('aria-expanded', 'false'); menuToggle.focus(); });
  on(menu, 'click', event => { if (event.target.closest('a')) menu.close(); });
}

// Copy email button
const copyEmailBtn = document.querySelector('#copy-email');
if (copyEmailBtn) {
  on(copyEmailBtn, 'click', async () => {
    const feedback = document.querySelector('#copy-feedback');
    try {
      await navigator.clipboard.writeText(profile.email);
      feedback.textContent = 'Email address copied to clipboard.';
    } catch {
      feedback.textContent = 'Select the email address above to copy it.';
    }
  });
}

// ─── THREEUI PERFORMANCE GAUGES SPEEDOMETER PURE CIRCULAR ONLOAD SEQUENCE ───
const speedometerOverlay = document.getElementById('onload-speedometer');
const speedometerFrame = document.getElementById('speedometer-iframe');
const enterBtn = document.getElementById('speedometer-enter-btn');

let speedometerDismissed = false;
let isPageLoaded = document.readyState === 'complete';
let isGaugeSweepDone = false;
let isSpeedometerFrameReady = false;
let isVideoReady = false;
let displayProgress = 0;
let latestLoadingProgress = 0;
let introStartedAt = 0;
let preloadWatchdog = null;

const experienceChoice = document.getElementById('experience-choice');
const animationChoiceButton = document.getElementById('choose-animation');
const normalChoiceButton = document.getElementById('choose-normal');

function openExperienceChoice() {
  if (!experienceChoice || experienceMode) return;
  experienceChoice.hidden = false;
  experienceChoice.classList.remove('is-dismissed');
  experienceChoice.setAttribute('aria-hidden', 'false');
  window.setTimeout(() => animationChoiceButton?.focus({ preventScroll: true }), 30);
}

function closeExperienceChoice() {
  if (!experienceChoice) return;
  experienceChoice.classList.add('is-dismissed');
  experienceChoice.setAttribute('aria-hidden', 'true');
  window.setTimeout(() => { experienceChoice.hidden = true; }, 450);
  document.querySelector('.space-signature')?.focus({ preventScroll: true });
}

function chooseNormalMode() {
  if (experienceMode) return;
  experienceMode = 'normal';
  document.body.classList.remove('experience-mode-pending', 'experience-animation');
  document.body.classList.add('experience-normal');
  if (speedometerOverlay) {
    speedometerOverlay.hidden = true;
    speedometerOverlay.setAttribute('aria-hidden', 'true');
  }
  closeExperienceChoice();
  // Keep the page usable with native-feeling scrolling and no media preloader.
  lenis.start();
}

function chooseAnimationMode() {
  if (experienceMode) return;
  experienceMode = 'animation';
  document.body.classList.remove('experience-mode-pending', 'experience-normal');
  document.body.classList.add('experience-animation');
  closeExperienceChoice();
  // The speedometer already ran before this choice. Start cinematic effects only now.
  initializeAnimationExperience();
  lenis.start();
}

on(animationChoiceButton, 'click', chooseAnimationMode);
on(normalChoiceButton, 'click', chooseNormalMode);

function sendLoadingProgress() {
  speedometerFrame?.contentWindow?.postMessage({ type: 'portfolio-loading-progress', progress: latestLoadingProgress }, '*');
}

if (speedometerFrame) {
  on(speedometerFrame, 'load', () => {
    isSpeedometerFrameReady = true;
    sendLoadingProgress();
  });
  on(window, 'message', (event) => {
    if (event.data?.type === 'speedometer-ready') {
      isSpeedometerFrameReady = true;
      sendLoadingProgress();
    }
  });
}

function dismissSpeedometer() {
  if (speedometerDismissed || !speedometerOverlay) return;
  speedometerDismissed = true;
  speedometerOverlay.classList.add('is-dismissed');
  if (preloadWatchdog) {
    clearInterval(preloadWatchdog);
    preloadWatchdog = null;
  }
  // The loader must finish before the visitor is asked which experience to enter.
  setTimeout(() => {
    speedometerOverlay.style.display = 'none';
    speedometerOverlay.hidden = true;
    speedometerOverlay.setAttribute('aria-hidden', 'true');
    if (!experienceMode) openExperienceChoice();
  }, 900);
}

function updateHud(progress, message, ready = false) {
  if (speedometerDismissed) return;
  const rounded = Math.min(100, Math.max(0, Math.round(progress)));
  latestLoadingProgress = rounded;
  sendLoadingProgress();
  if (ready && enterBtn) enterBtn.style.display = 'inline-flex';
}

// 1. Page load tracking
if (!isPageLoaded) {
  on(window, 'load', () => {
    isPageLoaded = true;
  });
}

// 2. ThreeUI Speedometer self-test completion (sweep 0 -> 160 -> settles on live speed)
on(window, 'message', (event) => {
  if (event.data?.type === 'speedometer-selftest-complete') {
    isGaugeSweepDone = true;
  }
});

// 3. Progressive cinematic loading. Never block access indefinitely on large media.
// The portfolio is usable even if the decorative video or gauge fails to load.
const INTRO_MIN_VISIBLE_MS = 3500;
const INTRO_MAX_WAIT_MS = 6500;

function startPreloadWatchdog() {
  if (preloadWatchdog) clearInterval(preloadWatchdog);
  introStartedAt = performance.now();
  displayProgress = 0;
  latestLoadingProgress = 0;
  isVideoReady = false;
  isPageLoaded = document.readyState === 'complete';

  preloadWatchdog = setInterval(() => {
    if (speedometerDismissed) {
      clearInterval(preloadWatchdog);
      preloadWatchdog = null;
      return;
    }

    const elapsed = performance.now() - introStartedAt;
    const actualBuffer = transformersBg ? transformersBg.getBufferProgress() : 0;
    const videoLoaded = transformersBg ? transformersBg.isVideoFullyReady() : false;
    if (videoLoaded) {
      isVideoReady = true;
      displayProgress = 100;
    } else {
      const target = Math.min(94, Math.max(displayProgress + 2.5, actualBuffer));
      displayProgress += (target - displayProgress) * 0.28;
    }

    // The speedometer runs before the visitor chooses a mode, so don't wait
    // for cinematic video. Show the choice once the gauge sweep and page are ready.
    const isReadyToDismiss = elapsed >= INTRO_MIN_VISIBLE_MS
      && isPageLoaded
      && isSpeedometerFrameReady
      && isGaugeSweepDone;

    if (elapsed >= INTRO_MAX_WAIT_MS || isReadyToDismiss) {
      clearInterval(preloadWatchdog);
      preloadWatchdog = null;
      updateHud(100, 'PORTFOLIO READY — VISUALS CONTINUE LOADING', true);
      dismissSpeedometer();
      return;
    }
    updateHud(displayProgress);
  }, 120);
}

// User interactive dismiss actions
if (enterBtn) {
  on(enterBtn, 'click', (e) => {
    e.stopPropagation();
    dismissSpeedometer();
  });
}

if (speedometerOverlay) {
  on(speedometerOverlay, 'click', () => {
    // If video is loaded or user explicitly clicks to skip, enter immediately
    dismissSpeedometer();
  });
}

on(window, 'keydown', (e) => {
  if (!speedometerDismissed && speedometerOverlay && !speedometerOverlay.hidden && ['Escape', 'Enter', ' '].includes(e.key) && !(e.target instanceof Element && e.target.closest('button, a, input, textarea, select'))) {
    dismissSpeedometer();
  }
});

// Start the performance gauge immediately on every visit. The two experience
// choices remain hidden until the initial gauge sequence is complete (or times out).
startPreloadWatchdog();
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    if (lenisRafId) cancelAnimationFrame(lenisRafId);
    lenis.destroy();
    events.abort();
    document.documentElement.classList.remove('has-side-scroll-reveals');
    spotlight?.dispose();
    transformersBg?.dispose();
    scrollDepth?.dispose();
    glitterEngine?.dispose();
    motionPhysics?.dispose();
    dialogs.request?.abort();
    dialogs.terminal?.stopMatrix();
    dialogs.dialog.remove();
  });
}




// Subtle pointer parallax gives foreground typography a separate depth plane
// from the continuously playing background video. It is throttled to animation frames.
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let raf = 0;
  let x = 0, y = 0;
  const reset = () => {
    document.documentElement.style.setProperty('--depth-pointer-x', '0px');
    document.documentElement.style.setProperty('--depth-pointer-y', '0px');
  };
  const onPointerMove = (event) => {
    if (reduceMotion.matches || (event.pointerType && event.pointerType !== 'mouse')) return;
    x = ((event.clientX / Math.max(1, window.innerWidth)) - 0.5) * 8;
    y = ((event.clientY / Math.max(1, window.innerHeight)) - 0.5) * 6;
    if (raf) return;
    raf = requestAnimationFrame(() => {
      document.documentElement.style.setProperty('--depth-pointer-x', x.toFixed(2) + 'px');
      document.documentElement.style.setProperty('--depth-pointer-y', y.toFixed(2) + 'px');
      raf = 0;
    });
  };
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('blur', reset);
  reduceMotion.addEventListener?.('change', () => { if (reduceMotion.matches) reset(); });
})();
