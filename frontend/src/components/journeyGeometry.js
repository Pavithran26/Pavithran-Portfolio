import { clamp, smoothstep } from '../data/stackJourney.js';

const TAU = Math.PI * 2;
const lerp = (a, b, t) => a + (b - a) * t;
export const chapterCenter = index => [Math.sin(index * .8) * .55, -index * .15, -index * 12];

/** Shared geometry keeps the WebGL and Canvas presentations in the same world. */
export function createJourneyGeometry(index) {
  const paths = [];
  const nodes = [];
  const path = (points, kind = 'edge') => paths.push({ points, kind });
  const rectangle = (x, y, z, w, h, kind = 'edge') => path([
    [x - w / 2, y - h / 2, z], [x + w / 2, y - h / 2, z],
    [x + w / 2, y + h / 2, z], [x - w / 2, y + h / 2, z], [x - w / 2, y - h / 2, z]
  ], kind);
  const box = (x, y, z, w, h, depth, kind = 'edge') => {
    rectangle(x, y, z - depth / 2, w, h, kind);
    rectangle(x, y, z + depth / 2, w, h, kind);
    for (const dx of [-w / 2, w / 2]) for (const dy of [-h / 2, h / 2]) {
      path([[x + dx, y + dy, z - depth / 2], [x + dx, y + dy, z + depth / 2]], kind);
      nodes.push([x + dx, y + dy, z + depth / 2]);
    }
  };
  const ring = (x, y, z, radius, plane = 'xz', kind = 'edge') => path(
    Array.from({ length: 65 }, (_, i) => {
      const a = i / 64 * TAU;
      return plane === 'xz' ? [x + Math.cos(a) * radius, y, z + Math.sin(a) * radius]
        : plane === 'xy' ? [x + Math.cos(a) * radius, y + Math.sin(a) * radius, z]
          : [x, y + Math.sin(a) * radius, z + Math.cos(a) * radius];
    }), kind
  );

  if (index === 0) {
    // A screen separates into component planes as the visitor moves past it.
    box(0, .1, -.6, 4.3, 2.9, .1, 'soft');
    box(0, .1, .05, 4.3, 2.9, .12);
    path([[-2.15, 1.05, .12], [2.15, 1.05, .12]], 'soft');
    [-1.85, -1.65, -1.45].forEach(x => nodes.push([x, 1.3, .14]));
    box(-1.32, -.05, .5, .83, 1.63, .12, 'soft');
    box(.55, .36, .82, 2.35, .82, .16);
    box(-.09, -.63, 1.06, 1.08, .64, .16, 'trace');
    box(1.25, -.63, 1.25, 1.08, .64, .16, 'trace');
    [-.13, .09, .3].forEach(y => path([[-1.57, y, .62], [-1.1, y, .62]], 'trace'));
    path([[-.36, .42, .92], [1.32, .42, .92]], 'soft');
    path([[-.36, .19, .92], [.7, .19, .92]], 'soft');
  } else if (index === 1) {
    // A service core, connected validation/auth nodes, and moving request paths.
    box(0, .15, 0, 1.35, 1.35, 1.35, 'trace');
    const services = [[-2.05, 1.15, -.5], [2.15, .95, -.6], [-1.85, -1.15, .4], [1.95, -1.05, .5]];
    services.forEach(([x, y, z]) => {
      box(x, y, z, .7, .7, .7);
      path([[0, .15, 0], [x * .55, .15, z], [x * .55, y, z], [x, y, z]], 'trace');
      ring(x, y, z, .59, 'xy', 'soft');
    });
    ring(0, .15, 0, 2.9, 'xz', 'soft');
    ring(0, .15, 0, 2.65, 'xz', 'soft');
  } else if (index === 2) {
    // Relational storage towers, a cache, and a vector index.
    [[-.8, 0, .1, 1.05], [1.4, .25, -.75, .62]].forEach(([x, y, z, r]) => {
      for (let level = 0; level < 5; level++) ring(x, y - .95 + level * .49, z, r, 'xz', level === 4 ? 'trace' : 'edge');
      for (let i = 0; i < 12; i++) {
        const a = i / 12 * TAU;
        const px = x + Math.cos(a) * r, pz = z + Math.sin(a) * r;
        path([[px, y - .95, pz], [px, y + 1.01, pz]], 'soft');
        nodes.push([px, y + 1.01, pz]);
      }
    });
    box(1.53, -1.16, 1.1, 1.05, .36, .7, 'trace');
    for (let x = 0; x < 4; x++) for (let y = 0; y < 4; y++) for (let z = 0; z < 3; z++) {
      nodes.push([-2.08 + x * .17, -.4 + y * .17, 1.5 + z * .17]);
    }
    path([[-.8, -.9, .1], [-.8, -1.6, .1], [1.53, -1.6, .1], [1.53, -1.16, 1.1]], 'trace');
  } else {
    // Connected points evoke retrieval neighborhoods, rather than a literal brain.
    const count = 125;
    for (let i = 0; i < count; i++) {
      const y = 1 - i / (count - 1) * 2;
      const r = Math.sqrt(1 - y * y), theta = i * Math.PI * (3 - Math.sqrt(5));
      const point = [Math.cos(theta) * r * 1.85, y * 1.85, Math.sin(theta) * r * 1.85];
      nodes.push(point);
      for (let j = 0; j < i; j++) {
        if (Math.hypot(...point.map((value, axis) => value - nodes[j][axis])) < .66) path([point, nodes[j]], 'soft');
      }
    }
    ring(0, 0, 0, 2.22, 'xz', 'trace');
    ring(0, 0, 0, 2.42, 'xy', 'soft');
    ring(0, 0, 0, 2.12, 'yz', 'soft');
    box(0, 0, 0, .6, .6, .6, 'trace');
  }

  const field = [];
  for (let row = 0; row < 19; row++) for (let col = 0; col < 47; col++) {
    const x = (col - 23) * .23, z = (row - 9) * .26;
    field.push([x, -2.25 + Math.sin(x * .95 + z * .75 + index) * .23 + Math.cos(z * 1.2) * .12, z]);
  }
  return { paths, nodes, field };
}

