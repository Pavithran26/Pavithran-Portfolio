/**
 * ClaraWidget.js
 * Implements the "MEET CLARA AI Assistant" pill button and interactive 3D robot eye.
 * Features:
 * - Lifelike cursor-following eye tracking with smooth dampening
 * - Fluid aurora shifting gradient background (magenta -> purple -> cyan)
 * - Pulsing cyan live status indicator
 * - Ambient neon glow and hover tooltip
 * - Idle eye wander animation
 */

export function getClaraPillHtml(extraClass = '', id = 'fab-rag-btn') {
  return `
    <button id="${id}" class="clara-ai-pill-btn ${extraClass}" aria-label="Meet DAWN AI Assistant" type="button">
      <div class="clara-eye-wrapper">
        <div class="clara-eye-sclera">
          <div class="clara-eye-iris">
            <div class="clara-eye-pupil"></div>
            <div class="clara-eye-glint"></div>
          </div>
        </div>
      </div>
      <div class="clara-text-group">
        <span class="clara-eyebrow">MEET DAWN</span>
        <span class="clara-title">AI Assistant</span>
      </div>
      <div class="clara-status-pulse" title="Online & Ready">
        <span class="clara-status-dot"></span>
      </div>
      <div class="clara-tooltip">DAWN AI Assistant</div>
    </button>
  `;
}

export function getClaraEyeAvatarHtml(size = 46) {
  return `
    <div class="clara-eye-avatar-wrapper" style="width: ${size}px; height: ${size}px;">
      <div class="clara-eye-sclera">
        <div class="clara-eye-iris">
          <div class="clara-eye-pupil"></div>
          <div class="clara-eye-glint"></div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Initializes cursor tracking and idle wander for all Clara eye elements on the page.
 */
export function initClaraEyeTracking() {
  const irises = document.querySelectorAll('.clara-eye-iris');
  if (!irises.length) return;

  let idleTimer = null;
  let isIdle = false;
  let idleAnimationId = null;

  // Max displacement radius in pixels for the iris inside the sclera
  const MAX_RADIUS = 7;

  function updateEyes(targetX, targetY) {
    irises.forEach(iris => {
      const rect = iris.parentElement.getBoundingClientRect();
      const eyeCenterX = rect.left + rect.width / 2;
      const eyeCenterY = rect.top + rect.height / 2;

      const dx = targetX - eyeCenterX;
      const dy = targetY - eyeCenterY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist === 0) {
        iris.style.transform = 'translate(0px, 0px)';
        return;
      }

      // Constrain displacement within max radius
      const factor = Math.min(MAX_RADIUS, dist * 0.05);
      const moveX = (dx / dist) * factor;
      const moveY = (dy / dist) * factor;

      iris.style.transform = `translate(${moveX.toFixed(1)}px, ${moveY.toFixed(1)}px)`;
    });
  }

  // Window mousemove handler
  function onMouseMove(e) {
    isIdle = false;
    if (idleAnimationId) {
      cancelAnimationFrame(idleAnimationId);
      idleAnimationId = null;
    }

    updateEyes(e.clientX, e.clientY);

    // Reset idle timer
    clearTimeout(idleTimer);
    idleTimer = setTimeout(startIdleWander, 2500);
  }

  // Idle wandering behavior when user is not moving mouse
  const idleWaypoints = [
    { x: -4, y: 1 },
    { x: -5, y: -3 },
    { x: 0, y: -4 },
    { x: 4, y: -2 },
    { x: 5, y: 2 },
    { x: 1, y: 3 },
    { x: 0, y: 0 }
  ];
  let waypointIdx = 0;

  function startIdleWander() {
    isIdle = true;
    let lastTime = performance.now();

    function step(now) {
      if (!isIdle) return;

      if (now - lastTime > 1800) {
        lastTime = now;
        waypointIdx = (waypointIdx + 1) % idleWaypoints.length;
        const target = idleWaypoints[waypointIdx];
        
        irises.forEach(iris => {
          iris.style.transform = `translate(${target.x}px, ${target.y}px)`;
        });
      }

      idleAnimationId = requestAnimationFrame(step);
    }

    idleAnimationId = requestAnimationFrame(step);
  }

  window.addEventListener('mousemove', onMouseMove, { passive: true });
  idleTimer = setTimeout(startIdleWander, 2500);
}
