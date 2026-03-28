import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Minus } from "lucide-react";

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
    desc: "För mindre team som vill digitalisera sin fältservice.",
    features: [
      { name: "Traivo One (basplanering)", included: true },
      { name: "Traivo Go (mobilapp)", included: true },
      { name: "Upp till 10 tekniker", included: true },
      { name: "GPS-spårning", included: true },
      { name: "Digitala protokoll", included: true },
      { name: "E-post-support", included: true },
      { name: "AI-schemaläggning", included: false },
      { name: "Ruttoptimering", included: false },
      { name: "White-label", included: false },
    ],
    accent: false,
  },
  {
    name: "Standard",
    tag: "Populärast",
    desc: "För växande företag som vill optimera med AI.",
    features: [
      { name: "Allt i Basic", included: true },
      { name: "AI-schemaläggning", included: true },
      { name: "Ruttoptimering", included: true },
      { name: "Fortnox-integration", included: true },
      { name: "Kundportal", included: true },
      { name: "Väderplanering", included: true },
      { name: "Upp till 50 tekniker", included: true },
      { name: "Prioriterad support", included: true },
      { name: "White-label", included: false },
    ],
    accent: true,
  },
  {
    name: "Premium",
    tag: "Enterprise",
    desc: "För stora organisationer med avancerade behov.",
    features: [
      { name: "Allt i Standard", included: true },
      { name: "Obegränsat antal tekniker", included: true },
      { name: "Multi-tenant", included: true },
      { name: "White-label", included: true },
      { name: "IoT-integration", included: true },
      { name: "Prediktivt underhåll", included: true },
      { name: "AI-assistent", included: true },
      { name: "Dedikerad kundansvarig", included: true },
      { name: "SLA & uptime-garanti", included: true },
    ],
    accent: false,
  },
];

const Pricing = () => {
  return (
    <>
      {/* Hero */}
      <section className="relative py-28 md:py-36 px-6 overflow-hidden bg-noise">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-primary/[0.04] blur-[120px]" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Priser</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-display text-5xl md:text-7xl font-bold leading-[0.95] tracking-tight mb-6"
          >
            <span className="text-gradient-ice">Välj rätt plan</span>
            <br />
            <span className="text-muted-foreground text-3xl md:text-4xl">för ert team</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground text-lg max-w-lg mx-auto"
          >
            Modulbaserade paket som växer med er verksamhet.
          </motion.p>
        </div>
      </section>

      {/* Cards */}
      <section className="px-6 pb-28 -mt-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-4">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-2xl p-8 flex flex-col relative ${
                plan.accent
                  ? "glass glow-teal"
                  : "glass-subtle"
              }`}
            >
              {plan.accent && (
                <span className="absolute -top-3 left-6 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-primary text-primary-foreground">
                  {plan.tag}
                </span>
              )}
              {!plan.accent && (
                <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-2">
                  {plan.tag}
                </span>
              )}
              <h3 className="font-display text-2xl font-bold mb-1 mt-1">{plan.name}</h3>
              <p className="text-sm text-muted-foreground mb-8">{plan.desc}</p>

              <div className="space-y-3 flex-1 mb-8">
                {plan.features.map((f) => (
                  <div key={f.name} className="flex items-center gap-3 text-sm">
                    {f.included ? (
                      <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                    ) : (
                      <Minus className="w-4 h-4 text-border shrink-0" />
                    )}
                    <span className={f.included ? "text-foreground/80" : "text-muted-foreground/50"}>{f.name}</span>
                  </div>
                ))}
              </div>

              <Button
                variant={plan.accent ? "default" : "outline"}
                className={`w-full font-display font-semibold text-sm tracking-wide uppercase ${
                  plan.accent ? "" : "border-border hover:border-primary/30"
                }`}
                asChild
              >
                <Link to="/kontakt">
                  {plan.accent ? "Boka demo" : "Kontakta oss"}
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>

        <motion.p {...fadeIn} className="text-center text-sm text-muted-foreground mt-16 max-w-md mx-auto">
          Priser anpassas efter antal användare och moduler. 
          Kontakta oss för en skräddarsydd offert.
        </motion.p>
      </section>
    </>
  );
};

export default Pricing;
