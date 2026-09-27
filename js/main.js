// Avvio: renderer, telecamera che segue il personaggio, comandi, etichette e schede.
// Se qualcosa fallisce la pagina resta in modalità lettura (solo HTML).
import * as THREE from 'three';
import { START, walkable, zoneAt, zoneSpawn } from './map.js';
import { createWorld, createPerson, toWorld } from './world.js';
import { createLabels } from './labels.js';

const html = document.documentElement;
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const HOP = 0.14; // secondi per un salto

const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
const FACING = { up: 0, down: Math.PI, left: Math.PI / 2, right: -Math.PI / 2 };
const KEYS = {
  ArrowUp: 'up', KeyW: 'up', ArrowDown: 'down', KeyS: 'down',
  ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right',
};

function start() {
  const canvas = document.getElementById('world');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;

  const world = createWorld();
  const hero = createPerson();
  hero.scale.setScalar(1.1);
  world.scene.add(hero);

  const camera = new THREE.OrthographicCamera();
  const OFFSET = new THREE.Vector3(3.2, 10, 7.5);
  const SUN = new THREE.Vector3(-10, 7, 3); // sole basso a ovest: tramonto
  const focus = new THREE.Vector3();
  const target = new THREE.Vector3();

  function resize() {
    const w = innerWidth;
    const h = innerHeight;
    renderer.setSize(w, h);
    const aspect = w / h;
    const halfH = Math.max(9, 6.5 / aspect);
    const halfW = halfH * aspect;
    // Lascia spazio alla scheda: a destra su desktop, in basso su mobile.
    const sx = w >= 900 ? (400 / w) * halfW : 0;
    const sy = w >= 900 ? 0 : 0.28 * halfH;
    Object.assign(camera, { left: -halfW + sx, right: halfW + sx, top: halfH - sy, bottom: -halfH - sy, near: 0.1, far: 100 });
    camera.updateProjectionMatrix();
  }
  resize();
  addEventListener('resize', resize);

  // Elementi dell'interfaccia
  const live = document.getElementById('live');
  const hint = document.getElementById('hint');
  const links = [...document.querySelectorAll('nav [data-zone]')];
  let zone = null;

  // Stato logico del personaggio (casella) + animazione del salto.
  const player = { c: START.c, r: START.r, next: null };
  const hop = { fx: 0, fz: 0, t: 1, bump: false, squash: 0 };

  function place(c, r) {
    const { x, z } = toWorld(c, r);
    Object.assign(player, { c, r });
    hero.position.set(x, 0, z);
    hop.t = 1;
  }

  function move(dir) {
    if (html.classList.contains('reading')) return;
    if (hop.t < 1) {
      player.next = dir;
      return;
    }
    hint.classList.add('gone');
    const [dc, dr] = DIRS[dir];
    hero.rotation.y = FACING[dir];
    const c = player.c + dc;
    const r = player.r + dr;
    Object.assign(hop, { fx: hero.position.x, fz: hero.position.z, bump: !walkable(c, r) });
    if (hop.bump) {
      if (!REDUCED) hop.t = 0;
      return;
    }
    Object.assign(player, { c, r });
    const { x, z } = toWorld(c, r);
    if (REDUCED) hero.position.set(x, 0, z);
    else hop.t = 0;
    enterZone();
  }

  function animate(dt) {
    if (hop.t < 1) {
      hop.t = Math.min(1, hop.t + dt / HOP);
      const { x, z } = toWorld(player.c, player.r);
      const k = hop.t;
      hero.position.set(
        hop.fx + (x - hop.fx) * k,
        Math.sin(k * Math.PI) * (hop.bump ? 0.12 : 0.42),
        hop.fz + (z - hop.fz) * k,
      );
      if (hop.t === 1) {
        hop.squash = 1;
        if (player.next) {
          const next = player.next;
          player.next = null;
          move(next);
        }
      }
    }
    if (hop.squash > 0) hop.squash = Math.max(0, hop.squash - dt / 0.12);
    const s = hop.squash;
    hero.userData.body.scale.set(1 + 0.15 * s, 1 - 0.25 * s, 1 + 0.15 * s);
  }

  // Schede delle zone
  function showCard(id) {
    document.querySelectorAll('.card.active').forEach((el) => el.classList.remove('active'));
    const card = document.getElementById(`z-${id}`);
    card?.classList.add('active');
    links.forEach((a) => a.toggleAttribute('aria-current', a.dataset.zone === id));
    if (card) live.textContent = `Sei in: ${card.querySelector('h2').textContent}`;
  }

  // Fuori dalle zone resta aperta l'ultima scheda.
  function enterZone() {
    const id = zoneAt(player.c, player.r);
    if (id && id !== zone) showCard((zone = id));
  }

  function goTo(id) {
    html.classList.remove('reading');
    hint.classList.add('gone');
    const spawn = zoneSpawn(id);
    place(spawn.c, spawn.r);
    hop.squash = 1;
    zone = null;
    enterZone();
  }

  links.forEach((a) =>
    a.addEventListener('click', (e) => {
      if (html.classList.contains('reading')) return; // in lettura il link scorre alla scheda
      e.preventDefault();
      goTo(a.dataset.zone);
    }),
  );
  const updateLabels = createLabels(document.getElementById('pins'), links, goTo);

  document.querySelectorAll('.card .close').forEach((b) =>
    b.addEventListener('click', () => b.closest('.card').classList.remove('active')),
  );

  const toggle = document.getElementById('read-toggle');
  toggle.addEventListener('click', () => {
    const reading = html.classList.toggle('reading');
    toggle.setAttribute('aria-pressed', reading);
    toggle.querySelector('span').textContent = reading ? 'Torna alla mappa' : 'Leggi tutto';
    if (!reading) showCard(zone);
  });

  addEventListener('keydown', (e) => {
    if (e.key === 'Escape') document.querySelector('.card.active .close')?.click();
    const dir = KEYS[e.code];
    if (!dir || e.altKey || e.ctrlKey || e.metaKey || html.classList.contains('reading')) return;
    e.preventDefault();
    if (!e.repeat) move(dir);
  });

  // Swipe (o click) sulla mappa: tocco breve = avanti.
  let sx = 0;
  let sy = 0;
  canvas.addEventListener('pointerdown', (e) => {
    sx = e.clientX;
    sy = e.clientY;
  });
  canvas.addEventListener('pointerup', (e) => {
    const dx = e.clientX - sx;
    const dy = e.clientY - sy;
    if (Math.hypot(dx, dy) < 24) move('up');
    else if (Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? 'right' : 'left');
    else move(dy > 0 ? 'down' : 'up');
  });

  place(START.c, START.r);
  hero.rotation.y = FACING.left; // guarda verso la cascina
  enterZone();
  focus.set(hero.position.x, 0, hero.position.z - 1);

  let last = performance.now();
  renderer.setAnimationLoop((now) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    animate(dt);
    world.update(REDUCED ? 0 : dt);
    target.set(hero.position.x, 0, hero.position.z - 1);
    focus.lerp(target, REDUCED ? 1 : 1 - Math.exp(-dt * 5));
    camera.position.copy(focus).add(OFFSET);
    camera.lookAt(focus);
    world.sun.position.copy(focus).add(SUN);
    world.sun.target.position.copy(focus);
    renderer.render(world.scene, camera);
    updateLabels(camera, zone);
  });

  html.classList.add('game', 'ready');

  if (!REDUCED) {
    import('./overlay.js')
      .then((m) => m.startOverlay(document.getElementById('sky')))
      .catch((err) => console.warn('Livello decorativo non disponibile', err));
  }
}

try {
  start();
} catch (err) {
  console.warn('3D non disponibile: resta la modalità lettura', err);
  html.classList.add('ready');
}
