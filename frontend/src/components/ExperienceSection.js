/**
 * ExperienceSection.js
 * Comprehensive professional experience timeline, 4-stage educational journey,
 * verified hackathon achievements, career roadmap & CEH ambition, and gaming interests.
 */
import { PORTFOLIO_DATA } from '../data/portfolioData.js';
import { escapeHtml } from '../utils/helpers.js';

export function renderExperienceSection(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // 1. Professional Work Experience
  const experienceHtml = PORTFOLIO_DATA.experience.map(exp => {
    const bulletsHtml = exp.responsibilities.map(r => `<li>${escapeHtml(r)}</li>`).join('');
    const projectBadges = exp.projects ? exp.projects.map(p => `<span class="project-tech-tag" style="margin-right: 6px;">${escapeHtml(p)}</span>`).join('') : '';

    return `
      <div class="timeline-block experience-card">
        <div class="timeline-dot" style="border-color: var(--cyan-accent); box-shadow: 0 0 12px var(--cyan-accent);"></div>
        <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 8px;">
          <h3 class="timeline-role">${escapeHtml(exp.role)}</h3>
          <span class="timeline-period" style="font-weight: 600;">${escapeHtml(exp.period)}</span>
        </div>
        <div class="timeline-org" style="color: var(--cyan-accent); font-weight: 600;">${escapeHtml(exp.company)} • ${escapeHtml(exp.location)}</div>
        <div style="font-size: 0.8rem; color: #94a3b8; margin: 0.3rem 0 0.6rem 0;">
          <strong>Domain:</strong> ${escapeHtml(exp.domain)}
        </div>
        <div style="margin-bottom: 0.6rem;">${projectBadges}</div>
        <ul class="timeline-bullets">
          ${bulletsHtml}
        </ul>
      </div>
    `;
  }).join('');

  // 2. Complete 4-Stage Education
  const educationHtml = PORTFOLIO_DATA.education.map(edu => `
    <div class="timeline-block education-card">
      <div class="timeline-dot" style="border-color: var(--purple-accent); box-shadow: 0 0 12px var(--purple-accent);"></div>
      <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 8px;">
        <h3 class="timeline-role">${escapeHtml(edu.degree)}</h3>
        <span class="timeline-period">${escapeHtml(edu.period)}</span>
      </div>
      <div class="timeline-org" style="color: var(--purple-accent); font-weight: 600;">
        ${escapeHtml(edu.institution)} • ${escapeHtml(edu.location)}
      </div>
      <span class="project-tech-tag" style="background: rgba(168, 85, 247, 0.15); color: #c084fc; margin: 0.4rem 0; display: inline-block;">
        ${escapeHtml(edu.badge)}
      </span>
      <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; margin-top: 0.3rem;">
        ${escapeHtml(edu.highlights)}
      </p>
    </div>
  `).join('');

  // 3. Verified Achievements
  const achievementsHtml = PORTFOLIO_DATA.achievements.map(ach => `
    <div class="achievement-card" style="background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 12px; padding: 1.25rem; margin-bottom: 1rem; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5);">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; margin-bottom: 0.5rem;">
        <h4 style="font-size: 1.05rem; font-weight: 700; color: #fff;">${escapeHtml(ach.title)}</h4>
        <span style="font-size: 0.75rem; background: rgba(16, 185, 129, 0.2); color: #34d399; padding: 2px 8px; border-radius: 9999px; font-weight: 600; white-space: nowrap;">
          ${escapeHtml(ach.badge)}
        </span>
      </div>
      <div style="font-size: 0.82rem; color: #f59e0b; margin-bottom: 0.4rem;">
        ${escapeHtml(ach.organization)} • ${escapeHtml(ach.date)}
      </div>
      <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">
        ${escapeHtml(ach.description)}
      </p>
    </div>
  `).join('');

  // 4. Career Roadmap
  const roadmapHtml = PORTFOLIO_DATA.careerAmbitions.roadmap.map(r => `
    <div style="display: flex; gap: 12px; margin-bottom: 0.8rem; align-items: flex-start;">
      <span style="background: rgba(56, 189, 248, 0.15); color: var(--cyan-accent); font-size: 0.72rem; font-weight: 700; padding: 2px 8px; border-radius: 4px; min-width: 80px; text-align: center;">
        ${escapeHtml(r.step)}
      </span>
      <div>
        <strong style="color: #fff; font-size: 0.9rem;">${escapeHtml(r.title)}</strong>
        <p style="font-size: 0.8rem; color: var(--text-muted); margin: 2px 0 0 0;">${escapeHtml(r.desc)}</p>
      </div>
    </div>
  `).join('');

  // 5. Gaming & Interests
  const gamesHtml = PORTFOLIO_DATA.interests.gaming.map(g => `
    <span class="project-tech-tag" style="background: rgba(245, 158, 11, 0.15); color: #fbbf24; border-color: rgba(245, 158, 11, 0.3); font-size: 0.82rem; padding: 4px 10px;">
      🎮 ${escapeHtml(g.name)} <small>(${escapeHtml(g.tag)})</small>
    </span>
  `).join(' ');

  container.innerHTML = `
    <section id="experience" class="experience-section container" style="margin-bottom: 4rem;">
      
      <!-- Section Header -->
      <div class="section-header">
        <span class="section-badge">Career & Background</span>
        <h2 class="section-title">Work Experience & <span class="gradient-text">Academic Journey</span></h2>
        <p class="section-subtitle">
          From foundational village schooling in M. Vellampatti to Master's in Data Analytics, enterprise ERP engineering, and hackathon championships.
        </p>
      </div>

      <!-- Experience & Education Split Flow -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem; margin-bottom: 3rem;">
        
        <div>
          <h3 style="font-size: 1.25rem; font-weight: 700; color: #fff; display: flex; align-items: center; gap: 8px; margin-bottom: 1.5rem;">
            <span>💼</span> Professional Experience
          </h3>
          <div class="timeline-flow" style="margin-top: 0;">
            ${experienceHtml}
          </div>
        </div>

        <div>
          <h3 style="font-size: 1.25rem; font-weight: 700; color: #fff; display: flex; align-items: center; gap: 8px; margin-bottom: 1.5rem;">
            <span>🎓</span> Educational Journey (School to M.Sc)
          </h3>
          <div class="timeline-flow" style="margin-top: 0;">
            ${educationHtml}
          </div>
        </div>

      </div>

      <!-- Honors, Career Vision & Gaming Showcase Cards -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
        
        <!-- Achievements Column -->
        <div style="background: rgba(30, 41, 59, 0.5); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; padding: 1.5rem; backdrop-filter: blur(12px);">
          <h3 style="font-size: 1.15rem; font-weight: 700; color: #fff; display: flex; align-items: center; gap: 8px; margin-bottom: 1.25rem;">
            <span>🏆</span> Honors & Competitions
          </h3>
          ${achievementsHtml}
        </div>

        <!-- Career Vision Column -->
        <div style="background: rgba(30, 41, 59, 0.5); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; padding: 1.5rem; backdrop-filter: blur(12px);">
          <h3 style="font-size: 1.15rem; font-weight: 700; color: #fff; display: flex; align-items: center; gap: 8px; margin-bottom: 1.25rem;">
            <span>🎯</span> Career Vision & Ethical Hacking
          </h3>
          ${roadmapHtml}
          <div style="margin-top: 1.25rem; padding: 0.75rem; background: rgba(0,0,0,0.3); border-radius: 8px; border-left: 3px solid var(--cyan-accent);">
            <p style="font-size: 0.8rem; color: #cbd5e1; font-style: italic; line-height: 1.5;">
              "${escapeHtml(PORTFOLIO_DATA.careerAmbitions.philosophy)}"
            </p>
          </div>
        </div>

        <!-- Gaming & LeetCode Column -->
        <div style="background: rgba(30, 41, 59, 0.5); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; padding: 1.5rem; backdrop-filter: blur(12px);">
          <h3 style="font-size: 1.15rem; font-weight: 700; color: #fff; display: flex; align-items: center; gap: 8px; margin-bottom: 1.25rem;">
            <span>🕹️</span> Gaming & Problem Solving
          </h3>
          <div style="margin-bottom: 1rem;">
            <div style="font-size: 0.85rem; font-weight: 600; color: #94a3b8; margin-bottom: 0.5rem;">Favorite Games:</div>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              ${gamesHtml}
            </div>
          </div>
          <div style="margin-bottom: 1rem; padding: 0.75rem; background: rgba(56, 189, 248, 0.08); border: 1px solid rgba(56, 189, 248, 0.2); border-radius: 8px;">
            <div style="font-size: 0.85rem; font-weight: 700; color: var(--cyan-accent); margin-bottom: 0.2rem;">
              ⚡ LeetCode 100+ Day Streak
            </div>
            <p style="font-size: 0.8rem; color: var(--text-secondary); margin: 0;">
              Consistent daily algorithmic problem solving across graphs, dynamic programming, and data structures.
            </p>
          </div>
          <div>
            <div style="font-size: 0.85rem; font-weight: 600; color: #94a3b8; margin-bottom: 0.4rem;">Tech Passions:</div>
            <ul style="font-size: 0.8rem; color: var(--text-secondary); padding-left: 1.2rem; line-height: 1.6; margin: 0;">
              <li>AI/RAG experimentation & local vector pipelines</li>
              <li>3D WebGL graphics and interactive physics</li>
              <li>Deep root-cause debugging and systems telemetry</li>
            </ul>
          </div>
        </div>

      </div>

    </section>
  `;
}
