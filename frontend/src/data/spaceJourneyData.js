import { STACK_CHAPTERS } from './stackJourney.js';

const tools = entries => entries.map(([name, search = name]) => ({ name, search }));

export const SPACE_CHAPTERS = [
  { ...STACK_CHAPTERS[0], orbit: '01 / THE EXPERIENCE', headline: 'Frontend.', side: 'left', tools: tools([
    ['React', 'React 18'], ['TypeScript'], ['JavaScript'], ['Next.js'], ['Tailwind CSS', 'Tailwind'], ['Three.js']
  ]) },
  { ...STACK_CHAPTERS[1], orbit: '02 / THE LOGIC', headline: 'Backend.', side: 'right', tools: tools([
    ['Python'], ['C#'], ['Java'], ['ASP.NET Core', 'ASP.NET'], ['FastAPI'], ['Django']
  ]) },
  { ...STACK_CHAPTERS[2], orbit: '03 / THE MEMORY', headline: 'Databases.', side: 'left', tools: tools([
    ['PostgreSQL'], ['pgvector'], ['Redis'], ['MongoDB'], ['MySQL'], ['Supabase']
  ]) },
  { ...STACK_CHAPTERS[3], orbit: '04 / THE INTELLIGENCE', headline: 'Applied AI.', side: 'left', tools: tools([
    ['LangChain'], ['Gemini'], ['OpenAI'], ['Embeddings'], ['RAG', 'AI, RAG'], ['Hugging Face']
  ]) }
];

export const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const lerp = (a, b, t) => a + (b - a) * t;

// World poses: viewport x, viewport y, width in viewport heights, opacity.
// Native document positions drive every stop; no intercepted wheel/touch input.
export const FLIGHT_STOPS = [
  { worlds: [[.88, 1.55, 2.65, 1], [-.3, .14, .045, .3], [1.5, .3, .04, 0]], stars: 0, neural: 0 },
  { worlds: [[.73, .50, .75, 1], [.12, .22, .045, .6], [1.3, .25, .05, 0]], stars: 1, neural: 0 },
  { worlds: [[1.15, .83, .13, .35], [.28, .49, .71, 1], [.83, .16, .1, .3]], stars: 3, neural: 0 },
  { worlds: [[.13, .84, .038, .2], [-.3, .65, .12, .2], [.73, .51, 1.27, 1]], stars: 6, neural: 0 },
  { worlds: [[-.2, .8, .018, 0], [.1, .22, .025, .3], [1.2, .67, .15, .2]], stars: 10, neural: 1 },
  { worlds: [[.85, .19, .065, .35], [.38, .08, .024, .2], [.83, .62, .3, .25]], stars: 13, neural: 0 }
];

export function flightPosition(scrollY, stops) {
  if (scrollY <= stops[0]) return 0;
  for (let index = 0; index < stops.length - 1; index++) {
    if (scrollY < stops[index + 1]) {
      const amount = (scrollY - stops[index]) / Math.max(1, stops[index + 1] - stops[index]);
      // Scroll smoothing happens in the renderer; every scroll pixel advances the camera.
      return index + clamp(amount);
    }
  }
  return stops.length - 1;
}

export function interpolateFlight(position, compact = false, route = FLIGHT_STOPS) {
  const value = clamp(position, 0, route.length - 1);
  const index = Math.min(route.length - 2, Math.floor(value));
  const amount = value - index;
  const from = route[index], to = route[index + 1];
  const worlds = from.worlds.map((world, i) => world.map((axis, j) => lerp(axis, to.worlds[i][j], amount)));
  if (compact) {
    worlds.forEach(world => { world[0] = .5 + (world[0] - .5) * .28; world[1] = .67 + (world[1] - .5) * .55; world[2] *= .67; });
    if (value < 1) worlds[0][1] += (1 - value) * .12;
  }
  const effects = Object.fromEntries(['galaxy', 'blackhole', 'orbits', 'starMap', 'shade'].map(key => [key, lerp(from[key] || 0, to[key] || 0, amount)]));
  return { ...effects, worlds, stars: lerp(from.stars, to.stars, amount), neural: lerp(from.neural, to.neural, amount), roll: lerp(from.roll || 0, to.roll || 0, amount) };
}

