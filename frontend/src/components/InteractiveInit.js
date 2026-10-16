/**
 * InteractiveInit.js — floating DAWN + magnetic cards + hide header DAWN AI button.
 * Loaded after main.js; does not require main.js changes.
 */
import { FloatingDawnWidget } from './FloatingDawnWidget.js';
import { initMagneticCards } from './MagneticCards.js';

function hideHeaderDawnAi() {
  const mount = document.getElementById('dawn-ai-button-mount');
  if (mount) {
    mount.style.display = 'none';
    mount.setAttribute('aria-hidden', 'true');
    mount.innerHTML = '';
  }
  document.querySelectorAll('#dawn-eye, .dawn-shiny-button, .dawn-eye').forEach((el) => {
    el.style.display = 'none';
    el.setAttribute('aria-hidden', 'true');
  });
  const style = document.createElement('style');
  style.id = 'hide-header-dawn-ai';
  style.textContent = `
    #dawn-ai-button-mount,
    #dawn-eye,
    .dawn-shiny-button,
    header .dawn-eye {
      display: none !important;
      visibility: hidden !important;
      pointer-events: none !important;
    }
  `;
  if (!document.getElementById('hide-header-dawn-ai')) {
    document.head.appendChild(style);
  }
}

function boot() {
  if (window.__interactiveEnhancementsReady) return;
  window.__interactiveEnhancementsReady = true;

  hideHeaderDawnAi();
  setTimeout(hideHeaderDawnAi, 400);
  setTimeout(hideHeaderDawnAi, 1200);

  const floatingDawn = new FloatingDawnWidget({
    onOpenFull: () => {
      floatingDawn.open();
    }
  });
  window.__floatingDawn = floatingDawn;

  window.addEventListener('portfolio:open-dawn', (event) => {
    const question = event.detail?.question;
    floatingDawn.open();
    if (question) floatingDawn.ask(question);
  });

  const runMagnetic = () => {
    initMagneticCards('.project-destination, .reading-tools button, .live-preview-tab, .skill-grid article');
  };
  setTimeout(runMagnetic, 800);
  setTimeout(runMagnetic, 2000);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => setTimeout(boot, 300));
} else {
  setTimeout(boot, 300);
}
