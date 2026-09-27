# Profilo del progetto

## Stato della conoscenza

- Tipo: nuovo, creato da zero il 2026-09-27; codice di base derivato da `ecovillaggio-valdiluce`.
- Data, branch e commit analizzato: 2026-09-27, `main`, `e0d0aac7b420a2249c562bbdf4ad41dd251fd0fd`.
- Modifiche locali comprese nella disamina: tutto il contenuto della prima demo.
- Foto di riferimento fornite in chat il 2026-09-27 (non salvate nella repo): porticato dell'ala sud con gli stand, Stage 1 davanti all'edificio ad archi con i pannelli, piazza in cemento.
- Fonti lette senza modificarle: `../lag_app` (README, `src/pages/Home.tsx`, `src/features/*` per le ancore delle sezioni, `public/logo-lag.png`, `src/styles/tokens.css`); la foto aerea di Cascina Marasco e la mappa dell'evento fornite in chat.
- Copertura e limiti:
  - verificati online: CI `test` e build di Pages superate su `e0d0aac`; https://andreasalami.github.io/lag-mappa/ in modalità mappa, 9 etichette, 0 errori, richieste solo al dominio di Pages;
  - verificati in browser locale: 375×812 e larghezza desktop, etichette, menu, tastiera, modalità lettura, guasto di Three.js, nessuna richiesta esterna;
  - non verificati: ramo WebGL assente, "riduci movimento", prestazioni su un telefono reale;
  - le posizioni delle zone sono un'ipotesi.
- Checkpoint 1: confermato da Andrea in chat il 2026-09-27. Mappa dell'evento (non sito generale della cascina); zone cliccabili + personaggio; tramonto; nuova repo pubblica con push autonomo; informazioni via link a LAG app; posizioni proposte sulla foto aerea.
- Checkpoint 2 iniziale: confermato da Andrea in chat il 2026-09-27 ("confermo, vai in autonomia fino alla fine").

## Obiettivo e modus operandi

- **Obiettivo**: una prima demo con le cose principali; dove e come sistemarla (dominio, integrazione in LAG app) si decide dopo.
- **Fonte dei dati**: LAG app, con link alle sue sezioni. Leggere dal vivo il database di LAG app è stato rinviato: richiede una decisione (dipendenza dallo schema, richieste esterne).
- **Stile**: come Valdiluce (ES modules semplici, commenti brevi in italiano, logica della mappa testata in Node).

**Confermato dalle foto:**

- **Stand**: nel porticato dell'ala sud, rivolti verso la piazza.
- **Stage 1**: sulla terra battuta davanti all'edificio ad archi a sud-ovest.
- **Vista**: la telecamera guarda da nord-est.

**Ipotesi aperte:**

- **Ingresso**: direzione d'ingresso dalla strada a est.
- **Casse e Giochi**: nell'angolo nord-est.
- **Stage 2**: sul campo a ovest.

## Documenti autorevoli

- [README](../README.md): architettura, comandi, come spostare le zone.
- [CLAUDE.md](../CLAUDE.md): regole operative, confini con LAG app, consegna.
- [Registro di apprendimento](../docs/learning/learning-register.md).
- Dati personali: nessuno raccolto.

## Interventi

- [2026-09-27 Prima demo](changes/2026-09-27-prima-demo.md)
- [2026-09-27 Vista da nord e stand nel porticato](changes/2026-09-27-vista-da-nord.md)
