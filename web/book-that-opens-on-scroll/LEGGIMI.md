# Il libro che si apre allo scroll

Una pagina bianco caldo con in alto il nome di un piccolo editore inventato, Bramble Press, e la scritta del catalogo d’autunno. Al centro, sul tavolo, c’è un libro chiuso visto dall’alto e di fronte: la copertina di tela beige con il titolo Small Hours impresso a secco e il nome dell’autore, il taglio delle pagine che si vede lungo il bordo in basso e a destra, e un nastro segnalibro rosso che spunta sotto. All’apertura il libro si posa sul tavolo con la sua ombra morbida. Scendendo la pagina resta ferma e il libro si apre: la copertina si alza sulla cerniera del dorso, si scurisce mentre sta in piedi, passa oltre e si posa a sinistra mostrando il risguardo col nome dell’editore. Poi sette pagine sottili la seguono una dopo l’altra: ognuna si stacca dal mucchio, si solleva un poco, si curva col bordo libero che resta indietro, getta un’ombra sulla pagina sotto e si posa a sinistra, appena sfalsata dalle altre. Intanto il libro scivola perché alla fine la doppia pagina sia al centro, si gira e si abbassa un poco, e il nastro ondeggia mentre le pagine gli passano sopra. Sull’ultima pagina compaiono Chapter one e la prima frase, Some stories wait for the right page., che prende peso mentre arriva. Risalendo il libro si richiude. Il puntatore inclina il libro di qualche grado su una molla, e un clic solleva l’angolo della pagina di sopra.

## Come si usa

Apri index.html in un browser. Le librerie arrivano da jsDelivr: in produzione puoi scaricarle e servirle dal tuo dominio.

## Come funziona

- **Un libro di facce piatte.** Il libro è un div con transform-style: preserve-3d, inclinato all’indietro con rotateX come se stesse sul tavolo. Dentro ci sono facce piatte messe nello spazio: il retro della copertina a z zero, il blocco delle pagine a z uguale allo spessore, i due tagli del blocco girati di 90 gradi con rotateX e rotateY, e la copertina in cima, con la faccia di tela e il risguardo girato di 180 gradi e backface-visibility nascosta.
- **La cerniera.** La copertina e ogni pagina hanno transform-origin sul bordo del dorso e girano con rotateY da 0 a meno 180 gradi. Mentre girano si alzano di un poco, col seno dell’avanzamento, e passano dalla loro quota sul mucchio di destra a quella sul mucchio di sinistra, così la prima pagina girata resta sotto a sinistra come in un libro vero.
- **La pagina che si curva.** Ogni pagina è fatta di cinque strisce, ognuna figlia della precedente e girata di qualche grado in più: le rotazioni si sommano e la pagina si curva. La curva cresce a metà del giro e torna a zero quando la pagina si posa, così da piatta torna piatta.
- **Tutto da una sola timeline.** Una timeline di ScrollTrigger con lo scrub porta un numero solo da 0 a 1; a ogni fotogramma lo script calcola da quel numero la copertina, ogni pagina con la sua finestra di scroll, le ombre, la luce sulle facce, lo scivolamento del libro e la frase finale. Lenis ammorbidisce lo scroll.

## Valori da cambiare

- `PAGES` (script.js, di partenza 7): Quante pagine sottili girano dopo la copertina (da 2 a 14).
- `SIZE` (script.js, di partenza 1): Quanto è grande il libro (1 = sta nello schermo).
- `CURL` (script.js, di partenza 14): Quanto si curva una pagina mentre gira, in gradi per striscia.
- `LIFT` (script.js, di partenza 0.07): Quanto si alza una pagina che gira, in parti della larghezza della pagina.
- `TILT` (script.js, di partenza [56, 40]): Quanto è inclinato all’indietro il libro all’inizio e alla fine, in gradi.
- `TURN` (script.js, di partenza [-9, -2]): Quanto è girato il libro sul tavolo all’inizio e alla fine, in gradi.
- `FAN` (script.js, di partenza 0.8): Quanto si aprono a ventaglio le pagine girate a sinistra, in gradi.
- `SMOOTH` (script.js, di partenza 0.7): Quanto morbido il libro segue lo scroll, in secondi (0 = attaccato).
- `RIDE` (script.js, di partenza 1): Quanto scroll serve per tutto: 2 è il doppio.

