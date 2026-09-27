# Profilo del progetto

## Stato della conoscenza

- Tipo: nuovo, creato da zero il 2026-09-27; codice di base derivato da `ecovillaggio-valdiluce`.
- Data, branch e commit analizzato: 2026-09-27, `main`, primo commit (aggiornato dopo il push).
- Modifiche locali comprese nella disamina: tutto il contenuto della prima demo.
- Fonti lette senza modificarle: `../lag_app` (README, `src/pages/Home.tsx`, `src/features/*` per le ancore delle sezioni, `public/logo-lag.png`, `src/styles/tokens.css`); la foto aerea di Cascina Marasco e la mappa dell'evento fornite in chat.
- Copertura e limiti:
  - verificati in browser locale: 375×812 e larghezza desktop, etichette, menu, tastiera, modalità lettura, guasto di Three.js, nessuna richiesta esterna;
  - non verificati: ramo WebGL assente, "riduci movimento", prestazioni su un telefono reale;
  - le posizioni delle zone sono un'ipotesi.
- Checkpoint 1: confermato da Andrea in chat il 2026-09-27. Mappa dell'evento (non sito generale della cascina); zone cliccabili + personaggio; tramonto; nuova repo pubblica con push autonomo; informazioni via link a LAG app; posizioni proposte sulla foto aerea.
- Checkpoint 2 iniziale: confermato da Andrea in chat il 2026-09-27 ("confermo, vai in autonomia fino alla fine").

## Obiettivo e modus operandi

- **Obiettivo**: una prima demo con le cose principali; dove e come sistemarla (dominio, integrazione in LAG app) si decide dopo.
- **Fonte dei dati**: LAG app, con link alle sue sezioni. Leggere dal vivo il database di LAG app è stato rinviato: richiede una decisione (dipendenza dallo schema, richieste esterne).
- **Stile**: come Valdiluce (ES modules semplici, commenti brevi in italiano, logica della mappa testata in Node).

**Ipotesi aperte:**

- **Ingresso**: direzione d'ingresso dalla strada a est.
- **Stand**: in fila lungo la facciata sud della stalla.
- **Stage 1**: lato ovest dell'aia.
- **Stage 2**: sul campo a ovest.
- **Aia**: nella foto è un cantiere; nella mappa è disegnata libera.

## Documenti autorevoli

- [README](../README.md): architettura, comandi, come spostare le zone.
- [CLAUDE.md](../CLAUDE.md): regole operative, confini con LAG app, consegna.
- [Registro di apprendimento](../docs/learning/learning-register.md).
- Dati personali: nessuno raccolto.

## Interventi

- [2026-09-27 Prima demo](changes/2026-09-27-prima-demo.md)
