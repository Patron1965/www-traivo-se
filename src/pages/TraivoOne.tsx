import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import AIChatLink from "@/components/AIChatLink";
import PlannerVisual from "@/components/PlannerVisual";
import {
  Calendar, Route, MapPin, Users, Brain, Receipt,
} from "lucide-react";
import { useT } from "@/i18n/LanguageContext";

const fadeIn = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const TraivoOne = () => {
  const t = useT();

  const sections = [
    {
      id: "01", title: t({ sv: "Planering", en: "Planning" }), icon: Calendar,
      intro: t({ sv: "Veckan läggs en gång – inte fem. Drag, släpp, klart.", en: "Plan the week once — not five times. Drag, drop, done." }),
      items: [
        { t: t({ sv: "Drag-and-drop veckoplanerare", en: "Drag-and-drop weekly planner" }), d: t({ sv: "Fördela jobb till rätt tekniker visuellt.", en: "Assign jobs to the right technician visually." }) },
        { t: t({ sv: "AI-autoschemaläggning", en: "AI auto-scheduling" }),                  d: t({ sv: "Kompetens, geografi, arbetstid, fordonskapacitet.", en: "Skills, geography, hours, vehicle capacity." }) },
        { t: t({ sv: "Årsplanering", en: "Annual planning" }),                              d: t({ sv: "Mål per kund med AI-driven fördelning.", en: "Targets per customer with AI-driven distribution." }) },
        { t: t({ sv: "Väderplanering", en: "Weather-aware planning" }),                     d: t({ sv: "Schemat anpassas efter prognosen.", en: "The schedule adapts to the forecast." }) },
      ],
    },
    {
      id: "02", title: t({ sv: "Ruttoptimering", en: "Route optimization" }), icon: Route,
      intro: t({ sv: "Rutter som följer riktiga vägar, inte en linjal på kartan.", en: "Routes that follow real roads, not a ruler on the map." }),
      items: [
        { t: t({ sv: "Automatisk optimering", en: "Automatic optimization" }), d: t({ sv: "Riktiga vägavstånd, inte fågelvägen.", en: "Real road distances, not as the crow flies." }) },
        { t: t({ sv: "Klusterbaserad planering", en: "Cluster-based planning" }), d: t({ sv: "Grupperar jobb geografiskt.", en: "Groups jobs geographically." }) },
        { t: t({ sv: "Fyll veckan", en: "Fill the week" }), d: t({ sv: "Dagsklustring som fyller tomma luckor.", en: "Day clustering that fills empty slots." }) },
        { t: t({ sv: "Flera motorer", en: "Multiple engines" }), d: t({ sv: "Geoapify, OR-Tools och fler.", en: "Geoapify, OR-Tools and more." }) },
      ],
    },
    {
      id: "03", title: t({ sv: "Realtid", en: "Real time" }), icon: MapPin,
      intro: t({ sv: "Du ser var alla är – och kan agera innan kunden hinner ringa.", en: "You see where everyone is — and can act before the customer calls." }),
      items: [
        { t: t({ sv: "Live GPS-karta", en: "Live GPS map" }), d: t({ sv: "Förarpositioner uppdateras i realtid.", en: "Driver positions update in real time." }) },
        { t: t({ sv: "Pop-out kartfönster", en: "Pop-out map window" }), d: t({ sv: "Separat skärm för kontrollrummet.", en: "Separate screen for the control room." }) },
        { t: t({ sv: "Akutjobb", en: "Urgent jobs" }), d: t({ sv: "Närmaste tekniker på sekunder.", en: "Nearest technician in seconds." }) },
        { t: t({ sv: "Störningshantering", en: "Disruption handling" }), d: t({ sv: "Automatisk omplanering vid sjukdom.", en: "Automatic re-planning on sick leave." }) },
      ],
    },
    {
      id: "04", title: t({ sv: "Kunder & Objekt", en: "Customers & Sites" }), icon: Users,
      intro: t({ sv: "Kund, objekt, historik och kommunikation – på samma ställe.", en: "Customer, site, history and communication — in one place." }),
      items: [
        { t: t({ sv: "Objektregister med karta", en: "Site registry with map" }), d: t({ sv: "Alla serviceobjekt visualiserade.", en: "All service sites visualized." }) },
        { t: t({ sv: "Rita serviceområden", en: "Draw service areas" }), d: t({ sv: "Polygon/polyline direkt på kartan.", en: "Polygon/polyline directly on the map." }) },
        { t: t({ sv: "Kundportal", en: "Customer portal" }), d: t({ sv: "Boka, chatta, se besökshistorik.", en: "Book, chat, view visit history." }) },
        { t: t({ sv: "Automatiskt SMS", en: "Automatic SMS" }), d: t({ sv: "'Vi är på väg' — utan manuell insats.", en: "‘We’re on our way’ — without manual effort." }) },
      ],
    },
    {
      id: "05", title: t({ sv: "AI & Analys", en: "AI & Analytics" }), icon: Brain,
      intro: t({ sv: "AI som hjälper dig se mönstren – innan de blir problem.", en: "AI that helps you see the patterns — before they become problems." }),
      items: [
        { t: t({ sv: "AI-assistent", en: "AI assistant" }), d: t({ sv: "Fråga i naturligt språk om data & planering.", en: "Ask in natural language about data and planning." }) },
        { t: t({ sv: "Prediktivt underhåll", en: "Predictive maintenance" }), d: t({ sv: "IoT-sensorer triggar schemalagda jobb.", en: "IoT sensors trigger scheduled jobs." }) },
        { t: t({ sv: "Avvikelsedetektering", en: "Anomaly detection" }), d: t({ sv: "Systemet flaggar anomalier.", en: "The system flags anomalies." }) },
        { t: t({ sv: "ROI-rapportering", en: "ROI reporting" }), d: t({ sv: "Beräknat vs faktiskt med feedback-loop.", en: "Estimated vs actual with feedback loop." }) },
      ],
    },
    {
      id: "06", title: t({ sv: "Ekonomi & Admin", en: "Finance & Admin" }), icon: Receipt,
      intro: t({ sv: "Från utfört jobb till skickad faktura – utan omvägar.", en: "From completed job to sent invoice — without detours." }),
      items: [
        { t: t({ sv: "Fakturering", en: "Invoicing" }), d: t({ sv: "Generera med förhandsgranskning.", en: "Generate with preview." }) },
        { t: t({ sv: "Ekonomisystem", en: "Accounting systems" }), d: t({ sv: "Färdig Fortnox-koppling. Integrationer mot Visma, Björn Lundén m.fl. byggs på begäran.", en: "Native Fortnox integration. Visma, Björn Lundén and others built on request." }) },
        { t: t({ sv: "White-label", en: "White-label" }), d: t({ sv: "Logga, färger, domän per kund.", en: "Logo, colors, domain per customer." }) },
        { t: t({ sv: "Rollbaserad åtkomst", en: "Role-based access" }), d: t({ sv: "Admin, planerare, tekniker, kund.", en: "Admin, planner, technician, customer." }) },
      ],
    },
  ];

  return (
    <>
      <section className="relative min-h-[50vh] flex items-center overflow-hidden bg-noise">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="absolute top-0 left-0 w-[min(400px,90vw)] h-[min(400px,90vw)] rounded-full bg-primary/[0.03] blur-[150px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full py-20 sm:py-28 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4">
              <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-primary">
                {t({ sv: "Webb · Planerare & arbetsledare", en: "Web · Planners & supervisors" })}
              </span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="font-display text-3xl sm:text-4xl md:text-6xl font-bold leading-[0.95] tracking-tight mb-5 max-w-2xl">
              <span className="text-gradient-ice">Traivo One</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-muted-foreground max-w-xl leading-relaxed">
              {t({
                sv: "Kontrollrummet för hela fältoperationen. Planering, rutter, realtid, kunder, AI och fakturering – i samma vy, samma data, samma sanning.",
                en: "The control room for the entire field operation. Planning, routes, real-time, customers, AI and invoicing — same view, same data, same truth.",
              })}
            </motion.p>
          </div>
          <div className="hidden lg:flex justify-end">
            <PlannerVisual />
          </div>
        </div>
      </section>

      {sections.map((section, si) => (
        <section key={section.id} className={`py-20 px-4 sm:px-6 border-t border-border ${si % 2 === 1 ? "bg-noise" : ""}`}>
          <div className="max-w-7xl mx-auto">
            <motion.div {...fadeIn} className="flex items-start gap-3 sm:gap-5 mb-6">
              <span className="font-display text-4xl sm:text-5xl md:text-7xl font-bold text-border/50 leading-none select-none">{section.id}</span>
              <div className="flex items-center gap-3 pt-2 sm:pt-3 flex-wrap">
                <section.icon className="w-5 h-5 text-primary opacity-60" />
                <h2 className="font-display text-lg sm:text-xl md:text-2xl font-bold">{section.title}</h2>
              </div>
            </motion.div>

            <motion.p {...fadeIn} className="text-sm md:text-base text-muted-foreground max-w-2xl mb-10 leading-relaxed">
              {section.intro}
            </motion.p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {section.items.map((item, fi) => (
                <motion.div key={item.t} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: fi * 0.06 }} className="glass-subtle rounded-xl p-5 group hover:border-primary/15 transition-all duration-300">
                  <h3 className="text-sm font-semibold mb-1.5 group-hover:text-primary transition-colors">{item.t}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.d}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="py-24 px-4 sm:px-6 border-t border-border bg-noise relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <motion.p {...fadeIn} className="font-display text-xl md:text-2xl font-medium leading-relaxed text-foreground/90 mb-6">
            {t({ sv: "Ett kontrollrum för dem som annars hade haft fem flikar öppna.", en: "A control room for those who would otherwise have five tabs open." })}
          </motion.p>
          <motion.p {...fadeIn} className="text-sm text-muted-foreground">
            {t({ sv: "Vill du se hur det skulle se ut för er?", en: "Want to see how it would look for you?" })}{" "}
            <AIChatLink className="text-primary hover:underline">{t({ sv: "Beskriv er verksamhet", en: "Describe your business" })}</AIChatLink>
            {" "}{t({ sv: "eller", en: "or" })}{" "}
            <Link to="/kontakt" className="text-primary hover:underline">{t({ sv: "hör av dig", en: "get in touch" })}</Link>.
          </motion.p>
        </div>
      </section>
    </>
  );
};

export default TraivoOne;
