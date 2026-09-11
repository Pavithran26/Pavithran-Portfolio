import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { SPACE_CHAPTERS, FLIGHT_STOPS, flightPosition, interpolateFlight, createPortfolioRoute, destinationIndex } from '../src/data/spaceJourneyData.js';
import { PROJECTS_DATA } from '../src/data/projectsData.js';
import { PORTFOLIO_DATA } from '../src/data/portfolioData.js';
import { SKILLS_CATEGORIES } from '../src/data/skillsData.js';
import { getTechnologyIcons } from '../src/components/TechnologyIcons.js';
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
  assert.ok(route.some(stop => stop.nav === '#dawn' && stop.neural === 1));
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
  for (let i = 6; i < route.length; i++) assert.notDeepEqual(route[i].worlds, route[i - 1].worlds);
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
