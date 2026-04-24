

## Plan: Lägg till "Marknader vi vänder oss till"-sektion

### Mål
Skapa en ny sektion på startsidan som tydligt presenterar de fem primära branscherna Traivo riktar sig till, samt motivera varför Traivo passar just dem.

### Var det placeras
Ny sektion på `src/pages/Index.tsx`, infogad **efter** "SOLUTION / FEATURES"-sektionen och **före** "CLOSING STATEMENT". Det skapar en logisk flow: problem → bakgrund → lösning → **för vem konkret** → avslut.

### Innehåll

**Sektionsrubrik:**
- Eyebrow: "Branscher"
- Rubrik: "Byggt för verksamheter med många stopp"
- Ingress (kort): "Traivo passar bäst där geografi, tid och kompetens måste pussla ihop varje dag. Här är branscherna där vi gör störst skillnad."

**Fem branschkort (grid 2 kolumner desktop, 1 mobil):**

| # | Bransch | Ikon (lucide) | Kort beskrivning (ca 2 rader) |
|---|---------|---------------|-------------------------------|
| 1 | Miljö, återvinning & avfall | `Recycle` | Geofencing av tömningsställen, ruttoptimering för tunga fordon, snabb hantering av budningar och extratömningar. |
| 2 | Tekniska installationer & service | `Wrench` | Vitvaror, fiber, hiss, kyla. Koppling mellan avtal, artiklar och teknikerns kompetens – med snabb dokumentation i fält. |
| 3 | Fastighet & facility management | `Building2` | Yttre skötsel, trappstädning, snöröjning, rondering. Årsplanering, QR-kvitto på utfört arbete och prediktivt underhåll. |
| 4 | Transport & last mile | `Truck` | Distribution där rutter ändras dagligen. What-if-analys, automatisk omplanering och kundportal med live-leveransstatus. |
| 5 | Hemtjänst & mobil vård | `HeartPulse` | Hårda tidsfönster och slotpreferenser per brukare. Heatmaps som visar belastning per område innan personalen blir överkörd. |

**Avslutande textblock (under korten):**
Kort stycke som förklarar varför Traivo sticker ut – fokus på kombinationen geografi + AI:
> "Det som gör skillnad är kombinationen geografi och AI. Klustervalidering hindrar att jobb säljs där de inte kan utföras lönsamt. Ruttoptimering med riktiga vägdata sparar bränsle och timmar varje dag. Och beslutsstödet förklarar *varför* AI:n placerade jobbet just där – så planeraren behåller kontrollen."

### Stilval (följer befintlig design)
- `border-t border-border`, `py-24 md:py-28 px-6`
- `max-w-5xl mx-auto`
- Branschkort: `glass-subtle rounded-xl p-6`, ikon i `bg-primary/10` cirkel (likt About-sidans value-cards)
- Eyebrow `text-[11px] uppercase tracking-[0.25em] text-primary`
- Rubrik: `font-display text-2xl md:text-3xl font-bold`
- Animationer: `motion.div` med `whileInView` + staggered delay (`i * 0.07`) – samma mönster som features-griden

### Ton
- Naturlig talad svenska, inga buzzwords ("revolutionerande", "game-changer" etc.)
- Industritermer används rakt: budning, rondering, tömningsställe, slot, last mile
- Objektiv, beskrivande – inte säljig

### Tekniska detaljer
- Endast en fil ändras: `src/pages/Index.tsx`
- Inga nya komponenter, inga nya routes, inga nya beroenden
- Lägga till ikoner i befintlig `lucide-react`-import: `Recycle`, `Wrench`, `Building2`, `Truck`, `HeartPulse`
- Definiera `industries`-array nära toppen av filen (parallellt med befintlig `features`-array)

### Memory-uppdatering
Uppdatera `mem://strategy/malgrupp-industrier` med den slutliga listan på fem branscher och deras värdeprop, så att framtida sessioner är konsekventa.

