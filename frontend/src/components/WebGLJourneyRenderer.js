import * as THREE from 'three';
import { STACK_CHAPTERS } from '../data/stackJourney.js';

export class WebGLJourneyRenderer {
  constructor(canvas, context, geometry) {
    this.renderer = new THREE.WebGLRenderer({ canvas, context, alpha: true, antialias: true });
    this.renderer.setClearColor(0x090b09, 0);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(46, 1, .5, 65);
    this.resources = [];
    this.groups = geometry.map((model, index) => {
      const group = new THREE.Group();
      const color = STACK_CHAPTERS[index].accent;
      const add = (points, opacity, pointSize) => {
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(points.flat(), 3));
        const material = pointSize ? new THREE.PointsMaterial({ color, size: pointSize, transparent: true, opacity, depthWrite: false, sizeAttenuation: true })
          : new THREE.LineBasicMaterial({ color, transparent: true, opacity, depthWrite: false });
        material.userData.baseOpacity = opacity;
        const object = pointSize ? new THREE.Points(geo, material) : new THREE.LineSegments(geo, material);
        group.add(object); this.resources.push(geo, material);
        return object;
      };
      ['soft', 'edge', 'trace'].forEach((kind, kindIndex) => {
        const segments = model.paths.filter(path => path.kind === kind).flatMap(path => path.points.slice(1).flatMap((point, i) => [path.points[i], point]));
        if (segments.length) add(segments, [.22, .58, .93][kindIndex]);
      });
      add(model.nodes, .94, .044);
      const field = add(model.field, .39, .022);
      group.userData.field = field;
      this.scene.add(group);
      return group;
    });
  }

  resize(width, height, dpr) {
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height; this.camera.updateProjectionMatrix();
  }

  draw(view, time) {
    this.camera.position.set(...view.camera);
    this.camera.lookAt(...view.target);
    this.groups.forEach((group, index) => {
      const pose = view.poses[index];
      group.visible = pose.opacity > .005;
      if (!group.visible) return;
      group.position.set(...pose.center);
      group.rotation.set(...pose.rotation, 'YXZ');
      group.children.forEach(object => { object.material.opacity = object.material.userData.baseOpacity * pose.opacity; });
      group.userData.field.position.y = Math.sin(time * .6 + index) * .055;
    });
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.resources.forEach(resource => resource.dispose());
    this.renderer.dispose();
  }
}
