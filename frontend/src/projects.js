import { NativeMotion } from './components/NativeMotion.js';
import { CursorSpotlight } from './components/CursorSpotlight.js';
import './style.css';
import './styles/project-archive.css';
import { PROJECTS_DATA } from './data/projectsData.js';
import { PROJECT_SCENES } from './components/ProjectVisuals.js';
import { PortfolioDialogs } from './components/PortfolioDialogs.js';
import { getClaraEyeAvatarHtml } from './components/ClaraWidget.js';
import { escapeHtml as html } from './utils/helpers.js';

const root = document.querySelector('#archive-grid');
root.innerHTML = PROJECTS_DATA.map((project, index) => `<article class="archive-project">
  ${PROJECT_SCENES[project.id] ? `<img src="/images/projects/${project.id}-768.webp" alt="${html(PROJECT_SCENES[project.id])}" width="768" height="432" loading="lazy" decoding="async">` : ''}
  <div class="archive-copy"><p class="space-kicker">${String(index + 1).padStart(2, '0')} / ${html(project.category)}</p>
  <h2><button type="button" data-project="${project.id}">${html(project.title)} <span aria-hidden="true">↗</span></button></h2>
  <p>${html(project.tagline)}</p><div class="archive-tags">${project.technologies.slice(0, 4).map(tech => `<span>${html(tech)}</span>`).join('')}</div>
  <div class="project-links"><button type="button" class="space-text-link" data-project="${project.id}">Explore project ↗</button>${project.liveUrl ? `<a class="space-text-link" href="${html(project.liveUrl)}" target="_blank" rel="noopener noreferrer">Visit project ↗</a>` : ''}</div></div>
</article>`).join('');
const nativeMotion = new NativeMotion(document);
const spotlight = new CursorSpotlight(root);
document.querySelector('#dawn-eye').innerHTML = getClaraEyeAvatarHtml(38) + '<span class="eye-label">Meet DAWN<small>AI guide</small></span>';
const dialogs = new PortfolioDialogs();
const events = new AbortController();
document.addEventListener('click', event => {
  const target = event.target.closest('[data-project], [data-dialog]');
  if (target?.dataset.project) dialogs.openProject(target.dataset.project);
  else if (target?.dataset.dialog) dialogs.open(target.dataset.dialog);
}, { signal: events.signal });
document.addEventListener('keydown', event => {
  if (event.key !== '`' || event.ctrlKey || event.metaKey || event.altKey || event.target.closest('input, textarea, [contenteditable], dialog')) return;
  event.preventDefault(); dialogs.open('terminal');
}, { signal: events.signal });
if (import.meta.hot) import.meta.hot.dispose(() => { events.abort(); nativeMotion.dispose(); spotlight.dispose(); dialogs.request?.abort(); dialogs.terminal?.stopMatrix(); dialogs.dialog.remove(); });
