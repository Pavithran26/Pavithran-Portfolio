/**
 * InteractiveInit.js — self-booting floating DAWN + magnetic cards.
 * Loaded after main.js; does not require main.js changes.
 */
import { FloatingDawnWidget } from './FloatingDawnWidget.js';
import { initMagneticCards } from './MagneticCards.js';

function openFullDawn(question) {
  // Prefer existing dialog system via click / custom event consumers
  const btn = document.querySelector('[data-dialog="dawn"], #dawn-eye, .dawn-shiny-button');
  if (btn && !question) {
    btn.click();
    return;
  }
  window.dispatchEvent(new CustomEvent('portfolio:open-dawn', { detail: { question: question || null } }));
}

function boot() {
  if (window.__interactiveEnhancementsReady) return;
  window.__interactiveEnhancementsReady = true;

  const floatingDawn = new FloatingDawnWidget({
    onOpenFull: () => openFullDawn()
  });
  window.__floatingDawn = floatingDawn;

  window.addEventListener('portfolio:open-dawn', (event) => {
    const question = event.detail?.question;
    if (question) {
      floatingDawn.open();
      floatingDawn.ask(question);
    } else {
      openFullDawn();
    }
  });

  const runMagnetic = () => {
    initMagneticCards('.project-destination, .reading-tools button, .live-preview-tab, .skill-grid article');
  };
  // Project cards render after main.js builds DOM
  setTimeout(runMagnetic, 800);
  setTimeout(runMagnetic, 2000);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => setTimeout(boot, 300));
} else {
  setTimeout(boot, 300);
}
