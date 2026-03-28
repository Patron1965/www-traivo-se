import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Calendar, Route, MapPin, Users, Brain, BarChart3, Receipt,
  Shield, Cloud, ArrowRight, GripVertical, Sun, Layers, Bell,
  Globe, Palette, Server, Cpu
} from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const featureGroups = [
  {
    title: "Planering & Schemaläggning",
    icon: Calendar,
    features: [
      { title: "Drag-and-drop veckoplanerare", desc: "Fördela jobb till rätt tekniker med en enkel dra-och-släpp." },
      { title: "AI-autoschemaläggning", desc: "Tar hänsyn till kompetens, geografi, arbetstid och fordonskapacitet." },
      { title: "Årsplanering", desc: "Sätt mål per kund och låt AI fördela över hela året." },
      { title: "Väderplanering", desc: "Schemat anpassas automatiskt efter väderprognoser." },
    ],
  },
  {
    title: "Ruttoptimering",
    icon: Route,
    features: [
      { title: "Automatisk optimering", desc: "Optimerar körslingor med riktiga vägavstånd." },
      { title: "Klusterbaserad planering", desc: "Grupperar jobb geografiskt för effektivare dagar." },
      { title: "Fyll veckan-funktion", desc: "Geografisk dagsklustring som fyller ut tomma luckor." },
      { title: "Flera optimeringsmotorer", desc: "Stöd för Geoapify, OR-Tools och fler." },
    ],
  },
  {
    title: "Realtidsövervakning",
    icon: MapPin,
    features: [
      { title: "Live-karta med GPS", desc: "Se förarpositioner i realtid direkt i webbläsaren." },
      { title: "Pop-out kartfönster", desc: "Separat skärm för kontrollrummet." },
      { title: "Akut jobbhantering", desc: "Tilldela brådskande uppdrag till närmaste tekniker på sekunder." },
      { title: "Störningshantering", desc: "Automatisk omplanering vid sjukdom, förseningar eller akutjobb." },
    ],
  },
  {
    title: "Kund- & Objekthantering",
    icon: Users,
    features: [
      { title: "Komplett objektregister", desc: "Alla serviceobjekt med kartvy." },
      { title: "Polygon/polyline-stöd", desc: "Rita serviceområden direkt på kartan." },
      { title: "Kundportal", desc: "Kunder kan boka, chatta och se besökshistorik." },
      { title: "Automatiska notiser", desc: "SMS/e-post: 'Vi är på väg' skickas automatiskt." },
    ],
  },
  {
    title: "AI & Analys",
    icon: Brain,
    features: [
      { title: "AI-assistent", desc: "Ställ frågor om planering och data i naturligt språk." },
      { title: "Prediktivt underhåll", desc: "Planering baserat på IoT-sensorer." },
      { title: "Avvikelsedetektering", desc: "Systemet flaggar anomalier automatiskt." },
      { title: "ROI-rapportering", desc: "Per kund, område och tjänst. Beräknat vs faktiskt." },
    ],
  },
  {
    title: "Ekonomi & Admin",
    icon: Receipt,
    features: [
      { title: "Fakturagenerering", desc: "Skapa fakturor med förhandsgranskning." },
      { title: "Fortnox-export", desc: "Sömlös integration med Fortnox." },
      { title: "Rollbaserad åtkomst", desc: "Admin, planerare, tekniker, kund." },
      { title: "White-label", desc: "Anpassa logga, färger och domän per kund." },
    ],
  },
];

const TraivoOne = () => {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-hero-gradient text-white py-24 md:py-32 px-6">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-32 w-80 h-80 rounded-full bg-teal blur-[100px]" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-white/10 border border-white/20 mb-6">
              Webb-plattform för planerare
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
              Traivo One
            </h1>
            <p className="text-lg text-white/75 max-w-2xl mx-auto mb-8">
              Kontrollcentret där arbetsledare och planerare schemalägger, optimerar och 
              övervakar hela fältoperationen i realtid.
            </p>
            <Button size="lg" variant="secondary" className="font-semibold" asChild>
              <Link to="/kontakt">Boka demo <ArrowRight className="w-4 h-4 ml-1" /></Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Feature groups */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto space-y-24">
          {featureGroups.map((group, gi) => (
            <motion.div key={group.title} {...fadeUp} transition={{ delay: 0.1, duration: 0.6 }}>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <group.icon className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">{group.title}</h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {group.features.map((f, fi) => (
                  <motion.div
                    key={f.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: fi * 0.08, duration: 0.5 }}
                    className="rounded-xl border border-border bg-card p-5 hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-semibold text-sm mb-2">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-hero-gradient text-white">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div {...fadeUp}>
            <h2 className="text-3xl font-bold mb-4">Vill du se Traivo One i aktion?</h2>
            <p className="text-white/70 mb-8">Boka en personlig demo och se hur plattformen kan effektivisera er planering.</p>
            <Button size="lg" variant="secondary" className="font-semibold" asChild>
              <Link to="/kontakt">Boka demo <ArrowRight className="w-4 h-4 ml-1" /></Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default TraivoOne;
