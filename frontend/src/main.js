import { educationCharacter } from './components/EducationCharacter.js';
import { CursorSpotlight } from './components/CursorSpotlight.js';
import './style.css';
import { PORTFOLIO_DATA as profile } from './data/portfolioData.js';
import { FEATURED_PROJECTS as projects } from './data/projectsData.js';
import { SPACE_CHAPTERS as chapters } from './data/spaceJourneyData.js';
import { PortfolioDialogs } from './components/PortfolioDialogs.js';
import { projectVisual } from './components/ProjectVisuals.js';
import { technologyIcons } from './components/TechnologyIcons.js';
import { NativeMotion } from './components/NativeMotion.js';
import { SectionMotion } from './components/SectionMotion.js';
import { getClaraEyeAvatarHtml } from './components/ClaraWidget.js';
import { SpaceJourney } from './components/SpaceJourney.js';

import { escapeHtml as html } from './utils/helpers.js';

const root = document.querySelector('#portfolio');
root.innerHTML = `
  <section class="space-intro" id="top" aria-labelledby="intro-title">
    <div class="intro-identity"><p class="space-kicker">TAMIL NADU, INDIA · SOFTWARE ENGINEER</p><h1 id="intro-title">Pavithran <em>S.</em></h1><p class="intro-statement">Thoughtful interfaces.<br>Dependable systems.<br>A little intelligence in between.</p><a class="intro-enter" href="#work">Explore my work <span aria-hidden="true">↓</span></a></div>
    <p class="intro-caption">A SMALL PART OF<br>A MUCH BIGGER UNIVERSE</p>
  </section>
  <section class="space-work space-section" id="work" aria-labelledby="work-title"><div class="space-content">
    <p class="space-kicker">IDEAS, BUILT INTO REAL THINGS</p><h2 id="work-title">Selected <em>work.</em></h2><p class="section-intro">Different problems. The same curiosity.</p>
    <nav class="project-index" aria-label="Browse projects">${projects.map(project => `<a href="#project-${project.id}">${html(project.title)}</a>`).join('')}</nav>
    <div class="space-projects">${projects.map((project, index) => `<article id="project-${project.id}" class="project-destination">
      <div class="project-copy"><p class="project-overline">${String(index + 1).padStart(2, '0')} / ${html(project.category)}</p>
      <button class="space-project-title" type="button" data-project="${project.id}"><span>${html(project.title)}</span><span aria-hidden="true">↗</span></button>
      <p>${html(project.tagline)}</p><p class="project-summary">${html(project.overview)}</p>
      <div class="project-logos" aria-label="${html(project.title)} technologies">${project.technologies.slice(0, 5).map(technology => `<span title="${html(technology)}"><span class="visually-hidden">${html(technology)}</span>${technologyIcons(technology)}</span>`).join('')}</div>
      <div class="project-links"><button class="space-text-link" type="button" data-project="${project.id}">Explore project ↗</button>${project.liveUrl ? `<a class="space-text-link" href="${html(project.liveUrl)}" target="_blank" rel="noopener noreferrer">Visit project ↗</a>` : ''}</div></div>
      ${projectVisual(project)}
    </article>`).join('')}</div><div class="project-archive-link"><a class="space-text-link" href="/projects.html">All projects & experiments <span aria-hidden="true">↗</span></a><p>More applications, explorations and things I learned by building.</p></div>
  </div></section>
  <section class="space-about space-section" id="about" aria-labelledby="about-title"><div class="space-content">
    <p class="space-kicker">THE PERSON BEHIND THE WORK</p><h2 id="about-title">Always curious.<br><em>Still building.</em></h2><p class="section-intro">I'm Pavithran, a software engineer from Tamil Nadu. I like making complicated things feel simple, from the first interaction to the systems underneath.</p>
    <div class="space-experience" id="experience">${profile.experience.map((job, index) => `<article id="experience-${index}"><p class="space-kicker">${html(job.period)}</p><h3>${html(job.role)}</h3><p class="experience-company">${html(job.company)}</p><p>${html(job.responsibilities[0])}</p></article>`).join('')}</div>
    <div class="space-actions"><button class="space-text-link" type="button" data-dialog="dossier">The full story <span aria-hidden="true">↗</span></button><button class="space-text-link" type="button" data-dialog="skills">All skills & tools <span aria-hidden="true">↗</span></button><a class="space-text-link" href="#education">Education & training <span aria-hidden="true">↓</span></a></div>
  </div></section>
  ${chapters.map((chapter, index) => `
    <section class="world-section world-section-${chapter.side}" id="stack-${chapter.id}" data-world-section="${index + 1}" aria-labelledby="world-title-${chapter.id}">
      <div class="world-copy"><p class="space-kicker">${chapter.orbit}</p><h2 id="world-title-${chapter.id}">${chapter.headline}</h2><p class="world-tagline">${html(chapter.tagline)}</p><p class="world-description">${html(chapter.description)}</p><button class="space-text-link" type="button" data-inspect-world="${index}">Explore this part of my work <span aria-hidden="true">↗</span></button>
        <div class="reading-tools" aria-label="${chapter.name} technologies">${chapter.tools.map(tool => `<button type="button" data-technology="${html(tool.search)}">${technologyIcons(tool.name)}<span>${html(tool.name)}</span></button>`).join('')}</div>
      </div>
    </section>
  `).join('')}
  <div id="journey-finish" aria-hidden="true"></div>
  <section class="space-learning space-section" id="education" aria-labelledby="education-title"><div class="space-content">
    <p class="space-kicker">THE FOUNDATIONS</p><h2 id="education-title">Learning,<br><em>layer by layer.</em></h2>
    <div class="space-education">${profile.education.map((education, index) => `<article id="education-${index}" class="education-milestone"><div class="education-copy"><p class="space-kicker">${html(education.period)}</p><h3>${html(education.degree)}</h3><p class="experience-company">${html(education.institution)}</p><p>${html(education.highlights)}</p></div>${educationCharacter(education.visualStage)}</article>`).join('')}</div>
    <h3 class="story-subheading" id="recognition">Training & recognition</h3><div class="space-recognition">${profile.training.map(item => `<article><p class="space-kicker">${html(item.date)}</p><h3>${html(item.title)}</h3><p>${html(item.organization)} · ${html(item.description)}</p><p class="training-certificate">Certificate: ${html(item.certificate)}</p></article>`).join('')}${profile.achievements.map(item => `<article><p class="space-kicker">${html(item.date)}</p><h3>${html(item.title)}</h3><p>${html(item.organization)}</p><p>${html(item.description)}</p></article>`).join('')}</div>
    <a class="space-text-link" href="${profile.links.certifications}" target="_blank" rel="noopener noreferrer">View certificate gallery <span aria-hidden="true">↗</span></a>
  </div></section>
  <section class="space-dawn space-section" id="dawn" aria-labelledby="dawn-title"><div class="space-content">
    <p class="space-kicker">A CONVERSATION, IF YOU'RE CURIOUS</p><h2 id="dawn-title">Meet <em>DAWN.</em></h2><p class="section-intro">An AI guide to my projects, skills, and experience. Ask a question and explore the work in a different way.</p><div class="space-actions"><button type="button" class="space-text-link" data-dialog="dawn">Open conversation <span aria-hidden="true">↗</span></button></div>
  </div></section>
  <footer class="space-contact space-section" id="contact"><div class="space-content"><p class="space-kicker">THE NEXT CHAPTER</p><h2>Let's make<br><em>something matter.</em></h2><a class="space-email" href="mailto:${html(profile.email)}">${html(profile.email)} <span aria-hidden="true">↗</span></a><div class="space-socials"><a href="${profile.links.github}" target="_blank" rel="noopener noreferrer">GitHub ↗</a><a href="${profile.links.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a><a href="${profile.links.leetcode}" target="_blank" rel="noopener noreferrer">LeetCode ↗</a><a href="${profile.links.hackerrank}" target="_blank" rel="noopener noreferrer">HackerRank ↗</a><a href="${profile.links.codechef}" target="_blank" rel="noopener noreferrer">CodeChef ↗</a><a href="${profile.links.geeksforgeeks}" target="_blank" rel="noopener noreferrer">GeeksforGeeks ↗</a><a href="${profile.links.youtube}" target="_blank" rel="noopener noreferrer">YouTube ↗</a><button type="button" id="copy-email">Copy email</button></div><p id="copy-feedback" role="status"></p><div class="space-colophon"><span>© ${new Date().getFullYear()} ${html(profile.name)}</span><button type="button" data-dialog="terminal">Developer terminal ↗</button><a href="#top">Back to the beginning ↑</a></div></div></footer>
`;

