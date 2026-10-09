import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourcePath = path.resolve(__dirname, '../src/shaders/neuform-isolated/sources/performance-gauges.html');
const outPath = path.resolve(__dirname, '../public/landing-pages/speedometer.html');

const source = fs.readFileSync(sourcePath, 'utf8');

// Isolate `#gauge-speedometer` centered and full-bleed
const styleInjection = `
<style>
  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: transparent !important;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  body > div:not(.grid) {
    display: none !important;
  }
  .grid {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 100% !important;
    height: 100% !important;
    max-width: none !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  .grid > *:not(#gauge-speedometer) {
    display: none !important;
  }
  #gauge-speedometer {
    position: relative !important;
    margin: auto !important;
    width: min(88vw, 88vh, 440px) !important;
    height: min(88vw, 88vh, 440px) !important;
    max-width: none !important;
    aspect-ratio: 1 / 1 !important;
    opacity: 1 !important;
    transform: none !important;
    filter: none !important;
  }
</style>
<script>
  window.addEventListener('load', () => {
    // Notify parent window when self-test sweep finishes and settles
    setTimeout(() => {
      window.parent.postMessage({ type: 'speedometer-selftest-complete', speed: 118 }, '*');
    }, 3800);
  });
</script>
`;

const isolatedHtml = source.replace('</head>', `${styleInjection}\n</head>`);
fs.writeFileSync(outPath, isolatedHtml);
console.log('✅ Generated public/landing-pages/speedometer.html, size:', fs.statSync(outPath).size);
