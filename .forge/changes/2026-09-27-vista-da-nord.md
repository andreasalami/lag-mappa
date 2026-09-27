# Intervento: vista da nord e stand nel porticato

- Stato: chiuso
- Data e perimetro: 2026-09-27; `js/map.js`, `js/world.js`, `js/main.js`, documentazione
- Profilo: [PROJECT_PROFILE.md](../PROJECT_PROFILE.md)
- Piano e approvazione: istruzione diretta di Andrea in chat ("girare la cascina dall'altra parte perché tutti i punti di interesse sono sul lato coperto"), con due foto di riferimento. Rientra nella demo già approvata, dove le posizioni erano dichiarate come ipotesi da correggere.
- Codice di partenza: `d2ef43f`

## Problema e risultato

- **Prima**: la telecamera guardava da sud. Gli stand erano lungo la stalla e l'ala sud mostrava solo la schiena.
- **Dalle foto di Andrea**: gli stand ("Drinks", "Bar") sono nel porticato ad arcate dell'ala sud, rivolto verso la piazza. Lo Stage 1 è sulla terra battuta davanti all'edificio intonacato ad archi con i pannelli (sud-ovest). La piazza è in cemento.
- **Ora**: la telecamera guarda da nord-est. Si vedono le arcate con gli stand e il fronte dei palchi.

## Scelte e alternative

- **Ruotare la telecamera invece della mappa**: la mappa di testo resta con il nord in alto, come la foto aerea, quindi è più facile da correggere. Costo: i comandi sono rimappati (su = sud, sinistra = est) con due costanti in `js/main.js`.
- **Nord-est invece di nord-ovest**: da nord-est si vedono il porticato sud e il fronte (lato est) dello Stage 1. Da nord-ovest il palco si vedrebbe di schiena.
- **Sole da nord-ovest**: coerente con un tramonto estivo e con la seconda foto (sole alle spalle di chi guarda verso sud).
- **Orientamento automatico** (`facing` + `orientedGroup` in `js/world.js`): chioschi, palchi e food truck si girano verso il centro della propria zona. Il pubblico guarda il proprio palco. Spostare una zona non richiede più di toccare il codice 3D.
- **Facciate generiche**: arcate su ogni lato che dà su uno spazio calpestabile, finestre altrove. Nuove caselle: `V` (arcate con tende verdi, prima foto) e `w` (bidoni della differenziata, seconda foto).
- **Ancora ipotesi**: Casse e Giochi nell'angolo nord-est, vicino al varco da cui si entra dalla strada est; lo Stage 2 sul campo ovest.

## Come funziona

- **`js/map.js`**: stand su riga 27, davanti all'ala sud (righe 28-30); `V` sulla facciata ovest dell'ala sud; Stage 1 su terra battuta (colonne 20-23); tavoli al centro; casse con il bancone rivolto a nord; zona giochi con due calcetti.
- **`js/world.js` → `facing(k, id)`**: vettore dal centro del gruppo al centro della zona, ridotto all'asse prevalente.
- **`js/world.js` → `orientedGroup`**: costruisce con il davanti verso +z locale e ruota di `atan2(dx, dz)`.
- **Persone**: guardano verso −z locale; per girarle verso il palco si usa `atan2(px - sx, pz - sz)`.
- **`js/main.js`**: `OFFSET (3.2, 10, -7.5)`, `SUN (-8, 7, -7)`, `DIRS` e `FACING` rimappati; lo sguardo in avanti della telecamera è su +z.

## Verifica e fragilità

**Verificato:**

- `node --test`: 4 test superati.
- Browser locale (127.0.0.1:8082):
  - da nord-est si vedono gli stand Birra, Bar e Cucina davanti alle arcate, le tende verdi, i tavoli con le lucine, Giochi, le Casse rivolte a nord e i bidoni;
  - Stage 1 e Stage 2 rivolti verso il pubblico; sportello del food truck verso i tavoli.
- **Tasti** (con eventi simulati): dai Tavoli, "su" porta alla Cucina (sud); dalle Casse, tre volte "destra" e poi "su" portano ai Tavoli (quindi "destra" va a ovest).

**Imprevisto durante la verifica**: sulla porta 8081 il browser ha usato un `map.js` vecchio dalla cache insieme ai file nuovi. Mappa e scena non combaciavano, quindi ho ripetuto la prova su una porta nuova.

**Rischio residuo**: GitHub Pages lascia i file in cache per circa 10 minuti. Per poco tempo dopo un push, un visitatore potrebbe ricevere moduli di versioni diverse. Per la demo è accettato; la soluzione è aggiungere un parametro di versione agli import.

**Non verificato:**

- lo swipe su un telefono reale;
- le posizioni di Casse, Giochi e Stage 2.

## Apprendimento

La proiezione e gli orientamenti con `atan2` sono nel [registro](../../docs/learning/learning-register.md).

## Annotazioni successive

Nessuna.
