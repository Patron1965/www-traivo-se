import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Sparkles } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useT, useLang } from "@/i18n/LanguageContext";
import SEO from "@/components/SEO";
import FAQ from "@/components/FAQ";

const fadeIn = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

type Tier = {
  id: "start" | "team" | "scale" | "enterprise";
  name: string;
  range: { sv: string; en: string };
  price: number | null; // null = offert
  desc: { sv: string; en: string };
  recommended?: boolean;
  features: { sv: string; en: string }[];
  onboarding: { sv: string; en: string };
};

const Pricing = () => {
  const t = useT();
  const { lang } = useLang();

  // ROI inputs
  const [technicians, setTechnicians] = useState(20);
  const [hourlyRate, setHourlyRate] = useState(650);
  const [workDays, setWorkDays] = useState(220);

  const fmt = (n: number) =>
    new Intl.NumberFormat(lang === "en" ? "en-US" : "sv-SE").format(Math.round(n));

  const currency = t({ sv: "kr", en: "SEK" });
  const perMonth = t({ sv: " /månad", en: " /month" });

  const tiers: Tier[] = [
    {
      id: "start",
      name: "Start",
      range: { sv: "1–10 tekniker", en: "1–10 technicians" },
      price: 4900,
      desc: t({ sv: "Allt ni behöver för att komma igång — inklusive Fortnox.", en: "Everything you need to get going — including Fortnox." }) as any,
      features: [
        { sv: "Traivo One (planering)", en: "Traivo One (planning)" },
        { sv: "Traivo Go (mobilapp)", en: "Traivo Go (mobile app)" },
        { sv: "GPS-spårning & ruttoptimering", en: "GPS tracking & route optimization" },
        { sv: "Digitala protokoll", en: "Digital reports" },
        { sv: "AI-schemaläggning", en: "AI scheduling" },
        { sv: "Fortnox-koppling", en: "Fortnox integration" },
        { sv: "E-post-support", en: "Email support" },
      ],
      onboarding: { sv: "Quick start: 1–2 dagar. Kostnad för migrering från befintligt system kan tillkomma.", en: "Quick start: 1–2 days. Migration from existing system may incur additional cost." },
    },
    {
      id: "team",
      name: "Team",
      range: { sv: "11–25 tekniker", en: "11–25 technicians" },
      price: 9900,
      recommended: true,
      desc: t({ sv: "För växande team som vill skala utan att tappa kontrollen.", en: "For growing teams that want to scale without losing control." }) as any,
      features: [
        { sv: "Allt i Start", en: "Everything in Start" },
        { sv: "Kundportal", en: "Customer portal" },
        { sv: "Väderplanering", en: "Weather-aware planning" },
        { sv: "Fler ekonomisystem (Visma, Björn Lundén m.fl.)", en: "More accounting systems (Visma, Björn Lundén etc.)" },
        { sv: "Prioriterad support", en: "Priority support" },
      ],
      onboarding: { sv: "Standard: 3–5 dagar. Kostnad för migrering från befintligt system kan tillkomma.", en: "Standard: 3–5 days. Migration from existing system may incur additional cost." },
    },
    {
      id: "scale",
      name: "Scale",
      range: { sv: "26–75 tekniker", en: "26–75 technicians" },
      price: 19900,
      desc: t({ sv: "Större drift med prediktivt underhåll och AI-assistent.", en: "Larger operations with predictive maintenance and AI assistant." }) as any,
      features: [
        { sv: "Allt i Team", en: "Everything in Team" },
        { sv: "Prediktivt underhåll", en: "Predictive maintenance" },
        { sv: "AI-assistent", en: "AI assistant" },
        { sv: "Dedikerad kundansvarig", en: "Dedicated account manager" },
        { sv: "Anpassade integrationer", en: "Custom integrations" },
      ],
      onboarding: { sv: "På plats: 6–10 dagar. Kostnad för migrering från befintligt system kan tillkomma.", en: "On site: 6–10 days. Migration from existing system may incur additional cost." },
    },
    {
      id: "enterprise",
      name: "Enterprise",
      range: { sv: "75+ tekniker / anpassat", en: "75+ technicians / custom" },
      price: null,
      desc: t({ sv: "SSO, SLA, dedikerad miljö och on-prem-option.", en: "SSO, SLA, dedicated environment and on-prem option." }) as any,
      features: [
        { sv: "Allt i Scale", en: "Everything in Scale" },
        { sv: "SSO & avancerad åtkomstkontroll", en: "SSO & advanced access control" },
        { sv: "Dedikerad miljö & SLA", en: "Dedicated environment & SLA" },
        { sv: "On-prem-option", en: "On-prem option" },
        { sv: "Anpassad onboarding & utbildning", en: "Custom onboarding & training" },
      ],
      onboarding: { sv: "Anpassad onboarding. Kostnad för migrering från befintligt system kan tillkomma.", en: "Custom onboarding. Migration from existing system may incur additional cost." },
    },
  ];

  // ROI: conservative 35 min/technician/day = 35/60 h
  const minutesSavedPerDay = 35;
  const yearlyValue = technicians * (minutesSavedPerDay / 60) * workDays * hourlyRate;

  // Match technicians to recommended tier for ROI plan cost
  const matchedTier =
    technicians <= 10 ? tiers[0] : technicians <= 25 ? tiers[1] : technicians <= 75 ? tiers[2] : tiers[3];
  const matchedYearlyCost = matchedTier.price ? matchedTier.price * 12 : 0;
  const net = yearlyValue - matchedYearlyCost;
  const roiMultiple = matchedYearlyCost > 0 ? yearlyValue / matchedYearlyCost : 0;

  return (
    <>
      <SEO
        path="/priser"
        title={t({ sv: "Priser – tre planer, transparent pris | Traivo", en: "Pricing – three plans, transparent pricing | Traivo" })}
        description={t({
          sv: "Från 4 900 kr/mån. Tre planer för fältservice — Start, Team och Scale — plus Enterprise. Fortnox ingår, ingen bindningstid.",
          en: "From 4,900 SEK/mo. Three plans for field service — Start, Team and Scale — plus Enterprise. Fortnox included, no lock-in.",
        })}
      />

      {/* Hero */}
      <section className="relative pt-28 pb-16 px-4 sm:px-6 overflow-hidden bg-noise">
        <div className="absolute inset-0 bg-grid-pattern opacity-15" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4">
            <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-primary">
              {t({ sv: "Priser", en: "Pricing" })}
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="font-display text-3xl sm:text-4xl md:text-6xl font-bold leading-[0.95] tracking-tight mb-5"
          >
            <span className="text-gradient-ice">
              {t({ sv: "Från 4 900 kr/mån.", en: "From 4,900 SEK/mo." })}
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-xl mx-auto"
          >
            {t({
              sv: "Tre planer baserat på antal tekniker. Fortnox ingår. Ingen bindningstid.",
              en: "Three plans based on number of technicians. Fortnox included. No lock-in.",
            })}
          </motion.p>
        </div>
      </section>

      {/* Plans */}
      <section className="px-4 sm:px-6 pb-16">
        <div className="max-w-6xl mx-auto grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
          {tiers.map((tier) => {
            const isRec = tier.recommended;
            return (
              <motion.div
                key={tier.id}
                {...fadeIn}
                className={`relative rounded-2xl border bg-card p-6 flex flex-col ${
                  isRec
                    ? "border-primary/50 shadow-[0_0_40px_-12px_hsl(var(--primary)/0.4)] lg:scale-[1.03]"
                    : "border-border"
                }`}
              >
                {isRec && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold uppercase tracking-wider">
                      <Sparkles className="w-3 h-3" />
                      {t({ sv: "Rekommenderad", en: "Recommended" })}
                    </span>
                  </div>
                )}

                <h3 className="text-lg font-semibold text-foreground">{tier.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{t(tier.range)}</p>

                <div className="mt-5 mb-2">
                  {tier.price === null ? (
                    <span className="text-2xl font-bold text-foreground">
                      {t({ sv: "Offert", en: "Custom quote" })}
                    </span>
                  ) : (
                    <>
                      <span className="text-3xl font-bold text-foreground">
                        {fmt(tier.price)} {currency}
                      </span>
                      <span className="text-sm text-muted-foreground">{perMonth}</span>
                    </>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-5 leading-relaxed">
                  {tier.desc as any}
                </p>

                <hr className="border-border mb-5" />

                <ul className="space-y-2.5 flex-1 mb-5">
                  {tier.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground/90">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span>{t(f)}</span>
                    </li>
                  ))}
                </ul>

                <div className="rounded-lg bg-muted/30 px-3 py-2 text-[11px] text-muted-foreground">
                  <span className="font-medium text-foreground/80">
                    {t({ sv: "Onboarding: ", en: "Onboarding: " })}
                  </span>
                  {t(tier.onboarding)}
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.p {...fadeIn} className="text-center mt-10 text-xs text-muted-foreground">
          {t({
            sv: "Priserna är exklusive moms. Månadsuppsägning, ingen bindningstid.",
            en: "Prices exclude VAT. Monthly cancellation, no lock-in.",
          })}
        </motion.p>
      </section>

      {/* ROI calculator */}
      <section className="px-4 sm:px-6 pb-28">
        <motion.div {...fadeIn} className="max-w-4xl mx-auto rounded-2xl border border-border bg-card p-6 sm:p-10">
          <div className="text-center mb-8">
            <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-primary">
              {t({ sv: "Räkna er besparing", en: "Calculate your savings" })}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold mt-3 mb-2">
              {t({ sv: "Vad är 35 minuter sparad tid värt?", en: "What is 35 minutes saved per day worth?" })}
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              {t({
                sv: "Konservativ uppskattning: digitala protokoll, ruttoptimering och automatiska SMS sparar i snitt 35 min per tekniker och dag.",
                en: "Conservative estimate: digital reports, route optimization and automatic SMS save on average 35 min per technician per day.",
              })}
            </p>
          </div>

          {/* Inputs */}
          <div className="grid sm:grid-cols-3 gap-8 mb-10">
            <div>
              <p className="text-xs text-muted-foreground mb-1">{t({ sv: "Antal tekniker", en: "Technicians" })}</p>
              <p className="text-2xl font-bold text-foreground mb-3">{technicians}</p>
              <Slider value={[technicians]} onValueChange={(v) => setTechnicians(v[0])} min={1} max={100} step={1} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">{t({ sv: "Timpris (kr)", en: "Hourly rate (SEK)" })}</p>
              <p className="text-2xl font-bold text-foreground mb-3">{fmt(hourlyRate)}</p>
              <Slider value={[hourlyRate]} onValueChange={(v) => setHourlyRate(v[0])} min={400} max={1500} step={50} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">{t({ sv: "Arbetsdagar/år", en: "Workdays / year" })}</p>
              <p className="text-2xl font-bold text-foreground mb-3">{workDays}</p>
              <Slider value={[workDays]} onValueChange={(v) => setWorkDays(v[0])} min={180} max={240} step={5} />
            </div>
          </div>

          {/* Outputs */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="rounded-xl bg-muted/20 p-5">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">
                {t({ sv: "Värde sparad tid / år", en: "Value of saved time / year" })}
              </p>
              <p className="text-2xl font-bold text-foreground">
                {fmt(yearlyValue)} {currency}
              </p>
            </div>
            <div className="rounded-xl bg-muted/20 p-5">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">
                {t({ sv: "Plankostnad / år", en: "Plan cost / year" })}
              </p>
              <p className="text-2xl font-bold text-foreground">
                {matchedTier.price ? `${fmt(matchedYearlyCost)} ${currency}` : t({ sv: "Offert", en: "Custom" })}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">
                {matchedTier.name} · {t(matchedTier.range)}
              </p>
            </div>
            <div className="rounded-xl bg-primary/10 border border-primary/30 p-5">
              <p className="text-[11px] uppercase tracking-wider text-primary/80 mb-2">
                {t({ sv: "Netto / år", en: "Net / year" })}
              </p>
              <p className="text-2xl font-bold text-primary">
                {matchedTier.price ? `${fmt(net)} ${currency}` : "—"}
              </p>
              {matchedTier.price && roiMultiple > 0 && (
                <p className="text-[11px] text-muted-foreground mt-1">
                  {roiMultiple.toFixed(1).replace(".", lang === "en" ? "." : ",")}×{" "}
                  {t({ sv: "pengarna tillbaka", en: "return on investment" })}
                </p>
              )}
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground text-center mt-6 leading-relaxed">
            {t({
              sv: "Siffrorna är konservativa riktmärken. Verklig besparing varierar — vill ni ha en räknad uppskattning för er verksamhet, hör av er.",
              en: "Numbers are conservative benchmarks. Actual savings vary — for a tailored estimate for your operation, reach out.",
            })}
          </p>
        </motion.div>
      </section>

      <FAQ
        items={[
          {
            q: { sv: "Vad händer om vi växer förbi vår plan?", en: "What if we grow beyond our plan?" },
            a: {
              sv: "Vi flyttar upp er till nästa plan vid nästa månads fakturering. Ingen extra avgift, ingen omförhandling — bara nytt månadspris.",
              en: "We move you to the next plan at the next monthly invoice. No extra fee, no renegotiation — just a new monthly price.",
            },
          },
          {
            q: { sv: "Ingår Fortnox redan i Start?", en: "Is Fortnox included in Start?" },
            a: {
              sv: "Ja. Fortnox-kopplingen är basfunktionalitet och ingår i alla planer. Andra ekonomisystem (Visma, Björn Lundén m.fl.) tillkommer i Team och uppåt.",
              en: "Yes. The Fortnox integration is core functionality and is included in all plans. Other accounting systems (Visma, Björn Lundén etc.) are added in Team and above.",
            },
          },
          {
            q: { sv: "Tillkommer kostnad för migrering från vårt befintliga system?", en: "Is there a cost for migrating from our existing system?" },
            a: {
              sv: "Onboarding-tiden ingår i planen, men om ni har ett komplext befintligt system med mycket historik eller anpassade integrationer kan extra migreringsarbete tillkomma. Vi går igenom detta i demo-mötet så det inte blir några överraskningar.",
              en: "Onboarding time is included in the plan, but if you have a complex existing system with lots of history or custom integrations, additional migration work may apply. We review this during the demo so there are no surprises.",
            },
          },
          {
            q: { sv: "Är priserna inklusive eller exklusive moms?", en: "Are prices including or excluding VAT?" },
            a: {
              sv: "Alla priser är angivna exklusive moms (B2B). Fakturering sker månadsvis i förskott.",
              en: "All prices are listed excluding VAT (B2B). Invoicing is monthly in advance.",
            },
          },
          {
            q: { sv: "Finns det bindningstid?", en: "Is there a lock-in period?" },
            a: {
              sv: "Nej, månadsuppsägning. Vi tror att produkten ska sälja sig själv varje månad — inte låsas in genom avtal.",
              en: "No, monthly cancellation. We believe the product should earn its keep every month — not lock you in by contract.",
            },
          },
          {
            q: { sv: "Kan vi prova innan vi bestämmer oss?", en: "Can we try before we decide?" },
            a: {
              sv: "Ja. Boka en demo så går vi igenom systemet utifrån er verksamhet. För större kunder kör vi även pilot på en avgränsad del av driften innan ett bredare införande.",
              en: "Yes. Book a demo and we'll walk through the system based on your operation. For larger customers we also run a pilot on a defined slice of operations before a broader rollout.",
            },
          },
        ]}
      />
    </>
  );
};

export default Pricing;
