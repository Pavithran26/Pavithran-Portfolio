/**
 * Navbar.js
 * Sticky navigation header with profile branding, section anchors, terminal toggle, and RAG trigger.
 */
import { PORTFOLIO_DATA } from '../data/portfolioData.js';
import { escapeHtml } from '../utils/helpers.js';

export function renderNavbar(containerId, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <nav class="portfolio-navbar" role="navigation">
      <div class="container nav-container">
        
        <!-- Brand identity -->
        <a href="#" class="nav-brand">
          <div class="brand-avatar">PS</div>
          <div class="brand-info">
            <span class="brand-name">${escapeHtml(PORTFOLIO_DATA.name)}</span>
            <span class="brand-role">${escapeHtml(PORTFOLIO_DATA.role)}</span>
          </div>
        </a>

        <!-- Section Navigation Links -->
        <ul class="nav-menu">
          <li><a href="#cyber-station" class="nav-link" style="color: var(--color-shockingly-green, #0ae448); font-weight: 700;">🕹️ 3D Lab</a></li>
          <li><a href="#projects" class="nav-link">Projects</a></li>
          <li><a href="#skills" class="nav-link">Skills Matrix</a></li>
          <li><a href="#terminal-section" class="nav-link">Terminal</a></li>
          <li><a href="#experience" class="nav-link">Journey</a></li>
        </ul>

        <!-- Action CTAs -->
        <div style="display: flex; align-items: center; gap: 8px;">
          <button id="nav-term-trigger" class="nav-cta-btn" style="background: rgba(15, 23, 42, 0.85); border-color: rgba(56, 189, 248, 0.4); color: var(--cyan-accent);" aria-label="Toggle Developer Terminal">
            <span>💻</span>
            <span>Terminal</span>
            <span style="font-size: 0.68rem; background: rgba(56, 189, 248, 0.15); padding: 1px 5px; border-radius: 4px; font-family: monospace;">~</span>
          </button>

          <button id="nav-rag-trigger" class="nav-cta-btn" style="background: linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(139, 92, 246, 0.25)); border-color: rgba(236, 72, 153, 0.4); color: #fff;" aria-label="Meet DAWN AI Assistant">
            <span class="clara-status-dot" style="width: 8px; height: 8px; display: inline-block;"></span>
            <span>Meet DAWN</span>
          </button>
        </div>

      </div>
    </nav>
  `;

  const ragBtn = document.getElementById('nav-rag-trigger');
  if (ragBtn && options.onOpenRAG) {
    ragBtn.addEventListener('click', options.onOpenRAG);
  }

  const termBtn = document.getElementById('nav-term-trigger');
  if (termBtn && options.onToggleTerminal) {
    termBtn.addEventListener('click', options.onToggleTerminal);
  }
}