export function getJourneyView(position, pointer, time = 0) {
  const index = Math.floor(clamp(position, 0, 3));
  const fraction = position - index;
  const a = chapterCenter(index), b = chapterCenter(Math.min(3, index + 1));
  const target = a.map((value, axis) => lerp(value, b[axis], fraction));
  const camera = [target[0] + pointer.x * .35 + Math.sin(position * Math.PI) * .3, target[1] + .55 + pointer.y * .2, target[2] + 9.5];
  const poses = Array.from({ length: 4 }, (_, i) => ({
    center: chapterCenter(i),
    rotation: [.17 + Math.sin(time * .25) * .025, [-.28, .28, -.35, 0][i] + Math.sin(time * .2) * .035, 0],
    opacity: 1 - smoothstep(.16, .84, Math.abs(position - i))
  }));
  return { camera, target, poses };
}

export function transformPoint(point, pose) {
  const [x, y, z] = point, [rx, ry] = pose.rotation;
  const y1 = y * Math.cos(rx) - z * Math.sin(rx), z1 = y * Math.sin(rx) + z * Math.cos(rx);
  return [x * Math.cos(ry) + z1 * Math.sin(ry) + pose.center[0], y1 + pose.center[1], -x * Math.sin(ry) + z1 * Math.cos(ry) + pose.center[2]];
}

/** Perspective basis used by the no-WebGL renderer. */
export function createProjector(view, width, height) {
  const normalize = vector => { const size = Math.hypot(...vector); return vector.map(value => value / size); };
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const dot = (a, b) => a.reduce((sum, value, i) => sum + value * b[i], 0);
  const forward = normalize(view.target.map((value, i) => value - view.camera[i]));
  const right = normalize(cross(forward, [0, 1, 0])), up = cross(right, forward);
  const focal = height / (2 * Math.tan(46 * Math.PI / 360));
  return point => {
    const vector = point.map((value, i) => value - view.camera[i]), depth = dot(vector, forward);
    if (depth < .5 || depth > 65) return null;
    return { x: width / 2 + dot(vector, right) * focal / depth, y: height / 2 - dot(vector, up) * focal / depth, depth };
  };
}
