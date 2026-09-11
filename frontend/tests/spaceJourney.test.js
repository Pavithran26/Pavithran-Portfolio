import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { SPACE_CHAPTERS, FLIGHT_STOPS, flightPosition, interpolateFlight, createPortfolioRoute, destinationIndex, ambientFlight } from '../src/data/spaceJourneyData.js';
import { PROJECTS_DATA } from '../src/data/projectsData.js';
import { PORTFOLIO_DATA } from '../src/data/portfolioData.js';
import { SKILLS_CATEGORIES } from '../src/data/skillsData.js';
import { getTechnologyIcons } from '../src/components/TechnologyIcons.js';
import { PROJECT_VISUALS, projectVisual } from '../src/components/ProjectVisuals.js';
import { RAGService } from '../src/services/ragService.js';

test('native scroll visits every chapter in order, including reverse travel', () => {
  const anchors = [0, 1250, 2600, 4100, 5400, 7000];
  anchors.forEach((anchor, index) => assert.equal(flightPosition(anchor, anchors), index));
  let previous = -1;
  for (let scroll = -100; scroll <= 7300; scroll += 10) {
    const position = flightPosition(scroll, anchors);
    assert.ok(position >= previous && position >= 0 && position <= 5);
    previous = position;
  }
  for (const anchor of anchors.slice(1, -1)) assert.ok(Math.abs(flightPosition(anchor + .1, anchors) - flightPosition(anchor - .1, anchors)) < .001);
});

test('all interpolated desktop and compact poses have finite sizes and bounded opacity', () => {
  for (const compact of [false, true]) for (let position = -.2; position <= 5.2; position += .025) {
    const pose = interpolateFlight(position, compact);
    assert.equal(pose.worlds.length, 3);
    for (const world of pose.worlds) {
      assert.ok(world.every(Number.isFinite));
      assert.ok(world[2] > 0);
      assert.ok(world[3] >= 0 && world[3] <= 1);
    }
    assert.ok(pose.neural >= 0 && pose.neural <= 1);
  }
  assert.deepEqual(interpolateFlight(0).worlds, FLIGHT_STOPS[0].worlds);
  interpolateFlight(5).worlds.forEach((world, i) => world.forEach((axis, j) => assert.ok(Math.abs(axis - FLIGHT_STOPS[5].worlds[i][j]) < 1e-10)));
});

test('every visible technology has a local logo and a matching searchable skill', () => {
  assert.deepEqual(SPACE_CHAPTERS.map(chapter => chapter.id), ['frontend', 'backend', 'databases', 'ai']);
  for (const chapter of SPACE_CHAPTERS) for (const tool of chapter.tools) {
    const icons = getTechnologyIcons(tool.name);
    assert.ok(icons.length, `${tool.name} is missing a logo`);
    for (const icon of icons) assert.ok(existsSync(new URL(`../public${icon.src}`, import.meta.url)));
    assert.ok(SKILLS_CATEGORIES.some(category => category.skills.some(skill => [skill.name, skill.tag, skill.level, category.name].join(' ').toLowerCase().includes(tool.search.toLowerCase()))), `${tool.search} has no skill results`);
  }
  assert.deepEqual(getTechnologyIcons('Java').map(icon => icon.id), ['java']);
  assert.deepEqual(getTechnologyIcons('JavaScript').map(icon => icon.id), ['javascript']);
});

