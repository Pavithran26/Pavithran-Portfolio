/**
 * InStationPanels.js
 * In-Station Cyberpunk Holographic Drawer / Panel System.
 * Inspired by Jesse's Ramen (jesse-zhou.com).
 * Renders interactive holographic screens INSIDE Pavithran's Cyberpunk Workstation:
 * - Projects Showcase (ClanSure, OWLSure, GT Companion, PrismIQ)
 * - Technical Skills Matrix (Interactive search, categories, proficiency bars)
 * - Dev Terminal Console (Embedded interactive CLI)
 * - DAWN AI Core (Interactive FastAPI RAG chat)
 * - Engineer Dossier (Experience, Education, Verified Achievements, Contact)
 */
import { PROJECTS_DATA } from '../data/projectsData.js';
import { SKILLS_CATEGORIES, PRODUCTION_CORE_STACK } from '../data/skillsData.js';
import { PORTFOLIO_DATA } from '../data/portfolioData.js';
import { DevTerminalConsole } from './DevTerminalConsole.js';
import { RAGService } from '../services/ragService.js';
import { escapeHtml } from '../utils/helpers.js';
import gsap from 'gsap';

export class InStationPanels {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.options = options; // { onClose: Function, onOpen: Function }
    this.currentPanel = null;
    this.activeSkillCategory = 'all';
    this.skillSearchQuery = '';
    this.terminalInstance = null;
    this.chatHistory = [];
    this.isAiThinking = false;

