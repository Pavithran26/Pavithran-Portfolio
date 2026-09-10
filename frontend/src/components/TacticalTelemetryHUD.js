/**
 * TacticalTelemetryHUD.js
 * Military-grade tactical telemetry HUD inspired by USAvionix (usavionix.com).
 * Streams live engineering system diagnostics, coordinate telemetry,
 * vector database metrics, and radar surveillance status.
 */
import { PORTFOLIO_DATA } from '../data/portfolioData.js';

export class TacticalTelemetryHUD {
  constructor(containerId = 'tactical-hud-root') {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.telemetryLogs = [
      'BOOT_SEQ: DAWN_OS_KERNEL [ONLINE]',
      'AI_CORE: 20 VECTORS INDEXED [ZERO_DB_LOCAL]',
      'LINK: FASTAPI RAG [STATUS: 200 OK]',
      'STACK: ASP.NET CORE + FASTAPI + REACT',
      'GEO_FIX: [13.0827°N / 80.2707°E] // CHENNAI',
      'RADAR: FULL-STACK SCAN [ALL SECURED]',
      'DEPLOY: DOCKER + RAILWAY [HEALTHY]',
    ];
    this.currentIndex = 0;
    this.intervalId = null;

    this.render();
    this.startTelemetryCycle();
  }

  render() {
    this.container.innerHTML = `
      <aside class="tactical-hud-bar" aria-label="Tactical System Telemetry">
        <div class="tactical-hud-inner">
          
          <!-- Left: Radar status beacon -->
          <div class="tactical-status-cluster">
            <span class="tactical-radar-beacon">
              <span class="beacon-ping"></span>
              <span class="beacon-dot"></span>
            </span>
            <span class="tactical-sys-label">SYS_DIAGNOSTICS</span>
            <span class="tactical-mode-pill">ISR // DEF_MODE</span>
          </div>

          <!-- Middle: Cycling Live Telemetry Stream -->
          <div class="tactical-stream-cluster">
            <span class="tactical-crosshair-icon">[+]</span>
            <span id="tactical-stream-text" class="tactical-stream-text">
              ${this.telemetryLogs[0]}
            </span>
          </div>

          <!-- Right: Real-time Coordinates & Status Badge -->
          <div class="tactical-meta-cluster">
            <span class="tactical-coord">13.0827°N / 80.2707°E</span>
            <span class="tactical-status-badge">
              <span class="badge-dot green"></span>
              <span>LOCKED</span>
            </span>
          </div>

        </div>
      </aside>
    `;
  }

  startTelemetryCycle() {
    const streamEl = document.getElementById('tactical-stream-text');
    if (!streamEl) return;

    this.intervalId = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.telemetryLogs.length;
      
      // Glitch/telemetry transition
      streamEl.style.opacity = '0.2';
      streamEl.style.transform = 'translateY(-3px)';
      
      setTimeout(() => {
        streamEl.textContent = this.telemetryLogs[this.currentIndex];
        streamEl.style.opacity = '1';
        streamEl.style.transform = 'translateY(0)';
      }, 150);
    }, 3200);
  }

  destroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }
}
