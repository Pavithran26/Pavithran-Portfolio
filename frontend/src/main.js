import './style.css';
import { PORTFOLIO_DATA as profile } from './data/portfolioData.js';
import { PROJECTS_DATA as projects } from './data/projectsData.js';
import { StackJourney } from './components/StackJourney.js';
import { escapeHtml as html } from './utils/helpers.js';
import { PortfolioDialogs } from './components/PortfolioDialogs.js';

const arrow = '<span aria-hidden="true">↗</span>';
const featuredCopy = [
  'Family insurance. One clear picture.',
  'Knowledge that moves with the next generation.',
  'Less spreadsheet work. More operational clarity.',
  'A portfolio you can explore. An assistant you can ask.'
];

document.querySelector('#portfolio-content').innerHTML = `
  <section class="work section-pad" id="work" aria-labelledby="work-title">
    <div class="section-top"><span class="eyebrow">02 / SELECTED WORK</span><span class="eyebrow">FROM IDEA TO IMPLEMENTATION</span></div>
    <div class="work-heading"><h2 class="display-title" id="work-title" data-reveal>Built to<br><span class="muted-light">make a difference.</span></h2><p>Insurance. Learning. Enterprise operations.<br>Different challenges. The same drive to solve them.</p></div>
    <div class="featured-projects">
      ${projects.slice(0, 2).map((project, i) => `<article class="project-feature project-${project.id}" data-reveal>
        <div class="project-meta"><span class="eyebrow">PROJECT / 0${i + 1}</span><span class="eyebrow">${i === 0 ? 'INSURANCE' : 'LEARNING'}</span></div>
        <div class="project-wordmark" aria-hidden="true">${i === 0 ? 'clan<span>sure.</span>' : 'gt<span>companion.</span>'}</div>
        <div class="project-feature-body"><span class="eyebrow">${html(project.category)}</span><h3>${featuredCopy[i]}</h3><p>${i === 0 ? 'Policies, documents, renewals, and claims — connected in a single family protection portal.' : 'Training tracks, shared materials, assignments, and an AI tutor that keeps learning within reach.'}</p><div class="project-bottom"><span class="project-technologies">React · .NET · FastAPI · PostgreSQL</span><button class="round-button" type="button" data-project="${project.id}" aria-label="Explore ${html(project.title)}">${arrow}</button></div></div>
      </article>`).join('')}
    </div>
    <div class="project-index">
      ${projects.slice(2).map((project, i) => `<article class="project-row" data-reveal><span class="eyebrow">0${i + 3}</span><div><span class="eyebrow">${html(project.category)}</span><h3>${i === 0 ? 'Enterprise ERP' : 'Portfolio & DAWN AI'}</h3></div><p>${featuredCopy[i + 2]}</p><button class="round-button" type="button" data-project="${project.id}" aria-label="Explore ${html(project.title)}">${arrow}</button></article>`).join('')}
    </div>
  </section>

  <section class="intro section-pad" id="about" aria-labelledby="about-title">
    <div class="section-top"><span class="eyebrow">03 / THE ENGINEER</span><span class="eyebrow">PURPOSE BEFORE PROCESS</span></div>
    <div class="intro-grid">
      <h2 class="display-title" id="about-title" data-reveal>Complex problems.<br><span class="muted-light">Clear solutions.</span></h2>
      <div class="intro-copy" data-reveal>
        <p>I’m Pavithran, a software engineer turning real-world problems into useful digital experiences.</p>
        <p>From family insurance to enterprise operations, I connect thoughtful interfaces, dependable backends, and AI that makes knowledge easier to find.</p>
        <a class="text-link" href="#experience">Explore my journey ${arrow}</a>
      </div>
    </div>
    <div class="practice-list">
      <div><span class="eyebrow">CURRENTLY BUILDING AT</span><strong>OWLSure <small>/ ValueMomentum</small></strong></div>
      <div><span class="eyebrow">WORK ACROSS</span><strong>Full-stack. AI. Systems.</strong></div>
      <div><span class="eyebrow">BASED IN</span><strong>Tamil Nadu, India</strong></div>
    </div>
  </section>

  <section class="experience section-pad" id="experience" aria-labelledby="experience-title">
    <div class="section-top"><span class="eyebrow">04 / THE JOURNEY</span><span class="eyebrow">ALWAYS IN PROGRESS</span></div>
    <div class="experience-grid"><div><h2 class="display-title" id="experience-title" data-reveal>Stay curious.<br><span class="muted-dark">Keep building.</span></h2><p class="experience-intro">Learning through real problems, real teams,<br>and the work it takes to ship.</p><button class="text-link" type="button" data-dialog="dossier">Education, achievements & more ${arrow}</button></div>
      <div class="experience-timeline">${profile.experience.map(job => `<article data-reveal><span class="eyebrow">${html(job.period)}</span><h3>${html(job.role)}</h3><p class="job-company">${html(job.company)}</p><p>${html(job.responsibilities[0])}</p><div class="job-projects">${job.projects.map(project => `<span>${html(project)}</span>`).join('')}</div></article>`).join('')}</div>
    </div>
    <div class="recognition">${profile.achievements.map(item => `<div><span class="eyebrow">${html(item.date)}</span><strong>${html(item.title)}</strong><span>${html(item.organization)}</span></div>`).join('')}</div>
  </section>

  <section class="dawn-section section-pad" aria-labelledby="dawn-title">
    <div class="dawn-identity"><span class="eyebrow">MEET YOUR GUIDE</span><h2 id="dawn-title">DAWN<span> AI</span></h2><p>A question is a good place to start.<br>Ask about my projects, skills, or experience.</p></div>
    <div class="dawn-prompts"><button type="button" data-ask="What is ClanSure and what did Pavithran build?">What went into ClanSure? ${arrow}</button><button type="button" data-ask="Tell me about Pavithran's backend and AI experience.">Where do backend and AI meet? ${arrow}</button><button type="button" data-dialog="dawn">Start a conversation ${arrow}</button></div>
  </section>

  <footer class="contact section-pad" id="contact">
    <div class="section-top"><span class="eyebrow">05 / WHAT’S NEXT?</span><a class="text-link" href="#top">Back to top ↑</a></div>
    <h2 class="contact-title" data-reveal>LET’S BUILD<br><a href="mailto:${html(profile.email)}">SOMETHING<span aria-hidden="true">↗</span></a></h2>
    <div class="contact-details"><div><span class="eyebrow">HAVE AN IDEA? SAY HELLO.</span><div class="email-row"><a href="mailto:${html(profile.email)}">${html(profile.email)}</a><button class="copy-email" type="button" aria-label="Copy email address">Copy</button></div><span id="copy-feedback" role="status"></span></div><div class="social-links"><a href="${profile.links.github}" target="_blank" rel="noopener noreferrer">GitHub ${arrow}</a><a href="${profile.links.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn ${arrow}</a><a href="${profile.links.leetcode}" target="_blank" rel="noopener noreferrer">LeetCode ${arrow}</a></div></div>
    <div class="footer-bottom"><a class="wordmark" href="#top">PAVITHRAN<span> / S.</span></a><span>© ${new Date().getFullYear()} Pavithran S.</span><button class="text-link" type="button" data-dialog="terminal">Open terminal <span aria-hidden="true">⌘</span></button></div>
  </footer>
`;

