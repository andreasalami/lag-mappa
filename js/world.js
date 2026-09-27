// Scena voxel di Cascina Marasco al tramonto, costruita da map.js.
import * as THREE from 'three';
import { grid, W, H, tileAt, walkable, zoneAt, zoneCells, zoneCenter, ZONES } from './map.js';

const unit = new THREE.BoxGeometry(1, 1, 1);
const materials = new Map();
// glow = colore pieno non influenzato dalle luci: lampadine, schermi, linee delle zone.
export const mat = (color, glow = false) => {
  const key = `${color}-${glow}`;
  if (!materials.has(key)) {
    materials.set(key, glow ? new THREE.MeshBasicMaterial({ color }) : new THREE.MeshLambertMaterial({ color }));
  }
  return materials.get(key);
};

// Cubo singolo per oggetti che si muovono. y è la base del cubo.
export function part(parent, x, y, z, w, h, d, color, glow = false) {
  const mesh = new THREE.Mesh(unit, mat(color, glow));
  mesh.position.set(x, y + h / 2, z);
  mesh.scale.set(w, h, d);
  mesh.castShadow = mesh.receiveShadow = !glow;
  parent.add(mesh);
  return mesh;
}

// Numero pseudo-casuale stabile per casella.
const rand = (a, b) => {
  const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return s - Math.floor(s);
};
const pick = (list, a, b) => list[Math.floor(rand(a, b) * list.length)];

export const toWorld = (c, r) => ({ x: c - (W - 1) / 2, z: r - (H - 1) / 2 });

export const ZONE_COLORS = {
  ingresso: 0x1e3a5f, casse: 0x1e88e5, cucina: 0xe53935, bar: 0xfb8c00, birra: 0x43a047,
  giochi: 0x8e24aa, tavoli: 0xfdd835, stage1: 0xffffff, stage2: 0xffffff,
};

const C = {
  grass: [0x93d05c, 0x8ac755],
  grassOut: [0x74ab47, 0x6ea343],
  field: [0xe0c67c, 0xd4b96c],
  road: 0xd6cbb8,
  yard: 0xd8d5ce, // piazza in cemento
  dirt: 0xb48d60,
  trunk: 0x8a5a36,
  leaves: [0x4caf50, 0x43a047, 0x66bb6a, 0x7cb342],
  wall: [0xf1e3c8, 0xeddcbc],
  roof: [0xbd6843, 0xae5b3b],
  pv: [0x2b4170, 0x34508a],
  tunnel: [0xf4f6f6, 0xe6ebed],
  wood: 0xa0703f,
  darkWood: 0x6d4426,
  cars: [0xe53935, 0xf5f5f5, 0x1e88e5, 0x90a4ae, 0x263238],
  shirts: [0xf2802e, 0x1e3a5f, 0xffffff, 0xe53935, 0x43a047, 0xfdd835, 0x8e24aa, 0x00acc1],
  skin: [0xf1c27d, 0xe0ac69, 0xc68642, 0x8d5524],
};

const BUILDING = 'SPV';
const isBuilding = (t) => t && BUILDING.includes(t);

