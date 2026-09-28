// Mappa di Cascina Marasco per L'Agro ai Giovani: logica pura, senza Three.js,
// testata da test/map.test.mjs. Ricavata dalla foto aerea: nord in alto, 1 casella ≈ 3 m.
// Posizioni di stand e Stage 1 dalle foto di Andrea (2026-09-27): la telecamera guarda da nord-est.
// Due strati della stessa misura: TERRENO (cosa c'è) e ZONE (dove succede cosa).
//
// TERRENO
//  .  prato        s  strada/sentiero   g  aia (cemento)   d  terra battuta   ;  campo coltivato
//  @  partenza     T  albero            h  siepe           o  orto            b  biciclette
//  S  edificio     P  edificio con pannelli solari sulle tegole                Q  serra   B  capanno
//  A  portico (coperto, ad archi verso il lato aperto)     m  muro di cinta   f  transenne
//  E  tavolo dei biglietti   X  palco/consolle   n  tavolo con panche   F  food truck
//  p  pubblico che balla     w  bidoni della differenziata
// ZONE (lettera → id della scheda in index.html)
//  I ingresso · K casse · C cucina · B bar · R birra · G giochi · T tavoli · 1 stage1 · 2 stage2
const TERRAIN = `
TTTT....................TTTTTTTTTTTT;;;;;;;;;;;;;;;
TTTT....................TTTTTTTTTTTT;;;;;;;;;;;;;;;
TTTT......ooo.ooo.ooo.ooTTTTTTTTTTTT;;;;;;;;;;;;;;;
TTTT....................TTTTTTTTTTTT;;;;;;;;;;;;;;;
TTTT......ooo.ooo.ooo.ooTTTTTPPPPPPPssssnnsTTTTTTTT
TTTT....................TTTTTPPPPPPPXsspssFTTTTTTTT
TTTT......ooo.ooo.ooo.ooTTTTTPPPPPPPXssspsFTTTTTTTT
TTTT....................TTTTTPPPPPPPXsspsssTTTTTTTT
TTTT......ooo.ooo.ooo.ooTTTTTPPPPPPPsssnnssTTTTTTTT
TTTsssssssssssssssssssssssssssssssssssssssssTTTTTTT
TTTSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSsssTTTTTTT
TTTSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSsssTTTTTTT
TTTSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSsssTTTTTTT
TTTSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSsssTTTTTTT
TTTSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSsssTTTTTTT
TTTSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSsEssssssss
TTTSSSSSSSSSSSSSSSSSgggggggggggggggggsssssss@ssssss
TTTSmggggggggggggggfddddggwwwgggggggAPPPTTTTTssssss
TTTsmgBBBBBBBBdddddfddddggggggggggggAPPPTTTTT.bbbbb
TTTsm.BBBBBBBBdddddfXXddggnngnngggggAPPPTTTT;;;;;;;
TTTsmddddddddddddddfXXdpggggggggggggASSSTTTT;;;;;;;
TTTsmddddddddddddddfXXddpgnngnngggggASSSTTTT;;;;;;;
TTTsmddddddddddddddfXXdpggggggggggggASSSTTTT;;;;;;;
TTTsmddddddddddddddfddddggnngnngggggASSSTTTT;;;;;;;
TTTsmdddddddddddAAAAAAPgggggggggggggASSSTTTT;;;;;;;
TTTsmdddddddddddPPPPPPAgggggggggggggASSSTTTT;;;;;;;
TTTsmdddddddddddPPPPPPAgggggggggggggASSSTTTT;;;;;;;
TTTsmQQQQQQQQQQdPPPPPPAgggggggggggggASSSTTTT;;;;;;;
TTTsmQQQQQQQQQQ.PPPPPPPSAAAAAAAAAAAASSSSTTTT;;;;;;;
TTTsmQQQQQQQQQQ.PPPPPPPSSSSSSSSSSSSSSSSSTTTT;;;;;;;
TTTsmQQQQQQQQQQ.PPPPPPPSSSSSSSSSSSSSSSS.TTTT;;;;;;;
TTTsBBBBBBB.....PPPPPPPSSSSSSSSSTTTTTTTTTTTT;;;;;;;
TTTshhhhhhhhhhhhhhhhhhhhhhhhhhhhTTTTTTTTTT..;;;;;;;
TTTsTTTTTTTTTTTTTTTTBBBBBBBBBBBBTTTTTTTTTTTT;;;;;;;
`;

