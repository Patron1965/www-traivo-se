import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CheckCircle2, Minus } from "lucide-react";

const fadeIn = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const plans = [
  {
    name: "Basic",
    tag: "Kom igång",
    desc: "För mindre team som vill digitalisera.",
    features: [
      { name: "Traivo One (basplanering)", ok: true },
      { name: "Traivo Go (mobilapp)", ok: true },
      { name: "Upp till 10 tekniker", ok: true },
      { name: "GPS-spårning", ok: true },
      { name: "Digitala protokoll", ok: true },
      { name: "E-post-support", ok: true },
      { name: "AI-schemaläggning", ok: false },
      { name: "Ruttoptimering", ok: false },
    ],
    highlight: false,
  },
  {
    name: "Standard",
    tag: "Populärast",
    desc: "AI-optimering och integrationer.",
    features: [
      { name: "Allt i Basic", ok: true },
      { name: "AI-schemaläggning", ok: true },
      { name: "Ruttoptimering", ok: true },
      { name: "Fortnox-integration", ok: true },
      { name: "Kundportal", ok: true },
      { name: "Väderplanering", ok: true },
      { name: "Upp till 50 tekniker", ok: true },
      { name: "Prioriterad support", ok: true },
    ],
    highlight: true,
  },
  {
    name: "Premium",
    tag: "Enterprise",
    desc: "Stora organisationer, avancerade behov.",
    features: [
      { name: "Allt i Standard", ok: true },
      { name: "Obegränsat tekniker", ok: true },
      { name: "Multi-tenant", ok: true },
      { name: "White-label", ok: true },
      { name: "IoT-integration", ok: true },
      { name: "Prediktivt underhåll", ok: true },
      { name: "AI-assistent", ok: true },
      { name: "Dedikerad kundansvarig", ok: true },
    ],
    highlight: false,
  },
];

const Pricing = () => {
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
            <span className="text-gradient-ice">Modulbaserade paket</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-md mx-auto"
          >
            Välj det som passar er storlek och behov. Alla planer inkluderar Traivo One och Go.
          </motion.p>
        </div>
      </section>

      {/* Cards */}
      <section className="px-6 pb-28 -mt-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-4">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-2xl p-7 flex flex-col ${
                plan.highlight ? "glass glow-teal relative" : "glass-subtle"
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-6 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-primary text-primary-foreground">
                  {plan.tag}
                </span>
              )}
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1">
                {!plan.highlight && plan.tag}
              </span>
              <h3 className="font-display text-xl font-bold mb-1">{plan.name}</h3>
              <p className="text-xs text-muted-foreground mb-6">{plan.desc}</p>

              <div className="space-y-2.5 flex-1 mb-6">
                {plan.features.map((f) => (
                  <div key={f.name} className="flex items-center gap-2.5 text-sm">
                    {f.ok ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />
                    ) : (
                      <Minus className="w-3.5 h-3.5 text-border shrink-0" />
                    )}
                    <span className={f.ok ? "text-foreground/75" : "text-muted-foreground/40 text-xs"}>
                      {f.name}
                    </span>
                  </div>
                ))}
              </div>

              <Link
                to="/kontakt"
                className={`text-center py-2.5 rounded-lg text-xs font-medium uppercase tracking-wider transition-all ${
                  plan.highlight
                    ? "bg-primary text-primary-foreground hover:bg-primary/80"
                    : "glass-subtle hover:border-primary/20 text-foreground/70 hover:text-foreground"
                }`}
              >
                Kontakta oss
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.p {...fadeIn} className="text-center text-xs text-muted-foreground mt-14 max-w-sm mx-auto">
          Priser anpassas efter antal användare och moduler. Vi sätter ihop en offert som passar er.
        </motion.p>
      </section>
    </>
  );
};

export default Pricing;
