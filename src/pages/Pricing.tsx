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
    name: "Nivå 1",
    tag: "",
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
    name: "Nivå 2",
    tag: "",
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
    highlight: false,
  },
  {
    name: "Nivå 3",
    tag: "",
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
      <section className="px-6 pb-28 -mt-4 border-solid">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-4">
...
        </div>

        <motion.p {...fadeIn} className="text-center mt-14 max-w-sm mx-auto text-sm text-primary border-solid">
          Priser anpassas efter antal användare och moduler. Vi sätter ihop en offert som passar er.
        </motion.p>
      </section>
    </>
  );
};

export default Pricing;
