import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { grid, zoneGrid, W, H, TILES, ZONE_CHARS, ZONES, START, ARCADES, walkable, zoneAt, zoneSpawn } from '../js/map.js';

test('terreno e zone hanno la stessa forma e solo caratteri noti', () => {
  assert.equal(zoneGrid.length, H, 'numero di righe diverso tra terreno e zone');
  grid.forEach((row, r) => {
    assert.equal(row.length, W, `terreno: riga ${r} lunga ${row.length}`);
    assert.equal(zoneGrid[r].length, W, `zone: riga ${r} lunga ${zoneGrid[r].length}`);
    for (const ch of row) assert.ok(TILES.has(ch), `terreno: carattere sconosciuto "${ch}" alla riga ${r}`);
    for (const ch of zoneGrid[r]) assert.ok(ZONE_CHARS.has(ch), `zone: carattere sconosciuto "${ch}" alla riga ${r}`);
  });
  assert.equal(grid.join('').split('@').length - 1, 1, 'serve esattamente una partenza @');
});

test('fuori mappa ed edifici non sono calpestabili', () => {
  assert.equal(walkable(-1, START.r), false);
  assert.equal(walkable(W, START.r), false);
  const barn = grid.findIndex((row) => row.includes('S'));
  assert.equal(walkable(grid[barn].indexOf('S'), barn), false);
});

// Caselle raggiungibili a piedi dalla partenza (visita in ampiezza).
function reachable() {
  const seen = new Set([`${START.c},${START.r}`]);
  const queue = [START];
  while (queue.length) {
    const { c, r } = queue.shift();
    for (const [dc, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const key = `${c + dc},${r + dr}`;
      if (!seen.has(key) && walkable(c + dc, r + dr)) {
        seen.add(key);
        queue.push({ c: c + dc, r: r + dr });
      }
    }
  }
  return seen;
}

test("ogni zona è raggiungibile a piedi dall'ingresso", () => {
  const seen = reachable();
  assert.equal(zoneAt(START.c, START.r), 'ingresso');
  for (const id of ZONES) {
    const spawn = zoneSpawn(id);
    assert.ok(spawn, `zona ${id} senza caselle calpestabili`);
    assert.equal(zoneAt(spawn.c, spawn.r), id);
    assert.ok(seen.has(`${spawn.c},${spawn.r}`), `zona ${id} non raggiungibile`);
  }
});

test('ogni zona ha scheda, voce di menu ed etichetta in index.html', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  for (const id of ZONES) {
    assert.match(html, new RegExp(`<article[^>]+id="z-${id}"`), `manca la scheda di ${id}`);
    assert.match(html, new RegExp(`<nav[\\s\\S]*data-zone="${id}"[\\s\\S]*</nav>`), `manca la voce di menu di ${id}`);
  }
  // Le etichette sulla mappa sono generate da main.js a partire dal menu: basta il menu.
});

test('CSS e moduli in index.html hanno tutti la stessa versione ?v=', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const versions = new Set([...html.matchAll(/\.(?:js|css)\?v=(\d+)/g)].map((m) => m[1]));
  assert.equal(versions.size, 1, `versioni diverse: ${[...versions].join(', ')}`);
  for (const f of ['style.css', 'js/main.js', 'js/map.js', 'js/world.js', 'js/labels.js', 'js/overlay.js']) {
    assert.ok(html.includes(`${f}?v=`), `${f} senza versione`);
  }
});

test('dietro lo Stage 1 non si passa', () => {
  const seen = reachable();
  // Le transenne corrono a ovest del palco: la casella oltre ciascuna non si raggiunge.
  grid.forEach((row, r) => [...row].forEach((t, c) => {
    if (t === 'f') assert.equal(seen.has(`${c - 1},${r}`), false, `si passa oltre la transenna in ${c},${r}`);
  }));
});

test('portici: casse, giochi e birra entrando a sinistra; di fronte 8 archi, uno libero, 3 bar e 4 cucina', () => {
  const zones = (a) => a.arches.map((x) => x.zone);
  const left = ARCADES.find((a) => zones(a).includes('casse'));
  assert.deepEqual([...new Set(zones(left))], ['casse', 'giochi', 'birra']); // da nord, cioè dall'ingresso
  const front = ARCADES.find((a) => zones(a).includes('bar'));
  assert.deepEqual(zones(front).reverse(), [null, 'bar', 'bar', 'bar', 'cucina', 'cucina', 'cucina', 'cucina']); // da est
});
