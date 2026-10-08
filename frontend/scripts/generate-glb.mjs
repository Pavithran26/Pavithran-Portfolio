import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import fs from 'fs';
import path from 'path';

globalThis.FileReader = class FileReader {
  constructor() {
    this.result = null;
    this.onload = null;
  }
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((buf) => {
      this.result = buf;
      if (this.onload) this.onload({ target: this });
    });
  }
};

async function run() {
  const primeGroup = new THREE.Group();
  primeGroup.name = "OptimusPrime_CybertronianMatrix";

  const primeRed = new THREE.MeshStandardMaterial({
    color: 0xc81919,
    roughness: 0.28,
    metalness: 0.72,
    name: "Prime_CrimsonArmor"
  });

  const primeNavy = new THREE.MeshStandardMaterial({
    color: 0x0c2548,
    roughness: 0.32,
    metalness: 0.68,
    name: "Prime_CobaltChassis"
  });

  const chrome = new THREE.MeshStandardMaterial({
    color: 0xd8e0ea,
    roughness: 0.15,
    metalness: 0.95,
    name: "Prime_ChromeAlloy"
  });

  const energon = new THREE.MeshStandardMaterial({
    color: 0x00e5ff,
    emissive: 0x00e5ff,
    emissiveIntensity: 2.0,
    roughness: 0.1,
    name: "Prime_EnergonGlow"
  });

  const glass = new THREE.MeshStandardMaterial({
    color: 0x0a1c30,
    roughness: 0.1,
    metalness: 0.2,
    name: "Prime_CabWindshield"
  });

  const rubber = new THREE.MeshStandardMaterial({
    color: 0x181818,
    roughness: 0.85,
    metalness: 0.1,
    name: "Prime_HeavyTireRubber"
  });

  // Torso
  const torso = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.0, 1.5), primeRed);
  torso.position.y = 1.0;
  primeGroup.add(torso);

  // Windshields & Grill
  const leftWin = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.85, 0.15), glass);
  leftWin.position.set(-0.55, 1.45, 0.8);
  primeGroup.add(leftWin);

  const rightWin = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.85, 0.15), glass);
  rightWin.position.set(0.55, 1.45, 0.8);
  primeGroup.add(rightWin);

  const grill = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.6, 0.1), chrome);
  grill.position.set(0, 0.35, 0.8);
  primeGroup.add(grill);

  // Head & Helmet
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 2.4, 0.1);
  const helmet = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.95, 0.9), primeNavy);
  headGroup.add(helmet);

  const crest = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.6, 1.05), primeNavy);
  crest.position.set(0, 0.55, -0.05);
  headGroup.add(crest);

  const leftAnt = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.8, 12), primeNavy);
  leftAnt.position.set(-0.52, 0.35, 0);
  headGroup.add(leftAnt);

  const rightAnt = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.8, 12), primeNavy);
  rightAnt.position.set(0.52, 0.35, 0);
  headGroup.add(rightAnt);

  const faceplate = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.38, 0.25), chrome);
  faceplate.position.set(0, -0.22, 0.42);
  headGroup.add(faceplate);

  const leftEye = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.08, 0.15), energon);
  leftEye.position.set(-0.18, 0.08, 0.45);
  headGroup.add(leftEye);

  const rightEye = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.08, 0.15), energon);
  rightEye.position.set(0.18, 0.08, 0.45);
  headGroup.add(rightEye);

  primeGroup.add(headGroup);

  // Shoulders & Smokestacks
  const leftShoulder = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.0, 1.4), primeRed);
  leftShoulder.position.set(-1.8, 1.7, 0);
  primeGroup.add(leftShoulder);

  const rightShoulder = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.0, 1.4), primeRed);
  rightShoulder.position.set(1.8, 1.7, 0);
  primeGroup.add(rightShoulder);

  const stackGeo = new THREE.CylinderGeometry(0.12, 0.12, 2.4, 16);
  const leftStack = new THREE.Mesh(stackGeo, chrome);
  leftStack.position.set(-2.2, 2.6, -0.2);
  primeGroup.add(leftStack);

  const rightStack = new THREE.Mesh(stackGeo, chrome);
  rightStack.position.set(2.2, 2.6, -0.2);
  primeGroup.add(rightStack);

  // Arms & Hands
  const bicepGeo = new THREE.CylinderGeometry(0.25, 0.22, 1.2, 12);
  const leftBicep = new THREE.Mesh(bicepGeo, chrome);
  leftBicep.position.set(-1.8, 0.9, 0);
  primeGroup.add(leftBicep);

  const rightBicep = new THREE.Mesh(bicepGeo, chrome);
  rightBicep.position.set(1.8, 0.9, 0);
  primeGroup.add(rightBicep);

  const forearmGeo = new THREE.BoxGeometry(0.65, 1.4, 0.7);
  const leftForearm = new THREE.Mesh(forearmGeo, primeRed);
  leftForearm.position.set(-1.8, -0.2, 0.2);
  primeGroup.add(leftForearm);

  const rightForearm = new THREE.Mesh(forearmGeo, primeRed);
  rightForearm.position.set(1.8, -0.2, 0.2);
  primeGroup.add(rightForearm);

  const handGeo = new THREE.BoxGeometry(0.4, 0.45, 0.45);
  const leftHand = new THREE.Mesh(handGeo, primeNavy);
  leftHand.position.set(-1.8, -1.0, 0.2);
  primeGroup.add(leftHand);

  const rightHand = new THREE.Mesh(handGeo, primeNavy);
  rightHand.position.set(1.8, -1.0, 0.2);
  primeGroup.add(rightHand);

  // Pelvis & Wheels
  const pelvis = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.8, 1.3), primeNavy);
  pelvis.position.set(0, -0.3, 0);
  primeGroup.add(pelvis);

  const tireGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.35, 20);
  const rimGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.37, 16);

  function addWheel(x, y, z) {
    const w = new THREE.Group();
    const t = new THREE.Mesh(tireGeo, rubber);
    t.rotation.z = Math.PI / 2;
    const r = new THREE.Mesh(rimGeo, chrome);
    r.rotation.z = Math.PI / 2;
    w.add(t);
    w.add(r);
    w.position.set(x, y, z);
    primeGroup.add(w);
  }

  addWheel(-1.25, -0.3, -0.2);
  addWheel(1.25, -0.3, -0.2);

  // Legs & Feet
  const thighGeo = new THREE.CylinderGeometry(0.3, 0.26, 1.4, 12);
  const leftThigh = new THREE.Mesh(thighGeo, chrome);
  leftThigh.position.set(-0.65, -1.3, 0);
  primeGroup.add(leftThigh);

  const rightThigh = new THREE.Mesh(thighGeo, chrome);
  rightThigh.position.set(0.65, -1.3, 0);
  primeGroup.add(rightThigh);

  const calfGeo = new THREE.BoxGeometry(0.9, 2.0, 1.1);
  const leftCalf = new THREE.Mesh(calfGeo, primeNavy);
  leftCalf.position.set(-0.65, -2.9, 0.05);
  primeGroup.add(leftCalf);

  const rightCalf = new THREE.Mesh(calfGeo, primeNavy);
  rightCalf.position.set(0.65, -2.9, 0.05);
  primeGroup.add(rightCalf);

  addWheel(-1.22, -2.7, 0.1);
  addWheel(1.22, -2.7, 0.1);

  const footGeo = new THREE.BoxGeometry(0.95, 0.45, 1.6);
  const leftFoot = new THREE.Mesh(footGeo, primeNavy);
  leftFoot.position.set(-0.65, -4.0, 0.3);
  primeGroup.add(leftFoot);

  const rightFoot = new THREE.Mesh(footGeo, primeNavy);
  rightFoot.position.set(0.65, -4.0, 0.3);
  primeGroup.add(rightFoot);

  const exporter = new GLTFExporter();
  const gltf = await exporter.parseAsync(primeGroup, { binary: true });

  const modelsDir = path.resolve('public/models');
  if (!fs.existsSync(modelsDir)) fs.mkdirSync(modelsDir, { recursive: true });
  const outPath = path.join(modelsDir, 'optimus-prime.glb');
  fs.writeFileSync(outPath, Buffer.from(gltf));
  console.log(`GLB_EXPORT_SUCCESS: ${outPath} (${fs.statSync(outPath).size} bytes)`);
}

run().catch(err => console.error("RUN_ERR:", err));