const ZONE_LAYER = `
...................................................
...................................................
...................................................
...................................................
....................................2222222........
....................................2222222........
....................................2222222........
....................................2222222........
....................................2222222........
...................................................
...................................................
...................................................
...................................................
...................................................
...................................................
.....................................IIIIIIIIIIIIII
.....................................IIIIIIIIIIIIII
....................11111........KKKK..............
....................11111TTTTTTT.KKKK..............
....................11111TTTTTTT.KKKK..............
....................11111TTTTTTT.GGGG..............
....................11111TTTTTTT.GGGG..............
....................11111TTTTTTT.GGGG..............
....................11111TTTTTTT.GGGG..............
.................................GGGG..............
..................................RRR..............
........................CCCCCCBBBBRRR..............
........................CCCCCCBBBBRRR..............
........................CCCCCCBBBB.................
...................................................
...................................................
...................................................
...................................................
...................................................
`;

const ZONE_IDS = {
  I: 'ingresso', K: 'casse', C: 'cucina', B: 'bar', R: 'birra',
  G: 'giochi', T: 'tavoli', 1: 'stage1', 2: 'stage2',
};

const rows = (text) => text.split('\n').map((l) => l.trim()).filter(Boolean);

export const grid = rows(TERRAIN);
export const zoneGrid = rows(ZONE_LAYER);
export const W = grid[0].length;
export const H = grid.length;

export const WALKABLE = new Set('.sgd;@');
export const TILES = new Set([...WALKABLE, ...'ThobSPAQBmfEXnFpw']);
export const ZONE_CHARS = new Set(['.', ...Object.keys(ZONE_IDS)]);
// Ordine del menu: dall'ingresso verso il fondo della cascina.
export const ZONES = Object.values(ZONE_IDS);

export const tileAt = (c, r) => (r >= 0 && r < H && c >= 0 && c < W ? grid[r][c] : null);
export const walkable = (c, r) => WALKABLE.has(tileAt(c, r));
export const zoneAt = (c, r) => ZONE_IDS[zoneGrid[r]?.[c]] ?? null;

const startRow = grid.findIndex((row) => row.includes('@'));
export const START = { c: grid[startRow].indexOf('@'), r: startRow };

// Caselle di una zona (anche non calpestabili): servono per etichette e oggetti.
export function zoneCells(id) {
  const cells = [];
  zoneGrid.forEach((row, r) => [...row].forEach((ch, c) => ZONE_IDS[ch] === id && cells.push({ c, r })));
  return cells;
}

export function zoneCenter(id) {
  const cells = zoneCells(id);
  const avg = (k) => cells.reduce((s, p) => s + p[k], 0) / cells.length;
  return { c: avg('c'), r: avg('r') };
}

// Casella d'arrivo per menu ed etichette: la casella calpestabile della zona più vicina al centro.
export function zoneSpawn(id) {
  const { c: mc, r: mr } = zoneCenter(id);
  const free = zoneCells(id).filter((p) => walkable(p.c, p.r));
  free.sort((a, b) => Math.hypot(a.c - mc, a.r - mr) - Math.hypot(b.c - mc, b.r - mr));
  return free[0] ?? null;
}

// Portici: file di caselle 'A' (almeno 2) con il lato aperto verso l'aia, divise in archi
// larghi circa 1,5 caselle. Ogni arco prende la zona della casella al suo centro: la zona
// decide cosa c'è sotto l'arco; null = arco libero. Archi in ordine di colonna o di riga.
function findArcades() {
  const runs = [];
  const scan = (outer, inner, cell, vertical) => {
    for (let a = 0; a < outer; a++) {
      let start = null;
      for (let b = 0; b <= inner; b++) {
        const { c, r } = cell(a, b);
        if (b < inner && tileAt(c, r) === 'A') {
          start ??= b;
          continue;
        }
        if (start !== null && b - start >= 2) {
          const mid = cell(a, Math.floor((start + b - 1) / 2));
          const [dc, dr] = vertical ? [walkable(mid.c - 1, mid.r) ? -1 : 1, 0] : [0, walkable(mid.c, mid.r - 1) ? -1 : 1];
          const len = b - start;
          const n = Math.max(1, Math.round(len / 1.5));
          const arches = Array.from({ length: n }, (_, i) => {
            const t = start - 0.5 + (len / n) * (i + 0.5);
            const at = cell(a, t);
            return { ...at, zone: zoneAt(Math.round(at.c), Math.round(at.r)) };
          });
          runs.push({ ...cell(a, start), len, vertical, open: { dc, dr }, width: len / n, arches });
        }
        start = null;
      }
    }
  };
  scan(H, W, (r, c) => ({ c, r }), false);
  scan(W, H, (c, r) => ({ c, r }), true);
  return runs;
}
export const ARCADES = findArcades();