test('camera continues through every project, job, education record and final contact arrival', () => {
  const route = createPortfolioRoute(PROJECTS_DATA, PORTFOLIO_DATA);
  for (const project of PROJECTS_DATA) assert.ok(route.some(stop => stop.selector === '#project-' + project.id));
  assert.equal(route.filter(stop => stop.selector.startsWith('#experience-')).length, PORTFOLIO_DATA.experience.length);
  assert.equal(route.filter(stop => stop.selector.startsWith('#education-')).length, PORTFOLIO_DATA.education.length);
  assert.equal(route.at(-1).nav, '#contact');
  assert.ok(route.some(stop => stop.nav === '#dawn' && stop.blackhole === 1));
  const anchors = route.map((_, i) => i * 900);
  let previousStars = 0;
  for (let scroll = 0; scroll <= anchors.at(-1); scroll += 50) {
    const position = flightPosition(scroll, anchors);
    for (const compact of [false, true]) {
      const pose = interpolateFlight(position, compact, route);
      assert.ok(pose.worlds.flat().every(Number.isFinite));
      assert.ok(pose.worlds.every(world => world[2] > 0 && world[3] >= 0 && world[3] <= 1));
      assert.ok(pose.stars >= previousStars - 1e-8);
      previousStars = pose.stars;
    }
  }
  const projectStops = route.filter(stop => stop.selector.startsWith('#project-'));
  assert.equal(projectStops.length, PROJECTS_DATA.length);
  for (const stop of projectStops) assert.ok(stop.worlds.every(world => world[3] === 0));
  const workStart = route.findIndex(stop => stop.selector === '#work');
  const workEnd = route.findIndex(stop => stop.selector === '#about');
  for (let position = workStart; position <= workEnd; position += .1) {
    assert.ok(interpolateFlight(position, false, route).worlds.every(world => world[3] === 0));
  }
  assert.equal(route[0].galaxy, 1);
  assert.ok(route.some(stop => stop.orbits === 1));
  assert.ok(route.some(stop => stop.starMap === 1));
  const order = ['#top', '#work', '#about', '#stack-frontend', '#stack-backend', '#stack-databases', '#stack-ai', '#education', '#dawn', '#contact'];
  const indices = order.map(selector => route.findIndex(stop => stop.selector === selector));
  assert.deepEqual([...indices].sort((a, b) => a - b), indices);
  for (const index of indices) assert.ok(index >= 0);
  const source = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
  assert.ok(source.indexOf('id="work"') < source.indexOf('id="about"'));
  assert.ok(source.indexOf('id="about"') < source.indexOf('${chapters.map'));
  assert.ok(source.indexOf('${chapters.map') < source.indexOf('id="education"'));
  const page = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(page, /id="dawn-eye" data-dialog="dawn"/);
  assert.match(page, /class="terminal-launch" data-dialog="terminal"/);
  assert.equal(destinationIndex(anchors.at(-1), anchors), route.length - 1);
  assert.equal(destinationIndex(-1, anchors), 0);
  assert.equal(destinationIndex(100, [0, 100, 100]), 2);
});

test('closing DAWN cancels its network request and keeps the API contract', async t => {
  let received;
  t.mock.method(globalThis, 'fetch', (url, options) => {
    received = { url, options };
    return new Promise((resolve, reject) => {
      if (options.signal.aborted) reject(new DOMException('Aborted', 'AbortError'));
      else options.signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), { once: true });
    });
  });
  const controller = new AbortController();
  const response = RAGService.query('Tell me about ClanSure', 4, { signal: controller.signal });
  controller.abort();
  await assert.rejects(response, { name: 'AbortError' });
  assert.equal(received.url, '/api/v1/rag/query');
  assert.deepEqual(JSON.parse(received.options.body), { query: 'Tell me about ClanSure', top_k: 4 });
  assert.ok(received.options.signal.aborted);
});


test('camera responds immediately throughout each section without a scroll hold', () => {
  const anchors = [0, 1000, 2200, 4000];
  for (let i = 0; i < anchors.length - 1; i++) {
    const distance = anchors[i + 1] - anchors[i];
    for (const fraction of [.01, .1, .2, .3, .5, .9]) {
      assert.ok(Math.abs(flightPosition(anchors[i] + distance * fraction, anchors) - (i + fraction)) < 1e-10);
    }
  }
});

