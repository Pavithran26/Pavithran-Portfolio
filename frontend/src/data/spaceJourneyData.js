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
  return { worlds, stars: lerp(from.stars, to.stars, amount), neural: lerp(from.neural, to.neural, amount), roll: lerp(from.roll || 0, to.roll || 0, amount) };
}

/** One camera itinerary for the entire document, including individual records. */
export function createPortfolioRoute(projects, profile) {
  const introLabels = ['THE BEGINNING', '01 / FRONTEND', '02 / BACKEND', '03 / DATABASES', '04 / APPLIED AI'];
  const introSelectors = ['#top', ...SPACE_CHAPTERS.map(chapter => '#stack-' + chapter.id)];
  const route = FLIGHT_STOPS.slice(0, 5).map((pose, index) => ({ ...pose, selector: introSelectors[index], nav: introSelectors[index], label: introLabels[index] }));
  const destination = (selector, label, nav, world, side, size, y = .52, neural = 0) => {
    const worlds = [[.92, .13, .035, .35], [.07, .78, .035, .3], [1.3, .3, .08, 0]];
    worlds[world] = [side === 'left' ? .26 : .76, y, size, .9];
    route.push({ selector, label, nav, worlds, stars: 13 + (route.length - 5) * 2.2, neural, roll: (route.length % 3 - 1) * 7 });
  };
  destination('#work', 'SELECTED WORK', '#work', 2, 'right', 1.05);
  projects.forEach((project, index) => destination(`#project-${project.id}`, 'WORK / ' + project.title.toUpperCase(), '#work', index % 3, index % 2 ? 'left' : 'right', index % 3 === 2 ? 1.12 : .83));
  destination('#about', 'ABOUT / PAVITHRAN', '#about', 0, 'right', 1.05, .66);
  profile.experience.forEach((job, index) => destination(`#experience-${index}`, 'EXPERIENCE / ' + job.company.split(',')[0].toUpperCase(), '#about', index % 3, 'right', index % 3 === 2 ? 1.1 : .88, .47 + index % 2 * .15));
  destination('#education', 'EDUCATION', '#education', 1, 'right', .72, .5);
  profile.education.forEach((education, index) => destination(`#education-${index}`, 'EDUCATION / ' + education.badge.toUpperCase(), '#education', index % 3, 'right', index % 3 === 2 ? 1.12 : .8, .43 + index % 2 * .17));
  destination('#recognition', 'TRAINING & RECOGNITION', '#education', 2, 'right', 1.2, .6);
  destination('#dawn', 'DAWN / A CONVERSATION', '#dawn', 1, 'right', .07, .17, 1);
  destination('#contact', 'CONTACT / THE NEXT CHAPTER', '#contact', 0, 'right', 1.5, 1.03);
  route.push({ selector: '#contact', offset: .7, nav: '#contact', label: 'CONTACT / LET’S BUILD', worlds: [[.84, 1.5, 2.5, 1], [-.2, .2, .02, 0], [1.4, .5, .08, 0]], stars: route.at(-1).stars + 3, neural: 0, roll: 0 });
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
