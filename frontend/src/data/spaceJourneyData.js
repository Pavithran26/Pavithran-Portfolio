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
const ease = value => { const t = clamp(value); return t * t * (3 - 2 * t); };
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
      return index + ease(index === 0 ? amount : (amount - .3) / .7);
    }
  }
  return stops.length - 1;
}

export function interpolateFlight(position, compact = false) {
  const value = clamp(position, 0, FLIGHT_STOPS.length - 1);
  const index = Math.min(FLIGHT_STOPS.length - 2, Math.floor(value));
  const amount = value - index;
  const from = FLIGHT_STOPS[index], to = FLIGHT_STOPS[index + 1];
  const worlds = from.worlds.map((world, i) => world.map((axis, j) => lerp(axis, to.worlds[i][j], amount)));
  if (compact) {
    worlds.forEach(world => { world[0] = .5 + (world[0] - .5) * .28; world[1] = .67 + (world[1] - .5) * .55; world[2] *= .67; });
    if (value < 1) worlds[0][1] += (1 - value) * .12;
  }
  return { worlds, stars: lerp(from.stars, to.stars, amount), neural: lerp(from.neural, to.neural, amount) };
}
