/**
 * FloatingDawnWidget.js
 * Persistent floating DAWN AI assistant widget.
 * - Always visible bottom-right (desktop) / bottom-center (mobile)
 * - Expandable mini chat panel
 * - Eye tracking avatar
 * - Connects to existing RAGService
 */
import { RAGService } from '../services/ragService.js';
import { getClaraEyeAvatarHtml, initClaraEyeTracking } from './ClaraWidget.js';
import { formatMarkdown, escapeHtml as html } from '../utils/helpers.js';

export class FloatingDawnWidget {
  constructor(options = {}) {
    this.onOpenFull = options.onOpenFull || (() => {});
    this.isOpen = false;
    this.busy = false;
    this.request = null;
    this.mount();
    this.bind();
    requestAnimationFrame(() => initClaraEyeTracking());
  }

  mount() {
    if (document.getElementById('floating-dawn-root')) return;

    const root = document.createElement('div');
    root.id = 'floating-dawn-root';
    root.innerHTML = `
      <div class="fd-panel" id="fd-panel" hidden aria-hidden="true">
        <div class="fd-header">
          <div class="fd-header-identity">
            ${getClaraEyeAvatarHtml(36)}
            <div>
              <strong class="fd-title">DAWN</strong>
              <span class="fd-status"><span class="fd-status-dot"></span> Online</span>
            </div>
          </div>
          <div class="fd-header-actions">
            <button type="button" class="fd-icon-btn" id="fd-expand" title="Open full conversation" aria-label="Open full conversation">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
            </button>
            <button type="button" class="fd-icon-btn" id="fd-close-panel" title="Minimize" aria-label="Minimize chat">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 12h14"/></svg>
            </button>
          </div>
        </div>
        <div class="fd-transcript" id="fd-transcript" role="log" aria-live="polite">
          <div class="fd-empty">
            ${getClaraEyeAvatarHtml(48)}
            <p>Ask me about Pavithran's work, skills, or projects.</p>
          </div>
        </div>
        <form class="fd-compose" id="fd-form">
          <label class="visually-hidden" for="fd-input">Message DAWN</label>
          <textarea id="fd-input" rows="1" placeholder="Ask DAWN…" maxlength="1200" required></textarea>
          <button type="submit" class="fd-send" aria-label="Send" id="fd-send">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 19V5m-6 6 6-6 6 6"/></svg>
          </button>
        </form>
      </div>

      <button type="button" class="fd-fab" id="fd-fab" aria-label="Open DAWN AI assistant" aria-expanded="false">
        <div class="fd-fab-eye">${getClaraEyeAvatarHtml(28)}</div>
        <span class="fd-fab-label">DAWN</span>
        <span class="fd-fab-pulse" aria-hidden="true"></span>
      </button>
    `;
    document.body.appendChild(root);
    this.root = root;
    this.panel = root.querySelector('#fd-panel');
    this.fab = root.querySelector('#fd-fab');
    this.transcript = root.querySelector('#fd-transcript');
    this.form = root.querySelector('#fd-form');
    this.input = root.querySelector('#fd-input');
    this.sendBtn = root.querySelector('#fd-send');
  }

  bind() {
    this.fab?.addEventListener('click', () => this.toggle());
    this.root.querySelector('#fd-close-panel')?.addEventListener('click', () => this.close());
    this.root.querySelector('#fd-expand')?.addEventListener('click', () => {
      this.close();
      this.onOpenFull();
    });

    this.form?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.ask(this.input.value.trim());
    });

    this.input?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
        e.preventDefault();
        if (!this.busy) this.form.requestSubmit();
      }
    });

    this.input?.addEventListener('input', () => {
      this.input.style.height = 'auto';
      this.input.style.height = `${Math.min(this.input.scrollHeight, 100)}px`;
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) this.close();
    });
  }

  toggle() {
    if (this.isOpen) this.close();
    else this.open();
  }

  open() {
    this.isOpen = true;
    this.panel.hidden = false;
    this.panel.setAttribute('aria-hidden', 'false');
    this.fab.setAttribute('aria-expanded', 'true');
    this.fab.classList.add('is-open');
    this.root.classList.add('is-expanded');
    setTimeout(() => this.input?.focus({ preventScroll: true }), 120);
  }

  close() {
    this.isOpen = false;
    this.panel.hidden = true;
    this.panel.setAttribute('aria-hidden', 'true');
    this.fab.setAttribute('aria-expanded', 'false');
    this.fab.classList.remove('is-open');
    this.root.classList.remove('is-expanded');
    this.request?.abort();
  }

  append(role, text, sources = []) {
    const empty = this.transcript.querySelector('.fd-empty');
    if (empty) empty.remove();

    const msg = document.createElement('div');
    msg.className = `fd-msg fd-msg-${role}`;
    msg.innerHTML = `
      <span class="fd-msg-role">${role === 'user' ? 'YOU' : 'DAWN'}</span>
      <div class="fd-msg-body">${formatMarkdown(text)}</div>
      ${sources.length ? `<details class="fd-sources"><summary>Sources (${sources.length})</summary>${sources.map(s => `<p><strong>${html(s.title || s.source || 'Knowledge base')}</strong>${s.snippet ? ': ' + html(s.snippet) : ''}</p>`).join('')}</details>` : ''}
    `;
    this.transcript.appendChild(msg);
    this.transcript.scrollTop = this.transcript.scrollHeight;
  }

  async ask(question) {
    if (this.busy || !question) return;
    this.busy = true;
    this.sendBtn.disabled = true;
    this.input.value = '';
    this.input.style.height = 'auto';
    this.append('user', question);

    const thinking = document.createElement('div');
    thinking.className = 'fd-msg fd-msg-assistant fd-thinking';
    thinking.innerHTML = `<span class="fd-msg-role">DAWN</span><div class="fd-msg-body">Thinking…</div>`;
    this.transcript.appendChild(thinking);
    this.transcript.scrollTop = this.transcript.scrollHeight;

    this.request = new AbortController();
    try {
      const response = await RAGService.query(question, 4, { signal: this.request.signal });
      thinking.remove();
      const answer = response.answer || response.response;
      if (typeof answer !== 'string' || !answer.trim()) throw new Error('Empty answer');
      this.append('assistant', answer, Array.isArray(response.sources) ? response.sources.filter(s => s && typeof s === 'object') : []);
    } catch (err) {
      thinking.remove();
      if (this.request.signal.aborted) return;
      this.append('assistant', 'DAWN is unavailable right now. Try the full conversation or email Pavithran.');
    } finally {
      this.busy = false;
      this.sendBtn.disabled = false;
      if (this.isOpen) this.input?.focus({ preventScroll: true });
    }
  }
}
