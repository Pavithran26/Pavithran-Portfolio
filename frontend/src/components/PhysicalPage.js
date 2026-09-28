import * as THREE from 'three';

// The semantic HTML remains the reading surface. Only a moving sheet is WebGL.
export class PhysicalPage {
  constructor(volume, paper) {
    this.volume = volume; this.paper = paper;
    try {
      this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    } catch { this.available = false; return; }
    this.available = true;
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.domElement.className = 'physical-page-canvas';
    this.renderer.domElement.setAttribute('aria-hidden', 'true');
    volume.append(this.renderer.domElement);
    this.scene = new THREE.Scene();
    this.scene.add(new THREE.AmbientLight(0xffffff, 2));
    const light = new THREE.DirectionalLight(0xffefd5, 2.4);
    light.position.set(-300, 600, 900); this.scene.add(light);
    this.geometry = new THREE.PlaneGeometry(1, 1, 64, 12);
    this.original = this.geometry.attributes.position.array.slice();
    this.front = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .95, side: THREE.FrontSide });
    this.back = new THREE.MeshStandardMaterial({ color: 0xe8ddc3, roughness: 1, side: THREE.BackSide });
    this.sheet = new THREE.Mesh(this.geometry, this.front);
    this.reverse = new THREE.Mesh(this.geometry, this.back);
    this.scene.add(this.sheet, this.reverse);
    this.resize(); this.hide();
  }
  resize() {
    if (!this.available) return;
    const w = this.volume.clientWidth, h = this.volume.clientHeight;
    this.width = this.paper.clientWidth; this.height = h;
    this.renderer.setSize(w, h, false);
    this.camera = new THREE.OrthographicCamera(0, w, h / 2, -h / 2, .1, 5000);
    this.camera.position.z = 2000;
    this.hinge = w - this.width;
    this.key = null;
  }
  capture(node) {
    const canvas = document.createElement('canvas');
    const scale = Math.min(devicePixelRatio, 1.5);
    canvas.width = this.width * scale; canvas.height = this.height * scale;
    const ctx = canvas.getContext('2d'); ctx.scale(scale, scale);
    ctx.fillStyle = '#f5efe2'; ctx.fillRect(0, 0, this.width, this.height);
    const box = node.getBoundingClientRect();
    node.querySelectorAll('img').forEach(img => {
      if (!img.complete || !img.naturalWidth) return;
      const r = img.getBoundingClientRect();
      try { ctx.drawImage(img, r.left - box.left, r.top - box.top, r.width, r.height); } catch {}
    });
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
    const range = document.createRange();
    while (walker.nextNode()) {
      const text = walker.currentNode, style = getComputedStyle(text.parentElement);
      if (style.visibility === 'hidden' || style.display === 'none' || text.parentElement.closest('.visually-hidden')) continue;
      ctx.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      ctx.fillStyle = style.color; ctx.textBaseline = 'top';
      for (const match of text.textContent.matchAll(/\S+/g)) {
        range.setStart(text, match.index); range.setEnd(text, match.index + match[0].length);
        const r = range.getBoundingClientRect();
        if (r.bottom > box.top && r.top < box.bottom && r.width) ctx.fillText(match[0], r.left - box.left, r.top - box.top);
      }
    }
    this.texture?.dispose();
    this.texture = new THREE.CanvasTexture(canvas); this.texture.colorSpace = THREE.SRGBColorSpace;
    this.front.map = this.texture; this.front.needsUpdate = true;
  }
  turn(progress, node) {
    if (!this.available) return false;
    if (this.key !== node) { this.capture(node); this.key = node; }
    const positions = this.geometry.attributes.position;
    const bend = Math.sin(progress * Math.PI);
    const points = [];
    let x = 0, z = 0;
    for (let j = 0; j <= 64; j++) {
      const u = j / 64;
      const angle = Math.PI * progress + bend * Math.sin(u * Math.PI) * .85;
      if (j) { x += Math.cos(angle) * this.width / 64; z += Math.sin(angle) * this.width / 64; }
      points.push([x, z]);
    }
    for (let i = 0; i < positions.count; i++) {
      const u = this.original[i * 3] + .5;
      const [px, pz] = points[Math.round(u * 64)];
      const oy = this.original[i * 3 + 1];
      positions.setXYZ(i, this.hinge + px, oy * this.height + bend * u * u * 18, pz + 2);
    }
    positions.needsUpdate = true; this.geometry.computeVertexNormals();
    this.renderer.domElement.style.display = 'block';
    this.renderer.render(this.scene, this.camera);
    return true;
  }
  hide() { if (this.available) { this.renderer.domElement.style.display = 'none'; this.key = null; } }
  dispose() { if (!this.available) return; this.texture?.dispose(); this.geometry.dispose(); this.front.dispose(); this.back.dispose(); this.renderer.dispose(); this.renderer.domElement.remove(); }
}
