/**
 * LibraryPOVScene.js
 * 3D Grand Library First-Person POV Environment & Shelf-to-Desk Cinematic Engine.
 * Built with Three.js (WebGL) + GSAP.
 */

import * as THREE from 'three';
import gsap from 'gsap';
import { libraryAudio } from './LibraryAudio.js';

export class LibraryPOVScene {
  constructor(options = {}) {
    this.container = options.container || document.body;
    this.onStateChange = options.onStateChange || (() => {});
    this.onOpenTerminal = options.onOpenTerminal || (() => {});
    this.onOpenDawn = options.onOpenDawn || (() => {});

    this.state = 'shelf'; // 'shelf' | 'animating' | 'desk'
    this.lampMode = 0; // 0: Warm Study, 1: Dark Academia, 2: Daylight
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();

    this.initScene();
    this.buildRoom();
    this.buildBookshelf();
    this.buildHeroBook();
    this.buildStudyDesk();
    this.buildBankersLamp();
    this.buildDustParticles();
    this.buildInteractiveDeskElements();

    this.bindEvents();
    this.animate = this.animate.bind(this);
    this.rafId = requestAnimationFrame(this.animate);
  }

  initScene() {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'library-pov-canvas';
    this.canvas.id = 'library-canvas';
    this.canvas.setAttribute('aria-hidden', 'true');
    this.container.prepend(this.canvas);

    const w = window.innerWidth;
    const h = window.innerHeight;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x080605);
    this.scene.fog = new THREE.FogExp2(0x0c0907, 0.12);

    this.camera = new THREE.PerspectiveCamera(48, w / h, 0.1, 50);
    // Shelf POV initial camera position (First person eye-level)
    this.camera.position.set(0, 1.58, 2.75);
    this.cameraTarget = new THREE.Vector3(0, 1.52, 0);
    this.camera.lookAt(this.cameraTarget);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;

    // Atmospheric Library Lights
    this.ambientLight = new THREE.AmbientLight(0x4a3627, 0.9);
    this.scene.add(this.ambientLight);

    // Warm chandelier / high library ceiling light
    this.ceilingLight = new THREE.PointLight(0xffdfaa, 1.2, 12, 1.5);
    this.ceilingLight.position.set(0, 3.8, 1.2);
    this.scene.add(this.ceilingLight);