const spotlight = new CursorSpotlight(root);
const eyeButton = document.querySelector('#dawn-eye');
eyeButton.innerHTML = getClaraEyeAvatarHtml(38) + '<span class="eye-label">Meet DAWN<small>AI guide</small></span>';
const dialogs = new PortfolioDialogs();
const journey = new SpaceJourney(document.querySelector('#universe'));
const nativeMotion = new NativeMotion(root);
const sectionMotion = new SectionMotion(root);

const events = new AbortController();
const on = (target, type, handler) => target.addEventListener(type, handler, { signal: events.signal });
on(document, 'click', event => {
  const anchor = event.target.closest('a[href^="#"]');
  if (!anchor || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const selector = anchor.getAttribute('href');
  if (!selector || selector === '#' || !document.querySelector(selector)) return;
  event.preventDefault();
  journey.flyTo(selector);
});
on(document, 'click', event => {
  const action = event.target.closest('[data-dialog], [data-project], [data-ask], [data-technology], [data-inspect-world]');
  if (!action) return;
  if (action.dataset.dialog) dialogs.open(action.dataset.dialog);
  else if (action.dataset.project) dialogs.openProject(action.dataset.project);
  else if (action.dataset.ask) dialogs.openDawn(action.dataset.ask);
  else if (action.dataset.technology) dialogs.openSkills(action.dataset.technology);
  else if (action.dataset.inspectWorld !== undefined) dialogs.openChapter(chapters[Number(action.dataset.inspectWorld)]);
});
on(window, 'pointermove', event => {
  if (!journey.motion || event.pointerType !== 'mouse') return;
  const iris = eyeButton.querySelector('.clara-eye-iris');
  const box = eyeButton.getBoundingClientRect();
  const dx = event.clientX - box.left - box.width / 2;
  const dy = event.clientY - box.top - box.height / 2;
  const distance = Math.max(1, Math.hypot(dx, dy));
  iris.style.transform = `translate(${dx / distance * 5}px, ${dy / distance * 5}px)`;
});
on(document.querySelector('#motion-toggle'), 'click', () => {
  if (!journey.motion) eyeButton.querySelector('.clara-eye-iris').style.transform = '';
});
on(document, 'keydown', event => {
  if (event.key !== '`' || event.ctrlKey || event.metaKey || event.altKey || event.target.closest('input, textarea, select, [contenteditable="true"]') || document.querySelector('dialog[open]')) return;
  event.preventDefault();
  dialogs.openTerminal();
});
const menu = document.querySelector('#mobile-menu');
const menuToggle = document.querySelector('#menu-toggle');
on(menuToggle, 'click', () => { menu.showModal(); menuToggle.setAttribute('aria-expanded', 'true'); queueMicrotask(() => document.querySelector('#menu-close')?.focus()); });
on(document.querySelector('#menu-close'), 'click', () => menu.close());
on(menu, 'close', () => { menuToggle.setAttribute('aria-expanded', 'false'); });
on(menu, 'close', () => menuToggle.focus());
on(menu, 'click', event => { if (event.target.closest('a')) menu.close(); });
on(document.querySelector('#copy-email'), 'click', async () => {
  const feedback = document.querySelector('#copy-feedback');
  try { await navigator.clipboard.writeText(profile.email); feedback.textContent = 'Email address copied.'; }
  catch { feedback.textContent = 'Select the email address above to copy it, or open it to send a message.'; }
});
if (import.meta.hot) import.meta.hot.dispose(() => { events.abort(); spotlight.dispose(); nativeMotion.dispose(); sectionMotion.dispose(); journey.dispose(); dialogs.request?.abort(); dialogs.terminal?.stopMatrix(); dialogs.dialog.remove(); });
