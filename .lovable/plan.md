# Pil från nivå-valet direkt till hjärnan

När besökaren har valt nivå i hero ska det synas en tydlig pil/animation som pekar ner mot hjärn-länken — och länken själv ska visa att hjärnan är anpassad till just det valet.

## Vad som händer

1. Besökaren väljer "IT bra — AI används" eller "Rutinerat IT — på väg med AI".
2. Direkt under pillarna animeras en liten nedåtpil fram (mjuk bounce) tillsammans med texten:
   - business: "Hjärnan är inställd på vardagligt språk →"
   - tech: "Hjärnan är inställd på teknisk nivå →"
3. Pilen pekar ner mot den befintliga "Beskriv din verksamhet anonymt"-länken, som samtidigt får en mjuk highlight (primary-färgad ram + ljus glow) så det blir uppenbart vart man ska.
4. Klick på länken tar besökaren till `/hjarna#brain-input` precis som idag — `AIInput.tsx` läser redan `traivo-answer-level` från localStorage och svarar enligt valet.

## UX-detaljer

- Pilen visas bara efter att ett val gjorts (eller laddas om besökaren har ett sparat val sen tidigare).
- Mjuk fade-in + lätt bouncy-y-animation (`animate-bounce` eller framer-motion `y: [0, 4, 0]` loop).
- Highlighten på hjärn-länken är subtil — en `border-primary/40` och `bg-primary/[0.05]` runt hela raden, inte en knapp-look.
- Inget ändrar sig på själva länkens text eller `href`.

## Filer som berörs

- `src/components/MondayHero.tsx` — lägga till pil + bekräftelse-text under pillarna, villkorlig highlight-styling på hjärn-länken.

## Vad som INTE ingår

- Inga ändringar i AI-input, edge-funktionen eller suggested questions.
- Ingen extra CTA-knapp — vi förstärker bara den befintliga länken.
- Ingen ändring av nivå-pillarna själva.
