// Procedural illustrations: cached planet surfaces and animated cosmic scenery.
// These are artistic scenes, not astronomical simulations.
const TAU = Math.PI * 2;
const palettes = [[174, 74, 43], [193, 151, 112], [47, 97, 192], [206, 167, 101]];
export function createPlanet(index) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 512;
  canvas.className = 'world-art procedural-world';
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;
  const pixels = ctx.createImageData(512, 512);
  const base = palettes[index];
  for (let y = 0; y < 512; y++) for (let x = 0; x < 512; x++) {
    const nx = (x - 256) / 244, ny = (y - 256) / 244;
    const radius = nx * nx + ny * ny;
    if (radius >= 1) continue;
    const z = Math.sqrt(1 - radius), longitude = Math.atan2(nx, z), latitude = Math.asin(ny);
    const noise = Math.sin(longitude * 37 + Math.sin(latitude * 21) * 3) * Math.sin(latitude * 47 + longitude * 13);
    const bands = Math.sin(latitude * (index === 1 ? 42 : 19) + Math.sin(longitude * 9) * .7);
    let surface = index === 0 ? .85 + noise * .19 + Math.sin(longitude * 12 + latitude * 14) * .14 : .88 + bands * .17 + noise * .045;
    if (index === 0 && Math.abs(ny) > .9) surface = 1.65;
    if (index === 1) surface -= Math.exp(-((longitude + .35) ** 2 * 55 + (latitude - .28) ** 2 * 300)) * .35;
    const lighting = Math.max(.035, -.55 * nx - .3 * ny + .65 * z);
    const rim = Math.pow(1 - z, 6) * .2;
    const i = (y * 512 + x) * 4;
    for (let c = 0; c < 3; c++) pixels.data[i + c] = Math.min(255, base[c] * surface * lighting + rim * (c === 2 ? 130 : 70));
    pixels.data[i + 3] = Math.min(255, (1 - radius) * 15000);
  }
  ctx.putImageData(pixels, 0, 0);
  return canvas;
}

export class CosmicScenes {
  constructor() {
    let seed = 2611;
    const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    this.dust = Array.from({ length: 1800 }, () => ({ r: Math.pow(random(), .65), a: random() * TAU, spread: random() - .5, size: .4 + random(), alpha: .1 + random() * .65 }));
    this.map = Array.from({ length: 20 }, (_, i) => ({ x: .2 + random() * .6, y: .14 + i / 26, size: 1 + random() * 2 }));
  }