const dialogs = new PortfolioDialogs();
document.addEventListener('click', (event) => {
  const button = event.target.closest('[data-dialog], [data-project], [data-ask]');
  if (!button) return;
  if (button.dataset.project) dialogs.openProject(button.dataset.project);
  else if (button.dataset.ask) dialogs.openDawn(button.dataset.ask);
  else dialogs.open(button.dataset.dialog);
});

const menuButton = document.querySelector('#menu-toggle');
const menu = document.querySelector('#mobile-menu');
menuButton.addEventListener('click', () => { menu.showModal(); menuButton.setAttribute('aria-expanded', 'true'); });
menu.querySelector('[data-close-menu]').addEventListener('click', () => menu.close());
menu.addEventListener('click', event => { if (event.target === menu || event.target.closest('a')) menu.close(); });
menu.addEventListener('close', () => { menuButton.setAttribute('aria-expanded', 'false'); menuButton.focus(); });
window.addEventListener('keydown', event => {
  if (event.key === '`' && !event.repeat && !event.ctrlKey && !event.metaKey && !event.altKey && !event.target.closest('input, textarea, select, [contenteditable="true"]') && !document.querySelector('dialog[open]')) {
    event.preventDefault(); dialogs.open('terminal');
  }
});

document.querySelector('.copy-email').addEventListener('click', async () => {
  const feedback = document.querySelector('#copy-feedback');
  try { await navigator.clipboard.writeText(profile.email); feedback.textContent = 'Email copied.'; }
  catch { feedback.textContent = 'Copy unavailable. Select the email address, or open it to send a message.'; }
});

const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
let motionPreference = null;
try { motionPreference = localStorage.getItem('portfolio-motion'); } catch { /* Private browsing may disable storage. */ }
let motionEnabled = motionPreference === null ? !motionQuery.matches : motionPreference === 'on';
const journeyRoot = document.querySelector('#architecture');
const journey = new StackJourney(journeyRoot, {
  motion: motionEnabled,
  onInspect: chapter => dialogs.openChapter(chapter),
  onTechnology: query => dialogs.openSkills(query)
});
function applyMotionPreference() {
  document.documentElement.classList.toggle('reduced-motion', !motionEnabled);
  journey.setMotion(motionEnabled);
  updateScroll();
}
journeyRoot.addEventListener('journey-motion-toggle', () => {
  motionEnabled = !motionEnabled;
  motionPreference = motionEnabled ? 'on' : 'off';
  try { localStorage.setItem('portfolio-motion', motionPreference); } catch { /* The preference still applies for this visit. */ }
  applyMotionPreference();
});
motionQuery.addEventListener('change', () => { if (motionPreference === null) { motionEnabled = !motionQuery.matches; applyMotionPreference(); } });

let framePending = false;
function updateScroll() {
  framePending = false;
  const y = window.scrollY;
  const total = document.documentElement.scrollHeight - window.innerHeight;
  document.querySelector('.reading-progress').style.transform = `scaleX(${total > 0 ? y / total : 0})`;
  document.querySelector('.site-header').classList.toggle('scrolled', y > 40);
}
window.addEventListener('scroll', () => { if (!framePending) { framePending = true; requestAnimationFrame(updateScroll); } }, { passive: true });
window.addEventListener('resize', updateScroll, { passive: true });
applyMotionPreference();

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('revealed'); revealObserver.unobserve(entry.target); } });
}, { threshold: 0.08 });
document.querySelectorAll('[data-reveal]').forEach(element => { element.classList.add('will-reveal'); revealObserver.observe(element); });
const navObserver = new IntersectionObserver(entries => {
  entries.filter(entry => entry.isIntersecting).forEach(entry => {
    document.querySelectorAll('.desktop-nav a').forEach(link => {
      const active = link.hash === `#${entry.target.id}`;
      if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
    });
  });
}, { rootMargin: '-15% 0px -60% 0px' });
document.querySelectorAll('section[id], footer[id]').forEach(section => navObserver.observe(section));

if (import.meta.hot) import.meta.hot.dispose(() => journey.dispose());
