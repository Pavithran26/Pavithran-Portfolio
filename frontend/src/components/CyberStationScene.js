/**
 * CyberStationScene.js
 * Interactive 3D Cyberpunk Developer Station inspired by Jesse's Ramen (jesse-zhou.com).
 * Features:
 * - 100% Full-screen isometric cyberpunk developer command workstation.
 * - Procedural Three.js hacker desk, curved multi-display matrix CRT canvas,
 *   steaming cup particles, levitating quantum DAWN AI core, blinking server LEDs.
 * - In-Station Holographic Panels: All content (Projects, Skills, Terminal, DAWN AI, Dossier)
 *   opens directly inside the 3D station with smooth GSAP camera dolly zoom, with ZERO external page scrolling.
 */
import * as THREE from 'three';
import gsap from 'gsap';
import { InStationPanels } from './InStationPanels.js';

export class CyberStationScene {
  constructor(containerId = 'cyber-station-root', options = {}) {
    this.container = document.getElementById(containerId);
    this.options = options;
    if (!this.container) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.clock = new THREE.Clock();
    this.animId = null;

    // Camera & Orbit state
    this.mouse = new THREE.Vector2();
    this.targetRotation = { x: 0.18, y: -0.45 };
    this.currentRotation = { x: 0.18, y: -0.45 };
    this.orbitRadius = 12.5;
    this.orbitCenter = new THREE.Vector3(0, 2.2, 0);
    this.cameraLookTarget = new THREE.Vector3(0, 2.2, 0);
    this.isAutoOrbit = true;
    this.isFocused = false;
    this.activeDollyTween = null;
    this.activeLookTween = null;

    // Raycasting & Hotspots
    this.raycaster = new THREE.Raycaster();
    this.hotspots = [];
    this.hoveredHotspot = null;

    // Theme state (White Cyber Lab / Dark Cyber Lab)
    this.theme = localStorage.getItem('portfolio-theme') || 'white';

    // Animated props
    this.ambientLight = null;
    this.keyLight = null;
    this.cyanBacklight = null;
    this.purpleRim = null;
    this.floor = null;
    this.grid = null;
    this.wall = null;
    this.deskTop = null;
    this.leftLeg = null;
    this.rightLeg = null;
    this.serverRack = null;
    this.monitorBezel = null;

    this.screenCanvas = null;
    this.screenContext = null;
    this.screenTexture = null;
    this.matrixLines = [];
    this.steamParticles = null;
    this.dawnCore = null;
    this.dawnRing1 = null;
    this.dawnRing2 = null;
    this.serverLeds = [];
    this.radarSweep = null;

    // Dolly Targets for in-station prop focus
    this.dollyTargets = {
      terminal: {
        pos: new THREE.Vector3(-0.15, 2.7, 1.3),
        lookAt: new THREE.Vector3(-0.15, 2.65, -0.4),
      },
      projects: {
        pos: new THREE.Vector3(-1.3, 2.8, 1.1),
        lookAt: new THREE.Vector3(-1.4, 2.15, 0.4),
      },
      skills: {
        pos: new THREE.Vector3(-2.4, 3.2, 0.9),
        lookAt: new THREE.Vector3(-3.2, 3.0, -1.2),
      },
      dawn: {
        pos: new THREE.Vector3(1.5, 3.3, 1.1),
        lookAt: new THREE.Vector3(1.9, 3.1, -0.1),
      },
      dossier: {
        pos: new THREE.Vector3(0, 2.7, 1.8),
        lookAt: new THREE.Vector3(0, 2.15, 0.2),
      },
    };

    this.inStationPanels = null;

    this.init();
  }

  init() {
    this.setupDOM();
    this.setupThree();
    this.createLighting();
    this.createEnvironment();
    this.createDeskSetup();
    this.createMonitorScreen();
    this.createDawnAICore();
    this.createSteamingCup();
    this.createServerRack();
    this.createHotspotPins();
    this.setupInStationPanels();
    this.applyTheme(this.theme);
    this.bindEvents();
    this.animate();
  }

