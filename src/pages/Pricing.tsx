import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Minus } from "lucide-react";
import { Slider } from "@/components/ui/slider";

const fadeIn = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const standardPlan = {
  name: "Standard",
  base: 3500,
  perUser: 99,
  desc: "AI-optimering, digitala protokoll och integrationer.",
  savingsPercent: 15,
  savingsLabel: "Uppskattad kostnadsreduktion genom effektivare planering och digitala flöden.",
  features: [
    "Traivo One (planering)",
    "Traivo Go (mobilapp)",
    "GPS-spårning",
    "Digitala protokoll",
    "AI-schemaläggning",
    "Ruttoptimering",
    "E-post-support",
  ],
};

const proPlan = {
  name: "Pro",
  base: 7500,
  perUser: 149,
  desc: "Avancerade funktioner för växande organisationer.",
  savingsPercent: 30,
  savingsLabel: "Uppskattad kostnadsreduktion genom AI-driven optimering, prediktivt underhåll och automation.",
  features: [
    "Allt i Standard",
    "Fortnox-integration",
    "Kundportal",
    "Väderplanering",
    "Prediktivt underhåll",
    "AI-assistent",
    "Prioriterad support",
    "Dedikerad kundansvarig",
  ],
};

const Pricing = () => {
  const [users, setUsers] = useState(10);
  const [onboardingDays, setOnboardingDays] = useState(2);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("sv-SE").format(price);

  return (
    <>
      {/* Hero */}
      <section className="relative py-28 px-6 overflow-hidden bg-noise">
        <div className="absolute inset-0 bg-grid-pattern opacity-15" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4">
            <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-primary">Priser</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="font-display text-4xl md:text-6xl font-bold leading-[0.95] tracking-tight mb-5"
          >
            <span className="text-gradient-ice">Transparent prissättning</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-md mx-auto"
          >
            Grundpris + kostnad per användare. Dra i reglaget för att se er månadskostnad.
          </motion.p>
        </div>
      </section>

      {/* Slider */}
      <section className="px-6 -mt-4">
        <motion.div {...fadeIn} className="max-w-md mx-auto text-center mb-12">
          <p className="text-sm text-muted-foreground mb-2">Antal användare</p>
          <p className="text-4xl font-bold text-foreground mb-6">{users}</p>
          <Slider
            value={[users]}
            onValueChange={(v) => setUsers(v[0])}
            min={1}
            max={100}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>1</span>
            <span>100</span>
          </div>
        </motion.div>

        <motion.div {...fadeIn} className="max-w-md mx-auto text-center mb-12 mt-10">
          <p className="text-sm text-muted-foreground mb-2">Onboarding (dagar)</p>
          <p className="text-4xl font-bold text-foreground mb-6">{onboardingDays}</p>
          <Slider
            value={[onboardingDays]}
            onValueChange={(v) => setOnboardingDays(v[0])}
            min={1}
            max={10}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>1</span>
            <span>10</span>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            {formatPrice(onboardingDays * 8900)} kr <span className="text-xs">(8 900 kr/dag)</span>
          </p>
        </motion.div>
      </section>

      {/* Cards */}
      <section className="px-6 pb-28">
        <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-6">
          {[standardPlan, proPlan].map((plan) => {
            const total = plan.base + plan.perUser * users;
            return (
              <motion.div
                key={plan.name}
                {...fadeIn}
                className="rounded-2xl border border-border bg-card p-8 flex flex-col"
              >
                <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-6">{plan.desc}</p>

                <div className="mb-6">
                  <span className="text-3xl font-bold text-foreground">
                    {formatPrice(total)} kr
                  </span>
                  <span className="text-sm text-muted-foreground"> /månad</span>
                </div>

                <p className="text-xs text-muted-foreground mb-1">
                  Grund: {formatPrice(plan.base)} kr + {plan.perUser} kr × {users} användare
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
          Priserna är exklusive moms. Kontakta oss för skräddarsydd offert.
        </motion.p>
      </section>
    </>
  );
};

export default Pricing;
