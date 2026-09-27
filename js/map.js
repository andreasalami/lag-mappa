// Mappa di Cascina Marasco per L'Agro ai Giovani: logica pura, senza Three.js,
// testata da test/map.test.mjs. Ricavata dalla foto aerea: nord in alto, 1 casella ≈ 3 m.
// Posizioni di stand e Stage 1 dalle foto di Andrea (2026-09-27): la telecamera guarda da nord-est.
// Due strati della stessa misura: TERRENO (cosa c'è) e ZONE (dove succede cosa).
//
// TERRENO
//  .  prato        s  strada/sentiero   g  aia (ghiaia)   d  terra battuta   ;  campo coltivato
//  @  partenza     T  albero            h  siepe/muro     o  orto            a  auto
//  S  edificio     P  edificio con pannelli solari       Q  serra a tunnel  B  capanno
//  V  edificio con tende verdi sulle arcate                w  bidoni della differenziata
//  K  chiosco      X  palco             n  tavolo con panche  F  food truck  y  calcio balilla
//  p  pubblico che balla
// ZONE (lettera → id della scheda in index.html)
//  I ingresso · K casse · C cucina · B bar · R birra · G giochi · T tavoli · 1 stage1 · 2 stage2
const TERRAIN = `
TTTT....................TTTTTTTTTTTT;;;;;;;;;;;;;;;
TTTT....................TTTTTTTTTTTT;;;;;;;;;;;;;;;
TTTT......ooo.ooo.ooo.ooTTTTTTTTTTTT;;;;;;;;;;;;;;;
TTTT....................TTTTTTTTTTTT;;;;;;;;;;;;;;;
TTTT......ooo.ooo.ooo.ooTTTTTPPPPPPP;;;;;;TTTTTTTTT
TTTT....................TTTTTPPPPPPPsssssssTTTTTTTT
TTTT......ooo.ooo.ooo.ooTTTTTPPPPPPPsasasasTTTTTTTT
TTTT....................TTTTTPPPPPPPsssssssTTTTTTTT
TTTT......ooo.ooo.ooo.ooTTTTTPPPPPPPssasassTTTTTTTT
TTTsssssssssssssssssssssssssssssssssssssssssTTTTTTT
TTTSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSsssTTTTTTT
TTTSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSsssTTTTTTT
TTTSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSsssTTTTTTT
TTTSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSsssTTTTTTT
TTTSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSsssTTTTTTT
TTTSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSssssssssss
TTTSSSSSSSSSSSSSSSSSgggggggggggggggggsssssss@ssssss
TTTSggggggggggggggggddddggwwwgggggggPPPPTTTTTssssss
TTTsggBBBBBBBBddddddddddggggggggggggPPPPTTTTT......
TTTss.BBBBBBBBddddddXXddggnngnnggKKgPPPPTTTT;;;;;;;
TTTssdddddddddddddddXXdpggggggggggggSSSSTTTT;;;;;;;
TTTssdXXdpdddnndddddXXddpgnngnnggyggSSSSTTTT;;;;;;;
TTTssdXXdddddddddFddXXdpggggggggggggSSSSTTTT;;;;;;;
TTTssdXXdpdddddddFddddddggnngnngggygSSSSTTTT;;;;;;;
TTTssdXXddpddnndPPPPPPPgggggggggggggSSSSTTTT;;;;;;;
TTTssdddddddddddPPPPPPPgggggggggggggSSSSTTTT;;;;;;;
TTTssdddddddddddPPPPPPPgggggggggggggSSSSTTTT;;;;;;;
TTTssQQQQQQQQQQdPPPPPPPggggKKgKKgKKgSSSSTTTT;;;;;;;
TTTssQQQQQQQQQQ.PPPPPPPVVVVSSSSSSSSSSSSSTTTT;;;;;;;
TTTssQQQQQQQQQQ.PPPPPPPSSSSSSSSSSSSSSSSSTTTT;;;;;;;
TTTssQQQQQQQQQQ.PPPPPPPSSSSSSSSSSSSSSSS.TTTT;;;;;;;
TTTsBBBBBBBQQQQ.PPPPPPPSSSSSSSSSTTTTTTTTTTTT;;;;;;;
TTTshhhhhhhhhhhhhhhhhhhhhhhhhhhhTTTTTTTTTT..;;;;;;;
TTTsTTTTTTTTTTTTTTTTBBBBBBBBBBBBTTTTTTTTTTTT;;;;;;;
`;

const ZONE_LAYER = `
...................................................
...................................................
...................................................
...................................................
...................................................
...................................................
...................................................
...................................................
...................................................
...................................................
...................................................
...................................................
...................................................
...................................................
...................................................
.....................................IIIIIIIIIIIIII
................................KKKK.IIIIIIIIIIIIII
....................11111.......KKKK...............
....................11111TTTTTTTKKKK...............
....................11111TTTTTTTKKKK...............
.....22222222222222.11111TTTTTTTGGGG...............
.....22222222222222.11111TTTTTTTGGGG...............
.....22222222222222.11111TTTTTTTGGGG...............
.....22222222222222.11111TTTTTTTGGGG...............
.....22222222222222.............GGGG...............
.....22222222222222........CC.BB.RR................
.....22222222222222........CC.BB.RR................
...........................CC.BB.RR................
...................................................
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
export const TILES = new Set([...WALKABLE, ...'ThoaSPVQBKXnFypw']);
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
