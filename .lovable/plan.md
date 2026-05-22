
## Diagnos (klar)

Jag har redan kollat:

- **`https://traivo.se/`** svarar `200 OK` (Cloudflare + Lovable). Sajten är live.
- **`/robots.txt`** ✅ tillåter alla crawlers, refererar `sitemap.xml`.
- **`/sitemap.xml`** ✅ svarar `200`, innehåller alla 12 rutter.
- **`index.html`** ✅ har title, description, OG-taggar, Organization + WebSite JSON-LD, och Google site-verification token är redan inlagd.
- **`site:traivo.se` på Google** → **0 träffar**.

**Slutsats:** Sajten är tekniskt redo. Google har helt enkelt inte indexerat den ännu. Det förklarar varför "traivo.se" inte ger någon träff – det finns inget i indexet att rangera.

Det som saknas är de manuella stegen i Google Search Console (verifiering + sitemap submission + "Request indexing"), samt några små tekniska förbättringar som påskyndar och stabiliserar indexeringen.

---

## Plan: tre delar

### Del 1 — Förbättra indexerbarheten (kod)

Småfixar i frontend som gör det enklare för Google att förstå sajten:

1. **Lägg till `<link rel="canonical">` i `index.html`** – pekar på `https://traivo.se/`. Saknas idag, vilket gör att Google kan välja "fel" URL-variant (preview-domän vs produktion) som kanonisk.
2. **Lägg till per-route SEO med `react-helmet-async`** för de viktigaste sidorna (`/`, `/traivo-one`, `/traivo-go`, `/hjarna`, `/priser`, `/kunskap`, `/om-oss`, `/kontakt` + kunskapsartiklarna). Idag har alla rutter samma title/description, vilket gör att Google bara indexerar startsidan på ett meningsfullt sätt.
   - Per sida: unik `<title>`, `<meta description>`, `<link rel="canonical">`, OG-taggar.
   - Kunskapsartiklar får dessutom `Article` JSON-LD.
3. **Lägg till `BreadcrumbList` JSON-LD** för kunskapsartiklar – ger Google brödsmulor i sökresultaten.
4. **Säkerställ att `<h1>` är unik per sida** (snabb kontroll, fix vid behov).

### Del 2 — Google Search Console-flöde (du klickar)

Ni har redan en bra dialog (`GoogleVerifyDialog`). När koden i Del 1 är publicerad:

1. Öppna verifieringsdialogen → kör steg 1–4 (Hämta token → publicera → Verifiera → Lägg till site).
2. När sajten finns i Search Console:
   - **Submit sitemap**: `https://traivo.se/sitemap.xml`
   - **URL Inspection** → `https://traivo.se/` → **Request Indexing**. Upprepa för 3–5 viktigaste rutterna.
3. Detta brukar trigga första crawlen inom timmar/dagar istället för veckor.

*(Inget jag behöver göra i koden här – instruktionerna skickas till dig efter Del 1.)*

### Del 3 — SEO-review

Kör den automatiska SEO-granskningen så vi får en konkret lista över ev. återstående problem (t.ex. saknade alt-texter, för långa titlar, dubblerade descriptions). Resultaten dyker upp i SEO-fliken efter ~1 minut.

---

## Tekniska detaljer (Del 1)

**Filer som ändras / läggs till:**

- `index.html` – lägg till `<link rel="canonical" href="https://traivo.se/" />`. Behåll all befintlig head-data.
- `package.json` – `npm install react-helmet-async`.
- `src/main.tsx` – wrappa `<App />` med `<HelmetProvider>`.
- `src/components/SEO.tsx` – komponenten finns redan, ingen ändring behövs.
- Per sida (`src/pages/Index.tsx`, `TraivoOne.tsx`, `TraivoGo.tsx`, `BrainPage.tsx`, `Pricing.tsx`, `KnowledgeIndex.tsx`, `KnowledgeArticle.tsx`, `About.tsx`, `Contact.tsx`) – importera och rendera `<SEO ... />` med unik titel/description/path.
- `src/pages/KnowledgeArticle.tsx` – lägg dessutom till `Article` + `BreadcrumbList` JSON-LD via `<Helmet>`.

**Påverkar inte:** routing, design, business logic, edge functions. Allt är ren frontend/presentation.

---

## Förväntat utfall

- Inom **3–14 dagar** efter Search Console-submission börjar `site:traivo.se` ge träffar.
- Sökning på **"traivo"** börjar visa startsidan inom några veckor (saknas konkurrens på varumärket).
- Per-sida-SEO gör att även `/priser`, `/kunskap/...` etc. kan rankas på relevanta termer (ruttoptimering, fältservice, etc.).

Säg till om jag ska köra planen så börjar jag med Del 1 + Del 3 i samma sväng.