test('background keeps moving at rest across the whole route, with a static motion-off mode', () => {
  const route = createPortfolioRoute(PROJECTS_DATA, PORTFOLIO_DATA);
  for (const compact of [false, true]) for (let i = 0; i < route.length; i++) {
    const pose = interpolateFlight(i, compact, route);
    const initial = structuredClone(pose);
    const start = ambientFlight(pose, 0);
    const later = ambientFlight(pose, 5000);
    assert.notDeepEqual(start.worlds, later.worlds);
    assert.notEqual(start.roll, later.roll);
    assert.ok(later.stars > start.stars);
    assert.deepEqual(ambientFlight(pose, 0, false), ambientFlight(pose, 5000, false));
    assert.deepEqual(pose, initial);
    for (let time = 0; time <= 120000; time += 1000) {
      const frame = ambientFlight(pose, time);
      frame.worlds.forEach((world, index) => {
        assert.ok(world.every(Number.isFinite));
        assert.ok(Math.abs(world[0] - pose.worlds[index][0]) <= .01800001);
        assert.ok(Math.abs(world[1] - pose.worlds[index][1]) <= .01400001);
        assert.deepEqual(world.slice(2), pose.worlds[index].slice(2));
      });
    }
  }
});


test('initial applyMotion does not treat false as a DOM anchor; toggling preserves position', async t => {
  const { SpaceJourney } = await import('../src/components/SpaceJourney.js');
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
  const originalDocument = Object.getOwnPropertyDescriptor(globalThis, 'document');
  t.after(() => {
    for (const [key, descriptor] of [['window', originalWindow], ['document', originalDocument]]) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  });
  let reading = false;
  const scrolls = [];
  globalThis.window = { scrollY: 500, scrollBy: options => scrolls.push(options) };
  globalThis.document = { body: { classList: { toggle: (_, value) => { reading = value; } } } };
  const section = { offsetTop: 200, offsetParent: null, getBoundingClientRect: () => ({ top: reading ? 80 : 120 }) };
  let measurements = 0;
  const journey = {
    motion: true, sections: [section],
    motionButton: { setAttribute() {} },
    measure() { measurements++; }
  };
  // Constructor calls this before stops have been measured.
  assert.doesNotThrow(() => SpaceJourney.prototype.applyMotion.call(journey));
  assert.equal(journey.motionButton.textContent, 'Motion on');
  assert.equal(scrolls.length, 0);
  assert.equal(measurements, 0);
  journey.stops = [0, 200];
  journey.motion = false;
  SpaceJourney.prototype.applyMotion.call(journey, true);
  assert.deepEqual(scrolls, [{ top: -40, behavior: 'instant' }]);
  assert.equal(journey.motionButton.textContent, 'Motion off');
  assert.equal(measurements, 1);
  journey.sections = [];
  assert.doesNotThrow(() => SpaceJourney.prototype.applyMotion.call(journey, true));
});


test('all sixteen projects have complete details and domain visuals, retaining live links', () => {
  assert.equal(PROJECTS_DATA.length, 16);
  assert.equal(new Set(PROJECTS_DATA.map(project => project.id)).size, 16);
  for (const project of PROJECTS_DATA) {
    for (const field of ['id', 'title', 'category', 'badge', 'overview', 'challenge', 'solution']) assert.ok(project[field], `${project.id}: ${field}`);
    assert.ok(project.technologies.length && project.highlights.length);
    assert.ok(PROJECT_VISUALS[project.id], `${project.id}: missing domain visual`);
    assert.match(projectVisual(project), /<svg /);
    assert.match(projectVisual(project), /<figcaption>/);
    assert.equal(PROJECT_VISUALS[project.id].steps.length, 3);
    for (const url of [project.githubUrl, project.liveUrl].filter(Boolean)) assert.equal(new URL(url).protocol, 'https:');
  }
  assert.equal(PROJECTS_DATA.find(p => p.id === 'srk-erp').liveUrl, 'https://ranjithkumars.vercel.app/');
  assert.ok(PROJECTS_DATA.find(p => p.id === 'clansure').liveUrl);
  assert.ok(PROJECTS_DATA.find(p => p.id === 'gt-companion').liveUrl);
  for (const id of ['upi-fraud-detection', 'heart-disease-prediction', 'pneumonia-detection', 'healthsurance']) assert.ok(PROJECTS_DATA.find(p => p.id === id).implementationNote);
  assert.ok(!PROJECTS_DATA.some(p => ['adhoc-erp', '3d-rag-platform'].includes(p.id)));
});
