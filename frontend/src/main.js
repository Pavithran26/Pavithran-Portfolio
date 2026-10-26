import { educationCharacter } from './components/EducationCharacter.js';
import { CursorSpotlight } from './components/CursorSpotlight.js';
import './style.css';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { PORTFOLIO_DATA as profile } from './data/portfolioData.js';
import { FEATURED_PROJECTS as featuredProjects, PROJECTS_DATA } from './data/projectsData.js';
import { SPACE_CHAPTERS as chapters } from './data/spaceJourneyData.js';
import { ALL_TECHNOLOGIES } from './data/allTechnologies.js';
import { PortfolioDialogs } from './components/PortfolioDialogs.js';
import { projectVisual, PROJECT_SCENES } from './components/ProjectVisuals.js';
import { technologyIcons } from './components/TechnologyIcons.js';
import { StaggeredGrid } from './components/ui/staggered-grid.jsx';
import { getClaraEyeAvatarHtml } from './components/ClaraWidget.js';
import { escapeHtml as html } from './utils/helpers.js';
import { TransformersBackground } from './components/TransformersBackground.js';
import { ScrollDepthController } from './components/ScrollDepthController.js';
import { GlitterTextEngine } from './components/GlitterTextEngine.js';
import { FramerMotionPhysics } from './utils/FramerMotionPhysics.js';
import { FlipText } from './components/ui/flip-text.jsx';
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { Component as Animation3DButton } from './components/ui/3d-button.tsx';
import { PerspectiveGrid } from './components/ui/perspective-grid.jsx';
import { LandingInteractiveParticles } from './components/LandingInteractiveParticles.jsx';
import { LiquidMetalSurface } from './components/ui/liquid-metal.jsx';
import ShinyButton from './components/ui/shiny-button.tsx';
import { SunMoonThemeToggle } from './components/ui/sun-moon-theme-toggle.tsx';
import { flushSync } from 'react-dom';
import { TextEffectsController } from './components/TextEffectsController.js';
import SocialFlipButton from './components/ui/social-flip-button.jsx';


const HERO_SHOWCASE_PROJECT_IDS = ['clansure', 'gt-companion', 'my-cow', 'srk-erp'];
const PROJECTS_WITHOUT_GENERATED_IMAGES = new Set(['clansure', 'gt-companion', 'srk-erp', 'sattam-ai']);
const heroShowcaseProjects = HERO_SHOWCASE_PROJECT_IDS
  .map(id => PROJECTS_DATA.find(project => project.id === id))
  .filter(Boolean);

const renderHeroProjectMonogram = (project) => {
  const words = String(project?.title || 'Project').trim().split(/\s+/);
  return html(words.map(word => word[0] || '').join('').slice(0, 2).toUpperCase());
};

// Show the actual deployed site wherever a live URL exists. Never substitute a generated mock.
const renderHeroProjectPreview = (project) => {
  if (!project) return '';
  if (project.liveUrl) {
    return '<div class="hero-live-preview" data-live-preview="' + html(project.id) + '">'
      + '<div class="hero-live-preview-toolbar">'
      + '<a class="hero-live-preview-open" href="' + html(project.liveUrl) + '" target="_blank" rel="noopener noreferrer" aria-label="Open ' + html(project.title) + ' live website in a new tab" title="Open live website">↗</a>'
      + '</div>'
      + '<iframe class="hero-live-preview-frame" src="' + html(project.liveUrl) + '" title="' + html(project.title) + ' live website preview" loading="eager" referrerpolicy="strict-origin-when-cross-origin" allow="clipboard-read; clipboard-write; fullscreen"></iframe>'
      + '</div>';
  }
  const sourceUrl = project.githubUrl || project.sourceUrl || '#work';
  return '<div class="hero-live-preview hero-live-preview-source" data-live-preview="' + html(project.id) + '">'
    + '<div class="hero-live-preview-toolbar" aria-label="Open project source"><a class="hero-live-preview-open" href="' + html(sourceUrl) + '" target="_blank" rel="noopener noreferrer" aria-label="Open ' + html(project.title) + ' source repository in a new tab" title="Open source repository">↗</a></div>'
    + '<div class="hero-live-source-card">'
    + '<span class="hero-live-source-monogram" aria-hidden="true">' + renderHeroProjectMonogram(project) + '</span>'
    + '<strong>' + html(project.title) + '</strong>'
    + '<p>This project does not have a live deployment URL linked in the portfolio yet.</p>'
    + '<a href="' + html(sourceUrl) + '" target="_blank" rel="noopener noreferrer">Open source repository <span aria-hidden="true">↗</span></a>'
    + '</div></div>';
};

