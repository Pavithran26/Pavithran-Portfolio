import * as THREE from 'three';

/** A software-layer diagram, progressively enhanced with WebGL and scroll. */
export class SystemStackScene {
  constructor(container, { motion = true, onSelect } = {}) {
    this.container = container;
    this.motion = motion;
    this.onSelect = onSelect;
    this.progress = 0;
    this.active = 0;
    this.visible = false;
    this.disposed = false;
    this.frame = null;
    this.pointer = new THREE.Vector2();
    this.listeners = new AbortController();
  }

  init() {
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    this.renderer.setClearColor(0x090a0b, 0);
    this.renderer.domElement.setAttribute('aria-hidden', 'true');
    this.container.appendChild(this.renderer.domElement);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50);
    this.camera.position.set(7.4, 6.3, 9.8);
    this.camera.lookAt(0, 0, 0);
    this.scene.add(new THREE.AmbientLight(0xdde3ec, 2.5));
    const key = new THREE.DirectionalLight(0xffffff, 4.5);
    key.position.set(3, 6, 4); this.scene.add(key);
    const rim = new THREE.DirectionalLight(0x9cb0c8, 3);
    rim.position.set(-4, 2, -2); this.scene.add(rim);
    this.group = new THREE.Group();
    this.scene.add(this.group);
    this.slabs = [];
    const geometry = new THREE.BoxGeometry(4.2, 0.22, 3.0);
    const edges = new THREE.EdgesGeometry(geometry);
    for (let index = 0; index < 6; index++) {
      const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: 0x9099a5, roughness: 0.32, metalness: 0.48 }));
      mesh.userData.index = index;
      const outline = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xdde1e5, transparent: true, opacity: 0.48 }));
      mesh.add(outline);
      const bar = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.036, 0.025), new THREE.MeshBasicMaterial({ color: 0x626971 }));
      bar.position.set(0, 0, 1.51); mesh.add(bar);
      this.group.add(mesh); this.slabs.push(mesh);
    }
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const signal = this.listeners.signal;
    this.container.addEventListener('pointermove', event => {
      if (event.pointerType !== 'mouse') return;
      const rect = this.container.getBoundingClientRect();
      this.pointer.set((event.clientX - rect.left) / rect.width - 0.5, (event.clientY - rect.top) / rect.height - 0.5);
      this.requestRender();
    }, { signal });
    this.container.addEventListener('pointerleave', () => { this.pointer.set(0, 0); this.requestRender(); }, { signal });
    this.container.addEventListener('click', event => {
      const rect = this.container.getBoundingClientRect();
      pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
      raycaster.setFromCamera(pointer, this.camera);
      const hit = raycaster.intersectObjects(this.slabs, false)[0];
      if (hit) this.onSelect?.(hit.object.userData.index);
    }, { signal });
    this.renderer.domElement.addEventListener('webglcontextlost', event => {
      event.preventDefault(); this.contextLost = true; this.stop();
      this.container.parentElement.classList.remove('webgl-ready');
    }, { signal });
    this.renderer.domElement.addEventListener('webglcontextrestored', () => {
      this.contextLost = false;
      this.container.parentElement.classList.add('webgl-ready'); this.requestRender();
    }, { signal });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) this.stop(); else this.requestRender();
    }, { signal });
    this.resizeObserver = new ResizeObserver(() => {
      const { width, height } = this.container.getBoundingClientRect();
      if (!width || !height) return;
      this.renderer.setSize(width, height);
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.requestRender();
    });
    this.resizeObserver.observe(this.container);
    this.observer = new IntersectionObserver(entries => {
      this.visible = entries[0].isIntersecting;
      if (this.visible) this.requestRender(); else this.stop();
    });
    this.observer.observe(this.container);
    this.select(0);
  }

  setProgress(value) { this.progress = value; this.requestRender(); }
  setMotion(enabled) { this.motion = enabled; this.requestRender(); }
  select(index) {
    this.active = index;
    this.slabs.forEach((slab, i) => {
      slab.material.color.setHex(i === index ? 0xe3e7eb : 0x747d89);
      slab.children[0].material.color.setHex(i === index ? 0xff644b : 0xdde1e5);
      slab.children[1].material.color.setHex(i === index ? 0xff644b : 0x626971);
    });
    this.requestRender();
  }

  requestRender() {
    if (this.frame !== null || !this.visible || this.disposed || document.hidden || this.contextLost) return;
    this.frame = requestAnimationFrame(() => { this.frame = null; this.render(); });
  }

  render() {
    if (this.disposed || !this.renderer) return;
    const spacing = 0.35 + this.progress * 0.62;
    this.slabs.forEach((slab, index) => {
      slab.position.y = (2.5 - index) * spacing;
      slab.position.x = index === this.active ? 0.22 : 0;
    });
    this.group.rotation.y = -0.38 + (this.motion ? this.progress * 0.68 + this.pointer.x * 0.12 : 0.3);
    this.group.rotation.z = this.motion ? -this.pointer.y * 0.04 : 0;
    this.renderer.render(this.scene, this.camera);
  }

  stop() { if (this.frame !== null) cancelAnimationFrame(this.frame); this.frame = null; }
  dispose() {
    this.disposed = true; this.stop(); this.listeners.abort();
    this.resizeObserver?.disconnect(); this.observer?.disconnect();
    const geometries = new Set(); const materials = new Set();
    this.scene?.traverse(object => {
      if (object.geometry) geometries.add(object.geometry);
      if (object.material) (Array.isArray(object.material) ? object.material : [object.material]).forEach(material => materials.add(material));
    });
    geometries.forEach(geometry => geometry.dispose()); materials.forEach(material => material.dispose());
    this.renderer?.dispose(); this.renderer?.domElement.remove();
  }
}