// Distanza dal bordo dell'edificio: serve per il tetto a gradoni.
function roofStep(c, r, same) {
  let d = 99;
  for (const [dc, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    let k = 0;
    while (same(tileAt(c + dc * (k + 1), r + dr * (k + 1)))) k++;
    d = Math.min(d, k);
  }
  return d;
}

// Rettangolo che contiene le caselle `ch` di una zona (chioschi, palchi, food truck).
function groupBox(id, ch) {
  const cells = zoneCells(id).filter(({ c, r }) => tileAt(c, r) === ch);
  if (!cells.length) return null;
  const cs = cells.map((p) => p.c);
  const rs = cells.map((p) => p.r);
  const a = toWorld(Math.min(...cs), Math.min(...rs));
  const b = toWorld(Math.max(...cs), Math.max(...rs));
  return { x0: a.x, z0: a.z, x1: b.x, z1: b.z, cx: (a.x + b.x) / 2, cz: (a.z + b.z) / 2, w: b.x - a.x + 1, d: b.z - a.z + 1 };
}

// Direzione "davanti" di un gruppo: dal suo centro verso il centro della sua zona,
// sull'asse prevalente. Così chioschi, palchi e food truck si girano da soli se si spostano.
function facing(k, id) {
  const zc = zoneCenter(id);
  const { x, z } = toWorld(zc.c, zc.r);
  const dx = x - k.cx;
  const dz = z - k.cz;
  return Math.abs(dx) > Math.abs(dz) ? { dx: Math.sign(dx), dz: 0 } : { dx: 0, dz: Math.sign(dz) || 1 };
}

// Gruppo costruito con il davanti verso +z locale e poi ruotato verso `f`.
function orientedGroup(scene, k, f) {
  const g = new THREE.Group();
  g.position.set(k.cx, 0, k.cz);
  g.rotation.y = Math.atan2(f.dx, f.dz);
  scene.add(g);
  const across = f.dz ? k.w : k.d; // larghezza del fronte
  const deep = f.dz ? k.d : k.w;
  return { g, across, deep };
}

function makeKiosk(scene, id) {
  const k = groupBox(id, 'K');
  if (!k) return;
  const color = ZONE_COLORS[id];
  const { g, across: w } = orientedGroup(scene, k, facing(k, id));
  part(g, 0, 0, -0.1, w - 0.1, 0.6, 0.7, color);
  part(g, 0, 0.6, 0, w - 0.1, 0.06, 0.8, 0xffffff);
  for (const dx of [-w / 2 + 0.1, w / 2 - 0.1]) part(g, dx, 0, 0.4, 0.07, 1.35, 0.07, 0xffffff);
  const n = Math.round(w * 2);
  for (let i = 0; i < n; i++) part(g, -w / 2 + (i + 0.5) * (w / n), 1.35, 0, w / n, 0.14, 1.05, i & 1 ? 0xffffff : color);
  part(g, 0, 1.49, -0.35, w * 0.7, 0.34, 0.08, color, true);
  part(g, 0, 1.6, -0.3, w * 0.45, 0.06, 0.02, 0xffffff, true);
}

function makeFoodTruck(scene, id) {
  const k = groupBox(id, 'F');
  if (!k) return;
  const { g, across: L } = orientedGroup(scene, k, facing(k, id)); // sportello sul davanti
  part(g, 0, 0.15, 0, L - 0.1, 1.05, 0.9, 0xffffff);
  part(g, 0, 0.62, 0, L - 0.08, 0.16, 0.92, 0xf2802e);
  part(g, -0.2, 0.6, 0.46, 0.9, 0.36, 0.02, 0x263238);
  part(g, -0.2, 1.02, 0.62, 1.0, 0.05, 0.34, 0xf2802e);
  part(g, -0.2, 1.2, 0, 0.5, 0.2, 0.08, 0xffd23f, true);
  for (const dx of [-L / 2 + 0.35, L / 2 - 0.35]) for (const dz of [-0.4, 0.4]) part(g, dx, 0, dz, 0.22, 0.22, 0.1, 0x212121);
}

function buildStatic(scene) {
  // Cubi fermi raggruppati per colore in InstancedMesh: poche chiamate di disegno.
  const buckets = new Map();
  const m4 = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  const p = new THREE.Vector3();
  const s = new THREE.Vector3();
  const box = (x, y, z, w, h, d, color, glow = false) => {
    q.setFromEuler(e.set(0, 0, 0));
    m4.compose(p.set(x, y + h / 2, z), q, s.set(w, h, d));
    const key = `${color}-${glow}`;
    if (!buckets.has(key)) buckets.set(key, { color, glow, list: [] });
    buckets.get(key).list.push(m4.clone());
  };

  const tree = (x, z, a, b) => {
    const leaf = pick(C.leaves, a, b);
    box(x, 0, z, 0.28, 0.45, 0.28, C.trunk);
    box(x, 0.45, z, 0.86, 0.75, 0.86, leaf);
    if (rand(b, a) > 0.4) box(x, 1.2, z, 0.58, 0.5, 0.58, leaf);
  };
  const car = (x, z, a, b) => {
    const color = pick(C.cars, a, b);
    box(x, 0.08, z, 0.8, 0.3, 0.46, color);
    box(x - 0.05, 0.38, z, 0.46, 0.22, 0.42, 0x37474f);
    for (const dx of [-0.26, 0.26]) for (const dz of [-0.2, 0.2]) box(x + dx, 0, z + dz, 0.16, 0.16, 0.08, 0x212121);
  };

  const MX = 14;
  const MZ = 10;
  for (let r = -MZ; r < H + MZ; r++) {
    for (let c = -MX; c < W + MX; c++) {
      const { x, z } = toWorld(c, r);
      const inside = tileAt(c, r);
      let t = inside;
      if (!t) {
        // Fuori mappa: la strada d'ingresso continua verso est con auto parcheggiate.
        if (c >= W && (r === 15 || r === 16)) t = 's';
        else if (c >= W && (r === 14 || r === 17)) t = rand(c, r) < 0.4 ? 'a' : '.';
        else t = rand(c, r) < 0.38 ? 'T' : '.';
      }
      const odd = r & 1;
      // Sotto chioschi, palchi e tavoli c'è il fondo della loro zona:
      // terra allo Stage 1, ghiaia nel cortile dello Stage 2, cemento in piazza.
      const event = 'KXnFypw'.includes(t) ? ({ stage1: C.dirt, stage2: C.road }[zoneAt(c, r)] ?? C.yard) : null;
      const ground = event ?? { s: C.road, a: inside ? C.road : C.grassOut[odd], '@': C.road, g: C.yard, d: C.dirt, ';': C.field[c & 1] }[t]
        ?? (inside ? C.grass[odd] : C.grassOut[odd]);
      box(x, -0.6, z, 1, 0.6, 1, ground);

      switch (t) {
        case 'T': tree(x, z, c, r); break;
        case 'h': box(x, 0, z, 1, 0.7, 0.9, 0x3f7d3a); break;
        case 'a': car(x, z, c, r); break;
        case 'o':
          box(x, 0, z, 0.9, 0.16, 0.8, 0x6d4c33);
          for (const dx of [-0.25, 0, 0.25]) box(x + dx, 0.16, z, 0.14, 0.16, 0.14, (c + r) & 1 ? 0x7cb342 : 0x9ccc65);
          break;
        case 'S':
        case 'P':
        case 'V': {
          const d = roofStep(c, r, isBuilding);
          const wallH = 1.3;
          if (d === 0) {
            box(x, 0, z, 1, wallH, 1, C.wall[(c + r) & 1]);
            // Facciate: arcate verso gli spazi calpestabili (tende verdi per 'V'), finestre altrove.
            for (const [dc, dr] of [[0, -1], [0, 1], [-1, 0], [1, 0]]) {
              if (isBuilding(tileAt(c + dc, r + dr))) continue;
              const face = (y, h, size, color) =>
                box(x + dc * 0.5, y, z + dr * 0.5, dr ? size : 0.03, h, dr ? 0.03 : size, color);
              const even = ((dr ? c : r) & 1) === 0;
              if (!walkable(c + dc, r + dr)) {
                if (!even) face(0.55, 0.3, 0.3, 0x3b3b4a);
              } else if (t === 'V') face(0, 1.1, 0.96, 0x2e7d4f);
              else if (even) face(0, 0.95, 0.5, 0x5b4636);
            }
          }
          // Coppi a gradoni; pannelli solari in file piane.
          if (t === 'P') box(x, wallH - 0.05, z, 1, 0.3, 1, C.pv[r & 1]);
          else box(x, wallH - 0.05, z, 1, 0.2 + d * 0.26, 1, C.roof[d & 1]);
          break;
        }
        case 'Q': {
          const d = roofStep(c, r, (u) => u === 'Q');
          box(x, 0, z, 1, 0.35 + d * 0.3, 1, C.tunnel[d & 1]);
          break;
        }
        case 'B':
          box(x, 0, z, 1, 0.8, 1, 0xc9b79a);
          box(x, 0.8, z, 1.02, 0.12, 1.02, 0x8d9399);
          break;
        case 'n':
          box(x, 0.42, z, 0.96, 0.07, 0.5, C.wood);
          box(x, 0, z, 0.08, 0.42, 0.4, C.darkWood);
          for (const dz of [-0.38, 0.38]) box(x, 0.22, z + dz, 0.96, 0.06, 0.18, C.wood);
          break;
        case 'w':
          [0xfdd835, 0x1e88e5, 0x43a047, 0x607d8b].forEach((color, i) => box(x - 0.33 + i * 0.22, 0, z, 0.19, 0.42, 0.34, color));
          break;
        case 'y':
          box(x, 0, z, 0.1, 0.35, 0.1, 0x37474f);
          box(x, 0.35, z, 0.8, 0.22, 0.5, 0x2e7d32);
          box(x, 0.57, z, 0.84, 0.04, 0.54, 0xffffff);
          break;
      }
    }
  }

  // Bordi colorati delle zone, come i contorni della mappa dell'evento.
  const LINE = 0.07;
  for (const id of ZONES) {
    const color = ZONE_COLORS[id];
    for (const { c, r } of zoneCells(id)) {
      const { x, z } = toWorld(c, r);
      if (zoneAt(c, r - 1) !== id) box(x, 0, z - 0.5 + LINE / 2, 1, 0.03, LINE, color, true);
      if (zoneAt(c, r + 1) !== id) box(x, 0, z + 0.5 - LINE / 2, 1, 0.03, LINE, color, true);
      if (zoneAt(c - 1, r) !== id) box(x - 0.5 + LINE / 2, 0, z, LINE, 0.03, 1, color, true);
      if (zoneAt(c + 1, r) !== id) box(x + 0.5 - LINE / 2, 0, z, LINE, 0.03, 1, color, true);
    }
  }

  // Lucine sopra la zona tavoli.
  const tv = zoneCells('tavoli');
  const a = toWorld(Math.min(...tv.map((p) => p.c)), Math.min(...tv.map((p) => p.r)));
  const b = toWorld(Math.max(...tv.map((p) => p.c)), Math.max(...tv.map((p) => p.r)));
  for (let zz = a.z; zz <= b.z + 0.01; zz += 2) {
    for (const xx of [a.x - 0.4, b.x + 0.4]) box(xx, 0, zz, 0.08, 1.9, 0.08, C.darkWood);
    box((a.x + b.x) / 2, 1.86, zz, b.x - a.x + 0.8, 0.02, 0.02, 0x333333);
    for (let xx = a.x - 0.2; xx <= b.x + 0.2; xx += 0.5) box(xx, 1.76, zz, 0.08, 0.1, 0.08, 0xffe08a, true);
  }

  for (const { color, glow, list } of buckets.values()) {
    const mesh = new THREE.InstancedMesh(unit, mat(color, glow), list.length);
    list.forEach((m, i) => mesh.setMatrixAt(i, m));
    mesh.castShadow = mesh.receiveShadow = !glow;
    scene.add(mesh);
  }
}

// Persona voxel. Con headphones = il personaggio del logo.
export function createPerson({ shirt = 0xf2802e, skin = C.skin[0], headphones = true } = {}) {
  const g = new THREE.Group();
  const body = new THREE.Group();
  g.add(body);
  for (const dx of [-0.09, 0.09]) part(body, dx, 0, 0, 0.14, 0.28, 0.16, 0x2c3e66);
  part(body, 0, 0.28, 0, 0.42, 0.34, 0.26, shirt);
  for (const dx of [-0.26, 0.26]) part(body, dx, 0.3, 0, 0.1, 0.3, 0.14, shirt);
  part(body, 0, 0.62, 0, 0.34, 0.32, 0.32, skin);
  part(body, 0, 0.9, 0.02, 0.36, 0.1, 0.34, 0x3b2a20);
  part(body, 0, 0.7, 0.16, 0.36, 0.22, 0.04, 0x3b2a20);
  for (const dx of [-0.07, 0.07]) part(body, dx, 0.72, -0.165, 0.05, 0.06, 0.02, 0x111111);
  if (headphones) {
    part(body, 0, 0.98, 0, 0.42, 0.05, 0.08, 0x14304f);
    for (const dx of [-0.2, 0.2]) {
      part(body, dx, 0.64, 0, 0.08, 0.18, 0.18, 0x14304f);
      part(body, dx * 1.1, 0.68, 0, 0.02, 0.1, 0.1, 0xf2802e);
    }
  }
  g.userData.body = body;
  return g;
}

function makeStage(scene, id, beams, screens) {
  const k = groupBox(id, 'X');
  const floor = 0.45;
  const top = 2.4;
  // Costruito con il pubblico verso +z locale, poi ruotato verso la zona.
  const { g, across: w, deep: d } = orientedGroup(scene, k, facing(k, id));
  part(g, 0, 0, 0, w, floor, d, 0x2b2b35);
  const screen = part(g, 0, floor, -d / 2 + 0.15, w * 0.9, 1.5, 0.12, 0xff4fd8, true);
  screen.material = new THREE.MeshBasicMaterial({ color: 0xff4fd8 });
  screens.push(screen);
  for (const x of [-w / 2, w / 2]) for (const z of [-d / 2, d / 2]) part(g, x, 0, z, 0.12, top, 0.12, 0x9aa0a6);
  for (const x of [-w / 2, w / 2]) part(g, x, top, 0, 0.14, 0.14, d + 0.14, 0x9aa0a6);
  for (const z of [-d / 2, d / 2]) part(g, 0, top, z, w + 0.14, 0.14, 0.14, 0x9aa0a6);
  for (const x of [-w / 2 + 0.25, w / 2 - 0.25]) part(g, x, floor, d / 2 - 0.3, 0.35, 0.75, 0.35, 0x1b1b1f);
  part(g, 0, floor, -0.1, 0.9, 0.45, 0.35, 0x1b1b1f); // console
  const dj = createPerson({ shirt: 0x1e3a5f });
  dj.position.set(0, floor, -0.45);
  dj.rotation.y = Math.PI; // il DJ guarda il pubblico (+z locale)
  g.add(dj);

  const colors = [0xff4fd8, 0x4fc3ff, 0xffd23f];
  const cone = new THREE.ConeGeometry(0.55, 3, 12, 1, true);
  cone.translate(0, -1.5, 0); // punta in alto, sulla struttura
  colors.forEach((color, i) => {
    const beam = new THREE.Mesh(cone, new THREE.MeshBasicMaterial({
      color, transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
    }));
    beam.position.set(-w / 2 + ((i + 0.5) * w) / colors.length, top, d / 2);
    beam.userData.phase = i * 2.1;
    g.add(beam);
    beams.push(beam);
  });
  return { x: k.cx, z: k.cz };
}

export function createWorld() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x3a3350);
  scene.add(new THREE.HemisphereLight(0xffe6cc, 0x5a4a70, 1.9));
  const sun = new THREE.DirectionalLight(0xffb27a, 2.3);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -24, right: 24, top: 24, bottom: -24, near: 1, far: 70 });
  sun.shadow.bias = -0.0008;
  sun.shadow.normalBias = 0.02;
  scene.add(sun, sun.target);

  buildStatic(scene);

  const beams = [];
  const screens = [];
  const stages = { stage1: makeStage(scene, 'stage1', beams, screens), stage2: makeStage(scene, 'stage2', beams, screens) };
  ZONES.forEach((id) => {
    makeKiosk(scene, id);
    makeFoodTruck(scene, id);
  });

  // Pubblico che balla davanti ai palchi.
  const dancers = [];
  grid.forEach((row, r) =>
    [...row].forEach((t, c) => {
      if (t !== 'p') return;
      const { x, z } = toWorld(c, r);
      for (let i = 0; i < 2; i++) {
        const person = createPerson({ shirt: pick(C.shirts, c + i, r), skin: pick(C.skin, r, c + i), headphones: false });
        person.position.set(x - 0.2 + i * 0.4, 0, z - 0.2 + rand(c, r + i) * 0.4);
        const stage = stages[zoneAt(c, r)];
        if (stage) person.rotation.y = Math.atan2(person.position.x - stage.x, person.position.z - stage.z); // verso il palco
        person.scale.setScalar(0.85);
        person.userData.phase = rand(c + i, r) * 6;
        scene.add(person);
        dancers.push(person);
      }
    }),
  );

  let time = 0;
  // dt = 0 ferma tutto (usato con "riduci movimento").
  function update(dt) {
    time += dt;
    for (const b of beams) {
      b.rotation.x = -0.5 + Math.sin(time * 0.9 + b.userData.phase) * 0.35; // inclinati verso il pubblico
      b.rotation.z = Math.sin(time * 0.7 + b.userData.phase) * 0.4;
    }
    screens.forEach((s, i) => s.material.color.setHSL((time * 0.05 + i * 0.3) % 1, 0.85, 0.55));
    for (const d of dancers) {
      d.position.y = Math.abs(Math.sin(time * 5 + d.userData.phase)) * 0.12;
    }
  }

  return { scene, sun, update };
}
