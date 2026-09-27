# Intervento: Stage 2 nel cortile nord-est e movimento continuo

- Stato: chiuso
- Data e perimetro: 2026-09-27; `js/map.js`, `js/world.js`, `js/main.js`, `index.html`, documentazione
- Profilo: [PROJECT_PROFILE.md](../PROJECT_PROFILE.md)
- Piano e approvazione: istruzione diretta di Andrea in chat. Stage 2 "al posto delle 5 auto nella parte esterna della cascina"; poter camminare tenendo premuta la direzione.
- Codice di partenza: `f352a92`

## Problema e risultato

- **Stage 2**: prima stava sul campo a ovest (una mia ipotesi). Ora occupa il cortile esterno a nord-est accanto al capannone con i pannelli, dove prima c'erano le 5 auto.
  - Il palco è sul lato ovest e guarda a est; da lì lo vede anche la telecamera.
  - Pubblico, due coppie di tavoli, food truck sul lato est.
  - Il campo a ovest torna terra battuta libera.
- **Movimento**: prima ogni pressione valeva un passo. Ora tenendo premuta una freccia (o WASD), o trascinando e tenendo giù il dito o il mouse, il personaggio continua a camminare finché non si rilascia.

## Scelte e alternative

- **Pila dei tasti premuti** (`pressed`, vince l'ultimo): se si tengono due direzioni e se ne rilascia una, si continua con l'altra. Un semplice "ultimo tasto" si sarebbe fermato.
- **Ripetizione gestita dal ciclo di animazione** (`heldDir()` in `animate`) invece della ripetizione automatica della tastiera: il ritmo è quello del salto (0,14 s) e non dipende dalle impostazioni del sistema. Gli eventi `repeat` vengono ignorati.
- **`cooldown`**: pausa minima tra due passi. Con "riduci movimento" i salti sono istantanei; senza pausa si attraverserebbe la mappa in un attimo.
- **Trascinamento sulla mappa**: la direzione si calcola rispetto al punto in cui il dito ha toccato. Un tocco senza trascinamento resta "un passo avanti". `setPointerCapture` fa arrivare gli eventi anche se il dito esce dal canvas.
- **Fondo sotto gli oggetti dell'evento**: terra allo Stage 1, ghiaia allo Stage 2, cemento in piazza.

## Verifica e fragilità

**Verificato:**

- `node --test`: 4 test superati. Lo Stage 2 si raggiunge dall'ingresso: la BFS del test lo conferma.
- Browser locale (127.0.0.1:8083):
  - Stage 2 nel cortile nord-est con palco, pubblico, fasci di luce, food truck e tavoli;
  - con i tasti: tenendo "su" dai Tavoli si arriva alla Cucina; un tocco singolo resta nei Tavoli;
  - con eventi puntatore simulati: un trascinamento tenuto dai Tavoli arriva alla Cucina.

**Non verificato:**

- trascinamento con un dito vero su un telefono;
- tasti tenuti premuti su una tastiera fisica (gli eventi sono simulati).

**Limite noto**: tenendo premuta una direzione contro un muro, il personaggio "rimbalza" sul posto finché non si rilascia. È voluto, come segnale che la strada è bloccata.

## Apprendimento

Concetti: eventi `keydown`/`keyup` e `repeat`, Pointer Events con `setPointerCapture`. Vedi il [registro](../../docs/learning/learning-register.md).

## Annotazioni successive

Nessuna.
