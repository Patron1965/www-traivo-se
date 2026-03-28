import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const plans = [
  {
    name: "Basic",
    desc: "För mindre team som vill komma igång med digital fältservice.",
    features: [
      "Traivo One (basplanering)",
      "Traivo Go (mobilapp)",
      "Upp till 10 tekniker",
      "GPS-spårning",
      "Digitala protokoll",
      "E-post-support",
    ],
    cta: "Kom igång",
    popular: false,
  },
  {
    name: "Standard",
    desc: "För växande företag som vill optimera med AI och integrationer.",
    features: [
      "Allt i Basic",
      "AI-schemaläggning",
      "Ruttoptimering",
      "Fortnox-integration",
      "Kundportal",
      "Väderplanering",
      "Upp till 50 tekniker",
      "Prioriterad support",
    ],
    cta: "Boka demo",
    popular: true,
  },
  {
    name: "Premium",
    desc: "För stora organisationer med avancerade behov.",
    features: [
      "Allt i Standard",
      "Obegränsat antal tekniker",
      "Multi-tenant / flerklient",
      "White-label",
      "IoT-integration",
      "Prediktivt underhåll",
      "AI-assistent",
      "Dedikerad kundansvarig",
      "SLA & uptime-garanti",
    ],
    cta: "Kontakta oss",
    popular: false,
  },
];

const Pricing = () => {
  return (
    <>
      {/* Hero */}
      <section className="py-24 md:py-32 px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Välj rätt plan för <span className="text-gradient-ocean">ert team</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Modulbaserade paket som växer med er verksamhet. Alla planer inkluderar Traivo One och Traivo Go.
          </p>
        </motion.div>
      </section>

      {/* Pricing cards */}
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              {...fadeUp}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`rounded-2xl border p-8 flex flex-col ${
                plan.popular
                  ? "border-primary bg-primary/[0.03] ring-2 ring-primary/20 relative"
                  : "border-border bg-card"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground">
                  Populärast
                </span>
              )}
              <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
              <p className="text-sm text-muted-foreground mb-6">{plan.desc}</p>
              <div className="space-y-3 flex-1 mb-8">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              <Button
                variant={plan.popular ? "default" : "outline"}
                className="w-full"
                asChild
              >
                <Link to="/kontakt">{plan.cta}</Link>
              </Button>
            </motion.div>
          ))}
        </div>

        <motion.p {...fadeUp} className="text-center text-sm text-muted-foreground mt-12">
          Alla priser anpassas efter antal användare och moduler. Kontakta oss för en offert.
        </motion.p>
      </section>
    </>
  );
};

export default Pricing;
