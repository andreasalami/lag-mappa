# Intervento: prima demo della mappa dell'evento

- Stato: chiuso
- Data e perimetro: 2026-09-27, intero progetto
- Profilo: [PROJECT_PROFILE.md](../PROJECT_PROFILE.md)
- Piano e approvazione: checkpoint 1 e 2 confermati in chat da Andrea il 2026-09-27
- Codice studiato/verificato: primo commit su `main`

## Problema e risultato

- **Richiesta**: lo stesso tipo di sito di Valdiluce, ma per l'evento a Cascina Marasco, partendo da una mappa illustrata dell'evento e da una foto aerea.
- **Risultato**: la cascina voxel al tramonto con 9 zone colorate. Si naviga dalle etichette o dal menu, oppure camminando con il personaggio. Le schede rimandano a LAG app per le informazioni che cambiano.

## Scelte e alternative

- **Mappa a due strati** invece dello schema a righe di Valdiluce: qui le zone sono aree nell'aia, non fasce. Lo strato zone si modifica senza toccare gli edifici.
- **Bozza generata da uno script usa-e-getta** (rettangoli in pixel della foto → caselle da 3 m), poi rifinita a mano. Lo script non è nella repo: il risultato vive come testo leggibile in `js/map.js`.
- **Link a LAG app invece di copiare i dati**: niente informazioni che diventano vecchie, nessuna richiesta esterna. L'alternativa, leggere il database dal vivo, è rinviata.
- **Etichette HTML invece di scritte 3D**: sono pulsanti veri, testo nitido a ogni zoom, stile con CSS. Costo: 9 aggiornamenti di posizione per fotogramma (trascurabile).
- **Tetti a gradoni calcolati** dalla distanza dal bordo dell'edificio: un tetto a falde "voxel" senza modellare ogni edificio. I tetti a pannelli solari sono piani, perché a gradoni sull'edificio quadrato disegnavano una spirale.
- **Scartati per la demo**: bagni e primo soccorso (posizioni ignote), dati dal vivo, suoni.

## Come funziona

1. **`js/map.js`**:
   - `TERRAIN` e `ZONE_LAYER` sono lette riga per riga;
   - `zoneAt(c, r)` traduce la lettera della zona nell'id della scheda;
   - `zoneSpawn(id)` restituisce la casella calpestabile della zona più vicina al suo centro.
2. **`js/world.js`**:
   - `buildStatic` crea terreno, edifici, alberi, auto, bordi delle zone, chioschi, lucine e food truck, raggruppati per colore in `InstancedMesh`;
   - i materiali "glow" (`MeshBasicMaterial`) non subiscono le luci e sembrano accesi;
   - `makeStage` costruisce palco, struttura, schermo LED (colore animato), DJ e 3 fasci di luce additivi;
   - `update(dt)` anima fasci, schermi e pubblico.
3. **`js/labels.js`**: per ogni voce del menu crea un pulsante. A ogni fotogramma proietta il centro della zona sullo schermo con `Vector3.project` e lo sposta con `transform`.
4. **`js/main.js`**:
   - telecamera ortografica e comandi come in Valdiluce;
   - `goTo(id)` è usato sia dal menu sia dalle etichette;
   - fuori dalle zone resta aperta l'ultima scheda (niente sfarfallio tra uno stand e l'altro).

## Verifica e fragilità

**Verificato:**

- `node --test`: 4 test superati.
  - Durante il lavoro un test ha fermato una riga della mappa più corta di una casella: un errore di battitura dell'IA, corretto subito.
- Browser locale (127.0.0.1:8081; la porta 8080 era già occupata da un altro server, lasciato stare):
  - etichette e menu portano a Casse, Stage 1, Stage 2 e Cucina con la scheda giusta;
  - camminando con le frecce dall'ingresso si arriva alle Casse;
  - a 375 px nessuno scroll orizzontale, etichette solo con l'icona;
  - la modalità lettura mostra 9 schede e nasconde etichette e livello decorativo;
  - richieste solo verso `127.0.0.1:8081`.
- **Prova di guasto**: una pagina temporanea puntava l'import map a un file inesistente. Risultato: modalità lettura con 9 schede, canvas ed etichette nascosti. La pagina è stata poi eliminata.

**Correzioni nate dalle verifiche:**

- inquadratura più larga e partenza vicino al cancello;
- tramonto meno arancione;
- uccelli chiari invece di macchie scure;
- tetti a pannelli piani;
- il suggerimento dei comandi sparisce anche toccando un'etichetta.

**Non verificato:**

- WebGL assente;
- "riduci movimento";
- un telefono reale;
- la corrispondenza delle zone con la realtà.

**Recupero**: `git revert` seguito da push, oppure disattivare Pages.

## Apprendimento

Vedi il [registro](../../docs/learning/learning-register.md). Nessuna competenza viene attribuita ad Andrea per il lavoro svolto dall'IA.

## Annotazioni successive

Nessuna.
