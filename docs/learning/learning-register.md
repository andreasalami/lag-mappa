# Registro di apprendimento

## Priorità

JavaScript nel browser (ES modules, `requestAnimationFrame`, proiezione 3D → schermo), poi Three.js e test con `node:test`.

## Voci

| Data | Strumento/concetto | Primo contatto | Evidenza | Errore o intuizione | Prossimo esercizio | Ambito |
|---|---|---:|---|---|---|---|
| 2026-09-27 | Three.js | no (vedi [scheda in Valdiluce](https://github.com/andreasalami/ecovillaggio-valdiluce/blob/main/docs/learning/tools/threejs.md)) | Stessa versione e stessi file vendored | Qui in più: `Vector3.project(camera)` per agganciare elementi HTML a punti 3D | In `js/labels.js` cambia l'altezza `2.6` e osserva come si spostano le etichette | progetto |
| 2026-09-27 | Mappa a due strati (`TERRAIN` + `ZONE_LAYER`) | sì | Introdotto dall'IA | Separare "cosa c'è" da "dove succede cosa" permette di spostare una zona senza toccare gli edifici | Sposta la zona Giochi di due colonne e lancia `node --test` | progetto |
| 2026-09-27 | `node:test` come rete di sicurezza | no | Durante il lavoro ha intercettato una riga della mappa più corta di un carattere, scritta per errore dall'IA | Un test su forma e raggiungibilità ferma errori invisibili a occhio | Accorcia volutamente una riga e leggi il messaggio del test | progetto |
| 2026-09-27 | `sips` (macOS) | da verificare | `sips -Z 320` ha ridotto il logo da 722×800 a 289×320 px | Strumento di sistema per immagini, già installato: nessuna dipendenza nuova. `-Z` imposta il lato più lungo mantenendo le proporzioni | `sips -g pixelWidth -g pixelHeight assets/logo-lag.png` per leggere le dimensioni | progetto |

Non si deduce competenza dal solo completamento dei compiti.
