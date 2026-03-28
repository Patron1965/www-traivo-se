import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Calendar, Route, MapPin, Users, Brain, Receipt,
  ArrowRight, GripVertical, Cloud, Sun, Layers,
  Shield, Palette, Server, Cpu, Bell
} from "lucide-react";

const fadeIn = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const sections = [
  {
    id: "01",
    title: "Planering",
    icon: Calendar,
    color: "primary",
    items: [
      { t: "Drag-and-drop veckoplanerare", d: "Fördela jobb till rätt tekniker visuellt." },
      { t: "AI-autoschemaläggning", d: "Kompetens, geografi, arbetstid, fordonskapacitet." },
      { t: "Årsplanering", d: "Mål per kund med AI-driven fördelning." },
      { t: "Väderplanering", d: "Schemat anpassas efter prognosen." },
    ],
  },
  {
    id: "02",
    title: "Ruttoptimering",
    icon: Route,
    color: "accent",
    items: [
      { t: "Automatisk optimering", d: "Riktiga vägavstånd, inte fågelvägen." },
      { t: "Klusterbaserad planering", d: "Grupperar jobb geografiskt." },
      { t: "Fyll veckan", d: "Dagsklustring som fyller tomma luckor." },
      { t: "Flera motorer", d: "Geoapify, OR-Tools och fler." },
    ],
  },
  {
    id: "03",
    title: "Realtid",
    icon: MapPin,
    color: "primary",
    items: [
      { t: "Live GPS-karta", d: "Förarpositioner uppdateras i realtid." },
      { t: "Pop-out kartfönster", d: "Separat skärm för kontrollrummet." },
      { t: "Akutjobb", d: "Närmaste tekniker på sekunder." },
      { t: "Störningshantering", d: "Automatisk omplanering vid sjukdom." },
    ],
  },
  {
    id: "04",
    title: "Kunder & Objekt",
    icon: Users,
    color: "accent",
    items: [
      { t: "Objektregister med karta", d: "Alla serviceobjekt visualiserade." },
      { t: "Rita serviceområden", d: "Polygon/polyline direkt på kartan." },
      { t: "Kundportal", d: "Boka, chatta, se besökshistorik." },
      { t: "Automatiskt SMS", d: "'Vi är på väg' — utan manuell insats." },
    ],
  },
  {
    id: "05",
    title: "AI & Analys",
    icon: Brain,
    color: "primary",
    items: [
      { t: "AI-assistent", d: "Fråga i naturligt språk om data & planering." },
      { t: "Prediktivt underhåll", d: "IoT-sensorer triggar schemalagda jobb." },
      { t: "Avvikelsedetektering", d: "Systemet flaggar anomalier." },
      { t: "ROI-rapportering", d: "Beräknat vs faktiskt med feedback-loop." },
    ],
  },
  {
    id: "06",
    title: "Ekonomi & Admin",
    icon: Receipt,
    color: "accent",
    items: [
      { t: "Fakturering", d: "Generera med förhandsgranskning." },
      { t: "Fortnox-export", d: "Sömlös integration." },
      { t: "White-label", d: "Logga, färger, domän per kund." },
      { t: "Rollbaserad åtkomst", d: "Admin, planerare, tekniker, kund." },
    ],
  },
];

const TraivoOne = () => {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden bg-noise">
        <div className="absolute inset-0 bg-grid-pattern opacity-25" />
        <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-primary/[0.04] blur-[150px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full py-28">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
              Webb-plattform · Planerare & arbetsledare
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-5xl md:text-7xl font-bold leading-[0.95] tracking-tight mb-6"
          >
            <span className="text-gradient-ice">Traivo</span>{" "}
            <span className="text-primary">One</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-muted-foreground max-w-xl mb-8"
          >
            Kontrollcentret där hela fältoperationen schemaläggas, optimeras och övervakas — i realtid.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <Button size="lg" className="h-12 px-8 font-display font-semibold text-sm tracking-wide uppercase" asChild>
              <Link to="/kontakt">Boka demo <ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Feature sections */}
      {sections.map((section, si) => (
        <section
          key={section.id}
          className={`py-24 px-6 border-t border-border ${si % 2 === 1 ? "bg-noise" : ""}`}
        >
          <div className="max-w-7xl mx-auto">
            <motion.div {...fadeIn} className="flex items-start gap-6 mb-12">
              <span className="font-display text-6xl md:text-8xl font-bold text-border/60 leading-none select-none">
                {section.id}
              </span>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <section.icon className={`w-5 h-5 ${section.color === "primary" ? "text-primary" : "text-accent"}`} />
                  <h2 className="font-display text-2xl md:text-3xl font-bold">{section.title}</h2>
                </div>
              </div>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {section.items.map((item, fi) => (
                <motion.div
                  key={item.t}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: fi * 0.08 }}
                  className="glass-subtle rounded-xl p-5 hover:border-primary/20 transition-all duration-300 group"
                >
                  <h3 className="text-sm font-semibold mb-2 group-hover:text-primary transition-colors">{item.t}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.d}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="relative py-32 px-6 border-t border-border overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-primary/[0.06] blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div {...fadeIn}>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Se One i aktion
            </h2>
            <p className="text-muted-foreground mb-10">
              Boka en personlig demo anpassad efter er verksamhet.
            </p>
            <Button size="lg" className="h-14 px-10 font-display font-semibold text-sm tracking-wide uppercase" asChild>
              <Link to="/kontakt">Boka demo <ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default TraivoOne;