    this.init();
  }

  init() {
    if (!this.container) return;

    // Create panel overlay container
    const overlay = document.createElement('div');
    overlay.id = 'station-panel-overlay';
    overlay.className = 'station-panel-overlay';
    overlay.style.display = 'none';

    overlay.innerHTML = `
      <div class="station-panel-backdrop" id="station-panel-backdrop"></div>
      <div class="station-panel-window" id="station-panel-window">
        <!-- Panel Header -->
        <div class="station-panel-header">
          <div class="station-panel-badge">
            <span class="cyber-status-pulse"></span>
            <span id="station-panel-syscode">SYSTEM_LINK // ACTIVE</span>
            <span class="station-panel-coord">SEC_LVL: 04 // 60_FPS</span>
          </div>

          <div class="station-panel-title-wrap">
            <h2 id="station-panel-title" class="station-panel-title">SYSTEM INTERFACE</h2>
            <div id="station-panel-subtitle" class="station-panel-sub">Inspect components directly inside Pavithran's Cyberpunk Workstation</div>
          </div>

          <!-- Return to Station Close Button -->
          <button id="btn-station-close" class="station-close-btn" title="Return to Workstation (Esc)">
            <span class="close-icon">✕</span>
            <span>RETURN TO STATION</span>
            <span class="kbd-hint">ESC</span>
          </button>
        </div>

        <!-- Panel Body Content -->
        <div class="station-panel-body" id="station-panel-body">
          <!-- Dynamic Content injected here -->
        </div>

        <!-- Panel Footer Controls -->
        <div class="station-panel-footer">
          <div class="station-footer-status">
            <span class="led-dot green"></span>
            <span id="station-footer-info">NEURAL LINK CONNECTED • ZERO SCROLL PROTOCOL</span>
          </div>
          <div class="station-footer-nav">
            <button class="station-quick-pill" data-panel="projects">🚀 Projects</button>
            <button class="station-quick-pill" data-panel="skills">⚡ Skills</button>
            <button class="station-quick-pill" data-panel="terminal">💻 Terminal</button>
            <button class="station-quick-pill" data-panel="dawn">🤖 DAWN AI</button>
            <button class="station-quick-pill" data-panel="dossier">📜 Dossier</button>
          </div>
        </div>
      </div>
    `;

    this.container.appendChild(overlay);
    this.overlay = overlay;
    this.windowEl = document.getElementById('station-panel-window');
    this.bodyEl = document.getElementById('station-panel-body');
    this.titleEl = document.getElementById('station-panel-title');
    this.subEl = document.getElementById('station-panel-subtitle');
    this.sysCodeEl = document.getElementById('station-panel-syscode');

    this.bindEvents();
  }

  bindEvents() {
    // Close button
    const closeBtn = document.getElementById('btn-station-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }

    // Backdrop click
    const backdrop = document.getElementById('station-panel-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', () => this.close());
    }

    // Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });

    // Quick footer navigation
    this.overlay.addEventListener('click', (e) => {
      const pill = e.target.closest('.station-quick-pill');
      if (pill) {
        const targetPanel = pill.dataset.panel;
        if (targetPanel) {
          this.open(targetPanel);
        }
      }
    });
  }

  isOpen() {
    return this.overlay && this.overlay.style.display !== 'none';
  }

  open(panelId) {
    if (!this.overlay) return;
    this.currentPanel = panelId;

    // Render the requested panel
    this.renderPanelContent(panelId);

    // Update active state of quick pills
    const pills = this.overlay.querySelectorAll('.station-quick-pill');
    pills.forEach((p) => {
      if (p.dataset.panel === panelId) {
        p.classList.add('active');
      } else {
        p.classList.remove('active');
      }
    });

    // Show overlay
    this.overlay.style.display = 'flex';

    // Animate Window In
    gsap.killTweensOf(this.windowEl);
    gsap.fromTo(
      this.windowEl,
      { opacity: 0, scale: 0.94, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: 'power3.out' }
    );

    // Notify scene callback (for camera dolly)
    if (this.options.onOpen) {
      this.options.onOpen(panelId);
    }
  }

  close() {
    if (!this.isOpen()) return;

    gsap.to(this.windowEl, {
      opacity: 0,
      scale: 0.94,
      y: 15,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => {
        this.overlay.style.display = 'none';
        this.bodyEl.innerHTML = '';
        this.currentPanel = null;
        if (this.options.onClose) {
          this.options.onClose();
        }
      },
    });
  }

  renderPanelContent(panelId) {
    switch (panelId) {
      case 'projects':
        this.renderProjectsPanel();
        break;
      case 'skills':
        this.renderSkillsPanel();
        break;
      case 'terminal':
        this.renderTerminalPanel();
        break;
      case 'dawn':
        this.renderDawnAIPanel();
        break;
      case 'dossier':
        this.renderDossierPanel();
        break;
      default:
        this.renderProjectsPanel();
        break;
    }
  }

  // ==========================================
  // 1. PROJECTS PANEL
  // ==========================================
  renderProjectsPanel() {
    this.sysCodeEl.textContent = 'SYSTEM_LINK // PROJECTS_SHOWCASE';
    this.titleEl.innerHTML = `Production <span class="neon-text-green">Deployments</span> & Architectures`;
    this.subEl.textContent = 'Mission-critical enterprise software, full-stack microservices, and AI systems built and deployed.';

    const cardsHtml = PROJECTS_DATA.map((proj) => {
      const bulletsHtml = proj.highlights.map((h) => `<li>${escapeHtml(h)}</li>`).join('');
      const techTagsHtml = proj.technologies.map((t) => `<span class="project-tech-tag">${escapeHtml(t)}</span>`).join('');

      const liveBtnHtml = proj.liveUrl
        ? `<a href="${escapeHtml(proj.liveUrl)}" target="_blank" rel="noopener noreferrer" class="project-link-btn primary">
            <span>🚀</span> Live Demo
          </a>`
        : '';

      const githubBtnHtml = proj.githubUrl
        ? `<a href="${escapeHtml(proj.githubUrl)}" target="_blank" rel="noopener noreferrer" class="project-link-btn secondary">
            <span>🐙</span> Source Code
          </a>`
        : '';

      return `
        <article class="station-project-card" style="--proj-accent: ${proj.accentColor};">
          <div class="station-proj-top">
            <span class="station-proj-badge">${escapeHtml(proj.badge)}</span>
            <span class="station-proj-cat">${escapeHtml(proj.category)}</span>
          </div>

          <h3 class="station-proj-title">${escapeHtml(proj.title)}</h3>
          <div class="station-proj-tagline">${escapeHtml(proj.tagline)}</div>

          <p class="station-proj-desc">${escapeHtml(proj.overview)}</p>

          <ul class="station-proj-bullets">
            ${bulletsHtml}
          </ul>

          <div class="station-proj-tech">
            ${techTagsHtml}
          </div>

          <div class="station-proj-links">
            ${liveBtnHtml}
            ${githubBtnHtml}
          </div>
        </article>
      `;
    }).join('');

    this.bodyEl.innerHTML = `
      <div class="station-projects-container">
        <div class="station-projects-grid">
          ${cardsHtml}
        </div>
      </div>
    `;
  }

  // ==========================================
  // 2. SKILLS PANEL
  // ==========================================
  renderSkillsPanel() {
    this.sysCodeEl.textContent = 'SYSTEM_LINK // TECHNICAL_SKILLS_MATRIX';
    this.titleEl.innerHTML = `Technical <span class="neon-text-green">Skills Matrix</span> & Architecture`;
    this.subEl.textContent = 'Engineered across real-world production environments at OWLSure (ValueMomentum) and Adhoc Softwares.';

    this.bodyEl.innerHTML = `
      <div class="station-skills-wrapper">
        <!-- Production Core Stack Row -->
        <div class="station-core-stack-bar">
          <div class="core-stack-label">⚡ PRODUCTION CORE STACK:</div>
          <div class="core-stack-items">
            ${PRODUCTION_CORE_STACK.map(
              (item) => `
              <span class="core-stack-pill" title="${escapeHtml(item.name)} - ${escapeHtml(item.role)}">
                <span>${item.icon}</span>
                <strong>${escapeHtml(item.name)}</strong>
              </span>
            `
            ).join('')}
          </div>
        </div>

        <!-- Filter Controls -->
        <div class="station-skills-controls">
          <div class="station-search-box">
            <span class="search-icon">🔍</span>
            <input 
              type="text" 
              id="station-skill-search" 
              placeholder="Search 47+ skills (e.g. FastAPI, Docker, pgvector, React)..." 
              value="${escapeHtml(this.skillSearchQuery)}"
            />
          </div>

          <div class="station-skills-tabs" id="station-skills-tabs">
            <button class="station-tab-btn ${this.activeSkillCategory === 'all' ? 'active' : ''}" data-cat="all">All (${SKILLS_CATEGORIES.reduce((acc, c) => acc + c.skills.length, 0)})</button>
            ${SKILLS_CATEGORIES.map(
              (cat) => `
              <button class="station-tab-btn ${this.activeSkillCategory === cat.id ? 'active' : ''}" data-cat="${cat.id}">
                <span>${cat.icon}</span> ${escapeHtml(cat.title)}
              </button>
            `
            ).join('')}
          </div>
        </div>

        <!-- Skills Grid -->
        <div class="station-skills-content" id="station-skills-content">
          ${this.generateSkillsGridHtml()}
        </div>
      </div>
    `;

    // Bind search and tab events
    const searchInput = document.getElementById('station-skill-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.skillSearchQuery = e.target.value.toLowerCase().trim();
        const content = document.getElementById('station-skills-content');
        if (content) content.innerHTML = this.generateSkillsGridHtml();
      });
    }

    const tabsWrap = document.getElementById('station-skills-tabs');
    if (tabsWrap) {
      tabsWrap.addEventListener('click', (e) => {
        const btn = e.target.closest('.station-tab-btn');
        if (btn) {
          tabsWrap.querySelectorAll('.station-tab-btn').forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
          this.activeSkillCategory = btn.dataset.cat;
          const content = document.getElementById('station-skills-content');
          if (content) content.innerHTML = this.generateSkillsGridHtml();
        }
      });
    }
  }

  generateSkillsGridHtml() {
    let categoriesToShow = SKILLS_CATEGORIES;
    if (this.activeSkillCategory !== 'all') {
      categoriesToShow = SKILLS_CATEGORIES.filter((c) => c.id === this.activeSkillCategory);
    }

    const q = this.skillSearchQuery;
    let matchFound = false;

    const sectionsHtml = categoriesToShow.map((cat) => {
      let filteredSkills = cat.skills;
      if (q) {
        filteredSkills = cat.skills.filter(
          (s) =>
            s.name.toLowerCase().includes(q) ||
            s.description.toLowerCase().includes(q) ||
            (s.tags && s.tags.some((t) => t.toLowerCase().includes(q)))
        );
      }

      if (filteredSkills.length === 0) return '';
      matchFound = true;

      const itemsHtml = filteredSkills.map((s) => {
        const levelPercent = s.level === 'Advanced' ? 95 : s.level === 'Proficient' ? 82 : 70;
        const levelColor = s.level === 'Advanced' ? '#0ae448' : '#00bae2';

        return `
          <div class="station-skill-item">
            <div class="station-skill-head">
              <span class="station-skill-name">${escapeHtml(s.name)}</span>
              <span class="station-skill-badge" style="color: ${levelColor}; border-color: ${levelColor}33; background: ${levelColor}15;">
                ${escapeHtml(s.level)}
              </span>
            </div>
            <div class="station-skill-bar-wrap">
              <div class="station-skill-bar-fill" style="width: ${levelPercent}%; background: ${levelColor};"></div>
            </div>
            <p class="station-skill-desc">${escapeHtml(s.description)}</p>
            ${s.productionProven ? `<span class="station-prod-tag">⚡ PRODUCTION PROVEN</span>` : ''}
          </div>
        `;
      }).join('');

      return `
        <div class="station-skill-category-block">
          <div class="station-cat-header">
            <span class="station-cat-icon">${cat.icon}</span>
            <span class="station-cat-title">${escapeHtml(cat.title)}</span>
            <span class="station-cat-count">${filteredSkills.length} skills</span>
          </div>
          <div class="station-skills-subgrid">
            ${itemsHtml}
          </div>
        </div>
      `;
    }).join('');

    if (!matchFound) {
      return `
        <div class="station-no-results">
          <div class="no-res-icon">🔍</div>
          <div class="no-res-title">No skills match "${escapeHtml(q)}"</div>
          <div class="no-res-sub">Try searching for FastAPI, React, Docker, LangChain, or .NET Core</div>
        </div>
      `;
    }

    return sectionsHtml;
  }

  // ==========================================
  // 3. TERMINAL PANEL
  // ==========================================
  renderTerminalPanel() {
    this.sysCodeEl.textContent = 'SYSTEM_LINK // CLI_TERMINAL_EMBED';
    this.titleEl.innerHTML = `Developer <span class="neon-text-green">Terminal Console</span>`;
    this.subEl.textContent = 'Interactive in-browser CLI. Execute commands to query projects, skills, system diagnostics, or matrix.';

    this.bodyEl.innerHTML = `
      <div class="station-terminal-wrapper">
        <div class="station-terminal-top-strip">
          <span class="terminal-prompt-badge">BASH // PAVITHRAN-OS v2.4.0</span>
          <span class="terminal-hint">Tip: Type <code>help</code>, <code>projects</code>, <code>skills</code>, <code>matrix</code>, or <code>clear</code></span>
        </div>
        <div id="station-terminal-embed" class="station-terminal-inner"></div>
      </div>
    `;

    // Instantiate terminal inside this container
    setTimeout(() => {
      this.terminalInstance = new DevTerminalConsole('station-terminal-embed', { isFloating: false });
      if (this.terminalInstance.input) {
        this.terminalInstance.input.focus();
      }
    }, 50);
  }

  // ==========================================
  // 4. DAWN AI PANEL
  // ==========================================
  renderDawnAIPanel() {
    this.sysCodeEl.textContent = 'SYSTEM_LINK // DAWN_AI_NEURAL_CORE';
    this.titleEl.innerHTML = `DAWN AI <span class="neon-text-green">Neural Assistant</span>`;
    this.subEl.textContent = 'RAG Assistant powered by FastAPI, SentenceTransformers, and local zero-database vector store.';

    this.bodyEl.innerHTML = `
      <div class="station-dawn-wrapper">
        <!-- AI Status Banner -->
        <div class="dawn-status-banner">
          <div class="dawn-status-left">
            <span class="cyber-status-pulse"></span>
            <strong>DAWN AI ONLINE</strong>
            <span class="dawn-status-model">LOCAL_VECTOR_STORE // 20 INDEXED CHUNKS</span>
          </div>
          <div class="dawn-status-right">
            <span>PORT 8000</span>
            <span class="status-pill active">HEALTHY</span>
          </div>
        </div>

        <!-- Chat Transcript Area -->
        <div class="dawn-chat-transcript" id="dawn-chat-transcript">
          <!-- Initial Welcome Message -->
          <div class="dawn-msg assistant">
            <div class="dawn-msg-avatar">🤖</div>
            <div class="dawn-msg-bubble">
              <div class="dawn-msg-sender">DAWN AI // RAG ASSISTANT</div>
              <p>Hello! I am <strong>DAWN AI</strong>, Pavithran's dedicated interactive portfolio intelligence agent. I have full indexed knowledge of Pavithran's experience at <strong>OWLSure (ValueMomentum)</strong>, his flagship full-stack projects, .NET Core & FastAPI microservices, and technical skill competencies.</p>
              <div class="dawn-suggested-prompts">
                <button class="dawn-prompt-btn" data-query="What is Pavithran's experience at OWLSure and ValueMomentum?">💼 Experience at OWLSure</button>
                <button class="dawn-prompt-btn" data-query="Explain Pavithran's flagship projects and tech stacks.">🚀 Flagship Projects</button>
                <button class="dawn-prompt-btn" data-query="How does Pavithran's zero-database vector RAG system work?">🧠 Zero-DB RAG Architecture</button>
                <button class="dawn-prompt-btn" data-query="What are Pavithran's key skills in Backend and AI?">⚡ Core Backend & AI Skills</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Input Area -->
        <div class="dawn-input-area">
          <input 
            type="text" 
            id="dawn-chat-input" 
            class="dawn-chat-input" 
            placeholder="Ask DAWN AI anything about Pavithran's work, projects, or background..." 
            autocomplete="off"
          />
          <button id="btn-dawn-send" class="dawn-send-btn">
            <span>SEND</span>
            <span>➤</span>
          </button>
        </div>
      </div>
    `;

    // Wire up sending chat message
    const input = document.getElementById('dawn-chat-input');
    const sendBtn = document.getElementById('btn-dawn-send');
    const transcript = document.getElementById('dawn-chat-transcript');

    const handleSend = async (queryText = null) => {
      const text = queryText || (input ? input.value.trim() : '');
      if (!text || this.isAiThinking) return;

      if (input) input.value = '';

      // Append User message
      this.appendDawnMessage('user', text);
      this.isAiThinking = true;

      // Show typing indicator
      const typingEl = document.createElement('div');
      typingEl.className = 'dawn-msg assistant typing';
      typingEl.id = 'dawn-typing-indicator';
      typingEl.innerHTML = `
        <div class="dawn-msg-avatar">🤖</div>
        <div class="dawn-msg-bubble">
          <span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>
          <span style="font-size: 0.78rem; color: #a8aba3; margin-left: 8px;">Retrieving from local vector store...</span>
        </div>
      `;
      transcript.appendChild(typingEl);
      transcript.scrollTop = transcript.scrollHeight;

      try {
        const response = await RAGService.query(text);
        typingEl.remove();
        this.appendDawnMessage('assistant', response.answer || response.response || 'System processed request.', response.sources);
      } catch (err) {
        typingEl.remove();
        this.appendDawnMessage(
          'assistant',
          `⚠️ Note: FastAPI backend is running locally on port 8000. Error details: ${err.message}. Showing cached knowledge response: Pavithran S. is a Multi-Stack Software Engineer with expertise in ASP.NET Core, FastAPI, React, pgvector, and LangChain.`
        );
      } finally {
        this.isAiThinking = false;
        if (input) input.focus();
      }
    };

    if (sendBtn) {
      sendBtn.addEventListener('click', () => handleSend());
    }

    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleSend();
        }
      });
      setTimeout(() => input.focus(), 100);
    }

    // Suggested prompts
    this.bodyEl.addEventListener('click', (e) => {
      const pBtn = e.target.closest('.dawn-prompt-btn');
      if (pBtn && pBtn.dataset.query) {
        handleSend(pBtn.dataset.query);
      }
    });
  }

  appendDawnMessage(role, text, sources = []) {
    const transcript = document.getElementById('dawn-chat-transcript');
    if (!transcript) return;

    const msgEl = document.createElement('div');
    msgEl.className = `dawn-msg ${role}`;

    const avatar = role === 'user' ? '👤' : '🤖';
    const sender = role === 'user' ? 'YOU // CLIENT' : 'DAWN AI // RAG ENGINE';

    const sourcesHtml =
      sources && sources.length > 0
        ? `<div class="dawn-sources-tag"><strong>Indexed Sources:</strong> ${sources.map((s) => `<span>[${escapeHtml(s)}]</span>`).join(' ')}</div>`
        : '';

    msgEl.innerHTML = `
      <div class="dawn-msg-avatar">${avatar}</div>
      <div class="dawn-msg-bubble">
        <div class="dawn-msg-sender">${sender}</div>
        <p>${escapeHtml(text).replace(/\n/g, '<br/>')}</p>
        ${sourcesHtml}
      </div>
    `;

    transcript.appendChild(msgEl);
    transcript.scrollTop = transcript.scrollHeight;
  }

  // ==========================================
  // 5. DOSSIER / EXPERIENCE PANEL
  // ==========================================
  renderDossierPanel() {
    this.sysCodeEl.textContent = 'SYSTEM_LINK // PERSONNEL_DOSSIER';
    this.titleEl.innerHTML = `Pavithran S. <span class="neon-text-green">// Career Dossier</span>`;
    this.subEl.textContent = 'Work history at ValueMomentum & Adhoc Softwares, academic credentials, verified honors, and direct contact.';

    const expHtml = PORTFOLIO_DATA.experience
      .map(
        (exp) => `
        <div class="dossier-card">
          <div class="dossier-card-head">
            <h4 class="dossier-role">${escapeHtml(exp.role)}</h4>
            <span class="dossier-period">${escapeHtml(exp.period)}</span>
          </div>
          <div class="dossier-company">${escapeHtml(exp.company)} • ${escapeHtml(exp.location)}</div>
          <div class="dossier-domain"><strong>Domain:</strong> ${escapeHtml(exp.domain)}</div>
          <ul class="dossier-bullets">
            ${exp.responsibilities.map((r) => `<li>${escapeHtml(r)}</li>`).join('')}
          </ul>
        </div>
      `
      )
      .join('');

    const eduHtml = PORTFOLIO_DATA.education
      .map(
        (edu) => `
        <div class="dossier-card">
          <div class="dossier-card-head">
            <h4 class="dossier-role">${escapeHtml(edu.degree)}</h4>
            <span class="dossier-period">${escapeHtml(edu.period)}</span>
          </div>
          <div class="dossier-company">${escapeHtml(edu.institution)} • ${escapeHtml(edu.location)}</div>
          <span class="station-prod-tag" style="margin-top: 4px; display: inline-block;">${escapeHtml(edu.badge)}</span>
          <p style="font-size: 0.84rem; color: #a8aba3; margin-top: 6px;">${escapeHtml(edu.highlights)}</p>
        </div>
      `
      )
      .join('');

    const achHtml = PORTFOLIO_DATA.achievements
      .map(
        (ach) => `
        <div class="dossier-ach-item">
          <div class="dossier-ach-head">
            <strong>${escapeHtml(ach.title)}</strong>
            <span class="dossier-period">${escapeHtml(ach.period)}</span>
          </div>
          <div style="font-size: 0.78rem; color: #00bae2;">${escapeHtml(ach.issuer)}</div>
          <p style="font-size: 0.82rem; color: #a8aba3; margin-top: 4px;">${escapeHtml(ach.description)}</p>
        </div>
      `
      )
      .join('');

    this.bodyEl.innerHTML = `
      <div class="station-dossier-grid">
        <!-- Left Column: Work Experience -->
        <div class="dossier-col">
          <h3 class="dossier-col-title">💼 Professional Experience</h3>
          ${expHtml}
        </div>

        <!-- Right Column: Education & Achievements -->
        <div class="dossier-col">
          <h3 class="dossier-col-title">🎓 Education & Certifications</h3>
          ${eduHtml}

          <h3 class="dossier-col-title" style="margin-top: 1.5rem;">🏆 Verified Achievements</h3>
          ${achHtml}

          <h3 class="dossier-col-title" style="margin-top: 1.5rem;">📬 Direct Communications</h3>
          <div class="dossier-contact-box">
            <div><strong>Email:</strong> pavithrans.work@gmail.com</div>
            <div><strong>GitHub:</strong> github.com/PavithranSivanandham</div>
            <div><strong>Location:</strong> Coimbatore / Hyderabad, India</div>
          </div>
        </div>
      </div>
    `;
  }
}