## Trappole

- Le pagine girate tenevano la loro quota del mucchio di destra e a sinistra finivano impilate al contrario: la prima girata stava sopra. La quota va spostata dal mucchio di destra a quello di sinistra mentre la pagina gira.
- Una pagina fatta di strisce con un’ombra diversa per striscia sembra a bande: l’ombra deve essere quasi uguale su tutte le strisce, e le strisce si sovrappongono di un pixel e mezzo perché fra loro non passi luce.
- overflow: hidden su un contenitore appiattisce il 3D di tutto quello che ha dentro: va messo solo sulle facce finali, mai sui gruppi.

---

# The book that opens on scroll

A warm white page with the name of a made-up small publisher, Bramble Press, and its autumn list at the top. In the middle, on the table, there is a closed book seen from above and in front: a beige cloth cover with the title Small Hours blind-pressed and the author’s name, the edge of the pages showing along the bottom and right sides, and a red ribbon bookmark poking out underneath. On opening the book settles on the table with its soft shadow. As you scroll the page holds still and the book opens: the cover rises on the spine’s hinge, darkens while it stands up, goes over and lies down on the left showing the endpaper with the publisher’s name. Then seven thin pages follow one after another: each one leaves the stack, lifts a little, curves with its free edge trailing, casts a shadow on the page below and lands on the left, slightly fanned from the others. Meanwhile the book glides so that the open spread ends in the middle, turns and lowers a little, and the ribbon sways as the pages pass over it. On the last page Chapter one and the first sentence, Some stories wait for the right page., appear, gaining weight as they arrive. Scroll back up and the book closes. The pointer tilts the book a few degrees on a spring, and a click lifts the corner of the top page.

## How to use it

Open index.html in a browser. Libraries load from jsDelivr: in production you can download them and serve them from your own domain.

## How it works

- **A book made of flat faces.** The book is a div with transform-style: preserve-3d, leaned back with rotateX as if it lay on the table. Inside are flat faces placed in space: the back cover at z zero, the block of pages at a z equal to its thickness, the two edges of the block turned 90 degrees with rotateX and rotateY, and the cover on top, with the cloth face and the endpaper turned 180 degrees and backface-visibility hidden.
- **The hinge.** The cover and every page have their transform-origin on the spine edge and turn with rotateY from 0 to minus 180 degrees. While they turn they rise a little, with the sine of the progress, and move from their height on the right-hand stack to their height on the left-hand one, so the first page turned stays at the bottom on the left like in a real book.
- **The page that curves.** Every page is made of five strips, each a child of the one before and turned a few degrees more: the rotations add up and the page curves. The curve grows halfway through the turn and goes back to zero as the page lands, so it starts flat and ends flat.
- **Everything from one timeline.** A ScrollTrigger timeline with scrub takes a single number from 0 to 1; on every frame the script works out from that number the cover, each page with its own window of scroll, the shadows, the light on the faces, the glide of the book and the closing sentence. Lenis smooths the scroll.

## Values to change

- `PAGES` (script.js, default 7): How many thin pages turn after the cover (2 to 14).
- `SIZE` (script.js, default 1): How big the book is (1 = fits the screen).
- `CURL` (script.js, default 14): How much a page curves while it turns, in degrees per strip.
- `LIFT` (script.js, default 0.07): How high a turning page rises off the stack, as a fraction of the page width.
- `TILT` (script.js, default [56, 40]): How much the book leans back at the start and at the end, in degrees.
- `TURN` (script.js, default [-9, -2]): How much the book is turned on the table at the start and at the end, in degrees.
- `FAN` (script.js, default 0.8): How much the turned pages fan out on the left, in degrees.
- `SMOOTH` (script.js, default 0.7): How softly the book follows the scroll, in seconds (0 = glued to it).
- `RIDE` (script.js, default 1): How much scroll the whole thing takes: 2 is twice as long.

## Pitfalls

- The turned pages kept their height on the right-hand stack and ended up stacked upside down on the left: the first one turned lay on top. The height has to move from the right-hand stack to the left-hand one while the page turns.
- A page made of strips with a different shade per strip looks banded: the shade has to be almost the same on every strip, and the strips overlap by a pixel and a half so that no light shows between them.
- overflow: hidden on a container flattens the 3D of everything inside it: it goes only on the final faces, never on the groups.

Animorio, 2026