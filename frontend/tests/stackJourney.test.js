import test from 'node:test';
import assert from 'node:assert/strict';
import { STACK_CHAPTERS, positionForProgress, progressForChapter } from '../src/data/stackJourney.js';
import { SKILLS_CATEGORIES } from '../src/data/skillsData.js';
import { chapterCenter, createJourneyGeometry, getJourneyView, createProjector, transformPoint } from '../src/components/journeyGeometry.js';

test('the story follows the requested stack order and every tool opens a real skill', () => {
  assert.deepEqual(STACK_CHAPTERS.map(chapter => chapter.id), ['frontend', 'backend', 'databases', 'ai']);
  const searchable = SKILLS_CATEGORIES.flatMap(category => category.skills.map(skill => [skill.name, skill.tag, skill.level, category.name].filter(Boolean).join(' ').toLowerCase()));
  for (const chapter of STACK_CHAPTERS) for (const tool of chapter.highlights) {
    assert.ok(searchable.some(text => text.includes(tool.search.toLowerCase())), `${tool.name} has no matching skill`);
  }
});

test('scrolling in either direction visits all chapters without jumping or escaping the story', () => {
  let previous = 0;
  const visited = new Set();
  for (let step = 0; step <= 1000; step++) {
    const position = positionForProgress(step / 1000);
    assert.ok(position >= previous && position <= 3);
    assert.ok(position - previous < .02, 'The camera should not jump between adjacent scroll samples');
    visited.add(Math.round(position)); previous = position;
  }
  assert.deepEqual([...visited], [0, 1, 2, 3]);
  assert.equal(positionForProgress(-2), 0);
  assert.equal(positionForProgress(4), 3);
  for (let step = 1000; step >= 0; step--) {
    const position = positionForProgress(step / 1000);
    assert.ok(position <= previous); previous = position;
  }
});

test('chapter navigation lands in a stable reading interval', () => {
  STACK_CHAPTERS.forEach((_, index) => {
    const progress = progressForChapter(index);
    assert.equal(positionForProgress(progress), index);
    assert.equal(positionForProgress(Math.min(1, progress + .08)), index);
  });
});

test('each chapter has bounded, finite geometry for both rendering paths', () => {
  const signatures = new Set();
  for (let index = 0; index < 4; index++) {
    const model = createJourneyGeometry(index);
    assert.ok(model.paths.length > 10 && model.paths.length < 500);
    assert.ok(model.nodes.length + model.field.length < 1200);
    const points = [...model.paths.flatMap(path => path.points), ...model.nodes, ...model.field];
    assert.ok(points.every(point => point.length === 3 && point.every(value => Number.isFinite(value) && Math.abs(value) < 6)));
    signatures.add(`${model.paths.length}/${model.nodes.length}`);
  }
  assert.equal(signatures.size, 4, 'Each skill area needs its own visual structure');
});

test('the fallback camera keeps each chapter centered while traveling through depth', () => {
  let lastDepth = Infinity;
  for (let index = 0; index < 4; index++) {
    const view = getJourneyView(index, { x: 0, y: 0 });
    assert.ok(view.camera[2] < lastDepth); lastDepth = view.camera[2];
    const project = createProjector(view, 1000, 650);
    const center = project(chapterCenter(index));
    assert.ok(Math.abs(center.x - 500) < .001 && Math.abs(center.y - 325) < .001);
    const model = createJourneyGeometry(index);
    assert.ok(model.nodes.every(point => project(transformPoint(point, view.poses[index])) !== null));
    assert.equal(view.poses[index].opacity, 1);
    assert.ok(view.poses.every((pose, i) => i === index || pose.opacity === 0));
  }
});
