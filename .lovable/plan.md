# Tillgänglighet för äldre användare — kontrast & läsbarhet

Målgrupp: äldre fältserviceproffs, ofta med försämrad syn. Inga stora visuella förändringar — bara höja kontrast, textstorlek och tydlighet där det idag är svagt.

## Problem som hittats

1. **Muted-text för ljusgrå mot mörk bakgrund** — `--muted-foreground: 185 14% 75%` ger ca 7:1 mot bakgrund, men används i väldigt små storlekar (text-xs, text-[11px], text-[12px]) på t.ex. nav-länkar, badges, "anonymt"-rad under CTA, svarsnivå-väljare. Små + grått = svårläst.
2. **Navbar-länkar** är `text-[12px] uppercase` i muted färg — kombinationen liten + versal + grå är jobbig för äldre ögon.
3. **Brödtext** i hero och sektioner använder ofta `text-sm` (14px) eller `text-base` (16px) i muted-färg.
4. **Fokusringar** finns på CTAs men saknas på vanliga textlänkar.
5. **Body font-size** är webbstandard 16px — kan höjas något på desktop.

## Föreslagna ändringar (små, säkra)

### 1. Höj kontrast på muted-foreground
`index.css`: `--muted-foreground` från `185 14% 75%` → `185 18% 84%`. Påverkar all sekundärtext globalt utan att ändra layout.

### 2. Navbar
- Höj länkstorlek från `text-[12px]` → `text-sm` (14px), behåll uppercase men öka `tracking` lite mindre.
- Använd `text-foreground/80` istället för `text-muted-foreground` för inaktiva länkar.
- Mobilmeny: `text-sm` → `text-base`.

### 3. Mikrotext (badges, "anonymt"-rader, hjälptexter)
Höj `text-[11px]` → `text-xs` (12px) och `text-xs` → `text-sm` där det är meningsbärande information (t.ex. raden "Inget loggas · Inga säljsamtal" i MondayHero, svarsnivå-väljaren).

### 4. Brödtext i hero/sektioner
Hero-paragraf: `text-base md:text-lg` → `text-lg md:text-xl`. Sektionsbeskrivningar `text-sm` → `text-base` där de är förklarande text.

### 5. Fokus & länkar
Lägg `focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2` på navbar-länkar och inline-länkar som idag saknar synlig fokusmarkering.

### 6. Underline på textlänkar i löpande text
Inline-länkar i brödtext får `underline underline-offset-4 decoration-primary/60` så de inte bara känns igen via färg.

## Filer som påverkas

- `src/index.css` — en token-ändring (`--muted-foreground`).
- `src/components/Navbar.tsx` — storlek + färg på länkar.
- `src/components/MondayHero.tsx` — hero-paragraf, microcopy-rader.
- `src/components/HowItWorksSection.tsx`, `TeamSection.tsx`, `Footer.tsx` — höj `text-sm` till `text-base` på beskrivande text.
- Eventuellt `FAQ.tsx` om text där är för liten.

## Vad som INTE ändras

- Färgtema, logotyp, layoutstruktur, typsnitt, animationer.
- Rubrikstorlekar (de är redan stora och tydliga).
- CTA-knappar (redan höga kontrastvärden).

## Resultat

Sekundärtext och navigering blir märkbart läsbarare för äldre användare, utan att designens karaktär ändras.
