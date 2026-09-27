// Livello 3D trasparente sopra l'interfaccia: note musicali, coriandoli e uccelli
// passano davanti alle schede. Il canvas ha pointer-events: none, quindi i click passano sotto.
import * as THREE from 'three';
import { part, mat } from './world.js';

const rnd = (a, b) => a + Math.random() * (b - a);

export function startOverlay(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 200);
  scene.add(new THREE.HemisphereLight(0xffe0c0, 0x6a5a8a, 2.2));
  const light = new THREE.DirectionalLight(0xffb070, 1.8);
  light.position.set(-4, 5, 8);
  scene.add(light);

  let halfW = 10;
  let halfH = 7;
  function resize() {
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    // Su schermi stretti la telecamera arretra: la scena resta larga almeno 16 unità.
    const tan = Math.tan(THREE.MathUtils.degToRad(20));
    camera.position.z = Math.max(20, 8 / (tan * camera.aspect));
    camera.updateProjectionMatrix();
    halfH = tan * camera.position.z;
    halfW = halfH * camera.aspect;
  }
  resize();
  addEventListener('resize', resize);

  // Note musicali voxel che salgono lente.
  const noteColors = [0xffffff, 0xf2802e, 0xffd23f];
  const notes = Array.from({ length: 5 }, (_, i) => {
    const g = new THREE.Group();
    const color = noteColors[i % noteColors.length];
    part(g, 0, 0, 0, 0.36, 0.26, 0.26, color); // testa
    part(g, 0.14, 0.2, 0, 0.08, 0.9, 0.08, color); // gambo
    part(g, 0.3, 0.9, 0, 0.3, 0.12, 0.08, color); // bandierina
    if (i % 2) {
      part(g, 0.7, 0.1, 0, 0.36, 0.26, 0.26, color);
      part(g, 0.84, 0.2, 0, 0.08, 0.8, 0.08, color);
      part(g, 0.49, 0.9, 0, 0.44, 0.12, 0.08, color);
    }
    g.position.set(rnd(-halfW, halfW), rnd(-halfH, halfH), rnd(0, 3));
    g.userData = { speed: rnd(0.35, 0.6), phase: rnd(0, 6) };
    scene.add(g);
    return g;
  });

  const confettiColors = [0xf2802e, 0x1e88e5, 0xe53935, 0x43a047, 0xfdd835, 0x8e24aa, 0xffffff];
  const confetti = Array.from({ length: 14 }, (_, i) => {
    const piece = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.03, 0.1), mat(confettiColors[i % confettiColors.length]));
    piece.position.set(rnd(-halfW, halfW), rnd(-halfH, halfH + 6), rnd(0, 4));
    piece.userData = { speed: rnd(0.6, 1.1), phase: rnd(0, 6) };
    scene.add(piece);
    return piece;
  });

  const birds = Array.from({ length: 2 }, () => {
    const g = new THREE.Group();
    part(g, 0, 0, 0, 0.5, 0.2, 0.24, 0xfff3e0);
    part(g, 0.28, 0.05, 0, 0.18, 0.18, 0.18, 0xffffff);
    const wings = [-1, 1].map((side) => {
      const pivot = new THREE.Group();
      pivot.position.set(0, 0.16, side * 0.1);
      part(pivot, 0, 0, side * 0.24, 0.3, 0.04, 0.46, 0xffe0c0);
      g.add(pivot);
      return { pivot, side };
    });
    g.userData = { wings, wait: rnd(0, 4), dir: 1, base: 0, t: 0 };
    g.visible = false;
    scene.add(g);
    return g;
  });

  let last = performance.now();
  renderer.setAnimationLoop((now) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const t = now / 1000;

    for (const n of notes) {
      const u = n.userData;
      n.position.y += u.speed * dt;
      n.position.x += Math.sin(t * 1.2 + u.phase) * 0.4 * dt;
      n.rotation.z = Math.sin(t * 1.5 + u.phase) * 0.25;
      if (n.position.y > halfH + 2) n.position.set(rnd(-halfW, halfW), -halfH - 2, rnd(0, 3));
    }

    for (const p of confetti) {
      const u = p.userData;
      p.position.y -= u.speed * dt;
      p.position.x += Math.sin(t * 1.5 + u.phase) * 0.5 * dt;
      p.rotation.set(t * 2 + u.phase, t * 1.3 + u.phase, Math.cos(t * 1.7 + u.phase));
      if (p.position.y < -halfH - 1) p.position.set(rnd(-halfW, halfW), halfH + rnd(1, 5), rnd(0, 4));
    }

    for (const b of birds) {
      const u = b.userData;
      if (!b.visible) {
        u.wait -= dt;
        if (u.wait > 0) continue;
        u.dir = Math.random() < 0.5 ? 1 : -1;
        u.base = rnd(0.1, 0.7) * halfH;
        b.position.set(-u.dir * (halfW + 2), u.base, rnd(1, 4));
        b.rotation.y = u.dir > 0 ? 0 : Math.PI;
        b.visible = true;
      }
      u.t += dt;
      b.position.x += u.dir * 2.4 * dt;
      b.position.y = u.base + Math.sin(u.t * 2) * 0.3;
      for (const w of u.wings) w.pivot.rotation.x = w.side * Math.sin(u.t * 14) * 0.7;
      if (b.position.x * u.dir > halfW + 2) {
        b.visible = false;
        u.wait = rnd(3, 8);
      }
    }

    renderer.render(scene, camera);
  });
}
