# LAG Mappa: dove succede cosa?

Demo di una mappa 3D voxel, in stile Crossy Road, per **L'Agro ai Giovani** a Cascina Marasco (Cremona). La cascina è ricostruita dalla foto aerea e ambientata al tramonto. Gli stand e lo Stage 1 sono posizionati come nelle foto dell'organizzatore. La telecamera guarda da nord-est per mostrare il porticato con gli stand. Casse, giochi e birra stanno sotto il portico a sinistra dell'ingresso; bar e cucina sotto il portico lungo a otto archi. Quando il personaggio si avvicina, i tetti dei portici diventano trasparenti e si vede cosa c'è sotto. Ogni zona dell'evento ha un'etichetta colorata e una scheda: ingresso, casse, cucina, bar, birra, giochi, zona tavoli, Stage 1, Stage 2. Si naviga toccando le etichette o il menu, oppure muovendo il personaggio con le cuffie: tenendo premute frecce/WASD, o trascinando e tenendo giù il dito, cammina finché non si rilascia.

Sito: <https://andreasalami.github.io/lag-mappa/>

Programma, menu, biglietti e torneo **non sono copiati qui**: ogni scheda apre la sezione giusta di [LAG app](https://andreasalami.github.io/lag_app/), così le informazioni restano sempre aggiornate.

## Comandi

```bash
python3 -m http.server 8081 --bind 127.0.0.1   # anteprima su http://127.0.0.1:8081 (Ctrl+C per fermare)
node --test                                    # test della mappa (Node 20+)
```

Non c'è nessuna build: GitHub Pages pubblica i file così come sono a ogni push su `main`.

## Come è fatto

| File | Ruolo |
|---|---|
| `index.html` | Menu delle zone, 9 schede con i link a LAG app, due canvas, import map di Three.js |
| `style.css` | Colori LAG, modalità lettura (base), modalità mappa (`html.game`), lettura sopra la mappa (`html.reading`) |
| `js/map.js` | Due mappe di testo della stessa misura: `TERRAIN` (cosa c'è) e `ZONE_LAYER` (dove succede cosa), più i portici divisi in archi (`ARCADES`). Logica pura, senza Three.js |
| `js/world.js` | Cascina voxel (tetti in coppi a gradoni, pannelli solari sopra le tegole, portici ad archi con tetto che sfuma, serra di vetro, muro e transenne), banchi sotto gli archi, palco, consolle e food truck che si girano da soli verso la loro zona, tavolo dei biglietti, bici, tavoli con lucine, pubblico, luce del tramonto |
| `js/labels.js` | Etichette HTML agganciate ai punti 3D, riposizionate a ogni fotogramma |
| `js/overlay.js` | Canvas trasparente sopra l'interfaccia: note musicali, coriandoli, uccelli |
| `js/main.js` | Telecamera ortografica che segue il personaggio, comandi, schede |
| `assets/` | Logo e favicon copiati da `lag_app/public` (logo ridotto con `sips -Z 320`) |
| `vendor/three/` | Three.js 0.186.1 (MIT), stessi file e hash di `ecovillaggio-valdiluce` |

## Spostare le zone

La mappa è indicativa: nord in alto, come nella foto aerea. Per spostare una zona basta modificare in `js/map.js` le lettere dello strato `ZONE_LAYER` e, se serve, palchi e tavoli (`X`, `n`, `F`) nello strato `TERRAIN`. Palchi e food truck si girano da soli verso il centro della loro zona.

I portici sono le caselle `A` del terreno: vengono divisi da soli in archi larghi circa una casella e mezza, e sotto ogni arco compare il banco della zona che copre il suo centro (nessuna zona = arco libero). Per cambiare cosa c'è sotto un arco basta cambiare la lettera della zona su quelle caselle.

Dopo ogni modifica lancia `node --test`. Il test controlla:

- che i due strati abbiano la stessa forma;
- che ogni zona sia raggiungibile dall'ingresso e abbia scheda e voce di menu;
- che dietro lo Stage 1 non si passi;
- l'ordine degli archi indicato da Andrea.

## Privacy

Nessun cookie, nessun analytics, nessun form e nessuna richiesta a server esterni. I link verso LAG app e Instagram si aprono solo quando li tocchi.
