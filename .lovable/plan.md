## Förslag

Jag håller med — det är bättre att **inte** ha en aktiv chattruta direkt i hero på startsidan. Två AI-ingångar (en på `/` och en på `/hjarna`) skapar förvirring, splittrar trafiken och gör startsidan mindre fokuserad. Startsidan ska sälja in idén; **`/hjarna` är platsen där analysen sker**.

## Vad jag vill ändra

### 1. Startsidan (`src/pages/Index.tsx`) — hero-sektionen

Ta bort `<AIInput />` ur hero (rad 183–185) och ersätt med en **inbjudande "teaser" till Hjärnan** som inte går att skriva i — bara klicka.

Layouten blir:

```text
   Dina tekniker kör. Dina planerare släcker bränder. Dina kunder väntar.
   Vi byggde det vi själva saknade i 15 år i fält.

   ┌──────────────────────────────────────────────────────────┐
   │  🧠  Prova Hjärnan                                        │
   │                                                           │
   │  Beskriv din verksamhet anonymt – få konkreta             │
   │  rekommendationer på 20 sekunder. Inga säljsamtal.        │
   │                                                           │
   │  [ Öppna Hjärnan → ]    Helt anonymt · Inget sparas       │
   └──────────────────────────────────────────────────────────┘
```

Komponenten är en `Link` till `/hjarna` (hela kortet är klickbart) med:
- Hjärn-ikon + rubrik "Prova Hjärnan"
- Kort beskrivning av vad det är
- Tydlig CTA-knapp "Öppna Hjärnan →"
- Mikro-trust-rad: "Helt anonymt · Inget loggas · Inga säljsamtal"
- Samma `glass` / `glow-teal`-stilar som befintliga kort så det matchar designen

Behåller `id="ai-chat"` på wrappern så befintliga ankarlänkar (t.ex. `AIChatLink` som scrollar till `#ai-chat`) fortfarande landar på rätt ställe.

### 2. `AIChatLink` (`src/components/AIChatLink.tsx`)

Uppdatera så att den navigerar direkt till `/hjarna` istället för att scrolla till `#ai-chat` på startsidan. Det matchar den nya intentionen: alla "starta AI-analys"-länkar i sidan leder till Hjärnan.

### 3. Behålla `AIInput`-komponenten

Komponenten `src/components/AIInput.tsx` tas **inte bort** — den är inte använd någon annanstans men kan vara värdefull att behålla i koden ifall vi vill återanvända chat-flödet senare. (Säg till om du hellre vill att jag raderar den.)

## Varför det här är bättre

- **En tydlig väg in**: startsidan presenterar erbjudandet, `/hjarna` är verktyget. Inget dubbelarbete.
- **Snabbare startsida**: ingen tung textarea + streaming-logik laddas i hero.
- **Bättre konvertering till Hjärnan**: ett klick istället för att skriva direkt — användaren kommer till en sida som är byggd för analysen, med exempel, integritetsbanner och rätt kontext.
- **Renare narrativ**: hero → problem → branscher → trovärdighet → kontakt, utan att hero-sektionen försöker leverera värdet redan.

## Vad jag inte rör

- `/hjarna`-sidan och `BrainPage` — fungerar redan bra och är platsen där flödet ska leva.
- Edge-funktionerna (`brain` och `chat`).
- Övriga sektioner på startsidan (problem, branscher, credibility, kontakt).
