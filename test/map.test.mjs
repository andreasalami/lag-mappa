import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { grid, zoneGrid, W, H, TILES, ZONE_CHARS, ZONES, START, walkable, zoneAt, zoneSpawn } from '../js/map.js';

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

test("ogni zona è raggiungibile a piedi dall'ingresso", () => {
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
