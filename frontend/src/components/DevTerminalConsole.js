/**
 * DevTerminalConsole.js
 * Hardware-accelerated, interactive Developer Terminal Console.
 * Supports bash-like command execution, tab completion, history navigation,
 * virtual file system (cat/ls), matrix digital rain, and easter eggs.
 */
import { PORTFOLIO_DATA } from '../data/portfolioData.js';
import { PROJECTS_DATA } from '../data/projectsData.js';
import { SKILLS_CATEGORIES } from '../data/skillsData.js';
import confetti from 'canvas-confetti';

export class DevTerminalConsole {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.isFloating = options.isFloating || false;
    this.isOpen = options.isFloating ? false : true;
    this.history = [];
    this.historyIndex = -1;
    this.currentTheme = 'dark';
    this.matrixActive = false;
    this.matrixAnimId = null;

    this.virtualFS = {
      'bio.txt': `Pavithran S. — Multi-Stack Software Engineer
Current Role: Software Engineer @ OWLSure (ValueMomentum)
Start Date: June 8, 2026
Hometown: M. Vellampatti, Harur Taluk, Dharmapuri District, Tamil Nadu
Email: pavithran2004cs@gmail.com
Born: August 2004
Tagline: Multi-Stack Software Engineer • Backend, AI/RAG & 3D Interactive Systems`,

      'philosophy.txt': `Engineering Philosophy:
"Software should solve real-world problems, eliminate unnecessary manual repetitive work,
make information effortless to access, and be genuinely practical for the people who use it daily."`,

      'resume.txt': `=== PAVITHRAN S. — CURRICULUM VITAE ===
Role: Software Engineer | Multi-Stack Developer
Current: OWLSure, a business unit of ValueMomentum (June 2026 – Present)
Previous: Adhoc Softwares — Python Developer (Dec 2025 – Apr 2026)
Education:
  • M.Sc CS with Data Analytics (2024–2026) — Dr. N.G.P. Arts & Science College
  • B.Sc Computer Science (2021–2024) — PSG College of Arts & Science
  • Schooling (Grades 6–12) — Kongu Matric Higher Secondary School, Morappur
  • Primary Schooling (Up to Grade 5) — M. Vellampatti Village School
Core Expertise: ASP.NET Core, FastAPI, React, TypeScript, LangChain, PostgreSQL (pgvector), Docker, CI/CD.`,

      'skills.json': JSON.stringify({
        languages: ["Python", "C#", "TypeScript", "JavaScript", "Java", "C/C++", "Kotlin", "R"],
        backend: ["FastAPI", "ASP.NET Core 8", "Django", "Node.js", "Express", "Flask", "EF Core"],
        ai_rag: ["LangChain LCEL", "pgvector", "Gemini 1.5/3.6", "OpenAI", "Vector Search"],
        frontend: ["React 18", "Three.js", "WebGL", "Next.js", "Vite", "Tailwind CSS", "Flutter"],
        devops: ["Docker", "GitHub Actions", "Railway", "Vercel", "Postman", "Git"]
      }, null, 2),

      'achievements.md': `# Honors & Competitions
1. KALAM 2025 Hackathon — 1st Place Champion
   • Sri Shakthi Institute of Engineering & Technology, Coimbatore (March 21–22, 2025)
2. Mission Possible 2026 — PrismIQ Team Winner
   • ValueMomentum / OWLSure enterprise innovation showcase
   • Platform ideation for ClanSure & GT Companion
   • Team Motto: "Preserve What Matters. Empower What’s Next."`
    };

    this.commands = [
      'help', 'about', 'skills', 'projects', 'project', 'experience', 'education',
      'achievements', 'goals', 'interests', 'contact', 'socials', 'ls', 'cat',
      'matrix', 'sudo', 'theme', 'clear', 'history', 'date', 'echo', 'exit'
    ];