  setupDOM() {
    this.container.innerHTML = `
      <div class="cyber-station-fullscreen-wrapper" id="cyber-station-wrapper">
        
        <!-- Top Floating Tactical Header & System Selector -->
        <header class="cyber-station-topbar">
          <div class="topbar-branding">
            <span class="cyber-status-pulse"></span>
            <div class="branding-text">
              <span class="branding-title">PAVITHRAN S. // CYBER_STATION</span>
              <span class="branding-sub">SOFTWARE ENGINEER • VALUEMOMENTUM // OWLSURE</span>
            </div>
          </div>

          <!-- Middle Telemetry Badge -->
          <div class="topbar-telemetry">
            <span class="telemetry-badge"><span class="led-dot green"></span> THREE.JS 60_FPS</span>
            <span class="telemetry-badge"><span class="led-dot cyan"></span> ZERO_SCROLL // IN_STATION</span>
            <span class="telemetry-badge"><span class="led-dot green"></span> DAWN AI: RAG VECTOR</span>
          </div>

          <!-- Right Direct In-Station System Jump Pills -->
          <div class="topbar-nav-pills" id="station-nav-pills">
            <button class="station-nav-btn" data-target="terminal" title="Launch Developer Terminal">
              <span>💻</span> Terminal
            </button>
            <button class="station-nav-btn" data-target="projects" title="Inspect Production Deployments">
              <span>🚀</span> Projects
            </button>
            <button class="station-nav-btn" data-target="skills" title="Open Technical Skills Matrix">
              <span>⚡</span> Skills
            </button>
            <button class="station-nav-btn" data-target="dawn" title="Consult DAWN AI Core">
              <span>🤖</span> DAWN AI
            </button>
            <button class="station-nav-btn" data-target="dossier" title="View Career Dossier">
              <span>📜</span> Dossier
            </button>
            <button id="station-theme-toggle" class="cyber-theme-switch is-white" role="switch" aria-checked="true" title="Switch Theme (White / Dark)">
              <span class="theme-icon sun" aria-hidden="true">☀️</span>
              <span class="theme-track">
                <span class="theme-thumb"></span>
              </span>
              <span class="theme-icon moon" aria-hidden="true">🌙</span>
              <span class="theme-mode-text" id="theme-switch-label">WHITE</span>
            </button>
          </div>
        </header>

        <!-- 3D Canvas Viewport Container -->
        <div class="cyber-viewport-fullscreen" id="cyber-canvas-container">
          <!-- Three.js canvas gets appended here -->
          
          <!-- Bottom Floating HUD Island Controls -->
          <div class="cyber-bottom-hud">
            <div class="cyber-hud-controls">
              <button id="btn-cyber-orbit" class="cyber-hud-btn active" title="Toggle Auto Rotation">
                <span>🔄</span> Auto Orbit: ON
              </button>
              <button id="btn-cyber-reset" class="cyber-hud-btn" title="Reset to Station Overview">
                <span>🎯</span> Overview
              </button>
              <button id="btn-cyber-dawn" class="cyber-hud-btn accent" title="Focus DAWN AI Neural Core">
                <span>🤖</span> Focus DAWN AI
              </button>
            </div>

            <div class="cyber-hud-hint">
              <span>✦</span> Drag to orbit 3D station • Click any neon beacon or top system pill to inspect inside station
            </div>
          </div>

          <!-- Hotspot Tooltip overlay -->
          <div id="cyber-hotspot-tooltip" class="cyber-hotspot-tooltip"></div>
        </div>

        <!-- In-Station Panels Mount Point -->
        <div id="station-panels-mount"></div>
      </div>
    `;
  }

