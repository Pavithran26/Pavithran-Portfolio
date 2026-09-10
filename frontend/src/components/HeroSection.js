/**
 * HeroSection.js
 * High-energy Kinetic Hero component inspired by GSAP.com:
 * Features bold kinetic typography with embedded SVG character flairs,
 * monospace bracketed role badges { ... }, and magnetic pill buttons.
 */
import { PORTFOLIO_DATA } from '../data/portfolioData.js';
import { escapeHtml } from '../utils/helpers.js';

export function renderHeroSection(containerId, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const statsHtml = PORTFOLIO_DATA.stats.map(s => `
    <div class="hero-stat-item">
      <span class="hero-stat-number">${escapeHtml(s.value)}</span>
      <span class="hero-stat-desc">${escapeHtml(s.label)}</span>
    </div>
  `).join('');

  container.innerHTML = `
    <section class="hero-section container tactical-frame" style="position: relative; overflow: hidden; padding-top: 3.5rem; padding-bottom: 4.5rem; border-radius: 28px; margin-top: 1rem;">
      
      <!-- High-Tech Cinematic Background Video -->
      <div class="hero-video-bg-wrapper">
        <video class="hero-video-bg" autoplay loop muted playsinline poster="/favicon.svg">
          <source src="/tech-bg.mp4" type="video/mp4" />
          <source src="/tech-cyber.mp4" type="video/mp4" />
        </video>
        <div class="hero-video-glass-overlay"></div>
      </div>

      <div style="position: relative; z-index: 2; max-width: 920px; margin: 0 auto; text-align: center;">
        
        <!-- GSAP-style Monospace Bracketed Subtitle -->
        <div style="margin-bottom: 1.5rem; display: flex; justify-content: center;">
          <div class="bracket-subtitle">
            <span class="brace">{</span>
            <span class="status-pulse-dot" style="display: inline-block; margin-right: 4px;"></span>
            <span>${escapeHtml(PORTFOLIO_DATA.role)} @ ${escapeHtml(PORTFOLIO_DATA.company)}</span>
            <span style="opacity: 0.35;">•</span>
            <span style="color: var(--color-shockingly-green, #0ae448); font-weight: 700;">Full-Stack & AI Systems</span>
            <span class="brace">}</span>
          </div>
        </div>

        <!-- GSAP Kinetic Typography with Letter Flairs -->
        <h1 class="hero-kinetic-title">
          <span class="kinetic-line">
            Engineering
            <span class="kinetic-flair-wrapper">
              <!-- GSAP Style Spinning Star Flair -->
              <svg class="kinetic-flair--star" viewBox="0 0 100 100" width="34" height="34" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 0L57 36L93 21L71 50L93 79L57 64L50 100L43 64L7 79L29 50L7 21L43 36L50 0Z" fill="url(#star-grad)"/>
                <defs>
                  <linearGradient id="star-grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#0ae448"/>
                    <stop offset="1" stop-color="#00bae2"/>
                  </linearGradient>
                </defs>
              </svg>
            </span>
            Resilient
          </span>
          <br/>
          <span class="kinetic-line kinetic-gradient-text">
            Full-Stack & Cloud
            <span class="kinetic-flair-wrapper">
              <!-- GSAP Style Neon Bolt Flair -->
              <svg class="kinetic-flair--bolt" viewBox="0 0 24 24" width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="#0ae448" stroke="#fffce1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
            AI/RAG
          </span>
        </h1>

        <p class="hero-lead-text" style="max-width: 720px; margin: 1.2rem auto 2.2rem auto; font-size: 1.05rem; color: #bbbaa6; line-height: 1.6;">
          ${escapeHtml(PORTFOLIO_DATA.summary)}
        </p>

        <!-- Magnetic Pill Buttons Group (GSAP.com style) -->
        <div class="hero-cta-group" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 14px; margin: 2rem 0;">
          
          <a href="#projects" class="magnetic-pill-btn hero-btn-primary" data-magnetic-strength="0.35">
            <span class="btn-flair"></span>
            <span class="btn-content" style="position: relative; z-index: 2; display: flex; align-items: center; gap: 8px;">
              <span>🚀</span> View Projects
            </span>
          </a>

          <a href="#cyber-station" class="magnetic-pill-btn hero-btn-3d" data-magnetic-strength="0.35" style="background: rgba(14, 16, 15, 0.85); color: #00bae2; border: 1.5px solid rgba(0, 186, 226, 0.4); text-decoration: none; padding: 0.85rem 1.6rem;">
            <span class="btn-flair" style="background: radial-gradient(circle, rgba(0, 186, 226, 0.5) 0%, transparent 70%);"></span>
            <span class="btn-content" style="position: relative; z-index: 2; display: flex; align-items: center; gap: 8px;">
              <span>🕹️</span> 3D Cyber Lab
            </span>
          </a>
          
          <button id="hero-btn-terminal" class="magnetic-pill-btn hero-btn-secondary" data-magnetic-strength="0.3">
            <span class="btn-flair"></span>
            <span class="btn-content" style="position: relative; z-index: 2; display: flex; align-items: center; gap: 8px;">
              <span>💻</span> Dev Terminal
            </span>
          </button>

          <button id="hero-btn-rag" class="magnetic-pill-btn hero-btn-accent" data-magnetic-strength="0.35">
            <span class="btn-flair" style="background: radial-gradient(circle, rgba(236, 72, 153, 0.5) 0%, transparent 70%);"></span>
            <span class="btn-content" style="position: relative; z-index: 2; display: flex; align-items: center; gap: 8px;">
              <span class="clara-status-dot" style="width: 9px; height: 9px; display: inline-block;"></span>
              <span>Meet DAWN (AI)</span>
            </span>
          </button>
        </div>

        <div class="hero-stats-strip">
          ${statsHtml}
        </div>
      </div>
    </section>
  `;

  const termBtn = document.getElementById('hero-btn-terminal');
  if (termBtn && options.onOpenTerminal) {
    termBtn.addEventListener('click', options.onOpenTerminal);
  }

  const ragBtn = document.getElementById('hero-btn-rag');
  if (ragBtn && options.onOpenRAG) {
    ragBtn.addEventListener('click', options.onOpenRAG);
  }
}