const initialHeroProject = heroShowcaseProjects[0];
const heroShowcaseMarkup = initialHeroProject ? (
  '<aside class="hero-project-showcase hero-project-showcase-visual-only" data-hero-showcase aria-label="Interactive project live previews">'
  + '<div class="hero-preview-stage" data-hero-project-preview aria-live="polite">' + renderHeroProjectPreview(initialHeroProject) + '</div>'
  + '<div class="hero-project-choices" role="group" aria-label="Choose a project live preview">'
  + heroShowcaseProjects.map((project, index) => '<button class="hero-project-choice' + (index === 0 ? ' is-active' : '') + '" type="button" data-hero-project-choice="' + html(project.id) + '" aria-label="Show ' + html(project.title) + ' live preview" title="' + html(project.title) + '" aria-pressed="' + String(index === 0) + '">'
      + '<span class="hero-project-choice-name">' + html(project.title) + '</span>'
      + '</button>').join('')
  + '</div></aside>'
) : '';

const root = document.querySelector('#portfolio');

const sunMoonThemeToggleMount = document.querySelector('#sun-moon-theme-toggle-mount');
let sunMoonThemeToggleRoot = null;
if (sunMoonThemeToggleMount) {
  sunMoonThemeToggleRoot = createRoot(sunMoonThemeToggleMount);
  sunMoonThemeToggleRoot.render(createElement(SunMoonThemeToggle, {
    size: 40,
    duration: 1740,
    defaultTheme: 'light',
    syncDocument: true,
    storageKey: 'portfolio-universe-theme',
    title: 'Toggle light or dark theme',
    className: 'sun-moon-theme-toggle--header'
  }));
}

