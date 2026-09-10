/**
 * ThreeStackViewer.js
 * Hardware-accelerated Three.js WebGL 3D Architecture Visualizer.
 * Renders glowing 3D architectural slabs with volumetric glassmorphism,
 * dynamic explosion physics, raycasting hover tooltips, and interactive selection.
 */
import * as THREE from 'three';
import { TECH_STACK_LAYERS } from '../data/techStackLayers.js';

export class ThreeStackViewer {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.onLayerSelect = options.onLayerSelect || null;
    this.explosion = options.initialExplosion !== undefined ? options.initialExplosion : 0.35;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.stackGroup = null;
    this.slabs = [];
    this.particles = null;
    this.beam = null;

    // Interaction state
    this.isDragging = false;
    this.prevMouse = { x: 0, y: 0 };
    this.targetRotationX = 0.25;
    this.targetRotationY = -0.55;
    this.currentRotationX = 0.25;
    this.currentRotationY = -0.55;
    this.isAutoSpinning = false;
    this.hoveredLayer = null;

    // Raycaster
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(-999, -999);

    // Floating Tooltip
    this.tooltip = document.getElementById('three-tooltip');

    if (this.container) {
      this.init();
    }
  }

  init() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || 640;

    // 1. Scene
    this.scene = new THREE.Scene();

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    this.camera.position.set(0, 1.2, 9.5);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    this.scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x10b981, 2.8);
    dirLight1.position.set(5, 10, 7);
    this.scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x00ff88, 2.0);
    dirLight2.position.set(-5, -5, -4);
    this.scene.add(dirLight2);

    // 5. Stack Group
    this.stackGroup = new THREE.Group();
    this.stackGroup.rotation.x = this.currentRotationX;
    this.stackGroup.rotation.y = this.currentRotationY;
    this.scene.add(this.stackGroup);

    // 6. Build 3D Architectural Slabs
    this.buildSlabs();

    // 7. Holographic Energy Beam
    this.buildConnectionBeam();

    // 8. Ambient Particle Constellation
    this.buildParticleCloud();

    // 9. Attach Event Listeners
    this.attachEvents();

    // 10. Start Animation Loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  buildSlabs() {
    const slabGeometry = new THREE.BoxGeometry(4.4, 0.28, 2.6);
    const edgeGeometry = new THREE.EdgesGeometry(slabGeometry);

    TECH_STACK_LAYERS.forEach((layer, index) => {
      // Body Material
      const material = new THREE.MeshPhysicalMaterial({
        color: layer.colorHex,
        emissive: layer.colorHex,
        emissiveIntensity: 0.18,
        roughness: 0.2,
        metalness: 0.15,
        transmission: 0.6,
        transparent: true,
        opacity: 0.85,
        reflectivity: 0.7
      });

      const slabMesh = new THREE.Mesh(slabGeometry, material);
      slabMesh.userData = { layer, index };

      // Glowing Wireframe Edges
      const edgeMaterial = new THREE.LineBasicMaterial({
        color: layer.colorHex,
        transparent: true,
        opacity: 0.85
      });
      const edgeLines = new THREE.LineSegments(edgeGeometry, edgeMaterial);
      slabMesh.add(edgeLines);

      // Core Glowing Node
      const coreGeo = new THREE.SphereGeometry(0.12, 16, 16);
      const coreMat = new THREE.MeshBasicMaterial({
        color: layer.colorHex
      });
      const coreNode = new THREE.Mesh(coreGeo, coreMat);
      coreNode.position.set(0, 0, 0);
      slabMesh.add(coreNode);

      this.stackGroup.add(slabMesh);
      this.slabs.push(slabMesh);
    });

    this.updateSlabPositions();
  }

  buildConnectionBeam() {
    const beamGeo = new THREE.CylinderGeometry(0.04, 0.04, 8, 16);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.45
    });
    this.beam = new THREE.Mesh(beamGeo, beamMat);
    this.stackGroup.add(this.beam);

    // Glowing data packets flowing along the architectural backbone
    this.dataPackets = [];
    const packetGeo = new THREE.SphereGeometry(0.08, 12, 12);
    const colors = [0x10b981, 0x00ff88, 0x34d399, 0x059669, 0x6ee7b7, 0xa7f3d0];
    for (let i = 0; i < 6; i++) {
      const pMat = new THREE.MeshBasicMaterial({
        color: colors[i % colors.length],
        transparent: true,
        opacity: 0.85
      });
      const packet = new THREE.Mesh(packetGeo, pMat);
      packet.userData = {
        progress: i / 6,
        speed: 0.006 + Math.random() * 0.005,
        direction: i % 2 === 0 ? 1 : -1
      };
      this.stackGroup.add(packet);
      this.dataPackets.push(packet);
    }
  }

  buildParticleCloud() {
    const particleCount = 180;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 16;
      positions[i + 1] = (Math.random() - 0.5) * 12;
      positions[i + 2] = (Math.random() - 0.5) * 12;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color: 0x34d399,
      size: 0.05,
      transparent: true,
      opacity: 0.55
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  updateSlabPositions() {
    const count = this.slabs.length;
    const center = (count - 1) / 2;
    const baseSpacing = 0.55;
    const extraSpacing = 1.35;
    const spacing = baseSpacing + this.explosion * extraSpacing;

    this.slabs.forEach((slab, index) => {
      const offset = center - index;
      const targetY = offset * spacing;
      slab.position.y = targetY;
    });

    if (this.beam) {
      const totalSpan = (count - 1) * spacing;
      this.beam.scale.set(1, totalSpan / 8, 1);
      this.beam.material.opacity = 0.15 + this.explosion * 0.4;
    }
  }

  setExplosion(val) {
    this.explosion = Math.max(0, Math.min(1, val));
    this.updateSlabPositions();
  }

  toggleAutoSpin() {
    this.isAutoSpinning = !this.isAutoSpinning;
    return this.isAutoSpinning;
  }

  resetCamera() {
    this.targetRotationX = 0.25;
    this.targetRotationY = -0.55;
    this.setExplosion(0.35);
  }

  attachEvents() {
    const el = this.renderer.domElement;

    // Drag Rotate
    el.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.prevMouse = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mousemove', (e) => {
      // Raycasting coordinates
      const rect = el.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (this.isDragging) {
        const deltaX = e.clientX - this.prevMouse.x;
        const deltaY = e.clientY - this.prevMouse.y;
        this.targetRotationY += deltaX * 0.007;
        this.targetRotationX += deltaY * 0.007;
        this.prevMouse = { x: e.clientX, y: e.clientY };
      }

      this.checkIntersection(e.clientX, e.clientY);
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    // Touch events for mobile
    el.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (this.isDragging && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - this.prevMouse.x;
        const deltaY = e.touches[0].clientY - this.prevMouse.y;
        this.targetRotationY += deltaX * 0.007;
        this.targetRotationX += deltaY * 0.007;
        this.prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      this.isDragging = false;
    });

    // Mouse wheel explosion zoom
    el.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY * 0.001;
      this.setExplosion(this.explosion + delta);

      window.dispatchEvent(new CustomEvent('stack-explosion-change', {
        detail: { factor: this.explosion }
      }));
    }, { passive: false });

    // Click selection
    el.addEventListener('click', () => {
      if (this.hoveredLayer && this.onLayerSelect) {
        this.onLayerSelect(this.hoveredLayer);
      }
    });

    // Window Resize
    window.addEventListener('resize', () => {
      if (!this.container || !this.renderer || !this.camera) return;
      const w = this.container.clientWidth;
      const h = this.container.clientHeight || 640;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    });
  }

  checkIntersection(clientX, clientY) {
    if (!this.camera || !this.slabs) return;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.slabs);

    if (intersects.length > 0) {
      const hitMesh = intersects[0].object;
      const layer = hitMesh.userData.layer;
      this.hoveredLayer = layer;

      // Cursor
      this.renderer.domElement.style.cursor = 'pointer';

      // Highlight hit mesh
      this.slabs.forEach(mesh => {
        if (mesh === hitMesh) {
          mesh.material.emissiveIntensity = 0.6;
          mesh.scale.set(1.05, 1.15, 1.05);
        } else {
          mesh.material.emissiveIntensity = 0.18;
          mesh.scale.set(1, 1, 1);
        }
      });

      // Update Tooltip
      if (this.tooltip && clientX !== undefined && clientY !== undefined) {
        this.tooltip.innerHTML = `
          <div class="three-tooltip-title">${layer.title}</div>
          <div class="three-tooltip-badge">${layer.badge} • Click to Inspect</div>
        `;
        this.tooltip.style.left = `${clientX}px`;
        this.tooltip.style.top = `${clientY}px`;
        this.tooltip.classList.add('visible');
      }
    } else {
      this.hoveredLayer = null;
      this.renderer.domElement.style.cursor = this.isDragging ? 'grabbing' : 'grab';

      this.slabs.forEach(mesh => {
        mesh.material.emissiveIntensity = 0.18;
        mesh.scale.set(1, 1, 1);
      });

      if (this.tooltip) {
        this.tooltip.classList.remove('visible');
      }
    }
  }

  animate() {
    requestAnimationFrame(this.animate);

    // Damping rotation
    if (this.isAutoSpinning) {
      this.targetRotationY += 0.004;
    }

    this.currentRotationX += (this.targetRotationX - this.currentRotationX) * 0.08;
    this.currentRotationY += (this.targetRotationY - this.currentRotationY) * 0.08;

    if (this.stackGroup) {
      this.stackGroup.rotation.x = this.currentRotationX;
      this.stackGroup.rotation.y = this.currentRotationY;
    }

    // Slowly rotate particle field
    if (this.particles) {
      this.particles.rotation.y += 0.0008;
    }

    // Animate data flow packets moving along the central stack
    if (this.dataPackets && this.slabs.length > 1) {
      const topY = this.slabs[0].position.y;
      const bottomY = this.slabs[this.slabs.length - 1].position.y;
      const span = topY - bottomY;

      this.dataPackets.forEach(p => {
        p.userData.progress += p.userData.speed;
        if (p.userData.progress > 1) p.userData.progress = 0;
        
        const normY = p.userData.direction === 1 ? p.userData.progress : (1 - p.userData.progress);
        p.position.y = bottomY + normY * span;
        p.position.x = Math.sin(p.userData.progress * Math.PI * 4) * 0.06;
        p.position.z = Math.cos(p.userData.progress * Math.PI * 4) * 0.06;
      });
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  dispose() {
    if (this.renderer && this.renderer.domElement) {
      this.renderer.domElement.remove();
      this.renderer.dispose();
    }
  }
}
