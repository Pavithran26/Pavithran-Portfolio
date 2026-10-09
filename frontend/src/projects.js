import { BookReader } from './components/BookReader.js';
import { CursorSpotlight } from './components/CursorSpotlight.js';
import { LiquidCursor } from './components/LiquidCursor.js';
import { PaperInteractive3D } from './components/PaperInteractive3D.js';
import './style.css';
import './styles/project-archive.css';
import { PROJECTS_DATA } from './data/projectsData.js';
import { PROJECT_SCENES } from './components/ProjectVisuals.js';
import { PortfolioDialogs } from './components/PortfolioDialogs.js';
import { getClaraEyeAvatarHtml } from './components/ClaraWidget.js';
import { escapeHtml as html } from './utils/helpers.js';

const root = document.querySelector('#archive-grid');
root.innerHTML = PROJECTS_DATA.map((project, index) => `<article class="archive-project">
  <div class="archive-copy"><p class="space-kicker">${String(index + 1).padStart(2, '0')} / ${html(project.category)}</p>
  <h2><button type="button" data-project="${project.id}">${html(project.title)} <span aria-hidden="true">↗</span></button></h2>
  <p>${html(project.tagline)}</p><div class="archive-tags">${project.technologies.slice(0, 4).map(tech => `<span>${html(tech)}</span>`).join('')}</div>
  <div class="project-links"><button type="button" class="space-text-link" data-project="${project.id}">Explore project ↗</button>${project.liveUrl ? `<a class="space-text-link" href="${html(project.liveUrl)}" target="_blank" rel="noopener noreferrer">Visit project ↗</a>` : ''}</div></div>
</article>`).join('');
const book = new BookReader(root, { archive: true });
const spotlight = new CursorSpotlight(root);
const liquidCursor = new LiquidCursor();
const paper3D = new PaperInteractive3D();
const projectEye = document.querySelector('#dawn-eye');
if (projectEye) {
  if (!projectEye.querySelector('.dawn-katana-video')) {
    projectEye.innerHTML = `<video class="dawn-katana-video" src="/videos/katana-blade.mp4" autoplay loop muted playsinline disablepictureinpicture aria-hidden="true"></video>`;
  }
  const vid = projectEye.querySelector('video');
  if (vid) {
    vid.muted = true;
    vid.play().catch(() => {});
  }
}
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
if (import.meta.hot) import.meta.hot.dispose(() => { events.abort(); book.dispose(); spotlight.dispose(); dialogs.request?.abort(); dialogs.terminal?.stopMatrix(); dialogs.dialog.remove(); });