root.innerHTML = `
  <section class="space-intro has-project-showcase" id="top" aria-labelledby="intro-title">
    <div class="intro-identity">
      <p class="space-kicker">TAMIL NADU, INDIA · FORWARD DEPLOYED ENGINEER (FDE)</p>
      <h1 id="intro-title"><span id="intro-title-flip-mount" role="text" aria-label="Pavithran S">Pavithran S</span></h1>
      <p class="intro-statement" data-flip-phrases="THOUGHTFUL INTERFACES|APPLIED AI &amp; RAG|DEPENDABLE SYSTEMS|FROM IDEA TO PRODUCTION"><span class="vx-flip-fade-current intro-flip-line">THOUGHTFUL INTERFACES</span><br><span class="intro-statement-support">A little intelligence in between.</span></p>
      <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
        <a class="intro-enter" href="#work">Explore my work <span aria-hidden="true">↓</span></a>
      </div>
    </div>
    ${heroShowcaseMarkup}
    <p class="intro-caption">A SMALL PART OF A MUCH BIGGER UNIVERSE</p>
  </section>

  <section class="space-work space-section" id="work" aria-labelledby="work-title">
    <div class="space-content work-wide-content">
      <p class="space-kicker" data-flip-phrases="IDEAS, BUILT INTO REAL THINGS|IDEA → ARCHITECTURE → PRODUCTION|REAL PROBLEMS. WORKING SYSTEMS."><span class="vx-flip-fade-current">IDEAS, BUILT INTO REAL THINGS</span></p>
      <h2 id="work-title">Selected <em>work & projects.</em></h2>
      <p class="section-intro">Different problems. The same relentless curiosity. Every application below was architected, written, and deployed to solve tangible challenges.</p>

      <nav class="project-index" aria-label="Browse featured projects">
        ${featuredProjects.map(project => `<a href="#project-${project.id}">${html(project.title)}</a>`).join('')}
        <button class="space-text-link" type="button" data-dialog="dossier" style="margin-left: 8px; color: var(--tf-energon); font-weight: 500;">All 16 Projects Dossier ↗</button>
      </nav>

      <!-- Featured Flagship Showcase -->
      <div class="space-projects">
        ${featuredProjects.map(project => `
          <article id="project-${project.id}" class="project-destination has-project-screenshot project-card-background-preview" data-card-project="${project.id}">
            <figure class="project-card-media project-card-media-live" aria-label="${html(project.title)} website background">
              ${project.id !== 'my-cow' && !PROJECTS_WITHOUT_GENERATED_IMAGES.has(project.id) ? `<img
                class="project-card-image project-card-fallback"
                src="/images/projects/${project.id}-1440.webp"
                alt=""
                width="1440"
                height="900"
                loading="lazy"
                decoding="async"
              >` : ''}
              ${PROJECTS_WITHOUT_GENERATED_IMAGES.has(project.id) ? `<div class="project-card-no-preview" aria-hidden="true"><span>${project.liveUrl ? 'LIVE LINK · NO EMBEDDED PREVIEW' : 'SOURCE REPOSITORY'}</span><strong>${html(project.title)}</strong><small>Explore the technical dossier for verified details.</small></div>` : ''}
              ${project.liveUrl && !PROJECTS_WITHOUT_GENERATED_IMAGES.has(project.id) ? `<iframe class="project-card-live-frame" data-project-frame-src="${html(project.liveUrl)}" title="${html(project.title)} website background preview" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" tabindex="-1" aria-hidden="true"></iframe>` : ''}
              <span class="project-card-preview-shade" aria-hidden="true"></span>
            </figure>
            <div class="project-copy">
              <button class="space-project-title" type="button" data-project="${project.id}">
                <span>${html(project.title)}</span><span aria-hidden="true">↗</span>
              </button>
              <p class="project-tagline">${html(project.tagline)}</p>
              <p class="project-summary">${html(project.overview)}</p>
              <div class="project-tech-tags" aria-label="Technologies used">
                ${project.technologies.slice(0, 4).map(technology => `<span class="project-tech-tag">${html(technology)}</span>`).join('')}
              </div>
              <div class="project-links">
                <button class="space-text-link" type="button" data-project="${project.id}">Explore technical dossier ↗</button>
                ${project.liveUrl ? `<a class="space-text-link project-live-cta" href="${html(project.liveUrl)}" target="_blank" rel="noopener noreferrer">Visit live app ↗</a>` : ''}
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
          <article id="experience-${index}" class="experience-timeline-card">
            <img
              class="experience-company-watermark"
              src="${index === 0 ? 'https://owlsure.com/wp-content/uploads/2025/08/owlsure-logo.png' : '/images/experience/adhoc-softwares.svg'}"
              alt=""
              aria-hidden="true"
              loading="eager"
              fetchpriority="high"
              decoding="async"
            >
            <span class="experience-company-watermark-fallback" aria-hidden="true" hidden>${index === 0 ? 'OWLSure' : 'ADHOC SOFTWARES'}</span>
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
    <section class="world-section world-section-${chapter.side} world-section-tools" id="stack-${chapter.id}" data-world-section="${index + 1}" aria-labelledby="world-title-${chapter.id}">
      <nav class="spotlight-stack-nav" aria-label="Tools and technologies navigation">
        <a class="spotlight-stack-brand" href="#top" aria-label="Pavithran home">PS<span> / FDE</span></a>
        <div class="spotlight-stack-links">
          <a href="#stack-tools" data-spotlight-nav>Tools &amp; Technologies</a>
        </div>
      </nav>
      <div class="world-copy">
        <p class="space-kicker">${chapter.orbit}</p>
        <h2 id="world-title-${chapter.id}">${chapter.headline}</h2>
        <p class="world-tagline">${html(chapter.tagline)}</p>
        <p class="world-description">${html(chapter.description)}</p>
        <button class="space-text-link" type="button" data-inspect-world="${index}">Explore this part of my work <span aria-hidden="true">↗</span></button>
        ${index < 2
          ? `<div class="reading-tools staggered-grid-mount" data-staggered-grid="${index}" aria-label="${html(chapter.name)} technologies"></div>`
          : `<div class="reading-tools" aria-label="${html(chapter.name)} technologies">${chapter.tools.map(tool => `<button type="button" data-technology="${html(tool.search)}">${technologyIcons(tool.name)}<span>${html(tool.name)}</span></button>`).join('')}</div>`}
      </div>
    </section>
  `).join('')}

  <div id="journey-finish" aria-hidden="true"></div>

  <section class="space-learning space-section" id="education" aria-labelledby="education-title">
    <div class="space-content">
      <p class="space-kicker">THE FOUNDATIONS</p>
      <h2 id="education-title">Learning,<br><em>layer by layer.</em></h2>
      <div class="space-education">
        ${profile.education.map((education, index) => {
          const educationPhoto = index === 0
            ? {
                src: 'https://cache.careers360.mobi/media/colleges/social-media/media-gallery/15415/2018/9/25/Campus%20view%20of%20Dr%20NGP%20Arts%20and%20Science%20College%20Coimbatore_Campus-view.jpg',
                alt: 'Dr. N.G.P. Arts and Science College campus',
                source: 'https://www.careers360.com/colleges/dr-ngp-arts-and-science-college-coimbatore',
                sourceName: 'Careers360'
              }
            : index === 1
              ? {
                  src: 'https://images.bhaskarassets.com/web2images/521/2024/09/13/uvpvt2sgaug1edlj_1726243861.jpeg',
                  alt: 'PSG College of Arts and Science campus',
                  source: 'https://www.bhaskar.com/career/news/top-10-commerce-colleges-in-the-country-133638088.html',
                  sourceName: 'Dainik Bhaskar'
                }
              : index === 2
                ? {
                    src: '/images/education/kongu-school.svg',
                    alt: 'Kongu Matric Higher Secondary School, Morappur campus',
                    source: null,
                    sourceName: null
                  }
                : index === 3
                  ? {
                      src: '/images/education/government-school.svg',
                      alt: 'Government school campus',
                      source: null,
                      sourceName: null
                    }
                  : null;
          const visualMark = ['NGP', 'PSG', 'KONGU', 'GOVT'][index] || 'EDU';
          const visualClass = educationPhoto ? 'has-campus-photo' : 'is-academic-illustration';
          return `
            <article id="education-${index}" class="education-milestone education-milestone--${education.visualStage || 'foundation'}" data-education-index="${index}">
              <div class="education-copy">
                <p class="space-kicker">${html(education.period)}</p>
                <h3>${html(education.degree)}</h3>
                <p class="experience-company">${html(education.institution)}</p>
                <p class="education-highlights">${html(education.highlights)}</p>
                <span class="education-level-badge">${html(education.badge || 'Education')}</span>
              </div>
              <div class="education-visual ${visualClass}">
                ${educationPhoto ? `<img class="education-campus-image" src="${educationPhoto.src}" alt="${html(educationPhoto.alt || education.institution)}" loading="eager" fetchpriority="high" decoding="async">` : ''}
                <span class="education-visual-glow" aria-hidden="true"></span>
                <span class="education-visual-mark" aria-hidden="true">${visualMark}</span>
                <span class="education-visual-caption" aria-hidden="true">${html(education.badge || 'Learning journey')}</span>
                ${educationPhoto?.source ? `<a class="education-image-source" href="${educationPhoto.source}" target="_blank" rel="noopener noreferrer" aria-label="Open ${educationPhoto.sourceName} campus image source">Campus photo · ${educationPhoto.sourceName} ↗</a>` : `<span class="education-visual-note" aria-hidden="true">${educationPhoto ? 'CAMPUS PHOTO' : `FOUNDATION / ${index + 1}`}</span>`}
              </div>
            </article>
          `;
        }).join('')}
      </div>
      <h3 class="story-subheading" id="recognition" style="margin-top: 48px; font-family: var(--font-display); font-size: 2.2rem; font-weight: 400;">Recognition & achievements</h3>
      <div class="space-recognition">
        ${profile.achievements.map(item => `
          <article>
            <p class="space-kicker">${html(item.date)}</p>
            <h3>${html(item.title)}</h3>
            <p>${html(item.organization)}</p>
            <p>${html(item.description)}</p>
          </article>
        `).join('')}
      </div>
    </div>
  </section>

  <section class="space-certifications space-section" id="certifications" aria-labelledby="certifications-title">
    <div class="space-content">
      <p class="space-kicker">CREDENTIALS & CONTINUOUS LEARNING</p>
      <h2 id="certifications-title">Certifications,<br><em>earned and documented.</em></h2>
      <p class="section-intro">Explore certificates from AI, agent workflows, developer tools, and technical training. Select a card to reveal its details.</p>
      <div class="space-certifications-rail certification-reveal-grid" aria-label="Certificate gallery">
        ${[
          ...profile.certificationsPdf.map(item => ({ ...item, kind: 'pdf' })),
          ...profile.certifications.map(item => ({ ...item, kind: 'image' })),
          ...profile.training.map(item => ({ ...item, kind: 'training', issuer: item.organization }))
        ].map((item, index) => `
          <article class="certification-card ${item.kind === 'pdf' ? 'certification-card-pdf' : item.kind === 'image' ? 'certification-card-image' : 'certification-card-training'} ${index === 0 ? 'is-active' : ''}" data-certification-card>
            <button class="certification-reveal-trigger" type="button" data-certification-trigger aria-expanded="${index === 0 ? 'true' : 'false'}" aria-controls="certification-details-${index}">
              <div class="certification-preview ${item.kind === 'pdf' ? 'certification-preview-pdf' : item.kind === 'training' ? 'certification-preview-icon' : 'certification-preview-image'}" aria-hidden="true">
                ${item.kind === 'pdf' ? `
                  <img class="certification-pdf-background" src="${html(item.backgroundImage)}" alt="" aria-hidden="true" loading="lazy" decoding="async">
                  <span class="certification-pdf-mark">CERTIFICATE</span>
                  <span class="certification-pdf-brand">ANTHROPIC</span>
                  <span class="certification-pdf-recipient">Pavithran S</span>
                  <span class="certification-pdf-caption">has completed</span>
                  <span class="certification-pdf-title">${html(item.title)}</span>
                ` : item.kind === 'image' ? `
                  <img src="${html(item.image)}" alt="" loading="lazy" decoding="async">
                  <span class="certification-pdf-mark certification-image-mark">${html(item.issuer || 'CERTIFICATE')}</span>
                ` : `
                  <svg viewBox="0 0 48 48"><circle cx="24" cy="17" r="11"/><path d="m16 26-2 17 10-5 10 5-2-17"/></svg>
                  <span class="certification-training-mark">TRAINING CREDENTIAL</span>
                  <span class="certification-pdf-title">${html(item.title)}</span>
                `}
                <span class="certification-preview-shade"></span>
                <span class="certification-preview-index">${String(index + 1).padStart(2, '0')} / ${String(profile.certificationsPdf.length + profile.certifications.length + profile.training.length).padStart(2, '0')}</span>
              </div>
              <span class="certification-card-heading">
                <span class="certification-type">${item.kind === 'pdf' ? 'Certificate of completion' : item.kind === 'training' ? 'Training credential' : 'Certificate image'}</span>
                <span class="certification-card-title">${html(item.title)}</span>
                <span class="certification-issuer">${html(item.issuer || 'Issuer details on certificate')}</span>
              </span>
              <span class="certification-trigger-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
              </span>
            </button>
            <div class="certification-details" id="certification-details-${index}" aria-hidden="${index === 0 ? 'false' : 'true'}">
              <p class="certification-description">${html(item.description || 'Original certificate record.')}</p>
              ${item.kind === 'image' ? `<a class="certification-view-link" href="${html(item.sourceUrl)}" target="_blank" rel="noopener noreferrer">View original certificate <span aria-hidden="true">↗</span></a>` : item.kind === 'training' ? `<div class="certification-detail-meta"><span>Completion</span><strong>${html(item.date)}</strong></div><div class="certification-detail-meta"><span>Certificate ID</span><strong>${html(item.certificate)}</strong></div>` : `<span class="certification-view-link certification-view-link-static">Anthropic certificate record</span>`}
            </div>
          </article>
        `).join('')}
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
      <p class="space-kicker" data-flip-phrases="THE NEXT CHAPTER|FROM IDEA TO IMPACT|LET'S BUILD WHAT'S NEXT"><span class="vx-flip-fade-current">THE NEXT CHAPTER</span></p>
      <h2>Let's make<br><em>something matter.</em></h2>
      <a class="space-email" href="mailto:${html(profile.email)}">${html(profile.email)} <span aria-hidden="true">↗</span></a>
      <div class="space-socials social-flip-section">
        <div id="social-flip-mount" aria-label="Social and developer profiles"></div>
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

// Render the SocialFlipButton with the real social and developer profile links.
const socialFlipMount = document.getElementById('social-flip-mount');
let socialFlipRoot = null;
if (socialFlipMount) {
  socialFlipRoot = createRoot(socialFlipMount);
  socialFlipRoot.render(createElement(SocialFlipButton, {
    items: [
      { letter: 'C', icon: 'github', label: 'GitHub', href: profile.links.github, external: true },
      { letter: 'O', icon: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/pavithran26s/', external: true },
      { letter: 'N', icon: 'leetcode', label: 'LeetCode', href: profile.links.leetcode, external: true },
      { letter: 'T', icon: 'hackerrank', label: 'HackerRank', href: profile.links.hackerrank, external: true },
      { letter: 'A', icon: 'codechef', label: 'CodeChef', href: profile.links.codechef, external: true },
      { letter: 'C', icon: 'geeksforgeeks', label: 'GeeksforGeeks', href: profile.links.geeksforgeeks, external: true },
      { letter: 'T', icon: 'youtube', label: 'YouTube', href: profile.links.youtube, external: true }
    ]
  }));
}

// Render one filterable staggered grid with the full Tools & Technologies inventory.
const technologyMount = root.querySelector('[data-staggered-grid="0"]');
if (technologyMount) {
  createRoot(technologyMount).render(createElement(StaggeredGrid, { items: ALL_TECHNOLOGIES }));
}

// Load real project sites as their cards approach the viewport, keeping the page fast.
// The project screenshot remains underneath the frame while it loads and for projects
// that do not have a public live URL.
function mountProjectCardFrame(frame) {
  if (!frame || frame.dataset.projectFrameMounted === 'true') return;
  const source = frame.dataset.projectFrameSrc;
  if (!source) return;

  frame.dataset.projectFrameMounted = 'true';
  frame.addEventListener('load', () => frame.classList.add('is-loaded'), { once: true });
  frame.src = source;
}

const projectCardFrames = [...root.querySelectorAll('.project-card-live-frame')];
if ('IntersectionObserver' in window) {
  const projectCardFrameObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      projectCardFrameObserver.unobserve(entry.target);
      mountProjectCardFrame(entry.target);
    });
  }, { rootMargin: '320px 0px' });
  projectCardFrames.forEach(frame => projectCardFrameObserver.observe(frame));
} else {
  projectCardFrames.forEach(mountProjectCardFrame);
}

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

// Skills-only technology navigator. Guard optional effects so they cannot block startup.
try {
  const spotlightStackNavs = [...document.querySelectorAll('.spotlight-stack-nav')];
  const spotlightLinks = [...document.querySelectorAll('[data-spotlight-nav]')];
  spotlightStackNavs.forEach(nav => {
    nav.addEventListener('pointermove', event => {
      if (event.pointerType === 'touch') return;
      const bounds = nav.getBoundingClientRect();
      nav.style.setProperty('--spot-x', `${event.clientX - bounds.left}px`);
      nav.style.setProperty('--spot-y', `${event.clientY - bounds.top}px`);
    }, { passive: true });
    nav.addEventListener('pointerleave', () => {
      nav.style.setProperty('--spot-x', '50%');
      nav.style.setProperty('--spot-y', '50%');
    });
  });
  spotlightLinks.forEach(link => link.addEventListener('click', event => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    lenis.scrollTo(target, { offset: -24, duration: 1.05 });
    history.replaceState(null, '', link.getAttribute('href'));
  }));
  if ('IntersectionObserver' in window) {
    const stackObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        spotlightLinks.forEach(link => {
          const active = link.hash === `#${entry.target.id}`;
          link.classList.toggle('is-active', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-28% 0px -48% 0px', threshold: 0 });
    spotlightLinks.forEach(link => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) stackObserver.observe(target);
    });
  }
} catch (error) {
  console.error('Skills navigation enhancement failed; continuing portfolio startup.', error);
}

