import { CosmicScenes } from './CosmicScenes.js';

/** Orthographic world: bodies never change position, scale or opacity on scroll. */
export function cameraAt(scrollY, anchors, width) {
  const offsets = [0, .10, -.08, .07, -.10, .06];
  let index = 0;
  while (index + 1 < anchors.length && scrollY >= anchors[index + 1]) index++;
  const next = Math.min(index + 1, anchors.length - 1);
  const raw = Math.max(0, Math.min(1, (scrollY - anchors[index]) / Math.max(1, anchors[next] - anchors[index])));
  // A short stable reading arrival followed by smooth lateral travel.
  const t = Math.max(0, Math.min(1, (raw - .18) / .72));
  const eased = t * t * (3 - 2 * t);
  return { x: width * (offsets[index % offsets.length] * (1 - eased) + offsets[next % offsets.length] * eased), y: scrollY };
}
export function projectWorld(body, camera, depth = 1) {
  return { x: body.x - camera.x * depth, y: body.y - camera.y * depth };
}
export class WorldCamera {
  constructor(onLoad = () => {}) {
    this.images = ['ocean-world', 'rocky-world', 'ring-world'].map(name => {
      const image = new Image(); image.onload = onLoad; image.src = `/images/space/${name}.webp`; return image;
    });
    this.cosmic = new CosmicScenes();
  }
  measure(width, height, route, stops) {
    this.width = width; this.height = height; this.stops = stops;
    const yAt = id => stops[Math.max(0, route.findIndex(stop => stop.selector === id))] + height * .53;
    const x = width * (width < 760 ? .5 : .76);
    const size = Math.min(width * .42, height * .65);
    this.bodies = [
      { type: 'galaxy', x, y: height * .55, size: size * 1.45 },
      { type: 'orbits', x, y: yAt('#about'), size: size * 1.35 },
      { image: 0, x, y: yAt('#stack-frontend'), size },
      { image: 1, x: width * (width < 760 ? .5 : .24), y: yAt('#stack-backend'), size },
      { image: 2, x, y: yAt('#stack-databases'), size: size * 1.2 },
      { type: 'core', x, y: yAt('#stack-ai'), size: size * .8 },
      { type: 'starMap', x, y: yAt('#education'), size },
      { type: 'blackhole', x, y: yAt('#dawn'), size: size * 1.25 },
    ];
    // Render textures once per responsive layout, not once per frame.
    this.bodies.forEach(body => {
      if (!body.type || body.type === 'core') return;
      const canvas = document.createElement('canvas'); canvas.width = canvas.height = 700;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.translate(0, -140);
        this.cosmic.draw(ctx, { [body.type]: 1, stars: 0, roll: 0 }, 0, 700, 700, true, false);
      }
      body.texture = canvas;
    });
  }
  draw(ctx, scrollY, light) {
    if (!ctx || !this.stops?.length) return;
    const { width: w, height: h } = this;
    const camera = cameraAt(scrollY, this.stops, w);
    ctx.clearRect(0, 0, w, h);
    ctx.save(); ctx.globalAlpha = 1;
    // Fixed distant stars: parallax is camera projection, not independent drift.
    ctx.fillStyle = light ? '#52657a' : '#b9cfe7';
    for (let i = 0; i < 650; i++) {
      const x = ((i * 137.508 - camera.x * .12) % w + w) % w;
      const y = ((i * 79.31 - camera.y * .12) % h + h) % h;
      ctx.globalAlpha = .2 + (i % 7) * .07;
      ctx.beginPath(); ctx.arc(x, y, i % 11 === 0 ? 1.5 : .7, 0, Math.PI * 2); ctx.fill();
    }
    for (const body of this.bodies) {
      const p = projectWorld(body, camera);
      if (p.y + body.size < 0 || p.y - body.size > h) continue;
      ctx.globalAlpha = light ? .65 : 1;
      const image = body.texture || this.images[body.image];
      if (image && (body.texture || image.complete && image.naturalWidth)) {
        ctx.drawImage(image, p.x - body.size / 2, p.y - body.size / 2, body.size, body.size);
      } else if (body.type === 'core') {
        const r = body.size * .32;
        const metal = ctx.createLinearGradient(p.x - r, p.y - r, p.x + r, p.y + r);
        [[0,'#d9f5ff'],[.3,'#819aac'],[.43,'#f2ffff'],[.6,'#21354c'],[1,'#a6bedb']].forEach(([at,c])=>metal.addColorStop(at,c));
        ctx.fillStyle = metal; ctx.beginPath();
        for (let i=0;i<=100;i++) { const a=i/100*Math.PI*2, radius=r*(1+.1*Math.sin(a*3)); const x=p.x+Math.cos(a)*radius,y=p.y+Math.sin(a)*radius; if(i)ctx.lineTo(x,y);else ctx.moveTo(x,y); }
        ctx.closePath();ctx.fill();
      }
    }
    ctx.restore();
    return camera;
  }
}
