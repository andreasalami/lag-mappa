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
| 2026-09-27 | Orientare oggetti con `Math.atan2` | sì | Introdotto dall'IA in `js/world.js` (`orientedGroup`, pubblico verso il palco) | `atan2(dx, dz)` dà l'angolo di rotazione attorno all'asse verticale che porta il "davanti" (+z) nella direzione voluta | Sposta un chiosco su un altro lato della sua zona e prevedi dove girerà il bancone | progetto |
| 2026-09-27 | Cache del browser e moduli ES | sì | In locale `map.js` arrivava dalla cache mentre gli altri moduli erano nuovi | File di versioni diverse possono mescolarsi: si cambia origine per i test, o si aggiunge una versione agli import | Guarda nel tab Network la colonna Size: `(disk cache)` indica un file non riscaricato | progetto |
| 2026-09-27 | `keydown`/`keyup`, `repeat` e Pointer Events | sì | Introdotto dall'IA in `js/main.js` (movimento continuo) | La ripetizione automatica della tastiera dipende dal sistema: meglio ricordare quali tasti sono giù e far camminare il ciclo di animazione; `setPointerCapture` continua a seguire il dito anche fuori dal canvas | Tieni premuti due tasti di direzione, rilasciane uno e osserva che si continua con l'altro | progetto |
| 2026-09-28 | Materiali trasparenti e opacità animata (Three.js) | sì | Introdotto dall'IA in `js/world.js`: vetro della serra e tetti dei portici che sfumano | `transparent: true` + `opacity` rende un materiale semitrasparente; cambiando `opacity` a ogni fotogramma verso un valore obiettivo si ottiene una dissolvenza morbida. Tutti gli oggetti che condividono il materiale sfumano insieme | In `js/world.js` cambia `0.15` in `0.5` e avvicinati a un portico: il tetto resta più visibile | progetto |

Non si deduce competenza dal solo completamento dei compiti.
