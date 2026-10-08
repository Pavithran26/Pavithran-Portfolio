import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Node.js polyfill for Three.js GLTFExporter
class FileReaderPolyfill {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then(buf => {
      this.result = buf;
      if (this.onloadend) this.onloadend({ target: this });
    });
  }
}
global.FileReader = FileReaderPolyfill;

console.log('⚡ Initializing Optimus Prime 3D GLB Generator...');

// Materials
const primeRed = new THREE.MeshStandardMaterial({
  name: 'Prime_Crimson_Armor',
  color: 0xc81919,
  metalness: 0.84,
  roughness: 0.24,
});

const primeNavy = new THREE.MeshStandardMaterial({
  name: 'Prime_Cybertronian_Blue',
  color: 0x12254a,
  metalness: 0.86,
  roughness: 0.26,
});

const primeChrome = new THREE.MeshStandardMaterial({
  name: 'Prime_Polished_Chrome',
  color: 0xdde4f0,
  metalness: 0.96,
  roughness: 0.12,
});

const darkChassis = new THREE.MeshStandardMaterial({
  name: 'Prime_Dark_Chassis',
  color: 0x161a22,
  metalness: 0.90,
  roughness: 0.42,
});

const tireRubber = new THREE.MeshStandardMaterial({
  name: 'Tire_Vulcanized_Rubber',
  color: 0x181a1d,
  metalness: 0.12,
  roughness: 0.85,
});

const goldAlloy = new THREE.MeshStandardMaterial({
  name: 'Matrix_Gold_Alloy',
  color: 0xdeb030,
  metalness: 0.92,
  roughness: 0.20,
});

const energonGlow = new THREE.MeshStandardMaterial({
  name: 'Energon_Cyan_Core',
  color: 0x00f0ff,
  emissive: 0x00e5ff,
  emissiveIntensity: 2.5,
  roughness: 0.1,
  metalness: 0.1,
});

const cabGlass = new THREE.MeshStandardMaterial({
  name: 'Cab_Windshield_Glass',
  color: 0x0d2238,
  metalness: 0.15,
  roughness: 0.12,
  transparent: true,
  opacity: 0.88,
});

const flameAccent = new THREE.MeshStandardMaterial({
  name: 'Flame_Yellow_Livery',
  color: 0xffa014,
  metalness: 0.80,
  roughness: 0.28,
});

// Helper for wheels
function createWheel() {
  const wheelGroup = new THREE.Group();
  wheelGroup.name = 'Truck_Wheel';

  // Tire rubber cylinder (with central hole via torus or tube)
  const tireGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.24, 24);
  tireGeo.rotateZ(Math.PI / 2);
  const tire = new THREE.Mesh(tireGeo, tireRubber);
  wheelGroup.add(tire);

  // Chrome rim
  const rimGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.25, 18);
  rimGeo.rotateZ(Math.PI / 2);
  const rim = new THREE.Mesh(rimGeo, primeChrome);
  wheelGroup.add(rim);

  // Center hub cap & lug nuts
  const hubGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.28, 12);
  hubGeo.rotateZ(Math.PI / 2);
  const hub = new THREE.Mesh(hubGeo, goldAlloy);
  wheelGroup.add(hub);

  return wheelGroup;
}

// Master Optimus Prime Root Group
const optimus = new THREE.Group();
optimus.name = 'Optimus_Prime_Leader_Class';

// ─── 1. HEAD & CREST & FACEPLATE ──────────────────────────────────────
const headGroup = new THREE.Group();
headGroup.name = 'Head_Unit';
headGroup.position.set(0, 2.25, 0.08);

// Helmet base
const helmetGeo = new THREE.BoxGeometry(0.72, 0.78, 0.75);
const helmet = new THREE.Mesh(helmetGeo, primeNavy);
headGroup.add(helmet);

// Central mohawk crest fin
const crestGeo = new THREE.BoxGeometry(0.14, 0.52, 0.88);
const crest = new THREE.Mesh(crestGeo, primeNavy);
crest.position.set(0, 0.44, -0.04);
headGroup.add(crest);

