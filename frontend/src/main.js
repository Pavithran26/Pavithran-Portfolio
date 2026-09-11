import './style.css';
import { PORTFOLIO_DATA as profile } from './data/portfolioData.js';
import { PROJECTS_DATA as projects } from './data/projectsData.js';
import { SPACE_CHAPTERS as chapters } from './data/spaceJourneyData.js';
import { PortfolioDialogs } from './components/PortfolioDialogs.js';
import { technologyIcons } from './components/TechnologyIcons.js';
import { SpaceJourney } from './components/SpaceJourney.js';
import { escapeHtml as html } from './utils/helpers.js';

const root = document.querySelector('#portfolio');
root.innerHTML = `
  <section class="space-intro" id="top" aria-labelledby="intro-title">
    <div class="intro-identity"><p class="space-kicker">TAMIL NADU, INDIA · SOFTWARE ENGINEER</p><h1 id="intro-title">Pavithran <em>S.</em></h1><p class="intro-statement">Thoughtful interfaces.<br>Dependable systems.<br>A little intelligence in between.</p><a class="intro-enter" href="#stack-frontend">A journey through my stack <span aria-hidden="true">↓</span></a></div>
    <p class="intro-caption">FROM INTERFACE<br>TO INTELLIGENCE</p>
  </section>
  ${chapters.map((chapter, index) => `
    <section class="world-section world-section-${chapter.side}" id="stack-${chapter.id}" data-world-section="${index + 1}" aria-labelledby="world-title-${chapter.id}">
      <div class="world-copy"><p class="space-kicker">${chapter.orbit}</p><h2 id="world-title-${chapter.id}">${chapter.headline}</h2><p class="world-tagline">${html(chapter.tagline)}</p><p class="world-description">${html(chapter.description)}</p><button class="space-text-link" type="button" data-inspect-world="${index}">Explore this part of my work <span aria-hidden="true">↗</span></button>
        <div class="reading-tools" aria-label="${chapter.name} technologies">${chapter.tools.map(tool => `<button type="button" data-technology="${html(tool.search)}">${technologyIcons(tool.name)}<span>${html(tool.name)}</span></button>`).join('')}</div>
      </div>
    </section>
  `).join('')}
  <div id="journey-finish" aria-hidden="true"></div>
  <section class="space-work space-section" id="work" aria-labelledby="work-title"><div class="space-content">
    <p class="space-kicker">BACK TO THE REAL WORLD</p><h2 id="work-title">Selected <em>work.</em></h2><p class="section-intro">Different problems. The same curiosity.</p>
    <div class="space-projects">${projects.map((project, index) => `<article><p class="project-overline">0${index + 1} / ${html(project.category)}</p><button class="space-project-title" type="button" data-project="${project.id}"><span>${html(project.title)}</span><span aria-hidden="true">↗</span></button><p>${html(project.tagline)}</p><div class="project-logos" aria-label="${html(project.title)} technologies">${project.technologies.slice(0, 5).map(technology => `<span title="${html(technology)}"><span class="visually-hidden">${html(technology)}</span>${technologyIcons(technology)}</span>`).join('')}</div></article>`).join('')}</div>
  </div></section>
  <section class="space-about space-section" id="about" aria-labelledby="about-title"><div class="space-content">
    <p class="space-kicker">THE PERSON BEHIND THE WORK</p><h2 id="about-title">Always curious.<br><em>Still building.</em></h2><p class="section-intro">I'm Pavithran, a software engineer from Tamil Nadu. I like making complicated things feel simple, from the first interaction to the systems underneath.</p>
    <div class="space-experience" id="experience">${profile.experience.map(job => `<article><p class="space-kicker">${html(job.period)}</p><h3>${html(job.role)}</h3><p class="experience-company">${html(job.company)}</p><p>${html(job.responsibilities[0])}</p></article>`).join('')}</div>
    <div class="space-actions"><button class="space-text-link" type="button" data-dialog="dossier">The full story <span aria-hidden="true">↗</span></button><button class="space-text-link" type="button" data-dialog="skills">All skills & tools <span aria-hidden="true">↗</span></button></div>
  </div></section>
  <section class="space-dawn space-section" aria-labelledby="dawn-title"><div class="space-content">
    <p class="space-kicker">A CONVERSATION, IF YOU'RE CURIOUS</p><h2 id="dawn-title">Meet <em>DAWN.</em></h2><p class="section-intro">An AI guide to my projects, skills, and experience. Ask a question and explore the work in a different way.</p><div class="dawn-questions"><button type="button" data-ask="What did Pavithran build for ClanSure?">Tell me about ClanSure <span aria-hidden="true">↗</span></button><button type="button" data-ask="How does Pavithran use backend engineering and AI together?">How do backend and AI connect? <span aria-hidden="true">↗</span></button><button type="button" data-dialog="dawn">Ask your own question <span aria-hidden="true">↗</span></button></div>
  </div></section>
  <footer class="space-contact space-section" id="contact"><div class="space-content"><p class="space-kicker">THE NEXT CHAPTER</p><h2>Let's make<br><em>something matter.</em></h2><a class="space-email" href="mailto:${html(profile.email)}">${html(profile.email)} <span aria-hidden="true">↗</span></a><div class="space-socials"><a href="${profile.links.github}" target="_blank" rel="noopener noreferrer">GitHub ↗</a><a href="${profile.links.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a><a href="${profile.links.leetcode}" target="_blank" rel="noopener noreferrer">LeetCode ↗</a><button type="button" id="copy-email">Copy email</button></div><p id="copy-feedback" role="status"></p><div class="space-colophon"><span>© ${new Date().getFullYear()} ${html(profile.name)}</span><button type="button" data-dialog="terminal">Developer terminal ↗</button><a href="#top">Back to the beginning ↑</a></div></div></footer>
`;