// Initially pause scrolling while the speedometer on-load sequence is running
lenis.stop();

let spotlight = null;
let transformersBg = null;
let scrollDepth = null;
let glitterEngine = null;
let motionPhysics = null;
let textEffects = null;
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

const dialogs = new PortfolioDialogs();

// Mount the emerald ShinyButton while retaining DAWN's existing dialog target
// and the optional katana video that only loads in Animation mode.
const dawnAiMount = document.querySelector('#dawn-ai-button-mount');
let dawnAiButtonRoot = null;
if (dawnAiMount) {
  dawnAiButtonRoot = createRoot(dawnAiMount);
  flushSync(() => {
    dawnAiButtonRoot.render(createElement(ShinyButton, {
      id: 'dawn-eye',
      dataDialog: 'dawn',
      ariaLabel: 'Open DAWN AI guide',
      label: 'DAWN AI',
      className: 'dawn-eye dawn-shiny-button',
      fillColor: '#07140b',
      labelColor: '#eaf8ee',
      accentColor: '#70dfa1',
      accentSoftColor: '#b9f8ce',
      sweepDuration: 4.2,
      easeDuration: 0.55,
      arcWidth: 5,
      cornerRadius: 32,
      showSpeckle: true,
      showSheen: true,
      speckleOpacity: 0.2,
      style: {
        minWidth: '120px',
        minHeight: '42px',
        padding: '8px 17px',
        fontSize: '12px',
        fontFamily: 'var(--font-mono)',
        letterSpacing: '.12em',
        textTransform: 'uppercase',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
      },
      children: createElement('video', {
        className: 'dawn-katana-video',
        'data-src': '/videos/katana-blade.mp4',
        loop: true,
        muted: true,
        playsInline: true,
        preload: 'none',
        disablePictureInPicture: true,
        'aria-hidden': true,
      }),
    }));
  });
}
const eyeButton = document.querySelector('#dawn-eye');
const events = new AbortController();
const on = (target, type, handler, options = {}) => {
  if (target) target.addEventListener(type, handler, { signal: events.signal, ...options });
};

