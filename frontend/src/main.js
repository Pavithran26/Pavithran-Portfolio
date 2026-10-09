import { educationCharacter } from './components/EducationCharacter.js';
import { CursorSpotlight } from './components/CursorSpotlight.js';
import { LiquidCursor } from './components/LiquidCursor.js';
import './style.css';
import { PORTFOLIO_DATA as profile } from './data/portfolioData.js';
import { FEATURED_PROJECTS as featuredProjects, PROJECTS_DATA } from './data/projectsData.js';
import { SPACE_CHAPTERS as chapters } from './data/spaceJourneyData.js';
import { PortfolioDialogs } from './components/PortfolioDialogs.js';
import { projectVisual, PROJECT_SCENES } from './components/ProjectVisuals.js';
import { technologyIcons } from './components/TechnologyIcons.js';
import { getClaraEyeAvatarHtml } from './components/ClaraWidget.js';
import { escapeHtml as html } from './utils/helpers.js';
import { TransformersBackground } from './components/TransformersBackground.js';

function getProjectCategory(project) {
  const cat = (project.category || '').toLowerCase();
  const id = project.id;
  if (['clansure', 'gt-companion', 'srk-erp', 'healthsurance'].includes(id) || cat.includes('full-stack') || cat.includes('erp') || cat.includes('business')) {
    return 'fullstack';
  }
  if (['sattam-ai', 'product-demand-forecast', 'upi-fraud-detection', 'heart-disease-prediction', 'pneumonia-detection', 'speech-recognition'].includes(id) || cat.includes('ai') || cat.includes('machine learning') || cat.includes('deep learning') || cat.includes('speech')) {
    return 'ai-ml';
  }
  if (['rf-detector', 'screen-drawing', 'save-water-game'].includes(id) || cat.includes('iot') || cat.includes('computer vision') || cat.includes('game')) {
    return 'vision-iot';
  }
  return 'utilities';
}

