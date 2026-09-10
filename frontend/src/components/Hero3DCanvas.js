/**
 * Hero3DCanvas.js
 * Lightweight interactive Three.js 3D background visualizer for the Hero section.
 * Renders glowing floating wireframe geometric tech polyhedra (icosahedron, torus knot, octahedron)
 * and ambient particle constellation with smooth mouse parallax responsiveness.
 */
import * as THREE from 'three';

export class Hero3DCanvas {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!containerId || !this.container) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.group = null;
    this.shapes = [];
    this.particles = null;

    this.mouseX = 0;
    this.mouseY = 0;
    this.targetX = 0;
    this.targetY = 0;

    this.init();
  }

  init() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || 450;

    // 1. Scene
    this.scene = new THREE.Scene();

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    this.camera.position.z = 12;

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    this.scene.add(ambientLight);

    const pointLightCyan = new THREE.PointLight(0x38bdf8, 4, 30);
    pointLightCyan.position.set(6, 4, 5);
    this.scene.add(pointLightCyan);

    const pointLightPurple = new THREE.PointLight(0xa855f7, 3, 30);
    pointLightPurple.position.set(-6, -4, 5);
    this.scene.add(pointLightPurple);

    // 5. Main Rotating Shape Group
    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.createFloatingGeometries();
    this.createParticleField();
    this.bindEvents();

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  createFloatingGeometries() {
    // Shape 1: Central Glowing Wireframe Torus Knot
    const knotGeom = new THREE.TorusKnotGeometry(1.8, 0.38, 90, 16);
    const knotMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.75,
      roughness: 0.2,
      metalness: 0.8
    });
    const knotMesh = new THREE.Mesh(knotGeom, knotMat);
    knotMesh.position.set(2.8, 0.2, 0);
    this.group.add(knotMesh);
    this.shapes.push({ mesh: knotMesh, rx: 0.006, ry: 0.009, rz: 0.003 });

    // Shape 2: Floating Icosahedron
    const icoGeom = new THREE.IcosahedronGeometry(1.2, 1);
    const icoMat = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      wireframe: true,
      transparent: true,
      opacity: 0.65
    });
    const icoMesh = new THREE.Mesh(icoGeom, icoMat);
    icoMesh.position.set(-3.6, 1.4, -1);
    this.group.add(icoMesh);
    this.shapes.push({ mesh: icoMesh, rx: 0.008, ry: -0.007, rz: 0.004 });

    // Shape 3: Octahedron
    const octGeom = new THREE.OctahedronGeometry(0.9, 0);
    const octMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      wireframe: true,
      transparent: true,
      opacity: 0.6
    });
    const octMesh = new THREE.Mesh(octGeom, octMat);
    octMesh.position.set(-1.8, -2.0, 1);
    this.group.add(octMesh);
    this.shapes.push({ mesh: octMesh, rx: -0.01, ry: 0.012, rz: 0.005 });

    // Inner glowing solid core for Torus
    const coreGeom = new THREE.SphereGeometry(0.65, 24, 24);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.25
    });
    const coreMesh = new THREE.Mesh(coreGeom, coreMat);
    coreMesh.position.copy(knotMesh.position);
    this.group.add(coreMesh);
    this.shapes.push({ mesh: coreMesh, rx: 0.002, ry: 0.002, rz: 0.002 });
  }

  createParticleField() {
    const count = 120;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const c1 = new THREE.Color(0x38bdf8);
    const c2 = new THREE.Color(0xa855f7);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

      const mixed = c1.clone().lerp(c2, Math.random());
      colors[i * 3] = mixed.r;
      colors[i * 3 + 1] = mixed.g;
      colors[i * 3 + 2] = mixed.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.09,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  bindEvents() {
    window.addEventListener('mousemove', (e) => {
      this.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    window.addEventListener('resize', () => {
      if (!this.container || !this.renderer || !this.camera) return;
      const w = this.container.clientWidth;
      const h = this.container.clientHeight || 450;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    });
  }

  animate() {
    requestAnimationFrame(this.animate);

    // Rotate individual 3D shapes
    for (const shape of this.shapes) {
      shape.mesh.rotation.x += shape.rx;
      shape.mesh.rotation.y += shape.ry;
      shape.mesh.rotation.z += shape.rz;
    }

    // Smooth mouse parallax
    this.targetX += (this.mouseX * 0.45 - this.targetX) * 0.05;
    this.targetY += (this.mouseY * 0.3 - this.targetY) * 0.05;

    if (this.group) {
      this.group.rotation.y = this.targetX;
      this.group.rotation.x = -this.targetY;
    }

    if (this.particles) {
      this.particles.rotation.y += 0.001;
      this.particles.rotation.x = this.targetY * 0.5;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