  setupThree() {
    const viewport = document.getElementById('cyber-canvas-container');
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0c0b);
    this.scene.fog = new THREE.FogExp2(0x0a0c0b, 0.042);

    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    this.camera.position.set(7, 6, 9);
    this.camera.lookAt(this.cameraLookTarget);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    viewport.appendChild(this.renderer.domElement);
  }

  setupInStationPanels() {
    this.inStationPanels = new InStationPanels('station-panels-mount', {
      onOpen: (panelId) => {
        this.dollyToTarget(panelId);
      },
      onClose: () => {
        this.returnToOrbit();
      },
    });
  }

  createLighting() {
    // Ambient soft fill
    this.ambientLight = new THREE.AmbientLight(0x0e1726, 1.4);
    this.scene.add(this.ambientLight);

    // Neon Lime Green directional keylight
    this.keyLight = new THREE.DirectionalLight(0x0ae448, 2.2);
    this.keyLight.position.set(6, 8, 4);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.width = 1024;
    this.keyLight.shadow.mapSize.height = 1024;
    this.scene.add(this.keyLight);

    // Cyan accent backlight
    this.cyanBacklight = new THREE.PointLight(0x00bae2, 3.5, 14);
    this.cyanBacklight.position.set(-4, 4, -2);
    this.scene.add(this.cyanBacklight);

    // Neon Pink/Purple rim light
    this.purpleRim = new THREE.PointLight(0xf7bdf8, 2.8, 12);
    this.purpleRim.position.set(3, 2, -4);
    this.scene.add(this.purpleRim);
  }

  createEnvironment() {
    // Dark cyber ground with subtle reflection
    const floorGeo = new THREE.PlaneGeometry(32, 32);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x060807,
      roughness: 0.25,
      metalness: 0.85,
    });
    this.floor = new THREE.Mesh(floorGeo, floorMat);
    this.floor.rotation.x = -Math.PI / 2;
    this.floor.receiveShadow = true;
    this.scene.add(this.floor);

    // Tactical Grid runner on floor
    this.grid = new THREE.GridHelper(28, 28, 0x0ae448, 0x18241c);
    this.grid.position.y = 0.01;
    this.scene.add(this.grid);

    // Cyberpunk backdrop wall
    const wallGeo = new THREE.PlaneGeometry(24, 12);
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x0c100e,
      roughness: 0.7,
      metalness: 0.3,
    });
    this.wall = new THREE.Mesh(wallGeo, wallMat);
    this.wall.position.set(0, 5, -5);
    this.scene.add(this.wall);

    // Neon Back Wall Strips
    const stripGeo = new THREE.BoxGeometry(16, 0.08, 0.08);
    const stripMat = new THREE.MeshBasicMaterial({ color: 0x0ae448 });
    const strip = new THREE.Mesh(stripGeo, stripMat);
    strip.position.set(0, 4.5, -4.92);
    this.scene.add(strip);

    const stripGeo2 = new THREE.BoxGeometry(12, 0.06, 0.06);
    const stripMat2 = new THREE.MeshBasicMaterial({ color: 0x00bae2 });
    const strip2 = new THREE.Mesh(stripGeo2, stripMat2);
    strip2.position.set(0, 4.3, -4.92);
    this.scene.add(strip2);

    // USAvionix Tactical Radar Sweep Ring & Beam on floor
    const radarRingGeo = new THREE.RingGeometry(4.8, 4.86, 64);
    const radarRingMat = new THREE.MeshBasicMaterial({
      color: 0x0ae448,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.3,
    });
    const radarRing = new THREE.Mesh(radarRingGeo, radarRingMat);
    radarRing.rotation.x = -Math.PI / 2;
    radarRing.position.set(0, 0.02, 0);
    this.scene.add(radarRing);

    const radarLineGeo = new THREE.PlaneGeometry(0.04, 4.8);
    const radarLineMat = new THREE.MeshBasicMaterial({
      color: 0x00bae2,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75,
    });
    this.radarSweep = new THREE.Mesh(radarLineGeo, radarLineMat);
    this.radarSweep.rotation.x = -Math.PI / 2;
    this.radarSweep.position.set(0, 0.025, 0);
    this.scene.add(this.radarSweep);
  }

  createDeskSetup() {
    const deskGroup = new THREE.Group();

    // Tabletop
    const topGeo = new THREE.BoxGeometry(5.2, 0.16, 2.6);
    const topMat = new THREE.MeshStandardMaterial({
      color: 0x141816,
      roughness: 0.3,
      metalness: 0.8,
    });
    this.deskTop = new THREE.Mesh(topGeo, topMat);
    this.deskTop.position.set(0, 2.1, 0);
    this.deskTop.castShadow = true;
    this.deskTop.receiveShadow = true;
    deskGroup.add(this.deskTop);

    // Neon edge piping on front of desk
    const edgeGeo = new THREE.BoxGeometry(5.24, 0.04, 0.04);
    const edgeMat = new THREE.MeshBasicMaterial({ color: 0x0ae448 });
    const edge = new THREE.Mesh(edgeGeo, edgeMat);
    edge.position.set(0, 2.18, 1.3);
    deskGroup.add(edge);

    // Desk Legs
    const legGeo = new THREE.BoxGeometry(0.12, 2.1, 2.2);
    const legMat = new THREE.MeshStandardMaterial({
      color: 0x0e1210,
      metalness: 0.9,
      roughness: 0.2,
    });

    this.leftLeg = new THREE.Mesh(legGeo, legMat);
    this.leftLeg.position.set(-2.4, 1.05, 0);
    this.leftLeg.castShadow = true;
    deskGroup.add(this.leftLeg);

    this.rightLeg = new THREE.Mesh(legGeo, legMat);
    this.rightLeg.position.set(2.4, 1.05, 0);
    this.rightLeg.castShadow = true;
    deskGroup.add(this.rightLeg);

    // Mechanical Keyboard
    const kbGeo = new THREE.BoxGeometry(1.5, 0.05, 0.6);
    const kbMat = new THREE.MeshStandardMaterial({ color: 0x1f2421, roughness: 0.4 });
    const kb = new THREE.Mesh(kbGeo, kbMat);
    kb.position.set(-0.15, 2.2, 0.6);
    deskGroup.add(kb);

    // RGB Glow beneath keyboard
    const kbGlowGeo = new THREE.PlaneGeometry(1.6, 0.7);
    const kbGlowMat = new THREE.MeshBasicMaterial({ color: 0x0ae448, transparent: true, opacity: 0.4 });
    const kbGlow = new THREE.Mesh(kbGlowGeo, kbGlowMat);
    kbGlow.rotation.x = -Math.PI / 2;
    kbGlow.position.set(-0.15, 2.185, 0.6);
    deskGroup.add(kbGlow);

    // Tactical Dossier ID Badge on desk
    const badgeGeo = new THREE.BoxGeometry(0.6, 0.02, 0.8);
    const badgeMat = new THREE.MeshStandardMaterial({ color: 0x111613, metalness: 0.8 });
    const badge = new THREE.Mesh(badgeGeo, badgeMat);
    badge.position.set(1.0, 2.19, 0.7);
    badge.rotation.y = 0.2;
    deskGroup.add(badge);

    // Holographic Projects Tablet
    const tabletGeo = new THREE.BoxGeometry(0.9, 0.04, 1.3);
    const tabletMat = new THREE.MeshStandardMaterial({ color: 0x0d1210, metalness: 0.9 });
    const tablet = new THREE.Mesh(tabletGeo, tabletMat);
    tablet.position.set(-1.4, 2.2, 0.4);
    tablet.rotation.y = -0.25;
    deskGroup.add(tablet);

    const tabletScreenGeo = new THREE.PlaneGeometry(0.8, 1.15);
    const tabletScreenMat = new THREE.MeshBasicMaterial({ color: 0x00bae2 });
    const tabletScreen = new THREE.Mesh(tabletScreenGeo, tabletScreenMat);
    tabletScreen.rotation.x = -Math.PI / 2;
    tabletScreen.rotation.z = -0.25;
    tabletScreen.position.set(-1.4, 2.225, 0.4);
    deskGroup.add(tabletScreen);

    this.scene.add(deskGroup);
  }

  createMonitorScreen() {
    const monitorGroup = new THREE.Group();

    // Curved Ultrawide Monitor Stand
    const standPoleGeo = new THREE.CylinderGeometry(0.06, 0.08, 0.9, 16);
    const standMat = new THREE.MeshStandardMaterial({ color: 0x222623, metalness: 0.9 });
    const pole = new THREE.Mesh(standPoleGeo, standMat);
    pole.position.set(-0.15, 2.5, -0.4);
    monitorGroup.add(pole);

    const standBaseGeo = new THREE.BoxGeometry(0.7, 0.04, 0.4);
    const base = new THREE.Mesh(standBaseGeo, standMat);
    base.position.set(-0.15, 2.18, -0.4);
    monitorGroup.add(base);

    // Bezel
    const bezelGeo = new THREE.BoxGeometry(2.8, 1.4, 0.1);
    const bezelMat = new THREE.MeshStandardMaterial({ color: 0x0c0f0d, metalness: 0.8 });
    this.monitorBezel = new THREE.Mesh(bezelGeo, bezelMat);
    this.monitorBezel.position.set(-0.15, 3.1, -0.4);
    monitorGroup.add(this.monitorBezel);

    // Create Canvas for Live Matrix Rain Text
    this.screenCanvas = document.createElement('canvas');
    this.screenCanvas.width = 512;
    this.screenCanvas.height = 256;
    this.screenContext = this.screenCanvas.getContext('2d');

    // Setup Matrix columns
    const columns = Math.floor(this.screenCanvas.width / 14);
    for (let i = 0; i < columns; i++) {
      this.matrixLines.push({
        x: i * 14,
        y: Math.random() * this.screenCanvas.height,
        speed: 1.5 + Math.random() * 2.5,
        chars: '01<>{}/*$#@!=+[];',
      });
    }

    this.screenTexture = new THREE.CanvasTexture(this.screenCanvas);
    this.screenTexture.minFilter = THREE.LinearFilter;

    const screenGeo = new THREE.PlaneGeometry(2.7, 1.3);
    const screenMat = new THREE.MeshBasicMaterial({ map: this.screenTexture });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(-0.15, 3.1, -0.34);
    monitorGroup.add(screen);

    this.scene.add(monitorGroup);
  }

  updateScreenCanvas(elapsedTime) {
    if (!this.screenContext || !this.screenCanvas) return;
    const ctx = this.screenContext;
    const w = this.screenCanvas.width;
    const h = this.screenCanvas.height;

    // Fade trail
    ctx.fillStyle = 'rgba(8, 12, 10, 0.25)';
    ctx.fillRect(0, 0, w, h);

    // Header strip on monitor
    ctx.fillStyle = '#0ae448';
    ctx.font = 'bold 13px monospace';
    ctx.fillText('PAVITHRAN_OS // TACTICAL KERNEL v2.4.0', 16, 22);

    ctx.fillStyle = '#00bae2';
    ctx.font = '11px monospace';
    ctx.fillText(`CPU: ${(42 + Math.sin(elapsedTime * 2) * 8).toFixed(1)}% | MEM: 6.4GB / 32GB`, 16, 38);

    // Matrix Rain
    ctx.fillStyle = '#0ae448';
    ctx.font = '12px monospace';

    this.matrixLines.forEach((col) => {
      const char = col.chars[Math.floor(Math.random() * col.chars.length)];
      ctx.fillText(char, col.x, col.y);

      col.y += col.speed;
      if (col.y > h) {
        col.y = 45;
        col.speed = 1.5 + Math.random() * 2.5;
      }
    });

    this.screenTexture.needsUpdate = true;
  }

  createDawnAICore() {
    this.dawnCoreGroup = new THREE.Group();
    this.dawnCoreGroup.position.set(1.9, 3.1, -0.1);

    // Core floating icosahedron
    const coreGeo = new THREE.IcosahedronGeometry(0.35, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x00bae2,
      emissive: 0x007896,
      roughness: 0.2,
      metalness: 0.9,
      wireframe: true,
    });
    this.dawnCore = new THREE.Mesh(coreGeo, coreMat);
    this.dawnCoreGroup.add(this.dawnCore);

    // Inner glowing sphere
    const innerGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const innerMat = new THREE.MeshBasicMaterial({ color: 0x0ae448 });
    const innerSphere = new THREE.Mesh(innerGeo, innerMat);
    this.dawnCoreGroup.add(innerSphere);

    // Orbit ring 1
    const ring1Geo = new THREE.TorusGeometry(0.55, 0.015, 16, 64);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: 0x00bae2 });
    this.dawnRing1 = new THREE.Mesh(ring1Geo, ring1Mat);
    this.dawnCoreGroup.add(this.dawnRing1);

    // Orbit ring 2
    const ring2Geo = new THREE.TorusGeometry(0.72, 0.012, 16, 64);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0xec4899 });
    this.dawnRing2 = new THREE.Mesh(ring2Geo, ring2Mat);
    this.dawnRing2.rotation.x = Math.PI / 3;
    this.dawnCoreGroup.add(this.dawnRing2);

    // Base pedestal
    const baseGeo = new THREE.CylinderGeometry(0.35, 0.45, 0.15, 32);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x181e1a, metalness: 0.8 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.set(1.9, 2.18, -0.1);
    this.scene.add(base);

    this.scene.add(this.dawnCoreGroup);
  }

  createSteamingCup() {
    const cupGroup = new THREE.Group();
    cupGroup.position.set(1.2, 2.18, 0.3);

    // Cup body
    const cupGeo = new THREE.CylinderGeometry(0.12, 0.09, 0.24, 16);
    const cupMat = new THREE.MeshStandardMaterial({ color: 0x1f2622, roughness: 0.3 });
    const cup = new THREE.Mesh(cupGeo, cupMat);
    cup.position.y = 0.12;
    cupGroup.add(cup);

    // Steaming particles
    const pCount = 28;
    const pGeo = new THREE.BufferGeometry();
    const pPositions = new Float32Array(pCount * 3);

    for (let i = 0; i < pCount; i++) {
      pPositions[i * 3 + 0] = (Math.random() - 0.5) * 0.1;
      pPositions[i * 3 + 1] = 0.25 + Math.random() * 0.7;
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.06,
      transparent: true,
      opacity: 0.4,
    });

    this.steamParticles = new THREE.Points(pGeo, pMat);
    cupGroup.add(this.steamParticles);

    this.scene.add(cupGroup);
  }

  createServerRack() {
    const serverGroup = new THREE.Group();
    serverGroup.position.set(-3.2, 0, -1.2);

    // Rack tower
    const rackGeo = new THREE.BoxGeometry(1.0, 4.2, 1.2);
    const rackMat = new THREE.MeshStandardMaterial({
      color: 0x0a0e0c,
      metalness: 0.9,
      roughness: 0.2,
    });
    this.serverRack = new THREE.Mesh(rackGeo, rackMat);
    this.serverRack.position.set(0, 2.1, 0);
    this.serverRack.castShadow = true;
    serverGroup.add(this.serverRack);

    // Blinking Server LEDs
    for (let i = 0; i < 7; i++) {
      const ledGeo = new THREE.SphereGeometry(0.03, 8, 8);
      const isGreen = i % 2 === 0;
      const ledMat = new THREE.MeshBasicMaterial({ color: isGreen ? 0x0ae448 : 0x00bae2 });
      const led = new THREE.Mesh(ledGeo, ledMat);
      led.position.set(0.42, 1.0 + i * 0.4, 0.615);
      serverGroup.add(led);
      this.serverLeds.push({ mesh: led, freq: 1.5 + i * 0.7 });
    }

    this.scene.add(serverGroup);
  }

  createHotspotPins() {
    const hotspotData = [
      {
        id: 'hotspot-terminal',
        panelId: 'terminal',
        label: '💻 Dev Terminal',
        subtitle: 'In-browser CLI Console',
        position: new THREE.Vector3(-0.15, 3.8, -0.4),
      },
      {
        id: 'hotspot-projects',
        panelId: 'projects',
        label: '🚀 Projects Tablet',
        subtitle: 'Enterprise Deployments',
        position: new THREE.Vector3(-1.4, 2.7, 0.4),
      },
      {
        id: 'hotspot-skills',
        panelId: 'skills',
        label: '⚡ Server Rack',
        subtitle: 'Technical Skills Matrix',
        position: new THREE.Vector3(-3.2, 4.4, -1.2),
      },
      {
        id: 'hotspot-dawn',
        panelId: 'dawn',
        label: '🤖 DAWN AI Core',
        subtitle: 'FastAPI + RAG Assistant',
        position: new THREE.Vector3(1.9, 4.0, -0.1),
      },
      {
        id: 'hotspot-dossier',
        panelId: 'dossier',
        label: '📜 Career Dossier',
        subtitle: 'Experience & Credentials',
        position: new THREE.Vector3(1.0, 2.6, 0.7),
      },
    ];

    hotspotData.forEach((data) => {
      const pinGroup = new THREE.Group();
      pinGroup.position.copy(data.position);

      // Glowing core marker sphere
      const sphereGeo = new THREE.SphereGeometry(0.12, 16, 16);
      const sphereMat = new THREE.MeshBasicMaterial({ color: 0x0ae448 });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      pinGroup.add(sphere);

      // Outer pulsing ring
      const ringGeo = new THREE.RingGeometry(0.16, 0.22, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x00bae2,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      pinGroup.add(ring);

      pinGroup.userData = {
        isHotspot: true,
        data: data,
        ring: ring,
        sphere: sphere,
        initialY: data.position.y,
      };

      this.scene.add(pinGroup);
      this.hotspots.push(pinGroup);
    });
  }

  bindEvents() {
    const viewport = document.getElementById('cyber-canvas-container');
    if (!viewport) return;

    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };

    viewport.addEventListener('mousedown', (e) => {
      if (this.isFocused) return; // Prevent orbit drag while focused on an in-station panel
      isDragging = true;
      this.isAutoOrbit = false;
      this.updateOrbitButtonState();
      prevMousePos = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    viewport.addEventListener('mousemove', (e) => {
      const rect = viewport.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging && !this.isFocused) {
        const deltaX = e.clientX - prevMousePos.x;
        const deltaY = e.clientY - prevMousePos.y;
        this.targetRotation.y += deltaX * 0.005;
        this.targetRotation.x = Math.max(-0.15, Math.min(0.55, this.targetRotation.x + deltaY * 0.004));
        prevMousePos = { x: e.clientX, y: e.clientY };
      }

      // Check raycast hover
      this.checkHotspotHover(e);
    });

    viewport.addEventListener('click', (e) => {
      this.checkHotspotClick(e);
    });

    // Resize handler (fullscreen 100vw x 100vh)
    window.addEventListener('resize', () => this.onWindowResize());

    // Topbar Navigation Pills
    const navPills = document.getElementById('station-nav-pills');
    if (navPills) {
      navPills.addEventListener('click', (e) => {
        const btn = e.target.closest('.station-nav-btn');
        if (btn && btn.dataset.target) {
          this.openPanel(btn.dataset.target);
        }
      });
    }

    // Bottom HUD Button binds
    const orbitBtn = document.getElementById('btn-cyber-orbit');
    if (orbitBtn) {
      orbitBtn.addEventListener('click', () => {
        if (this.isFocused) {
          this.returnToOrbit();
        } else {
          this.isAutoOrbit = !this.isAutoOrbit;
          this.updateOrbitButtonState();
        }
      });
    }

    const resetBtn = document.getElementById('btn-cyber-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (this.inStationPanels) this.inStationPanels.close();
        this.returnToOrbit();
      });
    }

    const dawnBtn = document.getElementById('btn-cyber-dawn');
    if (dawnBtn) {
      dawnBtn.addEventListener('click', () => {
        this.openPanel('dawn');
      });
    }

    const themeToggleBtn = document.getElementById('station-theme-toggle');
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        const nextTheme = this.theme === 'white' ? 'dark' : 'white';
        this.applyTheme(nextTheme);
      });
    }
  }

  applyTheme(theme) {
    this.theme = theme;
    const isWhite = theme === 'white';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);

    // Update sliding theme toggle switch in topbar
    const themeSwitch = document.getElementById('station-theme-toggle');
    const themeLabel = document.getElementById('theme-switch-label');
    if (themeSwitch) {
      themeSwitch.setAttribute('aria-checked', isWhite ? 'true' : 'false');
      if (isWhite) {
        themeSwitch.classList.add('is-white');
        themeSwitch.classList.remove('is-dark');
      } else {
        themeSwitch.classList.add('is-dark');
        themeSwitch.classList.remove('is-white');
      }
    }
    if (themeLabel) {
      themeLabel.textContent = isWhite ? 'WHITE' : 'DARK';
    }

    if (!this.scene) return;

    if (isWhite) {
      this.scene.background = new THREE.Color(0xf1f5f9);
      if (this.scene.fog) {
        this.scene.fog.color.set(0xf1f5f9);
        this.scene.fog.density = 0.026;
      }
      if (this.ambientLight) {
        this.ambientLight.color.set(0xffffff);
        this.ambientLight.intensity = 2.4;
      }
      if (this.keyLight) {
        this.keyLight.color.set(0xffffff);
        this.keyLight.intensity = 2.5;
      }
      if (this.cyanBacklight) {
        this.cyanBacklight.color.set(0x0284c7);
        this.cyanBacklight.intensity = 2.4;
      }
      if (this.purpleRim) {
        this.purpleRim.color.set(0x10b981);
        this.purpleRim.intensity = 2.0;
      }
      if (this.floor) {
        this.floor.material.color.set(0xe2e8f0);
        this.floor.material.roughness = 0.15;
        this.floor.material.metalness = 0.4;
      }
      if (this.grid) {
        this.grid.material.color.set(0x10b981);
        this.grid.material.opacity = 0.25;
      }
      if (this.wall) {
        this.wall.material.color.set(0xeef2f6);
        this.wall.material.roughness = 0.5;
      }
      if (this.deskTop) {
        this.deskTop.material.color.set(0xffffff);
        this.deskTop.material.roughness = 0.1;
        this.deskTop.material.metalness = 0.2;
      }
      if (this.leftLeg) this.leftLeg.material.color.set(0xcfd8dc);
      if (this.rightLeg) this.rightLeg.material.color.set(0xcfd8dc);
      if (this.serverRack) {
        this.serverRack.material.color.set(0xffffff);
        this.serverRack.material.roughness = 0.3;
        this.serverRack.material.metalness = 0.5;
      }
      if (this.monitorBezel) {
        this.monitorBezel.material.color.set(0x1e293b);
      }
    } else {
      this.scene.background = new THREE.Color(0x0a0c0b);
      if (this.scene.fog) {
        this.scene.fog.color.set(0x0a0c0b);
        this.scene.fog.density = 0.042;
      }
      if (this.ambientLight) {
        this.ambientLight.color.set(0x0e1726);
        this.ambientLight.intensity = 1.4;
      }
      if (this.keyLight) {
        this.keyLight.color.set(0x0ae448);
        this.keyLight.intensity = 2.2;
      }
      if (this.cyanBacklight) {
        this.cyanBacklight.color.set(0x00bae2);
        this.cyanBacklight.intensity = 3.5;
      }
      if (this.purpleRim) {
        this.purpleRim.color.set(0xf7bdf8);
        this.purpleRim.intensity = 2.8;
      }
      if (this.floor) {
        this.floor.material.color.set(0x060807);
        this.floor.material.roughness = 0.25;
        this.floor.material.metalness = 0.85;
      }
      if (this.grid) {
        this.grid.material.color.set(0x0ae448);
        this.grid.material.opacity = 1.0;
      }
      if (this.wall) {
        this.wall.material.color.set(0x0c100e);
        this.wall.material.roughness = 0.7;
      }
      if (this.deskTop) {
        this.deskTop.material.color.set(0x141816);
        this.deskTop.material.roughness = 0.3;
        this.deskTop.material.metalness = 0.8;
      }
      if (this.leftLeg) this.leftLeg.material.color.set(0x0e1210);
      if (this.rightLeg) this.rightLeg.material.color.set(0x0e1210);
      if (this.serverRack) {
        this.serverRack.material.color.set(0x0a0e0c);
        this.serverRack.material.roughness = 0.2;
        this.serverRack.material.metalness = 0.9;
      }
      if (this.monitorBezel) {
        this.monitorBezel.material.color.set(0x0c0f0d);
      }
    }
  }

  openPanel(panelId) {
    if (this.inStationPanels) {
      this.inStationPanels.open(panelId);
    }
  }

  dollyToTarget(targetId) {
    const target = this.dollyTargets[targetId];
    if (!target) return;

    this.isFocused = true;
    this.isAutoOrbit = false;
    this.updateOrbitButtonState();

    if (this.activeDollyTween) this.activeDollyTween.kill();
    if (this.activeLookTween) this.activeLookTween.kill();

    this.activeDollyTween = gsap.to(this.camera.position, {
      x: target.pos.x,
      y: target.pos.y,
      z: target.pos.z,
      duration: 1.15,
      ease: 'power2.inOut',
    });

    this.activeLookTween = gsap.to(this.cameraLookTarget, {
      x: target.lookAt.x,
      y: target.lookAt.y,
      z: target.lookAt.z,
      duration: 1.15,
      ease: 'power2.inOut',
    });
  }

  returnToOrbit() {
    this.isFocused = false;

    if (this.activeDollyTween) this.activeDollyTween.kill();
    if (this.activeLookTween) this.activeLookTween.kill();

    const radius = this.orbitRadius;
    const targetX = radius * Math.sin(this.currentRotation.y) * Math.cos(this.currentRotation.x);
    const targetY = 2.0 + radius * Math.sin(this.currentRotation.x);
    const targetZ = radius * Math.cos(this.currentRotation.y) * Math.cos(this.currentRotation.x);

    this.activeDollyTween = gsap.to(this.camera.position, {
      x: targetX,
      y: targetY,
      z: targetZ,
      duration: 1.2,
      ease: 'power2.inOut',
    });

    this.activeLookTween = gsap.to(this.cameraLookTarget, {
      x: 0,
      y: 2.2,
      z: 0,
      duration: 1.2,
      ease: 'power2.inOut',
      onComplete: () => {
        this.isAutoOrbit = true;
        this.updateOrbitButtonState();
      },
    });
  }

  updateOrbitButtonState() {
    const orbitBtn = document.getElementById('btn-cyber-orbit');
    if (!orbitBtn) return;
    if (this.isAutoOrbit && !this.isFocused) {
      orbitBtn.classList.add('active');
      orbitBtn.innerHTML = `<span>🔄</span> Auto Orbit: ON`;
    } else {
      orbitBtn.classList.remove('active');
      orbitBtn.innerHTML = `<span>⏸️</span> Auto Orbit: OFF`;
    }
  }

  checkHotspotHover(e) {
    if (this.isFocused) return;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.hotspots, true);
    const tooltip = document.getElementById('cyber-hotspot-tooltip');

    if (intersects.length > 0) {
      let rootHotspot = intersects[0].object;
      while (rootHotspot.parent && !rootHotspot.userData.isHotspot) {
        rootHotspot = rootHotspot.parent;
      }

      if (rootHotspot.userData && rootHotspot.userData.isHotspot) {
        this.hoveredHotspot = rootHotspot;
        document.body.style.cursor = 'pointer';

        if (tooltip) {
          const rect = document.getElementById('cyber-canvas-container').getBoundingClientRect();
          tooltip.style.display = 'block';
          tooltip.style.left = `${e.clientX - rect.left + 15}px`;
          tooltip.style.top = `${e.clientY - rect.top - 20}px`;
          tooltip.innerHTML = `
            <div class="tip-title" style="display: flex; align-items: center; gap: 6px; font-family: var(--font-mono);">
              <span style="color: #0ae448; font-size: 0.72rem; background: rgba(10, 228, 72, 0.15); padding: 1px 5px; border-radius: 3px;">[ SYSTEM_ENGAGE ]</span>
              <span>${rootHotspot.userData.data.label}</span>
            </div>
            <div class="tip-sub">IN_STATION // ${rootHotspot.userData.data.subtitle} • CLICK TO OPEN</div>
          `;
        }
        return;
      }
    }

    this.hoveredHotspot = null;
    document.body.style.cursor = 'default';
    if (tooltip) tooltip.style.display = 'none';
  }

  checkHotspotClick(e) {
    if (this.hoveredHotspot && this.hoveredHotspot.userData.data.panelId) {
      this.openPanel(this.hoveredHotspot.userData.data.panelId);
    }
  }

  onWindowResize() {
    if (!this.renderer || !this.camera) return;
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    this.animId = requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    if (!this.isFocused) {
      // Auto orbit rotation
      if (this.isAutoOrbit) {
        this.targetRotation.y += delta * 0.12;
      }

      // Smooth lerp rotation
      this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * 0.06;
      this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * 0.06;

      // Position camera along orbit sphere
      const radius = this.orbitRadius;
      this.camera.position.x = radius * Math.sin(this.currentRotation.y) * Math.cos(this.currentRotation.x);
      this.camera.position.y = 2.0 + radius * Math.sin(this.currentRotation.x);
      this.camera.position.z = radius * Math.cos(this.currentRotation.y) * Math.cos(this.currentRotation.x);
      this.camera.lookAt(this.orbitCenter);
    } else {
      // While focused on a target, camera looks at cameraLookTarget
      this.camera.lookAt(this.cameraLookTarget);
    }

    // Update Live Matrix Monitor Canvas
    this.updateScreenCanvas(elapsedTime);

    // Rotate Tactical Radar Sweep on floor
    if (this.radarSweep) {
      this.radarSweep.rotation.z += delta * 1.8;
    }

    // Animate DAWN AI Core
    if (this.dawnCore) {
      this.dawnCore.rotation.x += delta * 0.8;
      this.dawnCore.rotation.y += delta * 1.2;
      this.dawnCoreGroup.position.y = 3.1 + Math.sin(elapsedTime * 2.5) * 0.08;
    }
    if (this.dawnRing1) {
      this.dawnRing1.rotation.z += delta * 1.5;
      this.dawnRing1.rotation.x += delta * 0.6;
    }
    if (this.dawnRing2) {
      this.dawnRing2.rotation.y -= delta * 1.8;
    }

    // Animate Coffee Steam
    if (this.steamParticles) {
      const pos = this.steamParticles.geometry.attributes.position.array;
      for (let i = 0; i < pos.length / 3; i++) {
        pos[i * 3 + 1] += delta * 0.35; // rise up
        pos[i * 3 + 0] += Math.sin(elapsedTime * 3 + i) * 0.002; // wobble

        // Reset particle if reached top
        if (pos[i * 3 + 1] > 1.2) {
          pos[i * 3 + 1] = 0.25;
          pos[i * 3 + 0] = (Math.random() - 0.5) * 0.1;
        }
      }
      this.steamParticles.geometry.attributes.position.needsUpdate = true;
    }

    // Blink Server LEDs
    this.serverLeds.forEach((led) => {
      const isOn = Math.sin(elapsedTime * led.freq) > 0.1;
      led.mesh.material.opacity = isOn ? 1.0 : 0.2;
    });

    // Animate Hotspot Pins
    this.hotspots.forEach((pin, idx) => {
      const isHov = this.hoveredHotspot === pin;
      pin.position.y = pin.userData.initialY + Math.sin(elapsedTime * 3 + idx) * 0.08;
      pin.userData.ring.rotation.z += delta * 2;
      pin.userData.ring.scale.setScalar(isHov ? 1.4 : 1.0 + Math.sin(elapsedTime * 4) * 0.15);

      // Face ring toward camera
      pin.quaternion.copy(this.camera.quaternion);
    });

    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    if (this.animId) cancelAnimationFrame(this.animId);
    if (this.renderer && this.renderer.domElement) {
      this.renderer.domElement.remove();
    }
  }
}