const root = document.querySelector('#portfolio');
root.innerHTML = `
  <section class="space-intro" id="top" aria-labelledby="intro-title">
    <div class="intro-identity">
      <p class="space-kicker"><span class="tf-status-badge">AUTOBOT SYSTEM // ONLINE</span><br>TAMIL NADU, INDIA · SOFTWARE ENGINEER</p>
      <h1 id="intro-title">Pavithran <em>S.</em></h1>
      <p class="intro-statement">Thoughtful interfaces.<br>Dependable systems.<br>A little intelligence in between.</p>
      <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
        <a class="intro-enter" href="#work">Explore my work <span aria-hidden="true">↓</span></a>
        <a class="intro-enter" href="/scene.html" style="background: rgba(224, 35, 28, 0.15); border: 1px solid rgba(224, 35, 28, 0.4); color: #ff6864;">⚡ 3D Optimus Matrix <span aria-hidden="true">↗</span></a>
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
        <a href="#all-projects" style="color: var(--tf-energon); font-weight: 500;">All 16 Projects ↓</a>
      </nav>

      <!-- Featured Flagship Showcase -->
      <div class="space-projects">
        ${featuredProjects.map((project, index) => `
          <article id="project-${project.id}" class="project-destination" data-card-project="${project.id}">
            <div class="project-copy">
              <p class="project-overline">${String(index + 1).padStart(2, '0')} / ${html(project.category)} · <span class="project-badge-pill">${html(project.badge || 'Featured')}</span></p>
              <button class="space-project-title" type="button" data-project="${project.id}">
                <span>${html(project.title)}</span><span aria-hidden="true">↗</span>
              </button>
              <p class="project-tagline">${html(project.tagline)}</p>
              <p class="project-summary">${html(project.overview)}</p>
              <div class="project-logos" aria-label="${html(project.title)} technologies">
                ${project.technologies.slice(0, 6).map(technology => `<span title="${html(technology)}"><span class="visually-hidden">${html(technology)}</span>${technologyIcons(technology)}</span>`).join('')}
              </div>
              <div class="project-links">
                <button class="space-text-link" type="button" data-project="${project.id}">Explore technical dossier ↗</button>
                ${project.liveUrl ? `<a class="space-text-link" href="${html(project.liveUrl)}" target="_blank" rel="noopener noreferrer">Visit live app ↗</a>` : ''}
                ${project.githubUrl ? `<a class="space-text-link" href="${html(project.githubUrl)}" target="_blank" rel="noopener noreferrer">Source code ↗</a>` : ''}
              </div>
            </div>
            <!-- ${projectVisual(project)} (project image commented out to keep Transformers video visible) -->
          </article>
        `).join('')}
      </div>

      <!-- The Complete Engineering Catalog (All 16 Projects in One Place) -->
      <div class="all-projects-wrapper" id="all-projects" style="margin-top: 96px; padding-top: 48px; border-top: 1px solid var(--line);">
        <div class="archive-header-banner">
          <p class="space-kicker">ENGINEERING CATALOG · ALL 16 REPOSITORIES</p>
          <h3 class="story-subheading" style="font-size: clamp(2.2rem, 4vw, 3.4rem); font-family: var(--font-display); font-weight: 400; margin: 14px 0 16px;">The complete repository archive.</h3>
          <p class="section-intro">Explore every full-stack platform, machine learning classifier, computer vision experiment, and utility tool built by Pavithran.</p>

          <div class="catalog-filter-bar" role="tablist" aria-label="Filter projects by category">
            <button type="button" class="filter-tab active" data-filter="all">All Repositories <small>(16)</small></button>
            <button type="button" class="filter-tab" data-filter="fullstack">Enterprise & Full-Stack <small>(4)</small></button>
            <button type="button" class="filter-tab" data-filter="ai-ml">AI, ML & RAG <small>(6)</small></button>
            <button type="button" class="filter-tab" data-filter="vision-iot">Vision & IoT <small>(3)</small></button>
            <button type="button" class="filter-tab" data-filter="utilities">Data & Tools <small>(3)</small></button>
          </div>
        </div>

        <div class="archive-grid" id="full-projects-grid">
          ${PROJECTS_DATA.map((project, index) => `
            <article class="archive-project" data-cat="${getProjectCategory(project)}" data-project-id="${project.id}">
              <!-- ${PROJECT_SCENES[project.id] ? `<img src="/images/projects/${project.id}-768.webp" alt="${html(PROJECT_SCENES[project.id])}" width="768" height="432" loading="lazy" decoding="async">` : ''} -->
              <div class="archive-copy">
                <p class="space-kicker">${String(index + 1).padStart(2, '0')} / ${html(project.category)}</p>
                <h2><button type="button" data-project="${project.id}">${html(project.title)} <span aria-hidden="true">↗</span></button></h2>
                <p class="archive-tagline" style="font-weight: 500; margin: 6px 0 10px; color: #ffffff;">${html(project.tagline)}</p>
                <p class="archive-overview" style="margin: 0 0 16px; font-size: 0.92rem; line-height: 1.65; color: var(--tf-text-body);">${html(project.overview.slice(0, 160))}...</p>
                <div class="archive-tags">${project.technologies.slice(0, 4).map(tech => `<span>${html(tech)}</span>`).join('')}</div>
                <div class="project-links">
                  <button type="button" class="space-text-link" data-project="${project.id}">Explore dossier ↗</button>
                  ${project.liveUrl ? `<a class="space-text-link" href="${html(project.liveUrl)}" target="_blank" rel="noopener noreferrer">Live demo ↗</a>` : ''}
                  ${project.githubUrl ? `<a class="space-text-link" href="${html(project.githubUrl)}" target="_blank" rel="noopener noreferrer">GitHub ↗</a>` : ''}
                </div>
              </div>
            </article>
          `).join('')}
        </div>
      </div>
    </div>
  </section>

  <section class="space-about space-section" id="about" aria-labelledby="about-title">
    <div class="space-content">
      <p class="space-kicker">THE PERSON BEHIND THE WORK</p>
      <h2 id="about-title">Always curious.<br><em>Still building.</em></h2>
      <p class="section-intro">I'm Pavithran, a software engineer from Tamil Nadu. I like making complicated things feel simple, from the first interaction to the systems underneath.</p>
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
            <!-- ${educationCharacter(education.visualStage)} -->
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
        <span>© ${new Date().getFullYear()} ${html(profile.name)} · Forward Deployment Engineer</span>
        <button type="button" data-dialog="terminal">Developer terminal ↗</button>
        <a href="#top">Back to the beginning ↑</a>
      </div>
    </div>
  </footer>
`;