const dialogs = new PortfolioDialogs();
const journey = new SpaceJourney(document.querySelector('#universe'));
const events = new AbortController();
const on = (target, type, handler) => target.addEventListener(type, handler, { signal: events.signal });
on(document, 'click', event => {
  const action = event.target.closest('[data-dialog], [data-project], [data-ask], [data-technology], [data-inspect-world]');
  if (!action) return;
  if (action.dataset.dialog) dialogs.open(action.dataset.dialog);
  else if (action.dataset.project) dialogs.openProject(action.dataset.project);
  else if (action.dataset.ask) dialogs.openDawn(action.dataset.ask);
  else if (action.dataset.technology) dialogs.openSkills(action.dataset.technology);
  else if (action.dataset.inspectWorld !== undefined) dialogs.openChapter(chapters[Number(action.dataset.inspectWorld)]);
});
on(document, 'keydown', event => {
  if (event.key !== '`' || event.ctrlKey || event.metaKey || event.altKey || event.target.closest('input, textarea, select, [contenteditable="true"]') || document.querySelector('dialog[open]')) return;
  event.preventDefault();
  dialogs.openTerminal();
});
const menu = document.querySelector('#mobile-menu');
const menuToggle = document.querySelector('#menu-toggle');
on(menuToggle, 'click', () => { menu.showModal(); menuToggle.setAttribute('aria-expanded', 'true'); });
on(document.querySelector('#menu-close'), 'click', () => menu.close());
on(menu, 'close', () => { menuToggle.setAttribute('aria-expanded', 'false'); });
on(menu, 'click', event => { if (event.target.closest('a')) menu.close(); });
on(document.querySelector('#copy-email'), 'click', async () => {
  const feedback = document.querySelector('#copy-feedback');
  try { await navigator.clipboard.writeText(profile.email); feedback.textContent = 'Email address copied.'; }
  catch { feedback.textContent = 'Select the email address above to copy it, or open it to send a message.'; }
});
if (import.meta.hot) import.meta.hot.dispose(() => { events.abort(); journey.dispose(); dialogs.request?.abort(); dialogs.terminal?.stopMatrix(); dialogs.dialog.remove(); });