const crestTipGeo = new THREE.BoxGeometry(0.08, 0.18, 0.3);
const crestTip = new THREE.Mesh(crestTipGeo, primeChrome);
crestTip.position.set(0, 0.65, 0.1);
headGroup.add(crestTip);

// Side Antennae / Ear Audio-Sensors
const antLGeo = new THREE.CylinderGeometry(0.04, 0.06, 0.75, 12);
const antL = new THREE.Mesh(antLGeo, primeNavy);
antL.position.set(-0.42, 0.35, 0);
headGroup.add(antL);

const antR = new THREE.Mesh(antLGeo, primeNavy);
antR.position.set(0.42, 0.35, 0);
headGroup.add(antR);

// Faceplate / Battle Mask
const faceplateGeo = new THREE.BoxGeometry(0.54, 0.32, 0.22);
const faceplate = new THREE.Mesh(faceplateGeo, primeChrome);
faceplate.position.set(0, -0.18, 0.36);
faceplate.rotation.x = -0.15;
headGroup.add(faceplate);

// Glowing Energon Blue Optics (Eyes)
const eyeGeo = new THREE.BoxGeometry(0.16, 0.06, 0.12);
const eyeL = new THREE.Mesh(eyeGeo, energonGlow);
eyeL.position.set(-0.15, 0.07, 0.38);
headGroup.add(eyeL);

const eyeR = new THREE.Mesh(eyeGeo, energonGlow);
eyeR.position.set(0.15, 0.07, 0.38);
headGroup.add(eyeR);

// Neck actuator
const neckGeo = new THREE.CylinderGeometry(0.25, 0.28, 0.35, 16);
const neck = new THREE.Mesh(neckGeo, darkChassis);
neck.position.set(0, -0.45, 0);
headGroup.add(neck);

optimus.add(headGroup);

// ─── 2. TORSO & CAB CHEST & MATRIX ───────────────────────────────────
const torsoGroup = new THREE.Group();
torsoGroup.name = 'Torso_Chest_Unit';
torsoGroup.position.set(0, 1.1, 0);

// Main red chest block (Peterbilt 379 Truck Cab)
const cabGeo = new THREE.BoxGeometry(2.1, 1.6, 1.35);
const cab = new THREE.Mesh(cabGeo, primeRed);
torsoGroup.add(cab);

// Dual Windshield Windows
const winGeo = new THREE.BoxGeometry(0.85, 0.72, 0.12);
const winL = new THREE.Mesh(winGeo, cabGlass);
winL.position.set(-0.48, 0.28, 0.72);
torsoGroup.add(winL);

const winR = new THREE.Mesh(winGeo, cabGlass);
winR.position.set(0.48, 0.28, 0.72);
torsoGroup.add(winR);

// Windshield center pillar & wiper bracket
const pillarGeo = new THREE.BoxGeometry(0.12, 0.74, 0.14);
const pillar = new THREE.Mesh(pillarGeo, primeRed);
pillar.position.set(0, 0.28, 0.72);
torsoGroup.add(pillar);

// Roof Visor & Marker Lights
const visorGeo = new THREE.BoxGeometry(1.9, 0.15, 0.3);
const visor = new THREE.Mesh(visorGeo, primeRed);
visor.position.set(0, 0.85, 0.55);
torsoGroup.add(visor);

[-0.6, -0.2, 0.2, 0.6].forEach(x => {
  const lightGeo = new THREE.BoxGeometry(0.1, 0.06, 0.08);
  const light = new THREE.Mesh(lightGeo, flameAccent);
  light.position.set(x, 0.88, 0.68);
  torsoGroup.add(light);
});

// Front Chrome Radiator Grille
const grillBaseGeo = new THREE.BoxGeometry(1.4, 0.55, 0.12);
const grillBase = new THREE.Mesh(grillBaseGeo, primeChrome);
grillBase.position.set(0, -0.45, 0.72);
torsoGroup.add(grillBase);

// Headlight Clusters
const lightClusterGeo = new THREE.BoxGeometry(0.25, 0.35, 0.14);
const hLightL = new THREE.Mesh(lightClusterGeo, primeChrome);
hLightL.position.set(-0.9, -0.45, 0.7);
torsoGroup.add(hLightL);

