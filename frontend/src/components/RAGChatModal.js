/**
 * RAGChatModal.js
 * Interactive modal dialogue connecting directly to the FastAPI LangChain RAG backend.
 * Features Clara AI Assistant theme with 3D animated eye avatar and interactive prompt chips.
 */
import { RAGService } from '../services/ragService.js';
import { escapeHtml, formatMarkdown } from '../utils/helpers.js';
import { getClaraEyeAvatarHtml } from './ClaraWidget.js';

export class RAGChatModal {
  constructor(containerId = 'rag-modal-root') {
    this.container = document.getElementById(containerId);
    this.isOpen = false;

    this.render();
    this.bindEvents();
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="rag-modal-backdrop" id="rag-backdrop">
        <div class="rag-modal-window" role="dialog" aria-modal="true">
          
          <div class="rag-modal-header">
            <div class="rag-brand-badge">
              <div class="rag-clara-avatar-slot">
                ${getClaraEyeAvatarHtml(46)}
              </div>
              <div>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <h3 style="color: #fff; font-size: 1.25rem; font-weight: 800; margin: 0;">DAWN AI</h3>
                  <span style="font-size: 0.7rem; font-family: var(--font-mono); background: linear-gradient(135deg, #ec4899, #8b5cf6); color: #fff; padding: 2px 7px; border-radius: 9999px; font-weight: 700;">ASSISTANT</span>
                  <span class="clara-status-dot" style="width: 8px; height: 8px;" title="Online"></span>
                </div>
                <p style="font-size: 0.78rem; color: var(--text-muted); margin-top: 4px;">
                  Grounded in Pavithran's engineering knowledge via 
                  <span style="color: var(--cyan-accent); font-weight: 600;">FastAPI</span> + 
                  <span style="color: var(--emerald-accent); font-weight: 600;">LangChain</span> + 
                  <span style="color: #a855f7; font-weight: 600;">PostgreSQL (pgvector)</span>
                </p>
              </div>
            </div>
            <button class="btn-close-modal" id="btn-close-rag" aria-label="Close Assistant">✕</button>
          </div>

          <!-- Quick Suggestion Chips -->
          <div class="clara-quick-prompts">
            <span class="prompts-label">Try asking:</span>
            <div class="prompts-scroll">
              <button class="clara-prompt-pill" data-q="What is ClanSure and what was Pavithran's contribution?">
                🛡️ ClanSure Project
              </button>
              <button class="clara-prompt-pill" data-q="Tell me about Pavithran's role and experience at OWLSure (ValueMomentum).">
                💼 OWLSure Experience
              </button>
              <button class="clara-prompt-pill" data-q="What is GT Companion and what stack does it use?">
                🎓 GT Companion
              </button>
              <button class="clara-prompt-pill" data-q="What are Pavithran's top technical skills and languages?">
                ⚡ Core Stack
              </button>
            </div>
          </div>

          <form id="rag-form" class="rag-input-box" style="margin-top: 0.75rem;">
            <input 
              type="text" 
              id="rag-input" 
              class="rag-input" 
              placeholder="Ask DAWN anything about Pavithran's architecture, projects, or background..." 
              autocomplete="off"
            />
            <button type="submit" id="rag-submit" class="rag-send-btn clara-send-glow">
              <span>⚡</span> Ask DAWN
            </button>
          </form>

          <div class="rag-response-area" id="rag-response-box" style="margin-top: 1rem;">
            <div id="rag-empty-hint" style="color: var(--text-muted); font-size: 0.85rem; text-align: center; padding: 2.5rem 0;">
              <div style="font-size: 2.2rem; margin-bottom: 0.6rem;">✨</div>
              <strong style="color: #fff; font-size: 1rem; display: block; margin-bottom: 0.25rem;">Meet DAWN AI, your intelligent guide</strong>
              Type any question above or tap one of the suggested prompts to query Pavithran's portfolio in real time.
            </div>

            <div id="rag-result-view" style="display: none;">
              <div id="rag-answer-body" style="font-size: 0.95rem; color: #f1f5f9; line-height: 1.6;"></div>

              <div id="rag-sources-section" class="rag-sources-list" style="display: none;">
                <span style="font-size: 0.725rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 0.5rem;">
                  Retrieved Vector Grounding Chunks (pgvector):
                </span>
                <div id="rag-sources-chips"></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    `;
  }

  bindEvents() {
    this.backdrop = document.getElementById('rag-backdrop');
    const closeBtn = document.getElementById('btn-close-rag');
    const form = document.getElementById('rag-form');
    const input = document.getElementById('rag-input');

    if (closeBtn) closeBtn.addEventListener('click', () => this.close());
    if (this.backdrop) {
      this.backdrop.addEventListener('click', (e) => {
        if (e.target === this.backdrop) this.close();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) this.close();
    });

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const q = input.value.trim();
        if (q) this.ask(q);
      });
    }

    // Bind Quick Suggestion Pills
    const promptPills = this.container.querySelectorAll('.clara-prompt-pill');
    promptPills.forEach(pill => {
      pill.addEventListener('click', () => {
        const query = pill.getAttribute('data-q');
        if (input && query) {
          input.value = query;
          this.ask(query);
        }
      });
    });
  }

  open() {
    if (!this.backdrop) return;
    this.backdrop.classList.add('open');
    this.isOpen = true;
    const input = document.getElementById('rag-input');
    if (input) setTimeout(() => input.focus(), 150);
  }

  close() {
    if (!this.backdrop) return;
    this.backdrop.classList.remove('open');
    this.isOpen = false;
  }

  async ask(query) {
    const submitBtn = document.getElementById('rag-submit');
    const emptyHint = document.getElementById('rag-empty-hint');
    const resultView = document.getElementById('rag-result-view');
    const answerBody = document.getElementById('rag-answer-body');
    const sourcesSection = document.getElementById('rag-sources-section');
    const sourcesChips = document.getElementById('rag-sources-chips');

    if (emptyHint) emptyHint.style.display = 'none';
    if (resultView) resultView.style.display = 'block';

    if (answerBody) {
      answerBody.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.75rem; color: #38bdf8; font-size: 0.9rem;">
          <span style="display: inline-block; animation: spin 1s linear infinite;">⚙️</span>
          <span>DAWN is searching vector space in PostgreSQL (pgvector) & synthesizing verified answer...</span>
        </div>
      `;
    }

