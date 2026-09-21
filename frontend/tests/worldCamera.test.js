import test from 'node:test';
import assert from 'node:assert/strict';
import { cameraAt, projectWorld } from '../src/components/WorldCamera.js';
test('world landmarks stay immutable while camera traverses and reverses', () => {
 const body=Object.freeze({x:760,y:1800,size:300});
 const anchors=[0,900,1800,2700];
 const positions=[0,450,900,1350,1800];
 const forward=positions.map(y=>projectWorld(body,cameraAt(y,anchors,1000)));
 const backward=[...positions].reverse().map(y=>projectWorld(body,cameraAt(y,anchors,1000))).reverse();
 assert.deepEqual(forward,backward);
 assert.equal(body.size,300); assert.equal(body.y,1800);
 assert.equal(forward[4].y,0);
});
test('camera position is continuous at destination boundaries with stable arrivals',()=>{
 const stops=[0,1000,2000,3000];
 for(const y of stops.slice(1,-1)) {
  assert.ok(Math.abs(cameraAt(y-.001,stops,1000).x-cameraAt(y+.001,stops,1000).x)<.001);
  assert.equal(cameraAt(y,stops,1000).x,cameraAt(y+100,stops,1000).x);
 }
});
