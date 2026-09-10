/**
 * SkillsSection.js
 * High-End Cyber Glassmorphism Technical Skills Matrix.
 * Features:
 * - Production Core Stack spotlight banner
 * - Interactive category tab filters
 * - Live real-time search engine
 * - Dual view modes: Engineering Matrix (signal bars + tags) vs Compact Badges
 * - Animated proficiency level meters & production provenance tags
 */

import { SKILLS_CATEGORIES, PRODUCTION_CORE_STACK } from '../data/skillsData.js';
import { escapeHtml } from '../utils/helpers.js';
import { showToast } from './Toast.js';

export function renderSkillsSection(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Internal state
  let activeCategoryId = 'all';
  let searchQuery = '';
  let activeViewMode = 'matrix'; // 'matrix' | 'compact'
  let activeLevelFilter = 'all'; // 'all' | 'advanced' | 'proficient'

  // Total skills count
  const totalSkillsCount = SKILLS_CATEGORIES.reduce((acc, cat) => acc + cat.skills.length, 0);

  // Initial structure render
  container.innerHTML = `
    <section id="skills" class="skills-section">
      <div class="container">
        
        <!-- Section Header -->
        <div class="section-header" style="text-align: center; margin-bottom: 2.5rem;">
          <span class="section-badge">
            <span class="badge-pulse"></span>
            Enterprise Tech Stack
          </span>
          <h2 class="section-title">Technical <span class="gradient-text">Skills Matrix</span></h2>
          <p class="section-subtitle" style="max-width: 760px; margin: 0 auto;">
            Engineered across real-world production environments at <strong>OWLSure (ValueMomentum)</strong> and <strong>Adhoc Softwares</strong>. 
            Filtered by proficiency, domain architecture, and mission-critical deployment readiness.
          </p>
        </div>

        <!-- Production Core Stack Spotlight -->
        <div class="skills-spotlight-card">
          <div class="spotlight-header">
            <div class="spotlight-title-group">
              <span class="spotlight-badge">⚡ PRODUCTION CORE STACK</span>
              <h3 class="spotlight-title">Mission-Critical Daily Technologies</h3>
            </div>
            <span class="spotlight-env-tag">OWLSure & Adhoc Production Ready</span>
          </div>
          
          <div class="spotlight-grid">
            ${PRODUCTION_CORE_STACK.map(item => `
              <div class="spotlight-item" title="${escapeHtml(item.name)} — ${escapeHtml(item.role)}">
                <span class="spotlight-icon">${item.icon}</span>
                <div class="spotlight-info">
                  <span class="spotlight-name">${escapeHtml(item.name)}</span>
                  <span class="spotlight-role">${escapeHtml(item.role)}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Interactive Control Bar -->
        <div class="skills-controls-container">
          
          <!-- Search & View Mode Row -->
          <div class="skills-search-row">
            <div class="skills-search-box">
              <span class="search-icon">🔍</span>
              <input 
                type="text" 
                id="skills-search-input" 
                class="skills-search-input" 
                placeholder="Search 47+ skills, frameworks, or tools (e.g. FastAPI, Docker, pgvector)..."
                autocomplete="off"
              />
              <button id="skills-search-clear" class="skills-search-clear" title="Clear search" style="display: none;">✕</button>
            </div>

            <div class="skills-view-toggles">
              <button class="view-toggle-btn active" id="toggle-view-matrix" title="Detailed Engineering Matrix View">
                <span>📊</span> Matrix View
              </button>
              <button class="view-toggle-btn" id="toggle-view-compact" title="Compact Pill Cloud View">
                <span>🏷️</span> Compact Badges
              </button>
            </div>
          </div>

          <!-- Category Navigation Tabs -->
          <div class="skills-tabs-scroll-wrap">
            <div class="skills-category-tabs" id="skills-category-tabs">
              <button class="skill-tab-btn active" data-cat="all">
                <span class="tab-icon">🌐</span>
                <span class="tab-text">All Domains</span>
                <span class="tab-counter">${totalSkillsCount}</span>
              </button>
              ${SKILLS_CATEGORIES.map(cat => `
                <button class="skill-tab-btn" data-cat="${cat.id}">
                  <span class="tab-icon">${cat.emoji}</span>
                  <span class="tab-text">${escapeHtml(cat.shortName || cat.name)}</span>
                  <span class="tab-counter">${cat.skills.length}</span>
                </button>
              `).join('')}
            </div>
          </div>

        </div>

        <!-- Dynamic Content Grid Container -->
        <div id="skills-matrix-content" class="skills-matrix-content"></div>

      </div>
    </section>
  `;

  const contentContainer = container.querySelector('#skills-matrix-content');
  const searchInput = container.querySelector('#skills-search-input');
  const clearBtn = container.querySelector('#skills-search-clear');
  const tabButtons = container.querySelectorAll('.skill-tab-btn');
  const matrixToggle = container.querySelector('#toggle-view-matrix');
  const compactToggle = container.querySelector('#toggle-view-compact');

  // Helper to render the skill items according to current filters
  function updateView() {
    const query = searchQuery.trim().toLowerCase();

    // Filter categories
    let matchingCategories = SKILLS_CATEGORIES.map(cat => {
      // Category filter check
      if (activeCategoryId !== 'all' && cat.id !== activeCategoryId) {
        return null;
      }

      // Filter skills in category
      const matchedSkills = cat.skills.filter(s => {
        if (!query) return true;
        const inName = s.name.toLowerCase().includes(query);
        const inTag = s.tag && s.tag.toLowerCase().includes(query);
        const inLevel = s.level.toLowerCase().includes(query);
        const inCategory = cat.name.toLowerCase().includes(query);
        return inName || inTag || inLevel || inCategory;
      });

      if (matchedSkills.length === 0) return null;

      return {
        ...cat,
        skills: matchedSkills
      };
    }).filter(Boolean);

    // Empty state handling
    if (matchingCategories.length === 0) {
      contentContainer.innerHTML = `
        <div class="skills-empty-state">
          <div class="empty-icon">🔎</div>
          <h4 class="empty-title">No matching technologies found</h4>
          <p class="empty-desc">No skills match the query "<strong>${escapeHtml(searchQuery)}</strong>". Try searching for "Python", "FastAPI", "Docker", or "React".</p>
          <button id="skills-reset-btn" class="skills-reset-btn">
            <span>🔄</span> Reset Search & Filters
          </button>
        </div>
      `;

      const resetBtn = contentContainer.querySelector('#skills-reset-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          searchQuery = '';
          activeCategoryId = 'all';
          searchInput.value = '';
          clearBtn.style.display = 'none';
          tabButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.cat === 'all');
          });
          updateView();
        });
      }
      return;
    }

    // 1. Detailed Matrix View
    if (activeViewMode === 'matrix') {
      contentContainer.innerHTML = `
        <div class="skills-matrix-grid">
          ${matchingCategories.map(cat => {
            const skillsCards = cat.skills.map(skill => {
              // Build 4-segment signal bars
              const barsHtml = [1, 2, 3, 4].map(idx => {
                const isFilled = idx <= (skill.bars || 3);
                return `<span class="signal-bar ${isFilled ? 'filled' : ''}"></span>`;
              }).join('');

              const coreBadge = skill.isCore ? `<span class="skill-core-star" title="Core Production Tool">⭐</span>` : '';

              return `
                <div class="skill-matrix-item ${skill.isCore ? 'is-core' : ''}" data-skill="${escapeHtml(skill.name)}" tabindex="0">
                  <div class="skill-item-header">
                    <div class="skill-icon-name">
                      <span class="skill-icon">${escapeHtml(skill.icon)}</span>
                      <div class="skill-name-col">
                        <span class="skill-name">${escapeHtml(skill.name)} ${coreBadge}</span>
                        ${skill.tag ? `<span class="skill-tag">${escapeHtml(skill.tag)}</span>` : ''}
                      </div>
                    </div>
                    
                    <div class="skill-meter-col">
                      <div class="skill-signal-bars" title="Proficiency: ${skill.level} (${skill.percentage}%)">
                        ${barsHtml}
                      </div>
                      <span class="skill-percentage">${skill.percentage}%</span>
                    </div>
                  </div>

                  <div class="skill-level-strip">
                    <span class="skill-level-badge level-${skill.level.toLowerCase()}">${escapeHtml(skill.level)}</span>
                    <span class="skill-usage-dot" title="Active in Production"></span>
                  </div>
                </div>
              `;
            }).join('');

            return `
              <div class="skills-category-panel" data-cat-id="${cat.id}">
                <div class="cat-panel-header">
                  <div class="cat-header-left">
                    <span class="cat-header-emoji">${cat.emoji}</span>
                    <div>
                      <h3 class="cat-header-title">${escapeHtml(cat.name)}</h3>
                      <p class="cat-header-desc">${escapeHtml(cat.description)}</p>
                    </div>
                  </div>
                  <span class="cat-count-pill">${cat.skills.length} ${cat.skills.length === 1 ? 'skill' : 'skills'}</span>
                </div>

                <div class="cat-skills-grid">
                  ${skillsCards}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    } else {
      // 2. Compact Interactive Badges View
      contentContainer.innerHTML = `
        <div class="skills-compact-grid">
          ${matchingCategories.map(cat => {
            const badgesHtml = cat.skills.map(skill => `
              <div class="skill-compact-badge ${skill.isCore ? 'is-core' : ''}" data-skill="${escapeHtml(skill.name)}">
                <span class="compact-icon">${escapeHtml(skill.icon)}</span>
                <span class="compact-name">${escapeHtml(skill.name)}</span>
                <span class="compact-level">${escapeHtml(skill.level)}</span>
              </div>
            `).join('');

            return `
              <div class="compact-cat-card">
                <div class="compact-cat-title">
                  <span>${cat.emoji}</span>
                  <h4>${escapeHtml(cat.name)}</h4>
                  <span class="compact-cat-count">${cat.skills.length}</span>
                </div>
                <div class="compact-badges-wrap">
                  ${badgesHtml}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    // Attach interactive click handlers to skill items for feedback
    contentContainer.querySelectorAll('[data-skill]').forEach(el => {
      el.addEventListener('click', () => {
        const name = el.getAttribute('data-skill');
        showToast(`⚡ ${name} — Mastered in Enterprise Production`, 'info');
      });
    });
  }

  // Event Listeners: Tabs
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategoryId = btn.dataset.cat;
      updateView();
    });
  });

  // Event Listeners: Search
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    clearBtn.style.display = searchQuery ? 'block' : 'none';
    updateView();
  });

  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    searchQuery = '';
    clearBtn.style.display = 'none';
    searchInput.focus();
    updateView();
  });

  // Event Listeners: View Mode Toggles
  matrixToggle.addEventListener('click', () => {
    activeViewMode = 'matrix';
    matrixToggle.classList.add('active');
    compactToggle.classList.remove('active');
    updateView();
  });

  compactToggle.addEventListener('click', () => {
    activeViewMode = 'compact';
    compactToggle.classList.add('active');
    matrixToggle.classList.remove('active');
    updateView();
  });

  // Initial render of matrix view
  updateView();
}
