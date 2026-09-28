# Intervento: portici, ingresso e correzioni della cascina

- Stato: chiuso
- Data e perimetro: 2026-09-28; `js/map.js`, `js/world.js`, `js/main.js`, `index.html`, `test/map.test.mjs`, documentazione
- Profilo: [PROJECT_PROFILE.md](../PROJECT_PROFILE.md)
- Piano e approvazione: istruzioni dirette di Andrea in chat, partendo dalla versione online (`08cf0e7`), più un'aggiunta arrivata durante il lavoro sui portici dell'edificio accanto al palco
- Codice di partenza: `08cf0e7`

## Cosa è cambiato

**Ingresso:**

- le auto parcheggiate sono state tolte;
- ci sono qualche bici sul lato sud della strada d'ingresso: guardando la cascina è il lato sinistro;
- all'ingresso c'è il tavolo dove si scansionano i biglietti, con una persona dello staff, un portatile e il lettore.

**Stage 2**: al posto del palco con la struttura c'è una consolle DJ appoggiata al muro del capannone. Pubblico, tavoli e food truck restano dove erano.

**Portici:**

- le caselle `A` sono nuove: coperte dal tetto, non calpestabili, con archi a tutto sesto in mattoni sul lato aperto;
- portico subito a sinistra dell'ingresso: casse, poi giochi, poi birra in fondo;
- portico lungo, il lato più visibile dalla telecamera: 8 archi. Da est: uno libero, 3 bar, 4 cucina;
- aggiunta arrivata durante il lavoro: anche l'edificio con i pannelli accanto allo Stage 1 ha i portici. Stanno sul lato verso il palco e su quello verso l'aia, e proseguono dopo la cucina con archi liberi;
- le tende verdi e i chioschi con la tenda a righe non ci sono più.

**Tetti "blu"**: sono coppi come gli altri, con i pannelli solari appoggiati sopra lontano dal bordo.

**Confini:**

- transenne dietro lo Stage 1, dal fabbricato nord all'edificio con i pannelli: di lì non si passa;
- un muro di cinta in mattoni chiude il lato ovest della cascina, dove prima il cortile di terra era aperto.

**Serra**: al posto del blocco bianco c'è una serra di vetro semitrasparente, con montanti bianchi e file di piantine.

**Schede**: i testi dicono in quale portico stanno casse, giochi, birra, bar e cucina, e parlano del tavolo dei biglietti e della consolle. Nessun dato copiato da LAG app.

## Scelte e alternative

- **Archi calcolati, non disegnati a mano.**
  - `findArcades()` in `map.js` trova le file di caselle `A` e il loro lato aperto, poi le divide in archi larghi circa 1,5 caselle.
  - Il lato sud ha 12 caselle, quindi 8 archi, come nella realtà.
  - Il banco sotto ogni arco dipende dalla zona della casella al centro: per cambiare cosa c'è sotto un arco basta cambiare una lettera nello strato delle zone.
  - Alternativa scartata: un arco per casella. Avrebbe dato 12 archi sul lato sud, oppure 8 archi e 5 caselle di muro cieco.
- **Tetti dei portici che sfumano.**
  - La telecamera guarda da nord-est, quindi il portico delle casse (aperto verso ovest) è sempre coperto dal suo tetto. Anche sotto gli archi del lato sud si vede poco.
  - Quando il personaggio è a 3 caselle o meno da un portico, i tetti dei portici diventano trasparenti (opacità 0,15) e i banchi si vedono. Da lontano il tetto resta pieno.
  - Alternative scartate:
    - tetto sempre semitrasparente: sembra vetro;
    - togliere il tetto: non rispetta "sotto il tetto";
    - cambiare telecamera: non basta per un portico aperto verso ovest.
- **Portici non calpestabili**: i banchi occupano la profondità del portico, che è di una casella. Le zone comprendono anche le caselle d'aia davanti agli archi, quindi il personaggio arriva davanti al banco.
- **Pannelli solari**: una lastra sottile per casella, leggermente più piccola, sopra i coppi. Così restano visibili le fughe e il bordo in tegole.
- **Vetro della serra**: un materiale trasparente (`opacity 0.3`, senza scrittura nella profondità) e senza ombre, così dentro si vedono le piante.

## Interpretazioni da confermare

- **Muro "in fondo lato destro"**: l'ho letto come il lato ovest (a destra sullo schermo), dove il cortile di terra con capanno e serra era aperto verso la strada. Il muro corre lungo tutta la colonna ovest, dal fabbricato nord al capanno a sud.
- **Transenne**: occupano tutta la larghezza dietro il palco, così non si passa né sopra né sotto il palco.
- **Bici**: sul lato sud della strada d'ingresso, cioè a sinistra guardando la cascina dall'ingresso.
- **Portici dell'edificio con i pannelli**: 4 archi verso il palco e 2 verso l'aia, tutti liberi. L'edificio sporge dalla linea del portico lungo, come nella foto aerea.

## Verifica

**Verificato:**

- `node --test`: 7 test superati. I due test nuovi:
  - non si passa oltre le transenne. Controprova: aprendo una transenna il test fallisce;
  - ordine degli archi, entrando: casse → giochi → birra; di fronte, da est: libero, 3 bar, 4 cucina.
- Browser locale (127.0.0.1:8081), tutti i file con `?v=5`:
  - bici e tavolo dei biglietti visibili all'avvio;
  - consolle dello Stage 2;
  - 8 archi con banchi arancioni e rossi;
  - tetti dei portici che sfumano vicino a casse, bar, birra e cucina;
  - serra, muro e transenne;
  - pannelli sopra i coppi;
  - tenendo premuto "su" dai Tavoli si arriva alla Cucina.

**Non verificato:**

- telefono reale;
- larghezza desktop (il pannello di prova è largo 536 px);
- percorso "riduci movimento" (letto nel codice: l'opacità cambia di colpo).

## Apprendimento

Materiali trasparenti e opacità animata: vedi il [registro](../../docs/learning/learning-register.md).
