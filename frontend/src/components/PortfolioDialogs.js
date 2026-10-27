import { PORTFOLIO_DATA as profile } from '../data/portfolioData.js';
import { TECH_STACK_LAYERS as layers } from '../data/techStackLayers.js';
import { PROJECTS_DATA as projects } from '../data/projectsData.js';
import { SKILLS_CATEGORIES as categories } from '../data/skillsData.js';
import { RAGService } from '../services/ragService.js';
import { escapeHtml as html, formatMarkdown } from '../utils/helpers.js';
import { getClaraEyeAvatarHtml } from './ClaraWidget.js';
import { technologyIcons } from './TechnologyIcons.js';

const tags = values => `<div class="detail-tags">${values.map(value => `<span class="detail-tag">${technologyIcons(value)}${html(value)}</span>`).join('')}</div>`;
const bullets = values => `<ul class="detail-list">${values.map(value => `<li>${html(value)}</li>`).join('')}</ul>`;

/** Native dialogs provide focus containment, Escape dismissal and focus restoration. */
export class PortfolioDialogs {
  constructor() {
    this.dialog = document.createElement('dialog');
    this.dialog.className = 'portfolio-dialog';
    this.dialog.setAttribute('aria-labelledby', 'detail-title');
    this.dialog.innerHTML = '<div class="dialog-header"><span class="eyebrow" id="detail-label"></span><button class="dialog-close" type="button" aria-label="Close dialog">Close <span aria-hidden="true">×</span></button></div><h2 id="detail-title"></h2><div id="detail-body"></div>';
    document.body.appendChild(this.dialog);
    this.body = this.dialog.querySelector('#detail-body');
    this.dialog.querySelector('.dialog-close').addEventListener('click', () => this.dialog.close());
    this.dialog.addEventListener('click', event => { if (event.target === this.dialog) { const rect = this.dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) this.dialog.close(); } });
    this.dialog.addEventListener('close', () => {
      this.request?.abort();
      this.terminal?.stopMatrix();
      if (this.opener?.isConnected) this.opener.focus({ preventScroll: true });
    });
  }

  show(label, title, content, type = 'detail') {
    this.request?.abort();
    this.terminal?.stopMatrix();
    if (this.terminalMount?.isConnected) this.terminalMount.remove();
    this.view = type;
    this.viewRevision = (this.viewRevision || 0) + 1;
    this.dialog.classList.remove('fullscreen');
    this.dialog.dataset.view = type;
    this.dialog.querySelector('#detail-label').textContent = label;
    this.dialog.querySelector('#detail-title').textContent = title;
    this.body.innerHTML = content;
    this.dialog.scrollTop = 0;
    if (!this.dialog.open) { this.opener = document.activeElement; this.dialog.showModal(); }
    if (type !== 'terminal') this.dialog.querySelector('.dialog-close').focus({ preventScroll: true });
  }

  open(type) {
    if (type === 'dawn') this.openDawn();
    else if (type === 'skills') this.openSkills();
    else if (type === 'dossier') this.openDossier();
    else if (type === 'terminal') this.openTerminal();
    else if (type === 'prime') this.openPrime();
  }

  openPrime() {
    this.show('CYBERTRONIAN MATRIX // ARCHITECTURE', 'Optimus Prime 4K Master Blueprint', `
      <div class="prime-dossier-modal">
        <div class="prime-modal-banner">
          <span class="tf-status-badge">AUTOBOT FLAGSHIP · MASTER TECHNICAL SPECIFICATION</span>
        </div>
        <div class="prime-modal-image-wrap">
          <a href="/images/prime.png" target="_blank" rel="noopener noreferrer" title="Click to view full 4K resolution">
            <img src="/images/prime.png" alt="Optimus Prime 4K Master Model Blueprint and Orthographic Schematics" class="prime-modal-img" loading="eager" />
          </a>
          <p class="prime-img-caption">4K Master Blueprint · Orthographic Views, Wireframe Topology, PBR Texture Maps (Click to zoom)</p>
        </div>
        <div class="prime-modal-details">
          <div class="prime-specs-grid">
            <div class="prime-spec-card"><span class="eyebrow">DELIVERABLE</span><strong>GLB (Binary) Web-Ready</strong></div>
            <div class="prime-spec-card"><span class="eyebrow">GEOMETRY</span><strong>High-Poly & Precision Optimized</strong></div>
            <div class="prime-spec-card"><span class="eyebrow">TEXTURE MAPS</span><strong>4K Albedo, Normal, Roughness, Metallic</strong></div>
            <div class="prime-spec-card"><span class="eyebrow">CORE ARCHETYPE</span><strong>Optimus Prime · Leader of Autobots</strong></div>
          </div>
          <p class="detail-lead">The foundational architectural archetype inspiring Pavithran's portfolio: modular architecture, zero-latency execution, resilient distributed systems, and relentless forward deployment.</p>
          <div class="detail-actions">
            <a class="button button-light" href="/landing-pages/optimus-prime.html" target="_blank" rel="noopener noreferrer">Launch 3D WebGL Matrix ↗</a>
            <a class="button" href="/images/prime.png" target="_blank" download="optimus-prime-4k-blueprint.png">Download 4K Sheet (2.8MB) ↓</a>
          </div>
        </div>
      </div>
    `, 'prime');
  }

  openProject(id) {
    const project = projects.find(item => item.id === id);
    if (!project) return;
    this.show('SELECTED WORK / ' + project.category, project.title, `
      <p class="detail-lead">${html(project.tagline)}</p><p>${html(project.overview)}</p>
      <div class="detail-columns"><div><h3>The challenge</h3><p>${html(project.challenge)}</p></div><div><h3>The approach</h3><p>${html(project.solution)}</p></div></div>
      ${project.implementationNote ? `<p class="project-scope-note">${html(project.implementationNote)}</p>` : ''}<h3>Engineering contributions</h3>${bullets(project.highlights)}<h3>Technologies</h3>${tags(project.technologies)}
      <div class="detail-actions">${project.liveUrl ? `<a class="button button-light" href="${html(project.liveUrl)}" target="_blank" rel="noopener noreferrer">Visit project ↗</a>` : (project.githubUrl ? '' : '<span class="eyebrow">NO PUBLIC DEMO LINK</span>')}${project.githubUrl ? `<a class="text-link" href="${html(project.githubUrl)}" target="_blank" rel="noopener noreferrer">Source code ↗</a>` : ''}</div>
    `);
  }

  openLayer(layer) {
    this.show('ARCHITECTURE / LAYER ' + layer.number, layer.title, `
      <p class="detail-lead">${html(layer.subtitle)}</p><p>${html(layer.description)}</p><h3>Technologies</h3>${tags(layer.technologies)}<h3>In practice</h3>
      ${layer.projects.map(project => `<article class="detail-entry"><h4>${html(project.name)}</h4><span class="eyebrow">${html(project.role)}</span><p>${html(project.details)}</p></article>`).join('')}
      ${layer.codeSnippet ? `<details class="code-detail"><summary>View code example</summary><pre><code>${html(layer.codeSnippet)}</code></pre></details>` : ''}
    `);
  }

  openChapter(chapter) {
    const details = chapter.layerIndexes.map(index => layers[index]);
    this.show('THE STACK / ' + chapter.number, chapter.name + '.', `
      <p class="detail-lead">${html(chapter.tagline)}</p><p>${html(chapter.description)}</p>
      ${chapter.groups.map(group => `<h3>${html(group.label)}</h3>${tags(group.items)}`).join('')}
      <h3>In practice</h3>${details.flatMap(layer => layer.projects).map(project => `<article class="detail-entry"><h4>${html(project.name)}</h4><span class="eyebrow">${html(project.role)}</span><p>${html(project.details)}</p></article>`).join('')}
      ${details.filter(layer => layer.codeSnippet).map(layer => `<details class="code-detail"><summary>${html(layer.title)} — code example</summary><pre><code>${html(layer.codeSnippet)}</code></pre></details>`).join('')}
      ${chapter.id === 'ai' ? '<div class="detail-actions"><button class="button button-light" type="button" data-dialog="dawn">Try DAWN AI ↗</button></div>' : ''}
    `);
  }

  openToolCard({ title = 'Technology', category = 'Tools & Technologies', description = '' } = {}) {
    const icon = technologyIcons(title, { eager: true });
    const monogram = String(title).replace(/[^a-z0-9]/gi, '').slice(0, 2).toUpperCase() || 'T';
    this.show('TOOLS & TECHNOLOGIES / ' + category.toUpperCase(), title, `
      <div class="tool-card-detail">
        <div class="tool-card-detail__identity">
          <span class="tool-card-detail__icon">${icon || `<span class="staggered-tech-card__monogram">${html(monogram)}</span>`}</span>
          <span class="eyebrow">${html(category)}</span>
        </div>
        <p class="detail-lead">${html(description)}</p>
        <p>This item is part of the toolkit represented across full-stack development, AI/RAG, data workflows and application deployment.</p>
        <div class="detail-actions">
          <button class="button button-light" type="button" data-dialog="skills">Browse the full skills catalogue ↗</button>
        </div>
      </div>
    `, 'tool-detail');
  }

  openSkills(initialQuery = '') {
    this.show('CAPABILITIES / TECHNICAL SKILLS', 'The tools behind the work.', `
      <div class="skill-controls">
        <div class="skill-search-column">
          <label class="skill-gooey-label" for="skill-search-open">Search skills</label>
          <div class="skill-gooey-search" id="skill-gooey-search">
            <svg class="skill-gooey-filter-defs" aria-hidden="true" focusable="false">
              <defs><filter id="skill-gooey-filter">
                <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
                <feComposite in="SourceGraphic" in2="goo" operator="atop" />
              </filter></defs>
            </svg>
            <div class="skill-gooey-shell">
              <button id="skill-search-open" class="skill-gooey-open" type="button" aria-label="Open skills search">
                <span>Search</span>
                <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.2 4.2"/></svg>
              </button>
              <div class="skill-gooey-input-wrap" hidden>
                <input id="skill-search" type="search" placeholder="Search skills, frameworks, tools…" autocomplete="off" aria-label="Search skills, frameworks and tools" aria-controls="skill-search-suggestions" />
                <button id="skill-search-clear" type="button" aria-label="Clear search" title="Clear search">×</button>
                <button id="skill-search-collapse" type="button" aria-label="Close search" title="Close search">×</button>
              </div>
              <div id="skill-search-suggestions" class="skill-gooey-suggestions" role="listbox" aria-label="Matching skills" hidden></div>
            </div>
          </div>
        </div>
        <div><label for="skill-category">Category</label><select id="skill-category"><option value="all" selected>All categories</option>${categories.map(category => `<option value="${category.id}">${html(category.name)}</option>`).join('')}</select></div>
      </div><p id="skill-count" class="eyebrow" role="status"></p><div id="skills-results"></div>
    `, 'skills');
    const search = this.body.querySelector('#skill-search');
    const searchRoot = this.body.querySelector('#skill-gooey-search');
    const openSearchButton = this.body.querySelector('#skill-search-open');
    const inputWrap = this.body.querySelector('.skill-gooey-input-wrap');
    const clearSearchButton = this.body.querySelector('#skill-search-clear');
    const collapseSearchButton = this.body.querySelector('#skill-search-collapse');
    const suggestions = this.body.querySelector('#skill-search-suggestions');
    const categoryInput = this.body.querySelector('#skill-category');
    let suggestionsDismissed = false;

    const allSkillEntries = categories.flatMap(category =>
      category.skills.map(skill => ({ skill, category }))
    );

    const showSearchInput = () => {
      searchRoot.classList.add('is-open');
      openSearchButton.hidden = true;
      inputWrap.hidden = false;
      search.focus({ preventScroll: true });
    };

    if (initialQuery) {
      search.value = initialQuery;
      showSearchInput();
    }

    const renderSuggestions = () => {
      const query = search.value.trim().toLocaleLowerCase();
      if (!query || suggestionsDismissed) {
        suggestions.hidden = true;
        suggestions.innerHTML = '';
        return;
      }

      const matchedEntries = allSkillEntries
        .filter(({ skill, category }) => [skill.name, skill.tag, skill.level, category.name].filter(Boolean).join(' ').toLocaleLowerCase().includes(query))
        .sort((a, b) => {
          const aName = a.skill.name.toLocaleLowerCase();
          const bName = b.skill.name.toLocaleLowerCase();
          return Number(!aName.startsWith(query)) - Number(!bName.startsWith(query)) || aName.localeCompare(bName);
        })
        .slice(0, 4);

      suggestions.innerHTML = matchedEntries.map(({ skill, category }, index) => `
        <button type="button" class="skill-gooey-suggestion" role="option" aria-selected="false"
          data-skill-suggestion data-skill-name="${html(skill.name)}" data-skill-category="${html(category.id)}"
          style="--suggestion-index: ${index}">
          <span class="skill-gooey-suggestion-icon" aria-hidden="true">${technologyIcons(skill.name) || '<span>⌘</span>'}</span>
          <span class="skill-gooey-suggestion-copy"><strong>${html(skill.name)}</strong><small>${html(category.name)}</small></span>
          <span class="skill-gooey-suggestion-arrow" aria-hidden="true">↗</span>
        </button>
      `).join('');

      suggestions.hidden = matchedEntries.length === 0;
      suggestions.querySelectorAll('[data-skill-suggestion]').forEach(button => {
        button.addEventListener('click', () => {
          search.value = button.dataset.skillName;
          categoryInput.value = button.dataset.skillCategory;
          suggestionsDismissed = true;
          render();
          search.focus({ preventScroll: true });
        });
      });
    };

    const render = () => {
      const query = search.value.toLocaleLowerCase().trim();
      let count = 0;
      const content = categories.filter(category => categoryInput.value === 'all' || categoryInput.value === category.id).map(category => {
        const matches = category.skills.filter(skill => [skill.name, skill.tag, skill.level, category.name].filter(Boolean).join(' ').toLocaleLowerCase().includes(query));
        count += matches.length;
        if (!matches.length) return '';
        return `<section class="skill-group"><h3>${html(category.name)}</h3><p>${html(category.description)}</p><div class="skill-grid">${matches.map(skill => `<article><div class="skill-heading">${technologyIcons(skill.name)}<strong>${html(skill.name)}</strong></div><span class="skill-level">${html(skill.level)}</span><p>${html(skill.tag || '')}</p></article>`).join('')}</div></section>`;
      }).join('');
      this.body.querySelector('#skill-count').textContent = `${count} ${count === 1 ? 'skill' : 'skills'} found`;
      this.body.querySelector('#skills-results').innerHTML = content || '<p class="empty-result">No matching skills. Try another term or choose a different category.</p>';
      renderSuggestions();
    };
    openSearchButton.addEventListener('click', showSearchInput);
    search.addEventListener('input', () => {
      suggestionsDismissed = false;
      render();
    });
    search.addEventListener('keydown', event => {
      if (event.key === 'Enter' && !suggestions.hidden) {
        const first = suggestions.querySelector('[data-skill-suggestion]');
        if (first) {
          event.preventDefault();
          first.click();
        }
      } else if (event.key === 'Escape') {
        suggestions.hidden = true;
      }
    });
    clearSearchButton.addEventListener('click', () => {
      search.value = '';
      suggestionsDismissed = false;
      categoryInput.value = 'all';
      render();
      search.focus({ preventScroll: true });
    });
    collapseSearchButton.addEventListener('click', () => {
      search.value = '';
      suggestionsDismissed = false;
      categoryInput.value = 'all';
      suggestions.hidden = true;
      searchRoot.classList.remove('is-open');
      inputWrap.hidden = true;
      openSearchButton.hidden = false;
      render();
      openSearchButton.focus({ preventScroll: true });
    });
    categoryInput.addEventListener('change', render);
    render();
  }

  openDossier() {
    this.show('PROFILE / PAVITHRAN S.', 'A little more about me.', `
      <p class="detail-lead">${html(profile.summary)}</p><h3>Professional experience</h3>${profile.experience.map(job => `<article class="detail-entry"><span class="eyebrow">${html(job.period)}</span><h4>${html(job.role)} · ${html(job.company)}</h4><p>${html(job.location)}</p>${bullets(job.responsibilities)}</article>`).join('')}
      <h3>Education</h3>${profile.education.map(education => `<article class="detail-entry"><span class="eyebrow">${html(education.period)}</span><h4>${html(education.degree)}</h4><p>${html(education.institution)}</p><p>${html(education.highlights)}</p></article>`).join('')}
      <h3>Training</h3>${profile.training.map(item => `<article class="detail-entry"><span class="eyebrow">${html(item.date)}</span><h4>${html(item.title)} · ${html(item.organization)}</h4><p>${html(item.description)}</p><p>Certificate: ${html(item.certificate)}</p></article>`).join('')}<h3>Recognition</h3>${profile.achievements.map(achievement => `<article class="detail-entry"><span class="eyebrow">${html(achievement.date)} · ${html(achievement.organization)}</span><h4>${html(achievement.title)}</h4><p>${html(achievement.description)}</p></article>`).join('')}
      <h3>What comes next</h3>${profile.careerAmbitions.roadmap.map(goal => `<article class="detail-entry"><span class="eyebrow">${html(goal.step)}</span><h4>${html(goal.title)}</h4><p>${html(goal.desc)}</p></article>`).join('')}
      <h3>Beyond the code</h3><p>${html(profile.interests.coding)}</p>${tags(profile.interests.gaming.map(game => game.name))}${bullets(profile.interests.passions)}
      <h3>Find me elsewhere</h3><div class="detail-actions">${Object.entries(profile.links).filter(([key]) => !['portfolio', 'hometownMaps'].includes(key)).map(([name, url]) => `<a class="text-link" href="${html(url)}" target="_blank" rel="noopener noreferrer">${html(name)} ↗</a>`).join('')}</div><p><a href="mailto:${profile.email}">${profile.email}</a></p>
    `);
  }

  openDawn(question) {
    this.show('DAWN', 'Portfolio assistant', `
      <div class="chat-transcript" role="log" aria-label="Conversation with DAWN" aria-live="polite">
        <div class="chat-empty">${getClaraEyeAvatarHtml(64)}<h3>DAWN</h3><p>Pavithran's portfolio assistant.</p></div>
      </div>
      <div class="chat-compose"><p class="chat-status" role="status"></p><form class="chat-form"><label class="visually-hidden" for="dawn-question">Message DAWN</label><textarea id="dawn-question" rows="1" placeholder="Message DAWN…" maxlength="2000" required></textarea><button type="submit" class="chat-send" aria-label="Send message"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 19V5m-6 6 6-6 6 6"/></svg></button></form><p class="chat-footnote">DAWN can make mistakes. Check important details.</p></div>
    `, 'dawn');
    const form = this.body.querySelector('form');
    const input = this.body.querySelector('#dawn-question');
    const transcript = this.body.querySelector('.chat-transcript');
    const submit = form.querySelector('button');
    const status = this.body.querySelector('.chat-status');
    let busy = false;
    const append = (role, text, sources = []) => {
      const message = document.createElement('div');
      message.className = `chat-message ${role}`;
      message.innerHTML = `<span class="eyebrow">${role === 'user' ? 'YOU' : 'DAWN'}</span><div>${formatMarkdown(text)}</div>${sources.length ? `<details><summary>Sources (${sources.length})</summary>${sources.map(source => `<p><strong>${html(source.title || source.source || 'Portfolio knowledge base')}</strong>${source.snippet ? ': ' + html(source.snippet) : ''}</p>`).join('')}</details>` : ''}`;
      transcript.querySelector('.chat-empty')?.remove();
      transcript.appendChild(message); transcript.scrollTop = transcript.scrollHeight;
    };
    const ask = async questionText => {
      if (busy || !questionText.trim()) return;
      busy = true; submit.disabled = true; transcript.setAttribute('aria-busy', 'true');
      input.value = ''; input.style.height = 'auto'; append('user', questionText);
      status.textContent = 'DAWN is thinking…';
      this.request = new AbortController();
      const request = this.request;
      try {
        const response = await RAGService.query(questionText, 4, { signal: request.signal });
        if (request.signal.aborted) return;
        const answer = response.answer || response.response;
        if (typeof answer !== 'string' || !answer.trim()) throw new Error('No answer returned');
        append('assistant', answer, Array.isArray(response.sources) ? response.sources.filter(source => source && typeof source === 'object') : []);
        status.textContent = '';
      } catch {
        if (request.signal.aborted) return;
        append('assistant', 'DAWN is unavailable right now. Please try again, or explore the projects and experience sections. You can also reach Pavithran by email.');
        status.textContent = 'Your question was not answered. Please try again.';
      } finally {
        busy = false; submit.disabled = false; transcript.setAttribute('aria-busy', 'false');
        if (this.dialog.open && this.view === 'dawn' && !request.signal.aborted) input.focus({ preventScroll: true });
      }
    };
    form.addEventListener('submit', event => { event.preventDefault(); ask(input.value.trim()); });
    input.addEventListener('input', () => { input.style.height = 'auto'; input.style.height = `${Math.min(input.scrollHeight, 140)}px`; });
    input.addEventListener('keydown', event => { if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) { event.preventDefault(); if (!busy) form.requestSubmit(); } });
    if (question) ask(question); else input.focus({ preventScroll: true });
  }

  async openTerminal() {
    this.show('TERMINAL', 'pavithran@ubuntu: ~', '<p id="terminal-loading" role="status">Opening terminal…</p>', 'terminal');
    const revision = this.viewRevision;
    try {
      if (!this.terminal) {
        const { DevTerminalConsole } = await import('./DevTerminalConsole.js');
        if (!this.dialog.open || this.view !== 'terminal' || this.viewRevision !== revision) return;
        this.terminalMount = document.createElement('div'); this.terminalMount.id = 'portfolio-terminal';
        this.body.appendChild(this.terminalMount);
        this.terminal = new DevTerminalConsole('portfolio-terminal', { isFloating: false });
        this.terminal.input.setAttribute('aria-label', 'Terminal command');
        this.terminal.close = () => this.dialog.close();

      } else this.body.appendChild(this.terminalMount);
      const maximize = this.terminalMount.querySelector('#term-btn-max');
      maximize.setAttribute('aria-pressed', 'false');
      maximize.setAttribute('aria-label', 'Maximize terminal');
      this.body.querySelector('#terminal-loading')?.remove();
      this.terminal.input.focus({ preventScroll: true });
    } catch { const loading = this.body.querySelector('#terminal-loading'); if (loading) loading.textContent = 'The terminal could not open. Please close this window and try again.'; }
  }
}
