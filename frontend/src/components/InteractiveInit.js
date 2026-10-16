/**
 * InteractiveInit.js — bootstraps floating DAWN + magnetic cards + terminal event bridge.
 * Import once from main.js after PortfolioDialogs is constructed.
 */
import { FloatingDawnWidget } from './FloatingDawnWidget.js';
import { initMagneticCards } from './MagneticCards.js';

export function initInteractiveEnhancements(dialogs) {
  const floatingDawn = new FloatingDawnWidget({
    onOpenFull: () => dialogs.openDawn()
  });

  window.addEventListener('portfolio:open-dawn', (event) => {
    const question = event.detail?.question;
    if (question) {
      floatingDawn.open();
      floatingDawn.ask(question);
    } else {
      dialogs.openDawn();
    }
  });

  const bootMagnetic = () => {
    initMagneticCards('.project-destination, .reading-tools button, .live-preview-tab, .skill-grid article');
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(bootMagnetic, 400));
  } else {
    setTimeout(bootMagnetic, 600);
  }

  return { floatingDawn };
}