// Keep external campus photos resilient: an unavailable host falls back to the
// designed academic side panel instead of leaving a broken image icon.
on(root, 'error', event => {
  const image = event.target;
  if (!(image instanceof HTMLImageElement) || !image.matches('.education-campus-image')) return;
  image.remove();
  image.closest('.education-visual')?.classList.add('is-image-fallback');
}, { capture: true });

// Keep work-company logos visible and provide a clean branded fallback if the
// remote logo host fails, especially for the Adhoc Softwares timeline entry.
on(root, 'error', event => {
  const image = event.target;
  if (!(image instanceof HTMLImageElement) || !image.matches('.experience-company-watermark')) return;
  image.hidden = true;
  const fallback = image.nextElementSibling;
  if (fallback?.classList.contains('experience-company-watermark-fallback')) {
    fallback.hidden = false;
  }
}, { capture: true });

// TeamRevealGrid-inspired certificate selection: hover, focus, or tap to reveal a card.
const certificationGrid = root.querySelector('.certification-reveal-grid');
if (certificationGrid) {
  const certificationCards = [...certificationGrid.querySelectorAll('[data-certification-card]')];
  const activateCertificationCard = (card) => {
    if (!card) return;
    certificationCards.forEach(candidate => {
      const isActive = candidate === card;
      candidate.classList.toggle('is-active', isActive);
      const trigger = candidate.querySelector('[data-certification-trigger]');
      const details = candidate.querySelector('.certification-details');
      trigger?.setAttribute('aria-expanded', String(isActive));
      details?.setAttribute('aria-hidden', String(!isActive));
    });
  };
  certificationGrid.addEventListener('pointerover', event => {
    if (event.pointerType !== 'mouse') return;
    const card = event.target.closest('[data-certification-card]');
    if (card && certificationGrid.contains(card)) activateCertificationCard(card);
  });
  certificationGrid.addEventListener('focusin', event => {
    const card = event.target.closest('[data-certification-card]');
    if (card && certificationGrid.contains(card)) activateCertificationCard(card);
  });
  certificationGrid.addEventListener('click', event => {
    const trigger = event.target.closest('[data-certification-trigger]');
    if (trigger) activateCertificationCard(trigger.closest('[data-certification-card]'));
  });
}

