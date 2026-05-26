## Ny prismodell för /priser

Målet: ta bort friktionen i per-användare-modellen, koppla besparingen till verkliga siffror, och låta målgruppen (20–80 tekniker, B2B) direkt se vilken plan som passar.

### Tre tier-baserade planer + Enterprise

Fast pris per intervall i stället för grund + per användare. Tre publika tiers, fjärde är offert.

| Plan          | Tekniker      | Pris/mån      | Roll                                  |
|---------------|---------------|---------------|---------------------------------------|
| Start         | 1–10          | 4 900 kr      | Mindre team, kom igång                |
| Team          | 11–25         | 9 900 kr      | **Rekommenderad** — typisk kund       |
| Scale         | 26–75         | 19 900 kr     | Större drift, fler features           |
| Enterprise    | 75+ / custom  | Offert        | SLA, SSO, dedikerad infra             |

Alla priser exkl. moms, månadsuppsägning, ingen bindningstid (behålls).

### Vad som ingår var

**Allt i Start (basen — höjd ambitionsnivå):**
Traivo One, Traivo Go, GPS, digitala protokoll, AI-schemaläggning, ruttoptimering, **Fortnox-koppling**, e-post-support.

Motivering: Fortnox är minimikrav för svensk B2B-fältservice — ska inte vara premium.

**Team lägger till:**
Kundportal, väderplanering, fler ekonomisystem (Visma, Björn Lundén), prioriterad support.

**Scale lägger till:**
Prediktivt underhåll, AI-assistent, dedikerad kundansvarig, anpassade integrationer.

**Enterprise:**
SSO, dedikerad miljö, SLA, on-prem-option, anpassat.

### Konkret ROI-räknare (ersätter 15% / 30%-boxen)

Tre inputs användaren styr:

- Antal tekniker (default 20)
- Snitt-timpris för en tekniker (default 650 kr)
- Arbetsdagar per år (default 220)

Output (uppdateras live):

- **Tidsbesparing**: 35 min/tekniker/dag (admin + körtid)
- **Värde/år**: tekniker × 35 min × dagar × timpris = konkret kronbelopp
- **Plankostnad/år**: vald tier × 12
- **Netto/år** + **ROI-multipel** (t.ex. "5,8× pengarna tillbaka")

Visas som ett enda kort under planerna, inte en abstrakt procent. Siffrorna är konservativa och kan justeras — poängen är att kunden ser kronor, inte procent.

### Onboarding

Behålls som separat post men med kontextuell beskrivning per nivå i stället för rent reglage:

- **Quick start** (1–2 dagar, 8 900 kr/dag): grunduppsättning, import av tekniker, första schema
- **Standard** (3–5 dagar): + dataimport från befintligt system, integrationsuppsättning
- **På plats** (6–10 dagar): + utbildning på plats, workshops, custom-flöden

Rekommendation visas baserat på vald plan (Start→Quick, Team→Standard, Scale→På plats).

### Visuell hierarki

- Tre kort, mittenkortet (Team) lyfts visuellt: subtil teal-glow, "Rekommenderad"-pill överst, något större.
- Priset visas direkt i hero som ankare: *"Från 4 900 kr/mån. Tre planer, transparent pris, ingen bindningstid."*
- Reglaget för användare tas bort — ersätts av tier-val. Reglaget för onboarding tas bort — ersätts av tre tydliga val.
- ROI-kortet placeras under planerna, breddat, med inputs.

### FAQ-uppdateringar

- "Vad händer om vi växer förbi en tier?" → automatisk uppgradering vid nästa månad, ingen avgift.
- "Får jag prova innan?" → 30 dagars utvärdering med pengarna tillbaka (om ni vill ha den policyn).
- Ta bort frågan om volymrabatt (inbyggd i tiers).
- Behåll frågor om moms, bindningstid, vad som ingår per plan.

### Teknisk implementation

- `src/pages/Pricing.tsx` skrivs om: ta bort `users` och `onboardingDays` reglage, lägg till `selectedTier` state och tre ROI-inputs.
- Behåll `Slider`-komponenten endast för ROI-inputs (timpris, dagar) — eller använd `Input` för tydligare numerisk inmatning.
- Behåll FAQ-komponent och SEO-tags. Texter uppdateras enligt ovan.
- Memory `mem://product/pricing-structure` uppdateras med ny modell.
- Lägg till "Rekommenderad"-badge med befintliga semantic tokens (primary), ingen ny design-token behövs.

### Vad jag inte ändrar

- Färg, typografi, ton — befintlig design system och språkriktlinjer behålls.
- Sv/en-översättningar — ny copy översätts till båda språken i samma format som idag.
- Hero-rubrik och SEO-meta behålls (justeras bara om priset i hero ändras).
