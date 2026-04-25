## Mål
Höja kundupplevelsen och konverteringen på Traivo.se via fem konkreta åtgärder. Allt levereras i en serie steg där varje steg avslutas med ett **funktionstest** (manuell verifiering eller browser-test där relevant) innan jag går vidare till nästa.

---

## Steg 1 — Trust-sektion på förstasidan ("Vad Traivo gör / Vad Traivo inte gör")

**Vad:** Ny sektion på `/` (Index.tsx), placerad direkt efter hero/AI-kortet och före "Problem recognition". Två kolumner sida vid sida på desktop, staplade på mobil.

- **Vänster kolumn — "Det här är Traivo"** (gröna bockar): Planering, ruttoptimering, fältapp offline, kundportal/SMS, fakturering & Fortnox-export, AI-rekommendationer.
- **Höger kolumn — "Det här är vi inte"** (gråa kryss): Inte ett bokföringssystem. Inte ett HR-/lönesystem. Inte ett CRM för säljpipelines. Ingen tidsbokning för slutkonsument (typ Bokadirekt). Inte ett ERP.

Tonalitet: kort, sakligt, en mening per punkt.

**Funktionstest steg 1:**
- Visuell kontroll i preview (desktop + mobil 390px).
- Bekräfta att sektionen renderas mellan rätt sektioner och inte spräcker layouten.

---

## Steg 2 — Förbättrad djupanalys-leverans (innehåll + struktur)

**Vad:** Skärpa kvaliteten på det kunden får för 399 kr.

1. **Stärka system-prompten** i `supabase/functions/generate-deep-analysis/index.ts`:
   - Tvinga konkreta siffror (timmar, kr/år, %) i sektion 5 (ROI).
   - Kräva minst 3 specifika hävstänger (inte generiska floskler).
   - Lägga till "Quick wins (vecka 1)" som egen liten sektion under åtgärdsplanen.
   - Förbjuda säljspråk explicit ("revolutionerande", "transformera", "next-gen") med exempel i prompten.
2. **Strukturkontroll** efter generering: edge-funktionen verifierar att alla 9 rubriker finns; om någon saknas → markera som `failed` med tydligt felmeddelande istället för att leverera en halvfärdig rapport.
3. **PDF-rendering**: säkerställa att thank-you-sidan renderar markdown korrekt (kontroll av befintlig kod).

**Funktionstest steg 2:**
- Trigga om-generering på en befintlig betald order (eller skapa testorder via sandbox).
- Granska rapporten: alla 9 rubriker, ROI med siffror, inga floskler, korrekt företagsnamn och webbplats-referenser.
- Ladda ner PDF och kontrollera att formattering fungerar.

---

## Steg 3 — Performance-pass (mobil & 4G)

**Vad:** Snabbare första-paint på mobil.

1. **Lazy-load tunga animationer** — `BrainHero`, `FieldVisual`, `AboutVisual`, `PlannerVisual` får `IntersectionObserver`-baserad lazy mount så de inte blockerar initial render.
2. **Reducera blur-filter på mobil** — `<768px` får mindre `blur()`-värden via en CSS-klass (blur 50px → 20px på mobil), eftersom `blur(150px)` är tungt på äldre Android-telefoner.
3. **Code-splitting** på sällanbesökta routes: `GoLiveChecklist`, `DeepAnalysisCheckout`, `DeepAnalysisThankYou` lazy-loadas via `React.lazy()`.
4. **Preconnect** till Supabase + Lovable AI gateway i `index.html` för snabbare första API-anrop.

**Funktionstest steg 3:**
- Bygga produktion lokalt (`npm run build`) och kontrollera bundle-storlek.
- Browser-test i 390×844 viewport: ladda `/`, kontrollera att hero syns omedelbart utan layout-skutt.
- Verifiera att alla sidor fortfarande laddar och animationerna fungerar när man scrollar ner.

---

## Steg 4 — Kontaktformulär: bekräftelse via mail + spara säkrare

**Vad:** Säkerställa att inget tappas och att kunden vet att vi tagit emot.