const hLightR = new THREE.Mesh(lightClusterGeo, primeChrome);
hLightR.position.set(0.9, -0.45, 0.7);
torsoGroup.add(hLightR);

// ─── MATRIX OF LEADERSHIP (Chamber Core) ─────────────────────────────
const matrixGroup = new THREE.Group();
matrixGroup.name = 'Matrix_Of_Leadership';
matrixGroup.position.set(0, 0.15, 0.76);

const mShellGeo = new THREE.SphereGeometry(0.32, 20, 20);
const mShell = new THREE.Mesh(mShellGeo, primeChrome);
matrixGroup.add(mShell);

const mHandleGeo = new THREE.TorusGeometry(0.22, 0.045, 12, 24, Math.PI);
const mHandleL = new THREE.Mesh(mHandleGeo, goldAlloy);
mHandleL.rotation.z = Math.PI / 2;
mHandleL.position.set(-0.45, 0, 0);
matrixGroup.add(mHandleL);

const mHandleR = new THREE.Mesh(mHandleGeo, goldAlloy);
mHandleR.rotation.z = -Math.PI / 2;
mHandleR.position.set(0.45, 0, 0);
matrixGroup.add(mHandleR);

const mCrystalGeo = new THREE.IcosahedronGeometry(0.15, 0);
const mCrystal = new THREE.Mesh(mCrystalGeo, energonGlow);
matrixGroup.add(mCrystal);

torsoGroup.add(matrixGroup);

// Dual Chrome Smokestacks on Back
const stackGeo = new THREE.CylinderGeometry(0.1, 0.1, 2.3, 16);
const stackL = new THREE.Mesh(stackGeo, primeChrome);
stackL.position.set(-1.15, 0.85, -0.55);
torsoGroup.add(stackL);

const stackR = new THREE.Mesh(stackGeo, primeChrome);
stackR.position.set(1.15, 0.85, -0.55);
torsoGroup.add(stackR);

optimus.add(torsoGroup);

// ─── 3. SHOULDERS & ARMS ─────────────────────────────────────────────
function createArm(isLeft) {
  const side = isLeft ? -1 : 1;
  const armGroup = new THREE.Group();
  armGroup.name = isLeft ? 'Left_Arm' : 'Right_Arm';
  armGroup.position.set(side * 1.45, 1.6, 0);

  // Shoulder Pauldron (Red Armor with Flame Accent & Blue base)
  const pauldronGeo = new THREE.BoxGeometry(0.95, 0.85, 1.25);
  const pauldron = new THREE.Mesh(pauldronGeo, primeRed);
  pauldron.rotation.z = side * -0.15;
  armGroup.add(pauldron);

  const pauldronFlame = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.3, 1.26), flameAccent);
  pauldronFlame.position.set(0, -0.2, 0);
  pauldron.add(pauldronFlame);

  // Shoulder Ball Joint
  const shJointGeo = new THREE.SphereGeometry(0.32, 16, 16);
  const shJoint = new THREE.Mesh(shJointGeo, darkChassis);
  shJoint.position.set(side * 0.1, -0.35, 0);
  armGroup.add(shJoint);

  // Bicep
  const bicepGroup = new THREE.Group();
  bicepGroup.position.set(side * 0.1, -0.85, 0);

  const bicepCoreGeo = new THREE.BoxGeometry(0.5, 0.7, 0.55);
  const bicepCore = new THREE.Mesh(bicepCoreGeo, primeNavy);
  bicepGroup.add(bicepCore);

  const bicepPistonGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.65, 12);
  const bicepPiston = new THREE.Mesh(bicepPistonGeo, primeChrome);
  bicepPiston.position.set(side * -0.22, 0, 0.15);
  bicepGroup.add(bicepPiston);

  armGroup.add(bicepGroup);

  // Elbow Joint
  const elbowGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.45, 16);
  elbowGeo.rotateZ(Math.PI / 2);
  const elbow = new THREE.Mesh(elbowGeo, darkChassis);
  elbow.position.set(side * 0.1, -1.3, 0);
  armGroup.add(elbow);

  // Forearm Gauntlet (Red with yellow flames and blue undercarriage)
  const forearmGroup = new THREE.Group();
  forearmGroup.position.set(side * 0.1, -1.95, 0.08);

  const gauntletGeo = new THREE.BoxGeometry(0.65, 0.95, 0.7);
  const gauntlet = new THREE.Mesh(gauntletGeo, primeRed);
  forearmGroup.add(gauntlet);

  const flameStrip = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.4, 0.71), flameAccent);
  flameStrip.position.set(0, -0.15, 0);
  forearmGroup.add(flameStrip);

  // Exhaust pipe attached to outer forearm
  const exPipeGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.8, 12);
  const exPipe = new THREE.Mesh(exPipeGeo, primeChrome);
  exPipe.position.set(side * 0.38, 0.1, -0.15);
  forearmGroup.add(exPipe);

  // Mechanical Hand / Knuckles
  const handGroup = new THREE.Group();
  handGroup.position.set(0, -0.65, 0);

  const palmGeo = new THREE.BoxGeometry(0.35, 0.3, 0.45);
  const palm = new THREE.Mesh(palmGeo, darkChassis);
  handGroup.add(palm);

  // Articulated fingers (closed heroic fist / command pose)
  const fingerGeo = new THREE.BoxGeometry(0.08, 0.24, 0.1);
  for (let f = -1.5; f <= 1.5; f += 1) {
    const finger = new THREE.Mesh(fingerGeo, primeChrome);
    finger.position.set(side * 0.12, -0.2, f * 0.1);
    handGroup.add(finger);
  }

  forearmGroup.add(handGroup);
  armGroup.add(forearmGroup);

  return armGroup;
}

