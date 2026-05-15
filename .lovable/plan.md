# Hjärnan: lägg till valfri webbadress för bättre svar

## Mål
Höj kvaliteten på Hjärnans analys genom att låta besökaren (frivilligt) ange sin webbadress. Edge-funktionen hämtar då innehållet från sajten, sammanfattar det och låter Hjärnan väva in branschspecifika observationer i sitt svar — utan att tappa anonymiteten (vi sparar fortfarande inget).

## Användarflöde

```text
[Hjärnan-input]
 ├── Textfält: "Beskriv er verksamhet…"
 └── Valfritt: 🌐 "Lägg till webbadress för djupare analys"  (expanderbart)
       └── input: https://...

[Skicka] → edge function /brain
            ├── Om URL angiven: hämta + sammanfatta sajten (server-side)
            └── Skicka kombinerad kontext till AI-modellen

[Svar i chatten]
 └── Vanlig markdown-rendering
       + liten chip överst: "Analys baserad på din beskrivning + din.se"
```

## Vad användaren ser

- Under befintliga textfältet: en diskret länk "+ Lägg till webbadress (frivilligt)" som expanderar ett URL-fält.
- Hjälptext: "Vi läser publika sidor en gång för att förstå er bättre. Inget sparas."
- Validering: måste börja med http(s)://, max längd, ingen IP/localhost.
- Felhantering: om sajten inte kan läsas → svar fortsätter ändå utan URL-kontext, med liten notis "kunde inte läsa sajten".

## Vad Hjärnan får extra
1. Företagsnamn (om hittat i title/meta).
2. 1–2 meningar om vad bolaget gör (från meta description / hero).
3. Bransch-/tjänsteindikatorer (nyckelord från huvudsidan).
4. Geografi om det syns (t.ex. "verksam i Mälardalen").

Detta läggs in i system-prompten som "## Kontext från besökarens webbplats" så att Hjärnan kan referera konkret ("Eftersom ni jobbar med kyl- och värmepumpsservice i Stockholm…").

## Teknisk lösning

- **Frontend (`src/pages/BrainPage.tsx`)**
  - Nytt state `siteUrl`, expanderbart input ovanför skicka-knappen.
  - Skickar med `siteUrl` i body till edge-funktionen.
  - Visar liten "Läser din.se…" loader-chip när URL finns.

- **Edge function (`supabase/functions/brain/index.ts`)**
  - Tar emot `siteUrl` (validera: https?, längd, inte localhost/IP).
  - Om angiven: gör `fetch` mot URL:en med kort timeout (5s), läs HTML, plocka ut `<title>`, `<meta description>`, första ~3000 tecken text. Ren regex/strip-tags räcker — ingen extern beroende.
  - Bygg en kort kontextsträng (max ~1500 tecken) och prependa till messages som ett system- eller user-meddelande märkt "Kontext från besökarens sajt".
  - Caching: ingen (vi sparar inget). Per-request only.
  - Felfall: timeouts/4xx/5xx → ignorera tyst, fortsätt utan URL-kontext, sätt header `X-Site-Read: failed` så frontend kan visa notis.

- **Säkerhet**
  - Block: `localhost`, `127.*`, `10.*`, `192.168.*`, `169.254.*`, `::1`, interna .local-domäner (SSRF-skydd).
  - Endast http/https, max URL-längd 500.
  - Hämta max 1 MB, klipp av därefter.
  - Ingen lagring – inget i DB, inga loggar med URL-innehåll.

## Filer som ändras
- `src/pages/BrainPage.tsx` — nytt URL-fält + skicka med i request, liten statusnotis.
- `supabase/functions/brain/index.ts` — fetch+parse+SSRF-skydd, prepend kontext, valbar respons-header.

## Inga DB-ändringar, inga nya secrets, inga nya beroenden.

## Senare (ej i denna plan)
- Visa tydlig "läs igen"-knapp om sajten cachelagrats per session.
- Stötta att AI:n får använda Firecrawl-connectorn för bättre extraktion om vi vill öka kvaliteten.