1. **Bekräftelsemail till kunden** — ny edge-funktion `notify-contact-submission` som triggas efter lyckad insert. Skickar:
   - Mail till kunden: "Tack, vi återkommer inom 1 arbetsdag" + sammanfattning av deras meddelande.
   - Mail till `info@traivo.se`: hela formulärsubmissionen så ni ser den direkt.
2. **Använd Lovable transactional email** (Resend via Lovable Cloud) — ingen extra konfiguration krävs av användaren.
3. **Frontend uppdatering** i `Contact.tsx`: efter lyckad insert, anropa edge-funktionen i bakgrunden (fail-soft — om mail-utskick failar tappar vi inte själva submissionen).

**Funktionstest steg 4:**
- Fyll i formuläret med en testadress (din egen).
- Verifiera att (a) raden hamnar i `contact_submissions`, (b) du får bekräftelsemail, (c) info@traivo.se får kopia.
- Testa felfall: avbryt mail-funktionen artificiellt och bekräfta att submissionen ändå sparas.

*Notera om mailadress:* `info@traivo.se` används som mottagare. Om domänen `traivo.se` inte är verifierad i Lovable Cloud än kan jag använda en `onboarding@resend.dev`-fallback i utvecklingsläge och flagga upp att ni behöver verifiera domänen för produktion.

---

## Steg 5 — Hjärnan: hårdare anti-flosker + tydligare upsell

**Vad:** Höja signal-brus-förhållandet i AI-svaren och göra 399 kr-erbjudandet ärligare.

1. **Stärka system-prompten** i `supabase/functions/brain/index.ts`:
   - Förbjud säljspråk explicit (samma lista som steg 2).
   - Tvinga svar att börja med vad användaren beskrev (visa att vi lyssnat) innan rekommendationer.
   - Max 3 rekommendationer (inte 7 generiska bullets).
2. **Djupanalys-upsell-komponenten** (`DeepAnalysisUpsell.tsx`): tydligare lista över exakt vad de får (3-5 sidors PDF, ROI-beräkning, 30/60/90-plan, levereras inom 2 minuter, ingen mailspam efteråt).
3. **Ångerinformation**: kort rad om att 399 kr återbetalas om rapporten inte levereras inom 5 minuter (om ni vill — annars stryker jag den punkten).

**Funktionstest steg 5:**
- Skicka 3 olika test-prompts till Hjärnan (en kort, en lång, en på engelska).
- Verifiera: max 3 rekommendationer, börjar med en spegling, inga floskler.
- Klicka på upsell-kortet och kontrollera att checkout-sidan visar samma löften.

---

## Tekniska detaljer

| Steg | Filer som ändras | Nya filer |
|------|------------------|-----------|
| 1 | `src/pages/Index.tsx` | – |
| 2 | `supabase/functions/generate-deep-analysis/index.ts` | – |
| 3 | `src/App.tsx`, `src/components/BrainHero.tsx`, `src/components/FieldVisual.tsx`, `src/components/AboutVisual.tsx`, `src/components/PlannerVisual.tsx`, `src/index.css`, `index.html` | – |
| 4 | `src/pages/Contact.tsx`, `supabase/config.toml` | `supabase/functions/notify-contact-submission/index.ts` |
| 5 | `supabase/functions/brain/index.ts`, `src/components/DeepAnalysisUpsell.tsx` | – |

**Inga DB-migrationer behövs** — alla nödvändiga kolumner finns redan i `contact_submissions` och `deep_analyses`.

**Inga nya secrets/connectors behövs** — Lovable Cloud transactional email används out-of-the-box för steg 4.

**Bekräfta innan steg 4:** Kontaktmail ska gå till `info@traivo.se` — säg till om annan adress önskas (t.ex. `tomas@traivo.se`).

---

## Leveransordning & avbrott
Jag kör steg 1 → 5 sekventiellt. Efter varje steg pausar jag, redovisar resultatet av funktionstestet, och du säger "fortsätt" eller "stopp/justera". Om något test misslyckas fixar jag och testar om innan nästa steg.
