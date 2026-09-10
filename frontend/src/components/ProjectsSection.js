/**
 * ProjectsSection.js
 * Renders Pavithran S.'s flagship software engineering projects.
 */
import { PROJECTS_DATA } from '../data/projectsData.js';
import { escapeHtml } from '../utils/helpers.js';

export function renderProjectsSection(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const cardsHtml = PROJECTS_DATA.map(proj => {
    const bulletsHtml = proj.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('');
    const techTagsHtml = proj.technologies.map(t => `<span class="project-tech-tag">${escapeHtml(t)}</span>`).join('');

    const liveBtnHtml = proj.liveUrl ? `
      <a href="${escapeHtml(proj.liveUrl)}" target="_blank" rel="noopener noreferrer" class="project-link-btn" style="background: rgba(56, 189, 248, 0.15); color: var(--cyan-accent); border-color: rgba(56, 189, 248, 0.3);">
        <span>🚀</span> Live Demo
      </a>
    ` : '';

    const githubBtnHtml = proj.githubUrl ? `
      <a href="${escapeHtml(proj.githubUrl)}" target="_blank" rel="noopener noreferrer" class="project-link-btn">
        <span>🐙</span> Source Code
      </a>
    ` : '';

    return `
      <article class="project-card-full" style="--card-accent: ${proj.accentColor};">
        <div>
          <div class="project-top-row">
            <span class="project-badge-pill">${escapeHtml(proj.badge)}</span>
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">${escapeHtml(proj.category)}</span>
          </div>

          <h3 class="project-title">${escapeHtml(proj.title)}</h3>
          <div class="project-tagline">${escapeHtml(proj.tagline)}</div>

          <p class="project-overview">${escapeHtml(proj.overview)}</p>

          <ul class="project-bullets">
            ${bulletsHtml}
          </ul>
        </div>

        <div>
          <div class="project-tech-tags">
            ${techTagsHtml}
          </div>

          <div class="project-links-row">
            ${liveBtnHtml}
            ${githubBtnHtml}
          </div>
        </div>
      </article>
    `;
  }).join('');

  container.innerHTML = `
    <section id="projects" class="projects-section container">
      <div class="section-header">
        <span class="section-badge">Production Deployments</span>
        <h2 class="section-title">Featured Engineering <span class="gradient-text">Projects</span></h2>
        <p class="section-subtitle">
          Real-world full-stack architectures, enterprise web applications, and generative AI systems built and deployed for production impact.
        </p>
      </div>

      <div class="projects-grid">
        ${cardsHtml}
      </div>
    </section>
  `;
}
