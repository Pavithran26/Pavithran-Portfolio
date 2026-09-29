import * as THREE from 'three';

// The semantic HTML remains the reading surface. Only a moving sheet is WebGL.
export class PhysicalPage {
  constructor(volume, paper) {
    this.volume = volume; this.paper = paper;
    try {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('webgl2', {alpha:true,antialias:true});
      if (!context) { this.available = false; return; }
      this.renderer = new THREE.WebGLRenderer({ canvas, context, alpha: true, antialias: true, powerPreference: 'low-power' });
    } catch { this.available = false; return; }
    this.available = true;
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.domElement.className = 'physical-page-canvas';
    this.renderer.domElement.setAttribute('aria-hidden', 'true');
    volume.append(this.renderer.domElement);
    this.scene = new THREE.Scene();
    this.scene.add(new THREE.AmbientLight(0xffffff, 1.6));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    const light = new THREE.DirectionalLight(0xffefd5, 2.4);
    light.position.set(-450, 700, 1500);
    light.castShadow = true; light.shadow.mapSize.set(1024,1024);
    Object.assign(light.shadow.camera,{left:-1600,right:1600,top:1400,bottom:-1400,near:1,far:5000});
    light.shadow.bias = -.0002; light.shadow.normalBias = 2;
    this.scene.add(light);
    this.shadow = new THREE.Mesh(new THREE.PlaneGeometry(1,1), new THREE.ShadowMaterial({opacity:.09}));
    this.shadow.receiveShadow = true; this.scene.add(this.shadow);
    this.geometry = new THREE.PlaneGeometry(1, 1, 64, 12);
    this.original = this.geometry.attributes.position.array.slice();
    this.front = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.FrontSide });
    this.back = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.BackSide });
    this.sheet = new THREE.Mesh(this.geometry, this.front);
    this.reverse = new THREE.Mesh(this.geometry, this.back);
    this.sheet.castShadow = true; this.reverse.castShadow = true;
    this.scene.add(this.sheet, this.reverse);
    this.resize(); this.hide();
  }
  resize() {
    if (!this.available) return;
    const w = this.volume.clientWidth, h = this.volume.clientHeight;
    this.width = w / 2; this.height = h;
    this.renderer.setSize(w, h, false);
    this.camera = new THREE.OrthographicCamera(0, w, h / 2, -h / 2, .1, 5000);
    this.camera.position.z = 2000;
    this.hinge = w / 2;
    this.shadow.position.set(w/2,0,-2); this.shadow.scale.set(w,h,1);
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
      if ('letterSpacing' in ctx) ctx.letterSpacing = style.letterSpacing === 'normal' ? '0px' : style.letterSpacing;
      for (const match of text.textContent.matchAll(/\S+/g)) {
        range.setStart(text, match.index); range.setEnd(text, match.index + match[0].length);
        const r = range.getBoundingClientRect();
        if (r.bottom > box.top && r.top < box.bottom && r.width) ctx.fillText(style.textTransform === 'uppercase' ? match[0].toUpperCase() : match[0], r.left - box.left, r.top - box.top);
      }
    }
    const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }
  turn(progress, node, backNode) {
    if (!this.available) return false;
    if (this.key !== node) {
      this.texture?.dispose(); this.backTexture?.dispose();
      this.texture = this.capture(node); this.front.map = this.texture; this.front.needsUpdate = true;
      if (backNode) {
        this.backTexture = this.capture(backNode);
        this.backTexture.wrapS = THREE.RepeatWrapping;
        this.backTexture.repeat.x = -1; this.backTexture.offset.x = 1;
        this.back.map = this.backTexture; this.back.color.set(0xffffff); this.back.needsUpdate = true;
      }
      this.key = node;
    }
    const positions = this.geometry.attributes.position;
    const bend = Math.sin(progress * Math.PI);
    const points = [];
    let x = 0, z = 0;
    for (let j = 0; j <= 64; j++) {
      const u = j / 64;
      const angle = Math.PI * progress + bend * Math.sin(u * Math.PI) * .55;
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
  dispose() { if (!this.available) return; this.texture?.dispose(); this.backTexture?.dispose(); this.shadow.geometry.dispose(); this.shadow.material.dispose(); this.geometry.dispose(); this.front.dispose(); this.back.dispose(); this.renderer.dispose(); this.renderer.domElement.remove(); }
}