  draw(ctx, pose, time, width, height, compact, light) {
    const seconds = time / 1000;
    const cx = width * (compact ? .5 : .75), cy = height * (compact ? .7 : .53);
    const radius = Math.min(width * (compact ? .48 : .32), height * .52);
    ctx.save();
    if (pose.galaxy > .001) {
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(-.45 + seconds * .009 + pose.stars * .012);
      ctx.scale(1, .48);
      const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, radius * 1.5);
      glow.addColorStop(0, light ? '#6977aa70' : '#ead4ff70');
      glow.addColorStop(.18, '#8a77d733'); glow.addColorStop(.55, '#455da21c'); glow.addColorStop(1, '#00000000');
      ctx.globalAlpha = pose.galaxy; ctx.fillStyle = glow;
      ctx.fillRect(-radius * 1.5, -radius * 1.5, radius * 3, radius * 3);
      for (const star of this.dust) {
        const angle = star.a % (Math.PI / 2) * .16 + Math.floor(star.a / (Math.PI / 2)) * Math.PI / 2 + star.r * 7 + star.spread * .5;
        const r = star.r * radius * 1.5;
        ctx.globalAlpha = pose.galaxy * star.alpha;
        ctx.fillStyle = light ? '#3d487b' : star.r < .25 ? '#fff0d5' : star.spread > 0 ? '#b6caff' : '#bca0e1';
        ctx.beginPath(); ctx.arc(Math.cos(angle) * r, Math.sin(angle) * r, star.size, 0, TAU); ctx.fill();
      }
      ctx.restore();
    }
    if (pose.orbits > .001) {
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(-.4 + pose.roll * .01);
      for (let i = 0; i < 5; i++) {
        const r = radius * (.3 + i * .17);
        ctx.globalAlpha = pose.orbits * .35; ctx.strokeStyle = light ? '#344a70' : '#8caed0'; ctx.lineWidth = .7;
        ctx.beginPath(); ctx.ellipse(0, 0, r, r * .48, 0, 0, TAU); ctx.stroke();
        const a = seconds * (.08 - i * .008) + i * 1.8 + pose.stars * .15;
        ctx.globalAlpha = pose.orbits; ctx.fillStyle = i % 2 ? '#deb99a' : '#8dcce9';
        ctx.beginPath(); ctx.arc(Math.cos(a) * r, Math.sin(a) * r * .48, 4 + i, 0, TAU); ctx.fill();
      }
      ctx.restore();
    }
    if (pose.starMap > .001) {
      ctx.save(); ctx.translate(cx - radius * .5, cy - radius * .5);
      ctx.rotate(Math.sin(seconds * .06 + pose.stars * .02) * .12);
      ctx.strokeStyle = light ? '#35456b' : '#92aed4'; ctx.lineWidth = .7;
      this.map.forEach((point, i) => {
        const x = point.x * radius, y = point.y * radius * 1.25;
        if (i) { const prior = this.map[i - 1]; ctx.globalAlpha = pose.starMap * .3; ctx.beginPath(); ctx.moveTo(prior.x * radius, prior.y * radius * 1.25); ctx.lineTo(x, y); ctx.stroke(); }
        ctx.globalAlpha = pose.starMap * (.7 + Math.sin(seconds + i) * .2);
        ctx.fillStyle = light ? '#233a65' : '#d3e5ff'; ctx.beginPath(); ctx.arc(x, y, point.size, 0, TAU); ctx.fill();
        if (i % 5 === 0) { ctx.globalAlpha = pose.starMap * .5; ctx.beginPath(); ctx.arc(x, y, 10, 0, TAU); ctx.stroke(); }
      });
      ctx.restore();
    }
    if (pose.blackhole > .001) {
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(-.18);
      const r = radius * .42;
      const halo = ctx.createRadialGradient(0, 0, r * .7, 0, 0, r * 2.8);
      halo.addColorStop(0, '#00000000'); halo.addColorStop(.25, '#ffdbb86a'); halo.addColorStop(.45, '#c46a282d'); halo.addColorStop(1, '#00000000');
      ctx.globalAlpha = pose.blackhole; ctx.fillStyle = halo; ctx.fillRect(-r * 3, -r * 3, r * 6, r * 6);
      for (let i = 0; i < 32; i++) {
        ctx.strokeStyle = i % 3 ? '#df9759' : '#fff1d8'; ctx.globalAlpha = pose.blackhole * (.13 + Math.sin(i * 2 + seconds * .4) * .06);
        ctx.lineWidth = 1.5; ctx.beginPath(); ctx.ellipse(0, 0, r * (1.15 + i * .04), r * (.3 + i * .012), 0, 0, TAU); ctx.stroke();
      }
      ctx.globalAlpha = pose.blackhole; ctx.fillStyle = '#020308'; ctx.beginPath(); ctx.arc(0, 0, r * .8, 0, TAU); ctx.fill();
      ctx.strokeStyle = '#ffe6bd'; ctx.lineWidth = 2; ctx.shadowColor = '#ffad69'; ctx.shadowBlur = 15;
      ctx.beginPath(); ctx.arc(0, 0, r * .83, 0, TAU); ctx.stroke(); ctx.shadowBlur = 0;
      // Foreground accretion stream crosses the event horizon.
      ctx.globalAlpha = pose.blackhole * .85; ctx.lineWidth = 2.4;
      ctx.beginPath(); ctx.ellipse(0, 0, r * 2.35, r * .25, 0, 0, Math.PI); ctx.stroke();
      ctx.restore();
    }
    ctx.restore();
  }
}