// Build explicit horizontal story stages for Projects, Work, Studies, and recognition.
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const horizontalRailDefinitions = [
  ['.space-projects', 'PROJECTS'],
  ['.space-experience', 'WORK EXPERIENCE'],
  ['.space-education', 'STUDIES'],
  ['.space-recognition', 'RECOGNITION & ACHIEVEMENTS'],

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
          const maxScroll = Math.max(0, horizontalRail.scrollWidth - horizontalRail.clientWidth);
          const targetLeft = horizontalRail.scrollLeft + targetRect.left - railRect.left;
          const centeredLeft = horizontalStoryClamp(
            targetLeft - (horizontalRail.clientWidth - targetRect.width) / 2,
            0,
            maxScroll
          );
          const stage = horizontalRail.closest('.horizontal-story-stage');
          const toolbar = stage?.querySelector('.horizontal-rail-toolbar');
          if (stage?.classList.contains('is-scroll-pinned') && toolbar && maxScroll > 1) {
            const toolbarTop = parseFloat(getComputedStyle(toolbar).top) || 76;
            const stageDocumentTop = window.scrollY + stage.getBoundingClientRect().top;
            lenis.scrollTo(stageDocumentTop - toolbarTop + (centeredLeft / maxScroll) * maxScroll, {
              duration: 1.05,
              easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
          } else {
            horizontalRail.scrollTo({ left: centeredLeft, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
            lenis.scrollTo(horizontalRail, {
              offset: -40,
              duration: 1.15,
              easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
          }
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
on(document, 'click', event => {
  const action = event.target.closest('[data-dialog], [data-project], [data-ask], [data-technology], [data-inspect-world], [data-tool-card]');
  if (!action) return;

  if (action.dataset.dialog) dialogs.open(action.dataset.dialog);
  else if (action.dataset.project) dialogs.openProject(action.dataset.project);
  else if (action.dataset.ask) dialogs.openDawn(action.dataset.ask);
  else if (action.hasAttribute('data-tool-card')) dialogs.openToolCard({
    title: action.dataset.toolTitle,
    category: action.dataset.toolCategory,
    description: action.dataset.toolDescription
  });
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

// Animated glass-menu icon: hamburger morphs into a close mark while the drawer is open.
const menu = document.querySelector('#mobile-menu');
const menuToggle = document.querySelector('#menu-toggle');
const menuClose = document.querySelector('#menu-close');
const syncMenuToggle = (isOpen) => {
  if (!menuToggle) return;
  menuToggle.classList.toggle('is-open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  menuToggle.setAttribute('title', isOpen ? 'Close menu' : 'Open menu');
};
if (menu && menuToggle) {
  on(menuToggle, 'click', () => {
    if (!menu.open) menu.showModal();
    syncMenuToggle(true);
    queueMicrotask(() => menuClose?.focus());
  });
  on(menuClose, 'click', () => menu.close());
  on(menu, 'close', () => {
    syncMenuToggle(false);
    menuToggle.focus();
  });
  on(menu, 'click', event => { if (event.target.closest('a')) menu.close(); });
  syncMenuToggle(menu.open);
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
const normalChoiceButton = document.getElementById('choose-normal');

function openExperienceChoice() {
  if (!experienceChoice || experienceMode) return;
  experienceChoice.hidden = false;
  experienceChoice.classList.remove('is-dismissed');
  experienceChoice.setAttribute('aria-hidden', 'false');
  // Focus the dialog container, not the Animation button, so hover-only shine
  // does not appear before the visitor has interacted with either choice.
  window.setTimeout(() => experienceChoice.focus({ preventScroll: true }), 60);
}

function closeExperienceChoice() {
  if (!experienceChoice) return;
  experienceChoice.classList.add('is-dismissed');
  experienceChoice.setAttribute('aria-hidden', 'true');
  window.setTimeout(() => { experienceChoice.hidden = true; }, 450);
  document.querySelector('.space-signature')?.focus({ preventScroll: true });
}

function restoreWorkExperienceTimeline() {
  const stageIndex = horizontalStoryStages.findIndex(({ rail }) => rail.matches('.space-experience'));
  if (stageIndex < 0) return;

  const { stage, rail, toolbar } = horizontalStoryStages[stageIndex];
  const parent = stage.parentNode;
  if (!parent) return;

  // Remove the horizontal-only helper from the experience section. Other
  // chapters keep their existing horizontal storytelling in Animation mode.
  horizontalStoryResizeObserver?.unobserve(rail);
  horizontalStoryResizeObserver?.unobserve(toolbar);

  const heading = document.createElement('div');
  heading.className = 'experience-timeline-heading';
  heading.innerHTML = '<p class="space-kicker">CAREER TIMELINE</p><h3>Work experience</h3>';
  parent.insertBefore(heading, stage);
  parent.insertBefore(rail, stage);
  stage.remove();

  rail.classList.remove('horizontal-story-rail');
  rail.classList.add('vertical-experience-timeline');
  rail.setAttribute('role', 'list');
  rail.setAttribute('aria-label', 'Work experience timeline');
  rail.removeAttribute('tabindex');
  rail.style.removeProperty('scroll-snap-type');
  rail.style.removeProperty('scroll-behavior');
  rail.scrollLeft = 0;

  rail.querySelectorAll('article').forEach(card => {
    card.setAttribute('role', 'listitem');
    card.classList.remove('side-scroll-entry', 'is-side-revealed');
    card.style.removeProperty('--side-entry-x');
  });

  horizontalStoryRails.splice(horizontalStoryRails.indexOf(rail), 1);
  horizontalStoryStages.splice(stageIndex, 1);
  scheduleHorizontalStoryLayout();
}

function chooseNormalMode() {
  if (experienceMode) return;
  restoreWorkExperienceTimeline();
  experienceMode = 'normal';
  document.body.classList.remove('experience-mode-pending', 'experience-animation');
  document.body.classList.add('experience-normal');
  if (speedometerOverlay) {
    speedometerOverlay.hidden = true;
    speedometerOverlay.setAttribute('aria-hidden', 'true');
  }
  closeExperienceChoice();
  // Count-up, text reveals and image collage are lightweight in both modes.
  textEffects = textEffects || new TextEffectsController({ root, mode: 'normal' });
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
  textEffects = textEffects || new TextEffectsController({ root, mode: 'animation' });
  lenis.start();
}

// Live-site preview selector: switch the embedded page and keep project tabs in sync.
const heroShowcaseRoot = root.querySelector('[data-hero-showcase]');
if (heroShowcaseRoot) {
  const previewMount = heroShowcaseRoot.querySelector('[data-hero-project-preview]');
  const heroChoices = [...heroShowcaseRoot.querySelectorAll('[data-hero-project-choice]')];

  const activateHeroProject = (projectId) => {
    const project = heroShowcaseProjects.find(candidate => candidate.id === projectId);
    if (!project || !previewMount) return;
    previewMount.innerHTML = renderHeroProjectPreview(project);
    heroShowcaseRoot.dataset.activeProject = project.id;
    heroChoices.forEach(button => {
      const active = button.dataset.heroProjectChoice === project.id;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  };

  heroChoices.forEach(button => on(button, 'click', () => activateHeroProject(button.dataset.heroProjectChoice)));
}

// Mount the FlipText-inspired character animation in the hero name.
const introTitleFlipMount = document.getElementById('intro-title-flip-mount');
let introNameFlipRoot = null;
if (introTitleFlipMount) {
  introNameFlipRoot = createRoot(introTitleFlipMount);
  introNameFlipRoot.render(createElement(FlipText, {
    className: 'intro-name-flip',
    duration: 2.2,
    delay: 0,
    loop: true,
    separator: ' ',
    together: false,
    children: 'Pavithran S'
  }));
}

// Mount the React 3D button into the existing vanilla-Vite portfolio shell.
const animationModeMount = document.getElementById('animation-mode-mount');
const perspectiveGridMount = document.getElementById('perspective-grid-mount');
let perspectiveGridRoot = null;
if (perspectiveGridMount) {
  perspectiveGridRoot = createRoot(perspectiveGridMount);
  perspectiveGridRoot.render(createElement(PerspectiveGrid, { rows: 20, cols: 20 }));
}
const interactiveParticlesMount = document.getElementById('interactive-particles-mount');
let interactiveParticlesRoot = null;
if (interactiveParticlesMount) {
  interactiveParticlesRoot = createRoot(interactiveParticlesMount);
  interactiveParticlesRoot.render(createElement(LandingInteractiveParticles));
}
let animationButtonRoot = null;
if (animationModeMount) {
  animationButtonRoot = createRoot(animationModeMount);
  animationButtonRoot.render(createElement(Animation3DButton, { onSelect: chooseAnimationMode }));
}
const professionalLiquidMetalMount = document.getElementById('professional-liquid-metal-mount');
let professionalLiquidMetalRoot = null;
if (professionalLiquidMetalMount) {
  professionalLiquidMetalRoot = createRoot(professionalLiquidMetalMount);
  professionalLiquidMetalRoot.render(createElement(LiquidMetalSurface, { variant: 'professional' }));
}
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
    const isReadyToDismiss = elapsed >= INTRO_MIN_VISIBLE_MS && isPageLoaded;

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
    introNameFlipRoot?.unmount();
    animationButtonRoot?.unmount();
    perspectiveGridRoot?.unmount();
    interactiveParticlesRoot?.unmount();
    professionalLiquidMetalRoot?.unmount();
    socialFlipRoot?.unmount();
    textEffects?.dispose();
    horizontalStoryResizeObserver?.disconnect();
    if (horizontalStoryFrame !== null) cancelAnimationFrame(horizontalStoryFrame);
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
