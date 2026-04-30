import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useT, useLang } from "@/i18n/LanguageContext";

const fadeIn = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const Pricing = () => {
  const t = useT();
  const { lang } = useLang();
  const [users, setUsers] = useState(10);
  const [onboardingDays, setOnboardingDays] = useState(2);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat(lang === "en" ? "en-US" : "sv-SE").format(price);

  const standardPlan = {
    name: "Standard",
    base: 3500,
    perUser: 99,
    desc: t({ sv: "AI-optimering, digitala protokoll och integrationer.", en: "AI optimization, digital reports and integrations." }),
    savingsPercent: 15,
    savingsLabel: t({
      sv: "Uppskattad kostnadsreduktion genom effektivare planering och digitala flöden.",
      en: "Estimated cost reduction through more efficient planning and digital flows.",
    }),
    features: [
      t({ sv: "Traivo One (planering)", en: "Traivo One (planning)" }),
      t({ sv: "Traivo Go (mobilapp)", en: "Traivo Go (mobile app)" }),
      t({ sv: "GPS-spårning", en: "GPS tracking" }),
      t({ sv: "Digitala protokoll", en: "Digital reports" }),
      t({ sv: "AI-schemaläggning", en: "AI scheduling" }),
      t({ sv: "Ruttoptimering", en: "Route optimization" }),
      t({ sv: "E-post-support", en: "Email support" }),
    ],
  };

  const proPlan = {
    name: "Pro",
    base: 7500,
    perUser: 149,
    desc: t({ sv: "Avancerade funktioner för växande organisationer.", en: "Advanced features for growing organizations." }),
    savingsPercent: 30,
    savingsLabel: t({
      sv: "Uppskattad kostnadsreduktion genom AI-driven optimering, prediktivt underhåll och automation.",
      en: "Estimated cost reduction through AI-driven optimization, predictive maintenance and automation.",
    }),
    features: [
      t({ sv: "Allt i Standard", en: "Everything in Standard" }),
      t({ sv: "Fortnox-integration", en: "Fortnox integration" }),
      t({ sv: "Kundportal", en: "Customer portal" }),
      t({ sv: "Väderplanering", en: "Weather-aware planning" }),
      t({ sv: "Prediktivt underhåll", en: "Predictive maintenance" }),
      t({ sv: "AI-assistent", en: "AI assistant" }),
      t({ sv: "Prioriterad support", en: "Priority support" }),
      t({ sv: "Dedikerad kundansvarig", en: "Dedicated account manager" }),
    ],
  };

  const currency = t({ sv: "kr", en: "SEK" });
  const perMonth = t({ sv: " /månad", en: " /month" });

  return (
    <>
      <section className="relative py-28 px-4 sm:px-6 overflow-hidden bg-noise">
        <div className="absolute inset-0 bg-grid-pattern opacity-15" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4">
            <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-primary">
              {t({ sv: "Priser", en: "Pricing" })}
            </span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="font-display text-3xl sm:text-4xl md:text-6xl font-bold leading-[0.95] tracking-tight mb-5">
            <span className="text-gradient-ice">{t({ sv: "Transparent prissättning", en: "Transparent pricing" })}</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-muted-foreground max-w-md mx-auto">
            {t({
              sv: "Grundpris + kostnad per användare. Dra i reglaget för att se er månadskostnad.",
              en: "Base price + cost per user. Drag the slider to see your monthly cost.",
            })}
          </motion.p>
        </div>
      </section>

      <section className="px-4 sm:px-6 -mt-4">
        <motion.div {...fadeIn} className="max-w-md mx-auto text-center mb-12">
          <p className="text-sm text-muted-foreground mb-2">{t({ sv: "Antal användare", en: "Number of users" })}</p>
          <p className="text-4xl font-bold text-foreground mb-6">{users}</p>
          <Slider value={[users]} onValueChange={(v) => setUsers(v[0])} min={1} max={100} step={1} className="w-full" />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>1</span>
            <span>100</span>
          </div>
        </motion.div>

        <motion.div {...fadeIn} className="max-w-md mx-auto text-center mb-12 mt-10">
          <p className="text-sm text-muted-foreground mb-2">{t({ sv: "Onboarding (dagar)", en: "Onboarding (days)" })}</p>
          <p className="text-4xl font-bold text-foreground mb-6">{onboardingDays}</p>
          <Slider value={[onboardingDays]} onValueChange={(v) => setOnboardingDays(v[0])} min={1} max={10} step={1} className="w-full" />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>1</span>
            <span>10</span>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            {formatPrice(onboardingDays * 8900)} {currency} <span className="text-xs">({t({ sv: "8 900 kr/dag", en: "8,900 SEK/day" })})</span>
          </p>
        </motion.div>
      </section>

      <section className="px-4 sm:px-6 pb-28">
        <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-6">
          {[standardPlan, proPlan].map((plan) => {
            const total = plan.base + plan.perUser * users;
            return (
              <motion.div key={plan.name} {...fadeIn} className="rounded-2xl border border-border bg-card p-6 sm:p-8 flex flex-col">
                <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-6">{plan.desc}</p>

                <div className="mb-6">
                  <span className="text-2xl sm:text-3xl font-bold text-foreground break-words">
                    {formatPrice(total)} {currency}
                  </span>
                  <span className="text-sm text-muted-foreground">{perMonth}</span>
                </div>

                <p className="text-xs text-muted-foreground mb-1 break-words">
                  {t({ sv: "Grund:", en: "Base:" })} {formatPrice(plan.base)} {currency} + {plan.perUser} {currency} × {users} {t({ sv: "användare", en: "users" })}
                </p>

                <hr className="border-border my-5" />

                <ul className="space-y-3 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <hr className="border-border my-5" />

                <div className="rounded-xl bg-primary/10 p-4 text-center">
                  <p className="text-2xl font-bold text-primary">{plan.savingsPercent}%</p>
                  <p className="text-xs text-muted-foreground mt-1">{plan.savingsLabel}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.p {...fadeIn} className="text-center mt-14 max-w-sm mx-auto text-sm text-primary">
          {t({
            sv: "Priserna är exklusive moms. Kontakta oss för skräddarsydd offert.",
            en: "Prices are exclusive of VAT. Contact us for a tailored quote.",
          })}
        </motion.p>
      </section>
    </>
  );
};

export default Pricing;