    // Soft shelf spotlight to highlight the book spines
    this.shelfLight = new THREE.SpotLight(0xffecc2, 2.2, 8, Math.PI / 4, 0.5, 1.2);
    this.shelfLight.position.set(0, 2.6, 2.2);
    this.shelfLight.target.position.set(0, 1.5, 0);
    this.scene.add(this.shelfLight);
    this.scene.add(this.shelfLight.target);
  }

  /* --- TEXTURE GENERATION UTILITIES (100% Self-Contained) --- */
  createWoodTexture(colorHex = '#2b170e', grainHex = '#1a0d08') {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = colorHex;
    ctx.fillRect(0, 0, 512, 512);

    // Fine wood grain fibers
    ctx.fillStyle = grainHex;
    for (let i = 0; i < 700; i++) {
      ctx.globalAlpha = 0.04 + Math.random() * 0.08;
      const y = Math.random() * 512;
      const h = 1 + Math.random() * 3;
      ctx.fillRect(0, y, 512, h);
    }

    ctx.globalAlpha = 1.0;
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  createLeatherTexture(baseColor = '#131b26') {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, 256, 256);

    // Pebbled leather bump/noise
    ctx.fillStyle = '#000000';
    for (let i = 0; i < 1800; i++) {
      ctx.globalAlpha = 0.05 + Math.random() * 0.06;
      ctx.beginPath();
      ctx.arc(Math.random() * 256, Math.random() * 256, Math.random() * 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  createHeroSpineTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Deep midnight clothbound leather base
    const grad = ctx.createLinearGradient(0, 0, 256, 0);
    grad.addColorStop(0, '#0a101d');
    grad.addColorStop(0.2, '#121d30');
    grad.addColorStop(0.5, '#192843');
    grad.addColorStop(0.8, '#121d30');
    grad.addColorStop(1, '#0a101d');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 1024);

    // Gold foil decorative borders
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 6;
    ctx.strokeRect(16, 24, 224, 976);
    ctx.lineWidth = 2;
    ctx.strokeRect(24, 32, 208, 960);

    // Spine head/tail decorative rib bands
    for (const y of [90, 110, 890, 910]) {
      ctx.fillStyle = '#e8c85a';
      ctx.fillRect(16, y, 224, 6);
    }

    // Gilded Embossed Typography
    ctx.save();
    ctx.translate(128, 512);
    ctx.rotate(Math.PI / 2); // vertical spine title

    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffd700';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 6;

    ctx.font = 'bold 36px "Cinzel", "Cormorant Garamond", Georgia, serif';
    ctx.letterSpacing = '6px';
    ctx.fillText('PAVITHRAN S.', 0, -20);

    ctx.font = '22px "Cinzel", "Cormorant Garamond", Georgia, serif';
    ctx.fillStyle = '#e6c35c';
    ctx.fillText('✦   ✦   ✦', 0, 16);

    ctx.font = '500 21px "Outfit", sans-serif';
    ctx.fillStyle = '#edd187';
    ctx.letterSpacing = '4px';
    ctx.fillText('FORWARD DEPLOYMENT ENGINEER', 0, 50);

    ctx.restore();

    // Volume mark at the bottom
    ctx.font = 'bold 22px "Cinzel", Georgia, serif';
    ctx.fillStyle = '#ffd700';
    ctx.textAlign = 'center';
    ctx.fillText('VOL. 01', 128, 850);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  buildRoom() {
    this.roomGroup = new THREE.Group();

    // Polished Hardwood Parquet Floor
    const floorGeo = new THREE.PlaneGeometry(16, 16);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x1f130b,
      roughness: 0.38,
      metalness: 0.1,
      map: this.createWoodTexture('#24130a', '#140a04')
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.roomGroup.add(floor);

    // Back Library Wall
    const wallGeo = new THREE.PlaneGeometry(16, 10);
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x120e0b,
      roughness: 0.85
    });
    const backWall = new THREE.Mesh(wallGeo, wallMat);
    backWall.position.set(0, 5, -0.6);
    this.roomGroup.add(backWall);

    this.scene.add(this.roomGroup);
  }

  buildBookshelf() {
    this.shelfGroup = new THREE.Group();
    const woodMat = new THREE.MeshStandardMaterial({
      color: 0x24140b,
      roughness: 0.45,
      metalness: 0.08,
      map: this.createWoodTexture('#26150c', '#150904')
    });

    // Bookshelf Dimensions
    const shelfWidth = 4.2;
    const shelfHeight = 3.6;
    const shelfDepth = 0.46;

    // Upright vertical panels
    const uprightGeo = new THREE.BoxGeometry(0.12, shelfHeight, shelfDepth);
    const leftUpright = new THREE.Mesh(uprightGeo, woodMat);
    leftUpright.position.set(-shelfWidth / 2, shelfHeight / 2, 0);
    leftUpright.castShadow = true;
    leftUpright.receiveShadow = true;

    const rightUpright = leftUpright.clone();
    rightUpright.position.x = shelfWidth / 2;

    const centerUpright = leftUpright.clone();
    centerUpright.position.x = 0;

    this.shelfGroup.add(leftUpright, rightUpright, centerUpright);

    // Horizontal shelves (5 rows)
    const rowY = [0.4, 0.95, 1.5, 2.1, 2.7, 3.3];
    this.shelfHeights = rowY;
    const boardGeo = new THREE.BoxGeometry(shelfWidth, 0.08, shelfDepth);

    rowY.forEach(y => {
      const board = new THREE.Mesh(boardGeo, woodMat);
      board.position.set(0, y, 0);
      board.castShadow = true;
      board.receiveShadow = true;
      this.shelfGroup.add(board);
    });

    // Populate shelves with varied library books
    this.populateBooksOnShelves();

    this.shelfGroup.position.set(0, 0, 0);
    this.scene.add(this.shelfGroup);
  }

  populateBooksOnShelves() {
    const bookColors = [
      0x57181f, // Vintage Crimson
      0x132338, // Navy Leather
      0x1b3624, // Forest Green
      0x382213, // Saddle Brown
      0x271e1b, // Charcoal Leather
      0x503b1e, // Ochre Antiquarian
      0x1d2938  // Deep Slate
    ];

    const bookMaterials = bookColors.map(c => new THREE.MeshStandardMaterial({
      color: c,
      roughness: 0.65,
      metalness: 0.12
    }));

    // Generate books on lower, middle, and upper shelves
    const shelvesToFill = [0.4, 0.95, 1.5, 2.1, 2.7];

    shelvesToFill.forEach((shelfY, sIndex) => {
      // Left bay (-2.0 to -0.1) & Right bay (0.1 to 2.0)
      const bays = [
        { start: -2.0, end: -0.1 },
        { start: 0.1, end: 2.0 }
      ];

      bays.forEach((bay) => {
        let currentX = bay.start + 0.05;
        while (currentX < bay.end - 0.08) {
          // If center shelf (y = 1.5), leave a dedicated space for the Hero Book!
          if (shelfY === 1.5 && Math.abs(currentX) < 0.22) {
            currentX += 0.44;
            continue;
          }

          const thickness = 0.035 + Math.random() * 0.045;
          const height = 0.32 + Math.random() * 0.16;
          const depth = 0.28 + Math.random() * 0.08;

          const bookGeo = new THREE.BoxGeometry(thickness, height, depth);
          const mat = bookMaterials[Math.floor(Math.random() * bookMaterials.length)];
          const bookMesh = new THREE.Mesh(bookGeo, mat);

          const bookY = shelfY + 0.04 + height / 2;
          const bookZ = -0.02 + (Math.random() - 0.5) * 0.04;

          bookMesh.position.set(currentX + thickness / 2, bookY, bookZ);
          bookMesh.castShadow = true;
          bookMesh.receiveShadow = true;

          // Occasionally lean a book slightly for natural realism
          if (Math.random() < 0.14) {
            bookMesh.rotation.z = (Math.random() - 0.5) * 0.14;
          }

          this.shelfGroup.add(bookMesh);
          currentX += thickness + 0.006;
        }
      });
    });
  }

  buildHeroBook() {
    this.heroBookGroup = new THREE.Group();

    // Hero Book Dimensions (Substantial clothbound portfolio volume)
    const width = 0.26;
    const height = 0.42;
    const thickness = 0.075;

    // Materials
    const spineTexture = this.createHeroSpineTexture();
    const coverLeather = this.createLeatherTexture('#121e33');

    const spineMat = new THREE.MeshStandardMaterial({
      map: spineTexture,
      roughness: 0.38,
      metalness: 0.25
    });

    const coverMat = new THREE.MeshStandardMaterial({
      map: coverLeather,
      roughness: 0.5,
      metalness: 0.15
    });

    const pagesMat = new THREE.MeshStandardMaterial({
      color: 0xf4ecd8, // Antique parchment edge
      roughness: 0.9,
      metalness: 0.02
    });

    // Multi-material cube: Right face is the spine that faces the camera when on the shelf!
    // Materials order: [px, nx, py, ny, pz, nz]
    // Width = thickness (X), Height = height (Y), Depth = width (Z)
    const bookGeo = new THREE.BoxGeometry(thickness, height, width);
    const materials = [
      coverMat,    // +X: Back cover
      coverMat,    // -X: Front cover
      pagesMat,    // +Y: Top gilded edges
      pagesMat,    // -Y: Bottom edges
      spineMat,    // +Z: Spine facing the viewer!
      pagesMat     // -Z: Fore-edge pages
    ];

    this.heroBookMesh = new THREE.Mesh(bookGeo, materials);
    this.heroBookMesh.castShadow = true;
    this.heroBookMesh.receiveShadow = true;
    this.heroBookGroup.add(this.heroBookMesh);

    // Gold silk ribbon bookmark peeking from bottom
    const ribbonGeo = new THREE.PlaneGeometry(0.022, 0.12);
    const ribbonMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.3,
      side: THREE.DoubleSide
    });
    const ribbon = new THREE.Mesh(ribbonGeo, ribbonMat);
    ribbon.position.set(0, -height / 2 - 0.04, 0.02);
    ribbon.rotation.x = 0.15;
    this.heroBookGroup.add(ribbon);

    // Initial shelf position (Eye level, center shelf)
    this.shelfBookPosition = new THREE.Vector3(0, 1.5 + 0.04 + height / 2, 0.04);
    this.shelfBookRotation = new THREE.Euler(0, 0, 0);

    this.heroBookGroup.position.copy(this.shelfBookPosition);
    this.heroBookGroup.rotation.copy(this.shelfBookRotation);

    // Store custom metadata for raycasting interaction
    this.heroBookMesh.userData = { isHeroBook: true };

    this.scene.add(this.heroBookGroup);
  }

  buildStudyDesk() {
    this.deskGroup = new THREE.Group();

    const deskMat = new THREE.MeshStandardMaterial({
      color: 0x1f1108,
      roughness: 0.28,
      metalness: 0.12,
      map: this.createWoodTexture('#26140a', '#120703')
    });

    // Heavy Mahogany Study Desk Top
    const topGeo = new THREE.BoxGeometry(2.4, 0.1, 1.25);
    const deskTop = new THREE.Mesh(topGeo, deskMat);
    deskTop.position.set(0, 0.72, 1.15);
    deskTop.castShadow = true;
    deskTop.receiveShadow = true;
    this.deskGroup.add(deskTop);

    // Dark Leather Blotter Writing Pad
    const blotterGeo = new THREE.BoxGeometry(1.4, 0.012, 0.85);
    const blotterMat = new THREE.MeshStandardMaterial({
      color: 0x13110f,
      roughness: 0.7,
      metalness: 0.05,
      map: this.createLeatherTexture('#141210')
    });
    this.blotter = new THREE.Mesh(blotterGeo, blotterMat);
    this.blotter.position.set(0, 0.776, 1.15);
    this.blotter.receiveShadow = true;
    this.deskGroup.add(this.blotter);

    // Gold brass corner trims on the leather blotter
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xcca645,
      roughness: 0.25,
      metalness: 0.88
    });
    const cornerGeo = new THREE.BoxGeometry(0.08, 0.016, 0.08);
    [[-0.66, 0.38], [0.66, 0.38], [-0.66, -0.38], [0.66, -0.38]].forEach(([cx, cz]) => {
      const corner = new THREE.Mesh(cornerGeo, brassMat);
      corner.position.set(cx, 0.78, 1.15 + cz);
      this.deskGroup.add(corner);
    });

    // Desk Legs
    const legGeo = new THREE.CylinderGeometry(0.06, 0.045, 0.72, 16);
    [[-1.1, 0.6], [1.1, 0.6], [-1.1, 1.7], [1.1, 1.7]].forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(legGeo, deskMat);
      leg.position.set(lx, 0.36, lz);
      leg.castShadow = true;
      this.deskGroup.add(leg);
    });

    this.scene.add(this.deskGroup);

    // Target position for the book on the study desk blotter
    this.deskBookPosition = new THREE.Vector3(0, 0.81, 1.15);
    // On the desk, the book lies flat horizontally:
    this.deskBookRotation = new THREE.Euler(Math.PI / 2, 0, 0);
  }

  buildBankersLamp() {
    this.lampGroup = new THREE.Group();

    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.22,
      metalness: 0.85
    });

    // Heavy round base
    const baseGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.035, 32);
    const base = new THREE.Mesh(baseGeo, brassMat);
    base.position.set(0.68, 0.79, 0.88);
    base.castShadow = true;
    this.lampGroup.add(base);

    // Curved neck
    const stemGeo = new THREE.CylinderGeometry(0.016, 0.016, 0.34, 16);
    const stem = new THREE.Mesh(stemGeo, brassMat);
    stem.position.set(0.68, 0.96, 0.88);
    stem.castShadow = true;
    this.lampGroup.add(stem);

    // Horizontal shade holder
    const holderGeo = new THREE.BoxGeometry(0.03, 0.02, 0.24);
    const holder = new THREE.Mesh(holderGeo, brassMat);
    holder.position.set(0.68, 1.13, 0.88);
    this.lampGroup.add(holder);

    // Emerald Green Glass Cased Shade
    const shadeGeo = new THREE.CylinderGeometry(0.07, 0.11, 0.24, 32, 1, false, 0, Math.PI);
    const shadeMat = new THREE.MeshPhysicalMaterial({
      color: 0x074d2f,
      roughness: 0.15,
      metalness: 0.05,
      transmission: 0.62,
      thickness: 0.08,
      transparent: true,
      opacity: 0.94
    });
    this.shade = new THREE.Mesh(shadeGeo, shadeMat);
    this.shade.rotation.x = Math.PI / 2;
    this.shade.rotation.z = Math.PI / 2;
    this.shade.position.set(0.68, 1.12, 0.88);
    this.shade.castShadow = true;
    this.shade.userData = { isLamp: true };
    this.lampGroup.add(this.shade);

    // Warm reading bulb inside shade
    this.lampBulbLight = new THREE.PointLight(0xffeaad, 2.4, 5, 1.8);
    this.lampBulbLight.position.set(0.68, 1.1, 0.88);
    this.lampGroup.add(this.lampBulbLight);

    // Focused downward desk spotlight casting soft book shadows
    this.lampSpot = new THREE.SpotLight(0xfff1cc, 3.2, 3.5, Math.PI / 3, 0.45, 1.4);
    this.lampSpot.position.set(0.68, 1.1, 0.88);
    this.lampSpot.target.position.set(0, 0.78, 1.15);
    this.lampSpot.castShadow = true;
    this.lampSpot.shadow.bias = -0.0001;
    this.lampSpot.shadow.mapSize.set(1024, 1024);
    this.lampGroup.add(this.lampSpot);
    this.lampGroup.add(this.lampSpot.target);

    // Pull-chain switch with tiny brass bead
    const chainGeo = new THREE.CylinderGeometry(0.003, 0.003, 0.12, 8);
    const chain = new THREE.Mesh(chainGeo, brassMat);
    chain.position.set(0.65, 1.02, 0.96);
    this.lampGroup.add(chain);

    const beadGeo = new THREE.SphereGeometry(0.012, 12, 12);
    const bead = new THREE.Mesh(beadGeo, brassMat);
    bead.position.set(0.65, 0.96, 0.96);
    bead.userData = { isLamp: true };
    this.lampGroup.add(bead);

    this.scene.add(this.lampGroup);
  }

  buildInteractiveDeskElements() {
    this.deskPropsGroup = new THREE.Group();

    // 1. Engraved Brass Dev Terminal Card on Desk Corner
    const plateGeo = new THREE.BoxGeometry(0.18, 0.008, 0.08);
    const plateCanvas = document.createElement('canvas');
    plateCanvas.width = 256;
    plateCanvas.height = 128;
    const pctx = plateCanvas.getContext('2d');
    pctx.fillStyle = '#b38d38';
    pctx.fillRect(0, 0, 256, 128);
    pctx.strokeStyle = '#614612';
    pctx.lineWidth = 6;
    pctx.strokeRect(6, 6, 244, 116);
    pctx.fillStyle = '#2b1b04';
    pctx.font = 'bold 24px monospace';
    pctx.textAlign = 'center';
    pctx.fillText('>_ TERMINAL', 128, 56);
    pctx.font = '18px monospace';
    pctx.fillText('PRESS [ ` ]', 128, 92);

    const plateTex = new THREE.CanvasTexture(plateCanvas);
    plateTex.colorSpace = THREE.SRGBColorSpace;
    const plateMat = new THREE.MeshStandardMaterial({
      map: plateTex,
      metalness: 0.8,
      roughness: 0.3
    });
    this.terminalPlate = new THREE.Mesh(plateGeo, plateMat);
    this.terminalPlate.position.set(-0.64, 0.78, 0.86);
    this.terminalPlate.userData = { isTerminal: true };
    this.deskPropsGroup.add(this.terminalPlate);

    // 2. Silk DAWN AI Ribbon Bookmark on Desk
    const dawnCanvas = document.createElement('canvas');
    dawnCanvas.width = 256;
    dawnCanvas.height = 64;
    const dctx = dawnCanvas.getContext('2d');
    dctx.fillStyle = '#8b263e'; // Burgundy silk
    dctx.fillRect(0, 0, 256, 64);
    dctx.fillStyle = '#ffd700';
    dctx.font = 'bold 24px "Cinzel", Georgia, serif';
    dctx.textAlign = 'center';
    dctx.fillText('✦ DAWN AI ✦', 128, 42);

    const dawnTex = new THREE.CanvasTexture(dawnCanvas);
    dawnTex.colorSpace = THREE.SRGBColorSpace;
    const dawnMat = new THREE.MeshStandardMaterial({
      map: dawnTex,
      roughness: 0.4,
      metalness: 0.2
    });
    const ribbonGeo = new THREE.PlaneGeometry(0.18, 0.045);
    this.dawnRibbon = new THREE.Mesh(ribbonGeo, dawnMat);
    this.dawnRibbon.rotation.x = -Math.PI / 2;
    this.dawnRibbon.position.set(-0.64, 0.78, 1.02);
    this.dawnRibbon.userData = { isDawn: true };
    this.deskPropsGroup.add(this.dawnRibbon);

    this.scene.add(this.deskPropsGroup);
  }

  buildDustParticles() {
    const particleCount = 280;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      // Golden motes drifting around the library desk & light cone
      positions[i] = (Math.random() - 0.5) * 3.2;
      positions[i + 1] = 0.7 + Math.random() * 2.2;
      positions[i + 2] = 0.5 + Math.random() * 2.2;

      speeds[i] = (Math.random() - 0.5) * 0.002;
      speeds[i + 1] = 0.001 + Math.random() * 0.0025;
      speeds[i + 2] = (Math.random() - 0.5) * 0.002;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.particleSpeeds = speeds;

    // Soft glowing circle texture for dust motes
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 32;
    pCanvas.height = 32;
    const pctx = pCanvas.getContext('2d');
    const grad = pctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255, 235, 175, 1)');
    grad.addColorStop(0.4, 'rgba(255, 210, 120, 0.5)');
    grad.addColorStop(1, 'rgba(255, 200, 100, 0)');
    pctx.fillStyle = grad;
    pctx.fillRect(0, 0, 32, 32);

    const pTex = new THREE.CanvasTexture(pCanvas);

    const pMat = new THREE.PointsMaterial({
      size: 0.024,
      map: pTex,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.dustParticles = new THREE.Points(geometry, pMat);
    this.scene.add(this.dustParticles);
  }

  /* --- POV CINEMATIC TRANSITIONS --- */

  /**
   * Pulls the book from the shelf and brings it down to the study desk in POV.
   */
  pullBookToDesk(onComplete = null) {
    if (this.state !== 'shelf') return;
    this.state = 'animating';
    libraryAudio.playBookPull();

    // Timeline for coordinated first-person sequence
    const tl = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      onComplete: () => {
        this.state = 'desk';
        libraryAudio.playBookLand();
        this.onStateChange('desk');
        if (onComplete) onComplete();
      }
    });

    // Step 1: Slide book forward out of the shelf
    tl.to(this.heroBookGroup.position, {
      z: 0.48,
      duration: 0.6,
      ease: 'power1.out'
    });

    // Step 2: Camera pans/tilts down toward the mahogany desk as the book glides to the desk
    tl.to(this.camera.position, {
      x: 0,
      y: 1.88,
      z: 1.82,
      duration: 1.4
    }, '-=0.3');

    tl.to(this.cameraTarget, {
      x: 0,
      y: 0.78,
      z: 0.75,
      duration: 1.4,
      onUpdate: () => this.camera.lookAt(this.cameraTarget)
    }, '<');

    // Step 3: Rotate book horizontal and land squarely on the leather blotter
    tl.to(this.heroBookGroup.rotation, {
      x: Math.PI / 2,
      y: 0,
      z: 0,
      duration: 1.1
    }, '-=1.1');

    tl.to(this.heroBookGroup.position, {
      x: 0,
      y: 0.81,
      z: 1.15,
      duration: 1.1,
      ease: 'power2.out'
    }, '<');
  }

  /**
   * Returns the book from the desk back onto the bookshelf.
   */
  returnBookToShelf(onComplete = null) {
    if (this.state !== 'desk') return;
    this.state = 'animating';
    libraryAudio.playBookPull();

    const tl = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      onComplete: () => {
        this.state = 'shelf';
        this.onStateChange('shelf');
        if (onComplete) onComplete();
      }
    });

    // Lift and rotate
    tl.to(this.heroBookGroup.position, {
      y: 1.4,
      z: 0.5,
      duration: 0.8
    });

    tl.to(this.heroBookGroup.rotation, {
      x: 0,
      y: 0,
      z: 0,
      duration: 0.8
    }, '<');

    // Camera elevates to eye level looking back at shelf
    tl.to(this.camera.position, {
      x: 0,
      y: 1.58,
      z: 2.75,
      duration: 1.2
    }, '-=0.4');

    tl.to(this.cameraTarget, {
      x: 0,
      y: 1.52,
      z: 0,
      duration: 1.2,
      onUpdate: () => this.camera.lookAt(this.cameraTarget)
    }, '<');

    // Slide book back into its slot on the shelf
    tl.to(this.heroBookGroup.position, {
      x: this.shelfBookPosition.x,
      y: this.shelfBookPosition.y,
      z: this.shelfBookPosition.z,
      duration: 0.6,
      ease: 'power2.out'
    }, '-=0.4');
  }

  toggleBankersLamp() {
    libraryAudio.playLampClick();
    this.lampMode = (this.lampMode + 1) % 3;

    if (this.lampMode === 0) {
      // Warm Study Glow (Default)
      this.lampBulbLight.color.setHex(0xffeaad);
      this.lampBulbLight.intensity = 2.4;
      this.lampSpot.color.setHex(0xfff1cc);
      this.lampSpot.intensity = 3.2;
      this.ambientLight.intensity = 0.9;
    } else if (this.lampMode === 1) {
      // Dark Academia (Moody Candlelight)
      this.lampBulbLight.color.setHex(0xff9944);
      this.lampBulbLight.intensity = 1.6;
      this.lampSpot.color.setHex(0xffaa55);
      this.lampSpot.intensity = 2.2;
      this.ambientLight.intensity = 0.45;
    } else {
      // Clear Daylight Reading
      this.lampBulbLight.color.setHex(0xffffff);
      this.lampBulbLight.intensity = 1.8;
      this.lampSpot.color.setHex(0xffffff);
      this.lampSpot.intensity = 2.6;
      this.ambientLight.intensity = 1.2;
    }
  }

  bindEvents() {
    this.onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    };
    window.addEventListener('resize', this.onResize);

    // Subtle first-person head turning (Mouse Parallax)
    this.onPointerMove = (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      this.mouse.targetX = nx * 0.08;
      this.mouse.targetY = ny * 0.05;

      this.pointer.x = nx;
      this.pointer.y = ny;
    };
    window.addEventListener('pointermove', this.onPointerMove);

    // Interactive Raycasting (Clicking 3D Objects in the Library)
    this.onPointerDown = (e) => {
      // Only process clicks on canvas or primary elements
      this.raycaster.setFromCamera(this.pointer, this.camera);
      const hits = this.raycaster.intersectObjects(this.scene.children, true);

      if (hits.length > 0) {
        for (const hit of hits) {
          const ud = hit.object.userData;
          if (ud.isHeroBook && this.state === 'shelf') {
            this.pullBookToDesk();
            return;
          }
          if (ud.isLamp) {
            this.toggleBankersLamp();
            return;
          }
          if (ud.isTerminal) {
            this.onOpenTerminal();
            return;
          }
          if (ud.isDawn) {
            this.onOpenDawn();
            return;
          }
        }
      }
    };
    this.canvas.addEventListener('pointerdown', this.onPointerDown);
  }

  animate() {
    this.rafId = requestAnimationFrame(this.animate);

    // Smooth head-turning lerp
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    if (this.state === 'shelf') {
      this.camera.position.x = this.mouse.x;
      this.camera.position.y = 1.58 + this.mouse.y;
      this.camera.lookAt(this.cameraTarget.x, this.cameraTarget.y, this.cameraTarget.z);
    } else if (this.state === 'desk') {
      this.camera.position.x = this.mouse.x * 0.6;
      this.camera.lookAt(this.cameraTarget.x, this.cameraTarget.y, this.cameraTarget.z);
    }

    // Gentle dust particle swirl
    if (this.dustParticles) {
      const pos = this.dustParticles.geometry.attributes.position.array;
      for (let i = 0; i < pos.length; i += 3) {
        pos[i + 1] += this.particleSpeeds[i + 1];
        pos[i] += Math.sin(Date.now() * 0.001 + i) * 0.0006;

        if (pos[i + 1] > 2.9) {
          pos[i + 1] = 0.72;
        }
      }
      this.dustParticles.geometry.attributes.position.needsUpdate = true;
    }

    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('pointermove', this.onPointerMove);
    this.canvas.removeEventListener('pointerdown', this.onPointerDown);
    this.renderer.dispose();
    this.canvas.remove();
  }
}