optimus.add(createArm(true));
optimus.add(createArm(false));

// ─── 4. PELVIS & FUEL TANKS & HIP WHEELS ─────────────────────────────
const pelvisGroup = new THREE.Group();
pelvisGroup.name = 'Pelvis_Waist_Unit';
pelvisGroup.position.set(0, 0.05, 0);

// Center pelvis core
const pelvisGeo = new THREE.BoxGeometry(1.5, 0.65, 1.1);
const pelvis = new THREE.Mesh(pelvisGeo, darkChassis);
pelvisGroup.add(pelvis);

// Front buckle / Autobot emblem plate
const buckleGeo = new THREE.BoxGeometry(0.45, 0.4, 0.15);
const buckle = new THREE.Mesh(buckleGeo, primeRed);
buckle.position.set(0, 0.05, 0.6);
pelvisGroup.add(buckle);

const emblemDot = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 0.06), goldAlloy);
emblemDot.position.set(0, 0.05, 0.7);
pelvisGroup.add(emblemDot);

// Cylindrical Chrome Fuel Tanks on sides
const tankGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.9, 16);
tankGeo.rotateX(Math.PI / 2);
const tankL = new THREE.Mesh(tankGeo, primeChrome);
tankL.position.set(-0.95, -0.05, 0);
pelvisGroup.add(tankL);

const tankR = new THREE.Mesh(tankGeo, primeChrome);
tankR.position.set(0.95, -0.05, 0);
pelvisGroup.add(tankR);

// Hip Mounted Truck Wheels (Rear truck axle wheels visible at hips)
const hipWheelL = createWheel();
hipWheelL.position.set(-1.25, -0.1, -0.15);
pelvisGroup.add(hipWheelL);

const hipWheelR = createWheel();
hipWheelR.position.set(1.25, -0.1, -0.15);
pelvisGroup.add(hipWheelR);

optimus.add(pelvisGroup);

