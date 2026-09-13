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
      // Eight planets in order; visual sizes and orbital periods are illustrative.
      const planets = [
        ['#aaa49b', 3.5], ['#e6bd7f', 5.5], ['#5ba3e6', 6], ['#c96d4b', 4.5],
        ['#d6ad87', 13], ['#d9c38a', 10.5], ['#8bd5d9', 8], ['#527fdd', 7.5],
      ];
      const extent = Math.min(width * (compact ? .43 : .215), height * .39);
      const tilt = -.28;
      ctx.save(); ctx.translate(width * (compact ? .5 : .75), cy);
      const bodies = planets.map(([color, size], i) => {
        const r = extent * (.2 + i * .112);
        const angle = seconds * (.23 / (1 + i * .6)) + i * 2.39;
        const x = Math.cos(angle) * r, y = Math.sin(angle) * r * .57;
        ctx.save(); ctx.rotate(tilt);
        ctx.globalAlpha = pose.orbits * .3; ctx.strokeStyle = light ? '#344a70' : '#8caed0'; ctx.lineWidth = .7;
        ctx.beginPath(); ctx.ellipse(0, 0, r, r * .57, 0, 0, TAU); ctx.stroke(); ctx.restore();
        return { color, size: size * (compact ? .72 : 1), i, x: x * Math.cos(tilt) - y * Math.sin(tilt), y: x * Math.sin(tilt) + y * Math.cos(tilt) };
      });
      const sun = Math.max(12, extent * .078);
      const glow = ctx.createRadialGradient(0, 0, sun * .4, 0, 0, sun * 3.5);
      glow.addColorStop(0, '#fff4bddd'); glow.addColorStop(.3, '#ffb63888'); glow.addColorStop(1, '#ff800000');
      ctx.globalAlpha = pose.orbits; ctx.fillStyle = glow;
      ctx.fillRect(-sun * 3.5, -sun * 3.5, sun * 7, sun * 7);
      const fire = ctx.createRadialGradient(-sun * .3, -sun * .3, 0, 0, 0, sun);
      fire.addColorStop(0, '#fff9ce'); fire.addColorStop(.55, '#ffd05a'); fire.addColorStop(1, '#f08022');
      ctx.fillStyle = fire; ctx.beginPath(); ctx.arc(0, 0, sun, 0, TAU); ctx.fill();
      for (const body of bodies.sort((a, b) => a.y - b.y)) {
        const { x, y, size, color, i } = body;
        ctx.save(); ctx.translate(x, y); ctx.globalAlpha = pose.orbits;
        if (i === 5) {
          ctx.strokeStyle = '#d6c398'; ctx.lineWidth = size * .4;
          ctx.beginPath(); ctx.ellipse(0, 0, size * 1.9, size * .65, -.35, 0, TAU); ctx.stroke();
        }
        const surface = ctx.createRadialGradient(-size * .35, -size * .35, 0, 0, 0, size);
        surface.addColorStop(0, '#fff2db'); surface.addColorStop(.22, color); surface.addColorStop(1, '#111a2a');
        ctx.fillStyle = surface; ctx.beginPath(); ctx.arc(0, 0, size, 0, TAU); ctx.fill();
        ctx.save(); ctx.beginPath(); ctx.arc(0, 0, size, 0, TAU); ctx.clip();
        if (i === 4 || i === 5) {
          ctx.strokeStyle = '#86583c'; ctx.globalAlpha = pose.orbits * .45; ctx.lineWidth = size * .2;
          for (let band = -2; band <= 2; band++) { ctx.beginPath(); ctx.moveTo(-size, band * size * .35); ctx.lineTo(size, band * size * .35 + size * .15); ctx.stroke(); }
        }
        if (i === 2) {
          ctx.fillStyle = '#83b58b'; ctx.beginPath(); ctx.ellipse(-size * .2, -size * .2, size * .35, size * .55, -.5, 0, TAU); ctx.fill();
        }
        ctx.restore(); ctx.restore();
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