    if (sourcesSection) sourcesSection.style.display = 'none';
    if (sourcesChips) sourcesChips.innerHTML = '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>⏳</span> DAWN Thinking...';
    }

    try {
      const response = await RAGService.query(query);

      if (answerBody) {
        answerBody.innerHTML = `
          <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(56, 189, 248, 0.2); border-radius: 12px; padding: 1rem; margin-bottom: 0.75rem;">
            <span style="font-size: 0.8rem; color: #38bdf8; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 0.25rem;">Question</span>
            <div style="color: #fff; font-weight: 600;">${escapeHtml(query)}</div>
          </div>
          <div class="rag-answer-content">
            ${formatMarkdown(response.answer)}
          </div>
        `;
      }

      if (response.sources && response.sources.length > 0 && sourcesSection && sourcesChips) {
        sourcesSection.style.display = 'block';
        sourcesChips.innerHTML = response.sources.map(s => `
          <div class="rag-source-chip">
            <strong>${escapeHtml(s.title || 'Knowledge Base Chunk')}</strong>: ${escapeHtml(s.snippet || '')}
          </div>
        `).join('');
      }

    } catch (err) {
      if (answerBody) {
        answerBody.innerHTML = `
          <div style="color: #f87171; padding: 1rem; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 12px;">
            <strong>Service Notice:</strong> Could not connect to DAWN's local RAG backend. 
            <p style="font-size: 0.825rem; margin-top: 0.35rem; color: #fca5a5;">
              Ensure FastAPI backend is running via <code>python app/main.py</code>.
            </p>
          </div>
        `;
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>⚡</span> Ask DAWN';
      }
    }
  }
}
