/**
 * Footer.js
 * Comprehensive footer with all verified social links, code profiles, hometown map, and copyright.
 */
import { PORTFOLIO_DATA } from '../data/portfolioData.js';
import { escapeHtml } from '../utils/helpers.js';

export function renderFooter(containerId, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const links = PORTFOLIO_DATA.links;

  container.innerHTML = `
    <footer id="contact" class="portfolio-footer">
      <div class="container">
        
        <div class="footer-content" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2.5rem; margin-bottom: 2.5rem;">
          
          <div class="footer-brand">
            <h3 style="font-size: 1.5rem; font-weight: 800; color: #fff; margin-bottom: 0.5rem;">${escapeHtml(PORTFOLIO_DATA.name)}</h3>
            <p style="color: var(--text-secondary); line-height: 1.5;">${escapeHtml(PORTFOLIO_DATA.tagline)}</p>
            
            <div style="margin-top: 1rem; display: flex; flex-direction: column; gap: 6px; font-size: 0.85rem;">
              <div>
                📧 <a href="mailto:${escapeHtml(PORTFOLIO_DATA.email)}" style="color: var(--cyan-accent); font-weight: 600; text-decoration: none;">${escapeHtml(PORTFOLIO_DATA.email)}</a>
              </div>
              <div style="color: var(--text-muted);">
                📍 <a href="${escapeHtml(links.hometownMaps)}" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: underline;">
                  ${escapeHtml(PORTFOLIO_DATA.hometown)}
                </a>
              </div>
              <div style="color: var(--text-muted);">
                🏢 ${escapeHtml(PORTFOLIO_DATA.company)}
              </div>
            </div>
          </div>

          <div>
            <h4 style="font-size: 0.95rem; font-weight: 700; color: #fff; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1rem;">
              Coding & Public Profiles
            </h4>
            <div class="footer-social-links" style="display: flex; flex-wrap: wrap; gap: 8px;">
              <a href="${escapeHtml(links.github)}" target="_blank" rel="noopener noreferrer" class="social-btn">
                🐙 GitHub
              </a>
              <a href="${escapeHtml(links.linkedin)}" target="_blank" rel="noopener noreferrer" class="social-btn">
                💼 LinkedIn
              </a>
              <a href="${escapeHtml(links.leetcode)}" target="_blank" rel="noopener noreferrer" class="social-btn" style="border-color: rgba(245, 158, 11, 0.4); color: #fbbf24;">
                ⚡ LeetCode (100+ Streak)
              </a>
              <a href="${escapeHtml(links.codechef)}" target="_blank" rel="noopener noreferrer" class="social-btn">
                🍳 CodeChef
              </a>
              <a href="${escapeHtml(links.hackerrank)}" target="_blank" rel="noopener noreferrer" class="social-btn">
                🎯 HackerRank
              </a>
              <a href="${escapeHtml(links.geeksforgeeks)}" target="_blank" rel="noopener noreferrer" class="social-btn">
                📗 GeeksforGeeks
              </a>
              <a href="${escapeHtml(links.youtube)}" target="_blank" rel="noopener noreferrer" class="social-btn">
                📺 YouTube
              </a>
              <a href="${escapeHtml(links.prismiq)}" target="_blank" rel="noopener noreferrer" class="social-btn" style="border-color: var(--cyan-accent); color: var(--cyan-accent);">
                ✨ PrismIQ
              </a>
            </div>
          </div>

          <div>
            <h4 style="font-size: 0.95rem; font-weight: 700; color: #fff; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1rem;">
              Interactive Experiences
            </h4>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <a href="#3d-experience" class="social-btn" style="text-decoration: none; text-align: left; display: inline-flex; align-items: center; gap: 8px;">
                <span>🧊</span> 3D WebGL Architecture Exploder
              </a>
              <button id="footer-btn-term" class="social-btn" style="text-align: left; display: inline-flex; align-items: center; gap: 8px; cursor: pointer;">
                <span>💻</span> Open Developer Terminal Console
              </button>
              <button id="footer-btn-rag" class="social-btn" style="text-align: left; display: inline-flex; align-items: center; gap: 8px; cursor: pointer; border-color: rgba(168, 85, 247, 0.4); color: #c084fc;">
                <span>⚡</span> Ask AI RAG Knowledge Assistant
              </button>
            </div>
          </div>

        </div>

        <div class="footer-bottom-bar" style="border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 1.5rem; text-align: center; font-size: 0.82rem; color: var(--text-muted);">
          <p>© ${new Date().getFullYear()} Pavithran S. • Built with Three.js WebGL, FastAPI, LangChain, and PostgreSQL (pgvector). Dharmapuri / Coimbatore, Tamil Nadu, India.</p>
        </div>

      </div>
    </footer>
  `;

  const termBtn = document.getElementById('footer-btn-term');
  if (termBtn && options.onOpenTerminal) {
    termBtn.addEventListener('click', options.onOpenTerminal);
  }

  const ragBtn = document.getElementById('footer-btn-rag');
  if (ragBtn && options.onOpenRAG) {
    ragBtn.addEventListener('click', options.onOpenRAG);
  }
}