/** One camera itinerary for the entire document, including individual records. */
export function createPortfolioRoute(projects, profile) {
  const emptyWorlds = () => Array.from({ length: 7 }, () => [1.2, .6, .05, 0]);
  const route = [];
  const destination = (selector, label, nav, world = -1, side = 'right', scene = {}) => {
    const worlds = emptyWorlds();
    if (world >= 0) worlds[world] = [side === 'left' ? .25 : .76, .55, world === 2 ? 1.05 : .78, .9];
    route.push({ selector, label, nav, worlds, stars: route.length * 2.2, neural: 0, roll: 0,
      galaxy: 0, blackhole: 0, orbits: 0, starMap: 0, shade: side === 'left' ? 1 : 0, ...scene });
  };
  destination('#top', 'THE BEGINNING / MILKY WAY', '#top', -1, 'right', { galaxy: 1 });
  destination('#work', 'SELECTED WORK / NEW WORLDS', '#work', -1, 'right', { galaxy: .65 });
  const projectWorlds = [0, 3, 4, 5, 6, 2];
  const names = ['EARTH', 'MARS', 'JUPITER', 'NEPTUNE', 'VENUS', 'SATURN'];
  projects.forEach((project, index) => destination(`#project-${project.id}`, 'WORK / ' + project.title.toUpperCase() + ' / ' + names[index % names.length], '#work', projectWorlds[index % projectWorlds.length], index % 2 ? 'left' : 'right'));
  destination('#about', 'EXPERIENCE / ORBITAL PATHS', '#about', -1, 'right', { orbits: 1 });
  profile.experience.forEach((job, index) => destination(`#experience-${index}`, 'EXPERIENCE / ' + job.company.split(',')[0].toUpperCase(), '#about', -1, 'right', { orbits: 1, roll: index * 12 }));
  SPACE_CHAPTERS.forEach((chapter, index) => destination('#stack-' + chapter.id, chapter.orbit, '#stack-' + chapter.id, [0, 3, 2, -1][index], index === 1 ? 'left' : 'right', { neural: index === 3 ? 1 : 0, galaxy: index === 3 ? .2 : 0 }));
  destination('#education', 'EDUCATION / A CONSTELLATION OF MILESTONES', '#education', -1, 'right', { starMap: 1 });
  profile.education.forEach((education, index) => destination(`#education-${index}`, 'EDUCATION / ' + education.badge.toUpperCase(), '#education', -1, 'right', { starMap: 1, roll: index * 9 }));
  destination('#recognition', 'TRAINING & RECOGNITION', '#education', -1, 'right', { starMap: .6, galaxy: .6 });
  destination('#dawn', 'DAWN / BEYOND THE EVENT HORIZON', '#dawn', -1, 'right', { blackhole: 1, neural: .15 });
  destination('#contact', 'CONTACT / A NEW HORIZON', '#contact', 0, 'right', { galaxy: .35 });
  route.at(-1).worlds[0] = [.8, 1.1, 1.7, .85];
  destination('#contact', 'CONTACT / LET’S BUILD', '#contact', 0, 'right', { galaxy: .65, offset: .7 });
  route.at(-1).worlds[0] = [.8, 1.5, 2.5, .8];
  return route;
}

export function destinationIndex(scrollY, anchors) {
  let index = 0;
  while (index + 1 < anchors.length && scrollY >= anchors[index + 1]) index++;
  return index;
}

/** Small continuous camera drift, independent of document progress. */
export function ambientFlight(pose, time, enabled = true) {
  if (!enabled) return pose;
  const seconds = time / 1000;
  return {
    ...pose,
    worlds: pose.worlds.map(([x, y, size, opacity], index) => [
      x + Math.sin(seconds * .16 + index * 2) * .018,
      y + Math.sin(seconds * .12 + index * 1.7) * .014,
      size, opacity
    ]),
    roll: pose.roll + Math.sin(seconds * .1) * 2,
    stars: pose.stars + seconds * .45
  };
}