// ─── 5. LEGS & KNEES & CALF TIRES & BOOTS ────────────────────────────
function createLeg(isLeft) {
  const side = isLeft ? -1 : 1;
  const legGroup = new THREE.Group();
  legGroup.name = isLeft ? 'Left_Leg' : 'Right_Leg';
  legGroup.position.set(side * 0.55, -0.3, 0);

  // Upper Thigh
  const thighGroup = new THREE.Group();
  thighGroup.position.set(0, -0.5, 0);

  const thighGeo = new THREE.BoxGeometry(0.65, 0.95, 0.65);
  const thigh = new THREE.Mesh(thighGeo, primeNavy);
  thighGroup.add(thigh);

  // Chrome hydraulic cylinders along thigh
  const cylGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.95, 12);
  const cylFront = new THREE.Mesh(cylGeo, primeChrome);
  cylFront.position.set(0, 0, 0.35);
  thighGroup.add(cylFront);

  const cylBack = new THREE.Mesh(cylGeo, darkChassis);
  cylBack.position.set(side * 0.15, 0, -0.35);
  thighGroup.add(cylBack);

  legGroup.add(thighGroup);

  // Knee Guard (Navy Blue with Chrome edge)
  const kneeGroup = new THREE.Group();
  kneeGroup.position.set(0, -1.1, 0.1);

  const kneeCapGeo = new THREE.BoxGeometry(0.6, 0.45, 0.4);
  const kneeCap = new THREE.Mesh(kneeCapGeo, primeNavy);
  kneeCap.rotation.x = 0.2;
  kneeGroup.add(kneeCap);

  const kneePlate = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.2, 0.15), primeChrome);
  kneePlate.position.set(0, 0, 0.22);
  kneeGroup.add(kneePlate);

  legGroup.add(kneeGroup);

  // Lower Leg / Shin / Calf (Heavy armored blue with flame livery)
  const calfGroup = new THREE.Group();
  calfGroup.position.set(0, -1.9, 0);

  const shinGeo = new THREE.BoxGeometry(0.85, 1.2, 0.85);
  const shin = new THREE.Mesh(shinGeo, primeNavy);
  calfGroup.add(shin);

  // Front flame livery on shin
  const shinFlame = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.65, 0.1), flameAccent);
  shinFlame.position.set(0, 0.1, 0.45);
  calfGroup.add(shinFlame);

  // Outer Calf Mounted Wheel (Peterbilt rear dual wheels)
  const calfWheel = createWheel();
  calfWheel.position.set(side * 0.52, -0.15, -0.2);
  calfGroup.add(calfWheel);

  // Achilles Chrome Hydraulic Strut
  const achillesGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.1, 12);
  const achilles = new THREE.Mesh(achillesGeo, primeChrome);
  achilles.position.set(0, 0, -0.42);
  calfGroup.add(achilles);

  legGroup.add(calfGroup);

  // Foot / Boot (Heavy Cybertronian mech foot with toes & heel spurs)
  const footGroup = new THREE.Group();
  footGroup.position.set(0, -2.65, 0.2);

  const footMainGeo = new THREE.BoxGeometry(0.85, 0.35, 1.25);
  const footMain = new THREE.Mesh(footMainGeo, primeNavy);
  footGroup.add(footMain);

  // Toe Claws / Treads
  const toeGeo = new THREE.BoxGeometry(0.78, 0.22, 0.45);
  const toes = new THREE.Mesh(toeGeo, primeChrome);
  toes.position.set(0, -0.06, 0.65);
  footGroup.add(toes);

  // Heel Spur Stabilizer
  const heelGeo = new THREE.BoxGeometry(0.75, 0.28, 0.4);
  const heel = new THREE.Mesh(heelGeo, darkChassis);
  heel.position.set(0, -0.04, -0.7);
  footGroup.add(heel);

  legGroup.add(footGroup);

  return legGroup;
}

optimus.add(createLeg(true));
optimus.add(createLeg(false));

console.log('🦾 Optimus Prime procedural hierarchy assembled with', optimus.children.length, 'primary subsystems.');

// Export to Binary GLB
const exporter = new GLTFExporter();
exporter.parse(
  optimus,
  (glbArrayBuffer) => {
    const modelsDir = path.resolve(__dirname, '../public/models');
    if (!fs.existsSync(modelsDir)) {
      fs.mkdirSync(modelsDir, { recursive: true });
    }

    const outputPath = path.join(modelsDir, 'optimus-prime.glb');
    const buffer = Buffer.from(glbArrayBuffer);
    fs.writeFileSync(outputPath, buffer);

    console.log(`✅ GLB Model Exported Successfully: ${outputPath}`);
    console.log(`📦 File Size: ${(buffer.length / 1024).toFixed(2)} KB`);
  },
  (error) => {
    console.error('❌ Failed to export GLB:', error);
    process.exit(1);
  },
  { binary: true }
);