    if (this.container) {
      this.init();
    }
  }

  init() {
    this.renderLayout();
    this.bindEvents();
    this.printWelcome();
  }

  renderLayout() {
    const floatingClass = this.isFloating ? 'terminal-floating-wrapper hidden' : 'terminal-embedded-wrapper';
    
    this.container.innerHTML = `
      <div class="${floatingClass}" id="term-box-root" data-theme="${this.currentTheme}">
        <div class="terminal-window">
          
          <!-- Terminal Header Bar -->
          <div class="terminal-header">
            <div class="terminal-dots">
              <span class="term-dot dot-red" id="term-btn-close" title="Close / Hide Terminal"></span>
              <span class="term-dot dot-yellow" id="term-btn-min" title="Minimize"></span>
              <span class="term-dot dot-green" id="term-btn-max" title="Toggle Fullscreen"></span>
            </div>
            
            <div class="terminal-title">
              <span class="term-icon">⚡</span> pavithran@developer-box: ~
            </div>
            
            <div class="terminal-header-tools">
              <span class="terminal-pill">bash 5.2</span>
              <button class="term-tool-btn" id="term-btn-theme" title="Switch Theme">🎨 Theme</button>
              <button class="term-tool-btn" id="term-btn-clear" title="Clear Buffer">🧹 Clear</button>
            </div>
          </div>

          <!-- Terminal Output Screen -->
          <div class="terminal-body" id="term-output-body">
            <canvas id="term-matrix-canvas" class="matrix-canvas hidden"></canvas>
            <div id="term-history-log"></div>
            
            <!-- Active Input Prompt Line -->
            <div class="terminal-input-line" id="term-input-container">
              <span class="term-prompt">
                <span class="prompt-user">pavithran</span><span class="prompt-at">@</span><span class="prompt-host">dev-box</span>:<span class="prompt-path">~</span>$
              </span>
              <div class="input-wrapper">
                <input type="text" id="term-cli-input" class="term-input" autocomplete="off" spellcheck="false" autofocus />
              </div>
            </div>
          </div>

          <!-- Terminal Footer Status Bar -->
          <div class="terminal-footer">
            <span class="term-footer-item">Type <code>help</code> or press <code>Tab</code> to auto-complete</span>
            <span class="term-footer-item">Shortcuts: <code>Ctrl + L</code> clear • <code>Up/Down</code> history</span>
          </div>

        </div>
      </div>
    `;

    this.rootEl = this.container.querySelector('#term-box-root');
    this.outputBody = this.container.querySelector('#term-output-body');
    this.historyLog = this.container.querySelector('#term-history-log');
    this.input = this.container.querySelector('#term-cli-input');
    this.matrixCanvas = this.container.querySelector('#term-matrix-canvas');
  }

  bindEvents() {
    if (!this.input) return;

    // Focus input on click anywhere inside terminal body
    this.outputBody.addEventListener('click', (e) => {
      if (this.matrixActive) {
        this.stopMatrix();
        return;
      }
      this.input.focus();
    });

    // Handle Input Keys
    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = this.input.value.trim();
        this.input.value = '';
        if (cmd.length > 0) {
          this.history.push(cmd);
          this.historyIndex = this.history.length;
          this.executeCommand(cmd);
        } else {
          this.printPromptLine('');
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (this.history.length > 0 && this.historyIndex > 0) {
          this.historyIndex--;
          this.input.value = this.history[this.historyIndex] || '';
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (this.historyIndex < this.history.length - 1) {
          this.historyIndex++;
          this.input.value = this.history[this.historyIndex] || '';
        } else {
          this.historyIndex = this.history.length;
          this.input.value = '';
        }
      } else if (e.key === 'Tab') {
        e.preventDefault();
        this.handleTabCompletion();
      } else if (e.ctrlKey && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        this.clearScreen();
      }
    });

    // Theme Switcher Button
    const themeBtn = this.container.querySelector('#term-btn-theme');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        this.cycleTheme();
      });
    }

    // Clear Button
    const clearBtn = this.container.querySelector('#term-btn-clear');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.clearScreen();
      });
    }

    // Window controls
    const closeBtn = this.container.querySelector('#term-btn-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.close();
      });
    }

    const minBtn = this.container.querySelector('#term-btn-min');
    if (minBtn) {
      minBtn.addEventListener('click', () => {
        this.rootEl.classList.toggle('minimized');
      });
    }

    const maxBtn = this.container.querySelector('#term-btn-max');
    if (maxBtn) {
      maxBtn.addEventListener('click', () => {
        this.rootEl.classList.toggle('fullscreen');
      });
    }
  }

  printWelcome() {
    const welcomeHtml = `
      <div class="term-banner">
        <pre class="term-ascii-art">
   ___             _ _   _                         ____  
  / _ \\__ ___   _(_) |_| |__  _ __ __ _ _ __      / ___| 
 / /_)/ _\` \\ \\ / / | __| '_ \\| '__/ _\` | '_ \\ ____\\___ \\ 
/ ___/ (_| |\\ V /| | |_| | | | | | (_| | | | |_____|__) |
\\/    \\__,_| \\_/ |_|\\__|_| |_|_|  \\__,_|_| |_|    |____/ 
        </pre>
        <div class="term-welcome-text">
          <p><strong>Pavithran S. — Software Engineer & 3D Interactive Terminal</strong></p>
          <p class="term-text-muted">OWLSure / ValueMomentum • Multi-Stack Developer • RAG & Cloud Systems</p>
          <p>Type <span class="term-highlight">help</span> to view available commands, or press <span class="term-highlight">Tab</span> to auto-complete.</p>
        </div>
      </div>
    `;
    this.appendOutput(welcomeHtml);
  }

  executeCommand(rawCmd) {
    if (this.matrixActive) {
      this.stopMatrix();
    }

    this.printPromptLine(rawCmd);

    const parts = rawCmd.trim().split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (cmd) {
      case 'help':
        this.cmdHelp();
        break;
      case 'about':
      case 'bio':
      case 'whoami':
        this.cmdAbout();
        break;
      case 'skills':
      case 'stack':
        this.cmdSkills(args);
        break;
      case 'projects':
      case 'proj':
        this.cmdProjects();
        break;
      case 'project':
        this.cmdProjectDetail(args[0]);
        break;
      case 'experience':
      case 'exp':
        this.cmdExperience();
        break;
      case 'education':
      case 'edu':
        this.cmdEducation();
        break;
      case 'achievements':
      case 'awards':
        this.cmdAchievements();
        break;
      case 'goals':
      case 'career':
        this.cmdGoals();
        break;
      case 'interests':
      case 'gaming':
      case 'hobbies':
        this.cmdInterests();
        break;
      case 'contact':
      case 'email':
        this.cmdContact();
        break;
      case 'socials':
      case 'links':
        this.cmdSocials();
        break;
      case 'ls':
        this.cmdLs();
        break;
      case 'cat':
        this.cmdCat(args[0]);
        break;
      case 'matrix':
        this.startMatrix();
        break;
      case 'sudo':
        this.cmdSudo(args);
        break;
      case 'theme':
        this.cmdTheme(args[0]);
        break;
      case 'history':
        this.cmdHistory();
        break;
      case 'date':
        this.appendOutput(`<div class="term-line">${new Date().toString()}</div>`);
        break;
      case 'echo':
        this.appendOutput(`<div class="term-line">${args.join(' ')}</div>`);
        break;
      case 'clear':
      case 'cls':
        this.clearScreen();
        break;
      case 'exit':
        this.close();
        break;
      default:
        this.appendOutput(`
          <div class="term-error">
            command not found: <code>${cmd}</code>. Type <span class="term-highlight">help</span> for a list of valid commands.
          </div>
        `);
    }

    this.scrollToBottom();
  }

  cmdHelp() {
    const html = `
      <div class="term-output-block">
        <div class="term-heading">📖 Available CLI Commands</div>
        <div class="term-help-grid">
          <div><span class="cmd-name">about</span> — Professional background, identity & hometown</div>
          <div><span class="cmd-name">skills</span> — Technical skills categorized by layer</div>
          <div><span class="cmd-name">projects</span> — Flagship production systems & architectures</div>
          <div><span class="cmd-name">project &lt;name&gt;</span> — In-depth breakdown (clansure, gt, erp, 3d)</div>
          <div><span class="cmd-name">experience</span> — OWLSure & Adhoc Softwares work history</div>
          <div><span class="cmd-name">education</span> — 4-stage journey from M. Vellampatti to Dr. N.G.P. ASC</div>
          <div><span class="cmd-name">achievements</span> — KALAM 2025 Champion & Mission Possible 2026 Winner</div>
          <div><span class="cmd-name">goals</span> — Career ambition, Master Developer & CEH path</div>
          <div><span class="cmd-name">interests</span> — Gaming (Boom Beach, Solo Leveling), LeetCode streak</div>
          <div><span class="cmd-name">socials</span> — Direct clickable links (GitHub, LinkedIn, etc.)</div>
          <div><span class="cmd-name">contact</span> — Email and communication channels</div>
          <div><span class="cmd-name">ls</span> — List virtual files in workspace</div>
          <div><span class="cmd-name">cat &lt;file&gt;</span> — Inspect virtual file contents</div>
          <div><span class="cmd-name">matrix</span> — Launch live digital code rain visualizer</div>
          <div><span class="cmd-name">sudo hire</span> — Interactive Easter egg offer letter sequence 🎉</div>
          <div><span class="cmd-name">theme &lt;name&gt;</span> — Switch terminal color theme (cyberpunk, dracula, matrix, amber, dark)</div>
          <div><span class="cmd-name">clear</span> — Reset terminal display buffer</div>
        </div>
      </div>
    `;
    this.appendOutput(html);
  }

  cmdAbout() {
    const p = PORTFOLIO_DATA;
    const html = `
      <div class="term-output-block">
        <div class="term-heading">👤 About Pavithran S.</div>
        <table class="term-table">
          <tr><td class="key">Name:</td><td>${p.name}</td></tr>
          <tr><td class="key">Current Role:</td><td>${p.role} @ <span class="term-cyan">${p.company}</span> (Started ${p.experienceStart})</td></tr>
          <tr><td class="key">Hometown:</td><td>${p.hometown}</td></tr>
          <tr><td class="key">Public Email:</td><td><a href="mailto:${p.email}" class="term-link">${p.email}</a></td></tr>
          <tr><td class="key">Experience:</td><td>${p.totalExperience}</td></tr>
          <tr><td class="key">LeetCode:</td><td>100+ Day streak (<a href="${p.links.leetcode}" target="_blank" class="term-link">Profile</a>)</td></tr>
        </table>
        <p style="margin-top: 0.6rem; line-height: 1.5; color: var(--text-secondary);">
          ${p.summary}
        </p>
        <div class="term-quote" style="margin-top: 0.5rem; border-left: 2px solid var(--cyan-accent); padding-left: 0.8rem; color: #cbd5e1;">
          <em>"${p.careerAmbitions.philosophy}"</em>
        </div>
      </div>
    `;
    this.appendOutput(html);
  }

  cmdSkills(args) {
    const html = SKILLS_CATEGORIES.map(cat => {
      const skillsStr = cat.skills.map(s => `<span class="term-tag">${s.name} <small>(${s.level})</small></span>`).join(' ');
      return `
        <div style="margin-bottom: 0.5rem;">
          <strong style="color: var(--cyan-accent);">${cat.name}:</strong><br/>
          ${skillsStr}
        </div>
      `;
    }).join('');

    this.appendOutput(`
      <div class="term-output-block">
        <div class="term-heading">🛠️ Core Engineering Skills Matrix</div>
        ${html}
      </div>
    `);
  }

  cmdProjects() {
    const projs = PROJECTS_DATA.map(p => `
      <div class="term-card">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <strong class="term-cyan" style="font-size: 1.05rem;">${p.title}</strong>
          <span class="term-badge">${p.badge}</span>
        </div>
        <div style="font-size: 0.85rem; color: #a78bfa; margin-bottom: 0.3rem;">${p.tagline}</div>
        <p style="font-size: 0.85rem; margin-bottom: 0.4rem;">${p.overview}</p>
        <div style="font-size: 0.78rem; color: #94a3b8;">
          <strong>Stack:</strong> ${p.technologies.slice(0, 7).join(' • ')}
        </div>
        <div style="margin-top: 0.3rem; font-size: 0.8rem;">
          Type <code>project ${p.id}</code> for full architectural breakdown.
        </div>
      </div>
    `).join('');

    this.appendOutput(`
      <div class="term-output-block">
        <div class="term-heading">🚀 Flagship Production Deployments</div>
        ${projs}
      </div>
    `);
  }

  cmdProjectDetail(id) {
    if (!id) {
      this.appendOutput(`<div class="term-line">Usage: <code>project &lt;clansure | gt-companion | adhoc-erp | 3d-rag-platform&gt;</code></div>`);
      return;
    }
    const cleanId = id.toLowerCase();
    const proj = PROJECTS_DATA.find(p => p.id.includes(cleanId) || cleanId.includes(p.id));

    if (!proj) {
      this.appendOutput(`<div class="term-error">Project not found: ${id}. Available: clansure, gt-companion, adhoc-erp, 3d-rag-platform</div>`);
      return;
    }

    const bullets = proj.highlights.map(h => `<li>${h}</li>`).join('');
    const tech = proj.technologies.join(', ');

    const html = `
      <div class="term-output-block">
        <div class="term-heading">🔍 Project Blueprint: ${proj.title}</div>
        <div style="color: #a78bfa; font-weight: 600;">"${proj.tagline}"</div>
        <p style="margin: 0.4rem 0;">${proj.overview}</p>
        <p><strong>Problem:</strong> ${proj.challenge}</p>
        <p><strong>Solution:</strong> ${proj.solution}</p>
        <div style="margin-top: 0.4rem;"><strong>Key Engineering Contributions:</strong></div>
        <ul style="padding-left: 1.2rem; margin: 0.3rem 0; font-size: 0.85rem;">${bullets}</ul>
        <p style="margin-top: 0.4rem;"><strong>Technologies:</strong> ${tech}</p>
        ${proj.liveUrl ? `<p><strong>Live Demo:</strong> <a href="${proj.liveUrl}" target="_blank" class="term-link">${proj.liveUrl}</a></p>` : ''}
      </div>
    `;
    this.appendOutput(html);
  }

  cmdExperience() {
    const html = PORTFOLIO_DATA.experience.map(exp => {
      const resp = exp.responsibilities.map(r => `<li>${r}</li>`).join('');
      return `
        <div class="term-card">
          <div style="display: flex; justify-content: space-between;">
            <strong class="term-cyan">${exp.role}</strong>
            <span style="color: #94a3b8; font-size: 0.8rem;">${exp.period}</span>
          </div>
          <div style="color: #f59e0b; font-size: 0.85rem;">${exp.company} • ${exp.location}</div>
          <div style="font-size: 0.8rem; color: #94a3b8; margin: 0.2rem 0;">Domain: ${exp.domain}</div>
          <ul style="padding-left: 1.2rem; margin: 0.4rem 0; font-size: 0.83rem;">${resp}</ul>
        </div>
      `;
    }).join('');

    this.appendOutput(`
      <div class="term-output-block">
        <div class="term-heading">💼 Professional Work History</div>
        ${html}
      </div>
    `);
  }

  cmdEducation() {
    const html = PORTFOLIO_DATA.education.map(edu => `
      <div class="term-card">
        <div style="display: flex; justify-content: space-between;">
          <strong class="term-cyan">${edu.degree}</strong>
          <span class="term-badge">${edu.badge}</span>
        </div>
        <div style="color: #a78bfa; font-size: 0.85rem;">${edu.institution} • ${edu.location}</div>
        <div style="color: #94a3b8; font-size: 0.8rem;">${edu.period}</div>
        <p style="margin-top: 0.3rem; font-size: 0.83rem;">${edu.highlights}</p>
      </div>
    `).join('');

    this.appendOutput(`
      <div class="term-output-block">
        <div class="term-heading">🎓 Educational Journey (M. Vellampatti to Master's)</div>
        ${html}
      </div>
    `);
  }

  cmdAchievements() {
    const html = PORTFOLIO_DATA.achievements.map(ach => `
      <div class="term-card">
        <div style="display: flex; justify-content: space-between;">
          <strong class="term-cyan">${ach.title}</strong>
          <span class="term-badge" style="background: rgba(16, 185, 129, 0.2); color: #10b981;">${ach.badge}</span>
        </div>
        <div style="color: #f59e0b; font-size: 0.85rem;">${ach.organization} (${ach.date})</div>
        <p style="margin-top: 0.3rem; font-size: 0.83rem;">${ach.description}</p>
      </div>
    `).join('');

    this.appendOutput(`
      <div class="term-output-block">
        <div class="term-heading">🏆 Honors, Hackathons & Competitions</div>
        ${html}
      </div>
    `);
  }

  cmdGoals() {
    const roadmap = PORTFOLIO_DATA.careerAmbitions.roadmap.map(r => `
      <div style="margin-bottom: 0.4rem;">
        <span class="term-cyan"><strong>[${r.step}]</strong> ${r.title}</span> — 
        <span style="color: #cbd5e1; font-size: 0.85rem;">${r.desc}</span>
      </div>
    `).join('');

    this.appendOutput(`
      <div class="term-output-block">
        <div class="term-heading">🎯 Career Ambition & Engineering Roadmap</div>
        ${roadmap}
        <div style="margin-top: 0.8rem; border-top: 1px dashed #334155; padding-top: 0.5rem; font-size: 0.85rem; color: #94a3b8;">
          <strong>Target Certifications:</strong> Certified Ethical Hacker (CEH) • Solution Architecture
        </div>
      </div>
    `);
  }

  cmdInterests() {
    const p = PORTFOLIO_DATA.interests;
    const games = p.gaming.map(g => `<span class="term-tag">🎮 ${g.name} (${g.tag})</span>`).join(' ');
    const passions = p.passions.map(pass => `<li>${pass}</li>`).join('');

    this.appendOutput(`
      <div class="term-output-block">
        <div class="term-heading">🕹️ Gaming, LeetCode & Personal Interests</div>
        <p><strong>Favorite Games:</strong> ${games}</p>
        <p><strong>Coding Practice:</strong> ${p.coding}</p>
        <p><strong>Exploration & Research:</strong></p>
        <ul style="padding-left: 1.2rem; font-size: 0.85rem; margin: 0.3rem 0;">${passions}</ul>
      </div>
    `);
  }

  cmdContact() {
    this.appendOutput(`
      <div class="term-output-block">
        <div class="term-heading">📬 Contact & Communication Channels</div>
        <p><strong>Primary Email:</strong> <a href="mailto:${PORTFOLIO_DATA.email}" class="term-link">${PORTFOLIO_DATA.email}</a></p>
        <p><strong>Location:</strong> ${PORTFOLIO_DATA.location}</p>
        <p><strong>Hometown Google Maps:</strong> <a href="${PORTFOLIO_DATA.links.hometownMaps}" target="_blank" class="term-link">View M. Vellampatti on Maps</a></p>
        <p><strong>GitHub:</strong> <a href="${PORTFOLIO_DATA.links.github}" target="_blank" class="term-link">${PORTFOLIO_DATA.links.github}</a></p>
        <p><strong>LinkedIn:</strong> <a href="${PORTFOLIO_DATA.links.linkedin}" target="_blank" class="term-link">${PORTFOLIO_DATA.links.linkedin}</a></p>
      </div>
    `);
  }

  cmdSocials() {
    const l = PORTFOLIO_DATA.links;
    const html = `
      <div class="term-output-block">
        <div class="term-heading">🌐 Verified Public Profiles</div>
        <div class="term-socials-grid">
          <div><a href="${l.github}" target="_blank" class="term-link">🐙 GitHub</a></div>
          <div><a href="${l.linkedin}" target="_blank" class="term-link">💼 LinkedIn</a></div>
          <div><a href="${l.leetcode}" target="_blank" class="term-link">⚡ LeetCode (100+ Streak)</a></div>
          <div><a href="${l.codechef}" target="_blank" class="term-link">🍳 CodeChef</a></div>
          <div><a href="${l.hackerrank}" target="_blank" class="term-link">🎯 HackerRank</a></div>
          <div><a href="${l.geeksforgeeks}" target="_blank" class="term-link">📗 GeeksforGeeks</a></div>
          <div><a href="${l.youtube}" target="_blank" class="term-link">📺 YouTube (@be_a_techiegamer)</a></div>
          <div><a href="${l.prismiq}" target="_blank" class="term-link">✨ PrismIQ Showcase</a></div>
          <div><a href="${l.portfolio}" target="_blank" class="term-link">🚀 Web Portfolio</a></div>
        </div>
      </div>
    `;
    this.appendOutput(html);
  }

  cmdLs() {
    const files = Object.keys(this.virtualFS).map(f => `<span class="term-file">${f}</span>`).join('  ');
    this.appendOutput(`<div class="term-line" style="margin: 0.4rem 0;">${files}</div>`);
  }

  cmdCat(filename) {
    if (!filename) {
      this.appendOutput(`<div class="term-error">Usage: <code>cat &lt;filename&gt;</code>. Type <code>ls</code> to see files.</div>`);
      return;
    }
    const content = this.virtualFS[filename];
    if (!content) {
      this.appendOutput(`<div class="term-error">cat: ${filename}: No such file. Type <code>ls</code> to list available files.</div>`);
      return;
    }
    this.appendOutput(`<pre class="term-pre">${content}</pre>`);
  }

  cmdSudo(args) {
    const subCmd = args.join(' ').toLowerCase();
    if (subCmd.includes('hire')) {
      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#10b981', '#34d399', '#00ff88', '#059669', '#6ee7b7']
        });
      } catch (e) {}

      this.appendOutput(`
        <div class="term-output-block" style="border: 1px solid #10b981; background: rgba(16, 185, 129, 0.08); padding: 1rem; border-radius: 8px;">
          <div style="font-size: 1.1rem; font-weight: bold; color: #10b981;">🎉 ACCESS GRANTED: Offer Package Initialized!</div>
          <p style="margin: 0.5rem 0; line-height: 1.5;">
            You just discovered an exceptional, high-velocity Software Engineer! Pavithran is ready to build production-grade, distributed AI and full-stack systems with your team.
          </p>
          <div style="margin-top: 0.6rem;">
            <a href="mailto:${PORTFOLIO_DATA.email}?subject=Exciting%20Engineering%20Role%20for%20Pavithran&body=Hi%20Pavithran,%20we%20reviewed%20your%203D%20portfolio%20and%20terminal%20and%20would%20love%20to%20connect!" class="term-link" style="display: inline-block; background: #10b981; color: #0f172a; padding: 0.4rem 0.8rem; border-radius: 4px; font-weight: bold; text-decoration: none;">
              📩 Send Offer / Interview Email
            </a>
          </div>
        </div>
      `);
    } else {
      this.appendOutput(`<div class="term-error">sudo: permission denied. Try <code>sudo hire</code> 😉</div>`);
    }
  }

  cmdTheme(themeName) {
    const validThemes = ['dark', 'cyberpunk', 'matrix', 'dracula', 'amber'];
    if (!themeName) {
      this.appendOutput(`<div class="term-line">Current theme: <strong>${this.currentTheme}</strong>. Available: ${validThemes.join(', ')}</div>`);
      return;
    }
    const clean = themeName.toLowerCase();
    if (validThemes.includes(clean)) {
      this.setTheme(clean);
      this.appendOutput(`<div class="term-line">Switched terminal theme to <span class="term-cyan">${clean}</span>.</div>`);
    } else {
      this.appendOutput(`<div class="term-error">Unknown theme: ${themeName}. Choose from: ${validThemes.join(', ')}</div>`);
    }
  }

  cycleTheme() {
    const themes = ['dark', 'cyberpunk', 'matrix', 'dracula', 'amber'];
    const idx = themes.indexOf(this.currentTheme);
    const nextTheme = themes[(idx + 1) % themes.length];
    this.setTheme(nextTheme);
  }

  setTheme(theme) {
    this.currentTheme = theme;
    if (this.rootEl) {
      this.rootEl.setAttribute('data-theme', theme);
    }
  }

  cmdHistory() {
    const html = this.history.map((cmd, i) => `<div>${i + 1}  ${cmd}</div>`).join('');
    this.appendOutput(`<div class="term-line">${html}</div>`);
  }

  handleTabCompletion() {
    const val = this.input.value.trim();
    if (!val) return;

    const parts = val.split(/\s+/);
    if (parts.length === 1) {
      // Complete command
      const matches = this.commands.filter(c => c.startsWith(val.toLowerCase()));
      if (matches.length === 1) {
        this.input.value = matches[0] + ' ';
      } else if (matches.length > 1) {
        this.appendOutput(`<div class="term-line" style="color: #94a3b8;">${matches.join('  ')}</div>`);
        this.scrollToBottom();
      }
    } else if (parts[0].toLowerCase() === 'cat') {
      // Complete filename
      const fileArg = parts[1] || '';
      const files = Object.keys(this.virtualFS);
      const matches = files.filter(f => f.startsWith(fileArg.toLowerCase()));
      if (matches.length === 1) {
        this.input.value = `cat ${matches[0]}`;
      } else if (matches.length > 1) {
        this.appendOutput(`<div class="term-line" style="color: #94a3b8;">${matches.join('  ')}</div>`);
        this.scrollToBottom();
      }
    }
  }

  // --- Falling Matrix Rain Animation ---
  startMatrix() {
    if (!this.matrixCanvas) return;
    this.matrixActive = true;
    this.matrixCanvas.classList.remove('hidden');

    const canvas = this.matrixCanvas;
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = this.outputBody.clientWidth;
      canvas.height = this.outputBody.clientHeight;
    };
    resizeCanvas();

    const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -50);
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00ff66';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      this.matrixAnimId = requestAnimationFrame(draw);
    };

    draw();

    this.appendOutput(`
      <div class="term-line" style="color: #00ff66; margin-top: 0.5rem;">
        ⚡ MATRIX PROTOCOL ACTIVATED. Click anywhere or press any key to exit matrix.
      </div>
    `);
    this.scrollToBottom();
  }

  stopMatrix() {
    if (!this.matrixActive) return;
    this.matrixActive = false;
    if (this.matrixAnimId) {
      cancelAnimationFrame(this.matrixAnimId);
      this.matrixAnimId = null;
    }
    if (this.matrixCanvas) {
      this.matrixCanvas.classList.add('hidden');
    }
  }

  printPromptLine(cmd) {
    const lineHtml = `
      <div class="term-history-entry">
        <span class="term-prompt">
          <span class="prompt-user">pavithran</span><span class="prompt-at">@</span><span class="prompt-host">dev-box</span>:<span class="prompt-path">~</span>$
        </span>
        <span class="term-entered-cmd">${cmd}</span>
      </div>
    `;
    this.historyLog.insertAdjacentHTML('beforeend', lineHtml);
  }

  appendOutput(html) {
    this.historyLog.insertAdjacentHTML('beforeend', html);
  }

  clearScreen() {
    if (this.historyLog) {
      this.historyLog.innerHTML = '';
    }
    this.printWelcome();
    if (this.input) {
      this.input.focus();
    }
  }

  scrollToBottom() {
    if (this.outputBody) {
      this.outputBody.scrollTop = this.outputBody.scrollHeight;
    }
  }

  open() {
    this.isOpen = true;
    if (this.rootEl) {
      this.rootEl.classList.remove('hidden');
    }
    if (this.input) {
      setTimeout(() => this.input.focus(), 100);
    }
  }

  close() {
    if (this.isFloating) {
      this.isOpen = false;
      if (this.rootEl) {
        this.rootEl.classList.add('hidden');
      }
    } else {
      this.clearScreen();
    }
  }

  toggle() {
    if (this.isOpen && this.isFloating) {
      this.close();
    } else {
      this.open();
    }
  }
}
