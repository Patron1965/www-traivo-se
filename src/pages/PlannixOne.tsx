import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import AIChatLink from "@/components/AIChatLink";
import {
  Calendar, Route, MapPin, Users, Brain, Receipt,
  ArrowRight
} from "lucide-react";

const fadeIn = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const sections = [
  {
    id: "01", title: "Planering", icon: Calendar,
    intro: "Veckan läggs en gång – inte fem. Drag, släpp, klart.",
    items: [
      { t: "Drag-and-drop veckoplanerare", d: "Fördela jobb till rätt tekniker visuellt." },
      { t: "AI-autoschemaläggning", d: "Kompetens, geografi, arbetstid, fordonskapacitet." },
      { t: "Årsplanering", d: "Mål per kund med AI-driven fördelning." },
      { t: "Väderplanering", d: "Schemat anpassas efter prognosen." },
    ],
  },
  {
    id: "02", title: "Ruttoptimering", icon: Route,
    intro: "Rutter som följer riktiga vägar, inte en linjal på kartan.",
    items: [
      { t: "Automatisk optimering", d: "Riktiga vägavstånd, inte fågelvägen." },
      { t: "Klusterbaserad planering", d: "Grupperar jobb geografiskt." },
      { t: "Fyll veckan", d: "Dagsklustring som fyller tomma luckor." },
      { t: "Flera motorer", d: "Geoapify, OR-Tools och fler." },
    ],
  },
  {
    id: "03", title: "Realtid", icon: MapPin,
    intro: "Du ser var alla är – och kan agera innan kunden hinner ringa.",
    items: [
      { t: "Live GPS-karta", d: "Förarpositioner uppdateras i realtid." },
      { t: "Pop-out kartfönster", d: "Separat skärm för kontrollrummet." },
      { t: "Akutjobb", d: "Närmaste tekniker på sekunder." },
      { t: "Störningshantering", d: "Automatisk omplanering vid sjukdom." },
    ],
  },
  {
    id: "04", title: "Kunder & Objekt", icon: Users,
    intro: "Kund, objekt, historik och kommunikation – på samma ställe.",
    items: [
      { t: "Objektregister med karta", d: "Alla serviceobjekt visualiserade." },
      { t: "Rita serviceområden", d: "Polygon/polyline direkt på kartan." },
      { t: "Kundportal", d: "Boka, chatta, se besökshistorik." },
      { t: "Automatiskt SMS", d: "'Vi är på väg' — utan manuell insats." },
    ],
  },
  {
    id: "05", title: "AI & Analys", icon: Brain,
    intro: "AI som hjälper dig se mönstren – innan de blir problem.",
    items: [
      { t: "AI-assistent", d: "Fråga i naturligt språk om data & planering." },
      { t: "Prediktivt underhåll", d: "IoT-sensorer triggar schemalagda jobb." },
      { t: "Avvikelsedetektering", d: "Systemet flaggar anomalier." },
      { t: "ROI-rapportering", d: "Beräknat vs faktiskt med feedback-loop." },
    ],
  },
  {
    id: "06", title: "Ekonomi & Admin", icon: Receipt,
    intro: "Från utfört jobb till skickad faktura – utan omvägar.",
    items: [
      { t: "Fakturering", d: "Generera med förhandsgranskning." },
      { t: "Fortnox-export", d: "Sömlös integration." },
      { t: "White-label", d: "Logga, färger, domän per kund." },
      { t: "Rollbaserad åtkomst", d: "Admin, planerare, tekniker, kund." },
    ],
  },
];

const PlannixOne = () => {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden bg-noise">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full bg-primary/[0.03] blur-[150px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full py-28">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4">
            <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-primary">
              Webb · Planerare & arbetsledare
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="font-display text-4xl md:text-6xl font-bold leading-[0.95] tracking-tight mb-5 max-w-2xl"
          >
            <span className="text-gradient-ice">Plannix One</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-xl leading-relaxed"
          >
            Kontrollrummet för hela fältoperationen. Planering, rutter, realtid, kunder, AI och fakturering – i samma vy, samma data, samma sanning.
          </motion.p>
        </div>
      </section>

      {/* Feature sections */}
      {sections.map((section, si) => (
        <section
          key={section.id}
          className={`py-20 px-6 border-t border-border ${si % 2 === 1 ? "bg-noise" : ""}`}
        >
          <div className="max-w-7xl mx-auto">
            <motion.div {...fadeIn} className="flex items-start gap-5 mb-6">
              <span className="font-display text-5xl md:text-7xl font-bold text-border/50 leading-none select-none">
                {section.id}
              </span>
              <div className="flex items-center gap-3 pt-3">
                <section.icon className="w-5 h-5 text-primary opacity-60" />
                <h2 className="font-display text-xl md:text-2xl font-bold">{section.title}</h2>
              </div>
            </motion.div>

            <motion.p
              {...fadeIn}
              className="text-sm md:text-base text-muted-foreground max-w-2xl mb-10 leading-relaxed"
            >
              {section.intro}
            </motion.p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {section.items.map((item, fi) => (
                <motion.div
                  key={item.t}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: fi * 0.06 }}
                  className="glass-subtle rounded-xl p-5 group hover:border-primary/15 transition-all duration-300"
                >
                  <h3 className="text-sm font-semibold mb-1.5 group-hover:text-primary transition-colors">{item.t}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.d}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Bottom */}
      <section className="py-24 px-6 border-t border-border bg-noise relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <motion.p {...fadeIn} className="font-display text-xl md:text-2xl font-medium leading-relaxed text-foreground/90 mb-6">
            Ett kontrollrum för dem som annars hade haft fem flikar öppna.
          </motion.p>
          <motion.p {...fadeIn} className="text-sm text-muted-foreground">
            Vill du se hur det skulle se ut för er?{" "}
            <AIChatLink className="text-primary hover:underline">Beskriv er verksamhet</AIChatLink>
            {" "}eller{" "}
            <Link to="/kontakt" className="text-primary hover:underline">hör av dig</Link>.
          </motion.p>
        </div>
      </section>
    </>
  );
};

export default PlannixOne;