const spotlight = new CursorSpotlight(root);
const liquidCursor = new LiquidCursor();
const transformersBg = new TransformersBackground('/videos/Muzan-meets-Ubuyashiki-SnapYT.App.webm');

const eyeButton = document.querySelector('#dawn-eye');
if (eyeButton) {
  eyeButton.innerHTML = getClaraEyeAvatarHtml(38) + '<span class="eye-label">Meet DAWN<small>AI guide</small></span>';
}

const dialogs = new PortfolioDialogs();
const events = new AbortController();
const on = (target, type, handler, options = {}) => {
  if (target) target.addEventListener(type, handler, { signal: events.signal, ...options });
};

// Filter tabs in the All Projects Catalog
const filterTabs = document.querySelectorAll('.catalog-filter-bar .filter-tab');
const archiveCards = document.querySelectorAll('.archive-project');
filterTabs.forEach(tab => {
  on(tab, 'click', () => {
    filterTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.dataset.filter;
    archiveCards.forEach(card => {
      const match = filter === 'all' || card.dataset.cat === filter;
      card.classList.toggle('is-hidden', !match);
    });
  });
});

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
const openSpeedometerBtn = document.getElementById('open-speedometer-btn');

let speedometerDismissed = false;
let isPageLoaded = document.readyState === 'complete';
let isVideoReady = false;
let isGaugeSweepDone = false;

function dismissSpeedometer() {
  if (speedometerDismissed || !speedometerOverlay) return;
  speedometerDismissed = true;
  speedometerOverlay.classList.add('is-dismissed');
  setTimeout(() => {
    if (speedometerOverlay) speedometerOverlay.style.display = 'none';
  }, 900);
}

function checkAndDismissWhenReady() {
  if (speedometerDismissed) return;
  // Dismiss only when the video animation, full page, and needle self-test have loaded!
  if (isPageLoaded && isVideoReady && isGaugeSweepDone) {
    dismissSpeedometer();
  }
}

// 1. Page load tracking
if (!isPageLoaded) {
  on(window, 'load', () => {
    isPageLoaded = true;
    checkAndDismissWhenReady();
  });
}

// 2. Background video load tracking (Muzan meets Ubuyashiki 4K video)
function markVideoReady() {
  if (isVideoReady) return;
  isVideoReady = true;
  checkAndDismissWhenReady();
}

if (transformersBg?.video) {
  if (transformersBg.video.readyState >= 2) {
    markVideoReady();
  } else {
    on(transformersBg.video, 'loadeddata', markVideoReady, { once: true });
    on(transformersBg.video, 'canplay', markVideoReady, { once: true });
    on(transformersBg.video, 'canplaythrough', markVideoReady, { once: true });
  }
} else {
  isVideoReady = true;
}

// 3. ThreeUI Speedometer self-test completion (sweep 0 -> 160 -> settles on live speed)
on(window, 'message', (event) => {
  if (event.data?.type === 'speedometer-selftest-complete') {
    isGaugeSweepDone = true;
    checkAndDismissWhenReady();
  }
});

// Fallback maximum wait (8s) so user is never stuck if network slows down
setTimeout(() => {
  isPageLoaded = true;
  isVideoReady = true;
  isGaugeSweepDone = true;
  checkAndDismissWhenReady();
}, 8000);

// User interactive dismiss (click anywhere or press Escape/Enter/Space)
if (speedometerOverlay) {
  on(speedometerOverlay, 'click', dismissSpeedometer);
}

on(window, 'keydown', (e) => {
  if (['Escape', 'Enter', ' '].includes(e.key) && !speedometerDismissed) {
    dismissSpeedometer();
  }
});

function showSpeedometer() {
  if (!speedometerOverlay) return;
  speedometerDismissed = false;
  speedometerOverlay.style.display = 'flex';
  requestAnimationFrame(() => {
    speedometerOverlay.classList.remove('is-dismissed');
  });
}

if (openSpeedometerBtn) {
  on(openSpeedometerBtn, 'click', showSpeedometer);
}

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    events.abort();
    spotlight.dispose();
    transformersBg.dispose();
    dialogs.request?.abort();
    dialogs.terminal?.stopMatrix();
    dialogs.dialog.remove();
  });
}
