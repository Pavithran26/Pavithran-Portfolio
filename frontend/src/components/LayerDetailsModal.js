/**
 * LayerDetailsModal.js
 * Sliding inspection sheet displaying layer metrics, technologies, real-world implementations,
 * and production code signatures when a 3D layer is clicked in Three.js.
 */
import { escapeHtml, formatMetricKey } from '../utils/helpers.js';

export class LayerDetailsModal {
  constructor(containerId = 'layer-modal-root') {
    this.container = document.getElementById(containerId);
    this.currentLayer = null;
    this.render();
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = `
      <div class="layer-drawer-backdrop" id="layer-backdrop">
        <div class="layer-drawer-sheet" id="layer-sheet" role="dialog" aria-modal="true">
          <div id="layer-sheet-content"></div>
        </div>
      </div>
    `;

    this.backdrop = document.getElementById('layer-backdrop');
    this.backdrop.addEventListener('click', (e) => {
      if (e.target === this.backdrop) {
        this.close();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.close();
      }
    });
  }

  open(layer) {
    if (!layer || !this.backdrop) return;
    this.currentLayer = layer;

    const contentContainer = document.getElementById('layer-sheet-content');
    if (!contentContainer) return;

    // Metrics grid
    const metricsHtml = Object.entries(layer.metrics || {}).map(([k, v]) => `
      <div class="metric-box">
        <div class="metric-val" style="color: ${layer.accentColor}">${escapeHtml(v)}</div>
        <div class="metric-lbl">${escapeHtml(formatMetricKey(k))}</div>
      </div>
    `).join('');

    // Tech pills
    const techPillsHtml = (layer.technologies || []).map(t => `
      <span class="tech-pill">${escapeHtml(t)}</span>
    `).join('');

    // Projects list
    const projectsHtml = (layer.projects || []).map(p => `
      <div class="project-mini-card">
        <h4>${escapeHtml(p.name)}</h4>
        <div class="project-mini-role">${escapeHtml(p.role)}</div>
        <p class="project-mini-details">${escapeHtml(p.details)}</p>
      </div>
    `).join('');

    contentContainer.innerHTML = `
      <div class="drawer-header">
        <div>
          <span class="drawer-badge" style="background: ${layer.glowColor}; color: #fff; border: 1px solid ${layer.accentColor}">
            Layer ${escapeHtml(layer.number)} • ${escapeHtml(layer.badge)}
          </span>
          <h2 class="drawer-title" style="color: #fff;">${escapeHtml(layer.title)}</h2>
          <p class="drawer-subtitle" style="color: ${layer.accentColor}">${escapeHtml(layer.subtitle)}</p>
        </div>
        <button class="btn-close-modal" id="btn-close-sheet" aria-label="Close sheet">✕</button>
      </div>

      <p class="drawer-desc">${escapeHtml(layer.description)}</p>

      <h3 class="drawer-section-title">Production Performance Benchmarks</h3>
      <div class="drawer-metrics-grid">
        ${metricsHtml}
      </div>

      <h3 class="drawer-section-title">Core Technologies & Tooling</h3>
      <div class="tech-pills">
        ${techPillsHtml}
      </div>

      <h3 class="drawer-section-title">Verified Portfolio Implementations</h3>
      <div style="margin-bottom: 1.75rem;">
        ${projectsHtml}
      </div>

      <h3 class="drawer-section-title">Engineering Code Signature</h3>
      <div class="code-block-wrapper">
        <pre><code>${escapeHtml(layer.codeSnippet || '// No code preview')}</code></pre>
      </div>
    `;

    const closeBtn = document.getElementById('btn-close-sheet');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }

    this.backdrop.classList.add('open');
  }

  close() {
    if (this.backdrop) {
      this.backdrop.classList.remove('open');
    }
    this.currentLayer = null;
  }
}
