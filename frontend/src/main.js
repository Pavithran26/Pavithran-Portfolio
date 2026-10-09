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

const spotlight = new CursorSpotlight(root);
document.querySelector('#liquid-cursor-container')?.remove();
document.querySelector('.liquid-svg-defs')?.remove();

const transformersBg = new TransformersBackground('/videos/Muzan-meets-Ubuyashiki-Smooth.mp4', { lenis });
const scrollDepth = new ScrollDepthController({ lenis });
const glitterEngine = new GlitterTextEngine({ lenis });
const motionPhysics = new FramerMotionPhysics();

// Connect Lenis sub-pixel virtual scroll ticks directly to video scrubbing and 3D depth
lenis.on('scroll', (e) => {
  transformersBg.onScroll(e);
  scrollDepth.onScroll(e);
});

// Master hardware-synchronized animation loop
let lenisRafId = null;
function rafLoop(time) {
  lenis.raf(time);
  lenisRafId = requestAnimationFrame(rafLoop);
}
lenisRafId = requestAnimationFrame(rafLoop);

const eyeButton = document.querySelector('#dawn-eye');
if (eyeButton) {
  if (!eyeButton.querySelector('.dawn-katana-video')) {
    eyeButton.innerHTML = `<video class="dawn-katana-video" src="/videos/katana-blade.mp4" autoplay loop muted playsinline disablepictureinpicture aria-hidden="true"></video>`;
  }
  const vid = eyeButton.querySelector('video');
  if (vid) {
    vid.muted = true;
    vid.play().catch(() => {});
  }
}

const dialogs = new PortfolioDialogs();
const events = new AbortController();
const on = (target, type, handler, options = {}) => {
  if (target) target.addEventListener(type, handler, { signal: events.signal, ...options });
};

// Lenis smooth anchor navigation for all internal jump links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  on(anchor, 'click', (e) => {
    const href = anchor.getAttribute('href');
    if (href && href.startsWith('#') && href.length > 1) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target, {
          offset: -40,
          duration: 1.4,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
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
on(document, 'click', event => {
  const action = event.target.closest('[data-dialog], [data-project], [data-ask], [data-technology], [data-inspect-world]');
  if (!action) return;
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
const hudMsg = document.getElementById('speedometer-hud-msg');
const hudPct = document.getElementById('speedometer-hud-pct');
const hudFill = document.getElementById('speedometer-hud-fill');
const hudDot = document.getElementById('speedometer-hud-dot');
const enterBtn = document.getElementById('speedometer-enter-btn');

let speedometerDismissed = false;
let isPageLoaded = document.readyState === 'complete';
let isGaugeSweepDone = false;
let isVideoReady = false;
let displayProgress = 8;

function dismissSpeedometer() {
  if (speedometerDismissed || !speedometerOverlay) return;
  speedometerDismissed = true;
  speedometerOverlay.classList.add('is-dismissed');
  // Unlock ultra-smooth scrolling now that preloader is finished
  lenis.start();
  setTimeout(() => {
    if (speedometerOverlay) speedometerOverlay.style.display = 'none';
  }, 900);
}

function updateHud(progress, message, ready = false) {
  if (speedometerDismissed) return;
  const rounded = Math.min(100, Math.max(0, Math.round(progress)));
  if (hudPct) hudPct.textContent = `${rounded}%`;
  if (hudFill) hudFill.style.width = `${rounded}%`;
  if (hudMsg && message) hudMsg.textContent = message;
  if (ready) {
    if (hudDot) hudDot.classList.add('is-ready');
    if (enterBtn) {
      enterBtn.style.display = 'inline-flex';
    }
  }
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
const introStartedAt = performance.now();
const INTRO_MAX_WAIT_MS = 4500;
const preloadWatchdog = setInterval(() => {
  if (speedometerDismissed) { clearInterval(preloadWatchdog); return; }
  const elapsed = performance.now() - introStartedAt;
  const actualBuffer = transformersBg ? transformersBg.getBufferProgress() : 0;
  const videoLoaded = transformersBg ? transformersBg.isVideoFullyReady() : false;
  if (videoLoaded) { isVideoReady = true; displayProgress = 100; }
  else {
    const target = Math.min(94, Math.max(displayProgress + 2.5, actualBuffer));
    displayProgress += (target - displayProgress) * 0.28;
  }
  if (elapsed >= INTRO_MAX_WAIT_MS || (isPageLoaded && isGaugeSweepDone && isVideoReady)) {
    clearInterval(preloadWatchdog);
    updateHud(100, 'PORTFOLIO READY — VISUALS CONTINUE LOADING', true);
    // Show the actual portfolio promptly; background media continues independently.
    dismissSpeedometer();
    return;
  }
  if (displayProgress < 30) updateHud(displayProgress, 'INITIALIZING CINEMATIC ENGINE...');
  else if (displayProgress < 70) updateHud(displayProgress, 'BUFFERING CINEMATIC TIMELINE...');
  else updateHud(displayProgress, 'SYNCHRONIZING FRAMES...');
}, 120);

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
  if (['Escape', 'Enter', ' '].includes(e.key) && !speedometerDismissed) {
    dismissSpeedometer();
  }
});
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    if (lenisRafId) cancelAnimationFrame(lenisRafId);
    lenis.destroy();
    events.abort();
    spotlight.dispose();
    transformersBg.dispose();
    scrollDepth.dispose();
    glitterEngine.dispose();
    motionPhysics.dispose();
    dialogs.request?.abort();
    dialogs.terminal?.stopMatrix();
    dialogs.dialog.remove();
  });
}


