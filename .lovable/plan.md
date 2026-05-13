## Mål
Göra all text på siten ljusare — matcha den ljusare nyansen som navigationslänkarna (Hjärnan, Traivo One, Traivo Go, Om oss, Kontakt) har idag, dvs ~10% högre lightness.

## Ändringar i `src/index.css`

Justera de semantiska text-tokens (HSL lightness +10%):

- `--foreground`: `180 15% 95%` → behålls (redan ljus, används för huvudtext)
- `--card-foreground`: `180 15% 95%` → behålls
- `--popover-foreground`: `180 15% 95%` → behålls
- `--secondary-foreground`: `180 20% 90%` → `180 20% 95%`
- `--muted-foreground`: `185 14% 65%` → `185 14% 75%` (största synliga lyftet — påverkar bryttext, footer, beskrivningar)
- `--mountain`: `185 16% 60%` → `185 16% 70%`

Samt gradienten som används för rubriker:
- `.text-gradient-ice`: stop 2 `hsl(195 20% 65%)` → `hsl(195 20% 75%)`
- `.text-gradient-ocean`: stop 1 `hsl(202 60% 36%)` → `hsl(202 60% 46%)`, stop 2 `hsl(180 36% 55%)` → `hsl(180 36% 65%)`

## Effekt
Eftersom nästan all brödtext, footer-text, beskrivningar och badges använder `text-muted-foreground`, ger lyftet där den största visuella effekten. Rubriker som använder `text-gradient-ice`/`text-gradient-ocean` blir också tydligt ljusare.

## Inte i scope
- Inga komponentändringar (allt sker via design-tokens).
- Inga färgskiften — endast lightness höjs, hue/saturation behålls för att bevara den teal-tonade Nordic-paletten.
