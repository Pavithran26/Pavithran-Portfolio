/**
 * main.js
 * Application entry point for Pavithran S.'s Cyberpunk Workstation Portfolio.
 * Inspired by Jesse's Ramen (jesse-zhou.com).
 * Renders a 100% full-screen 3D Cyberpunk Command Workstation with in-station
 * holographic drawers, zero external page scrolling, and camera dolly zoom physics.
 */
import { CyberStationScene } from './components/CyberStationScene.js';
import { RAGService } from './services/ragService.js';
import { initClaraEyeTracking } from './components/ClaraWidget.js';
import { GsapInteractions } from './utils/GsapInteractions.js';
import confetti from 'canvas-confetti';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Pavithran's Cyberpunk Workstation (100% Fullscreen 3D Universe)
  const cyberStation = new CyberStationScene('cyber-station-root');

  // 2. Initialize Animated DAWN AI Eye Tracking
  initClaraEyeTracking();

  // 3. Meet DAWN AI Quick Action Button
  const fabRagBtn = document.getElementById('fab-rag-btn');
  if (fabRagBtn) {
    fabRagBtn.addEventListener('click', () => {
      cyberStation.openPanel('dawn');
    });
  }

  // 4. Global Keyboard Shortcuts: Backtick (`) launches In-Station Terminal
  window.addEventListener('keydown', (e) => {
    if (e.key === '`' && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
      e.preventDefault();
      cyberStation.openPanel('terminal');
    }
  });

  // 5. Initialize GSAP Kinetic Micro-Physics & Magnetic Elements
  GsapInteractions.init();

  // 6. Subtle celebratory welcome burst
  setTimeout(() => {
    try {
      confetti({
        particleCount: 40,
        spread: 70,
        origin: { y: 0.88 },
        colors: ['#0ae448', '#00bae2', '#10b981', '#38bdf8', '#fffce1']
      });
    } catch (e) {
      // Ignore
    }
  }, 700);

  // 7. Check FastAPI backend health & log status
  RAGService.checkHealth().then(status => {
    if (status) {
      console.log('⚡ FastAPI RAG Backend Online & Ready:', status);
    } else {
      console.log('ℹ️ DAWN AI running in offline client mode.');
    }
  }).catch(() => {
    console.log('ℹ️ DAWN AI running in offline client mode.');
  });
});
