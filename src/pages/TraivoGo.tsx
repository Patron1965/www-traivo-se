import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Smartphone, MapPin, Camera, Pen, Clock, WifiOff, Bell,
  CheckSquare, Package, ArrowRight, Navigation, MessageSquare
} from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const featureGroups = [
  {
    title: "Daglig jobbhantering",
    icon: Smartphone,
    features: [
      { title: "Tydlig jobblista", desc: "Dagens uppdrag med adresser, kundinfo och instruktioner." },
      { title: "Ett-tryck navigation", desc: "Starta GPS-navigation till nästa stopp direkt." },
      { title: "Restid per jobb", desc: "Se avstånd och beräknad restid för varje uppdrag." },
      { title: "Akutjobb i realtid", desc: "Ta emot brådskande uppdrag med accept/avböj." },
    ],
  },
  {
    title: "Utförande & Rapportering",
    icon: CheckSquare,
    features: [
      { title: "Digitala protokoll", desc: "Checklistor anpassade per jobbtyp." },
      { title: "Fotodokumentation", desc: "Ta bilder direkt i appen som bifogas jobbet." },
      { title: "Digital signatur", desc: "Kunden signerar direkt på skärmen." },
      { title: "Materiallogg", desc: "Registrera förbrukat material enkelt." },
    ],
  },
  {
    title: "Tidsrapportering",
    icon: Clock,
    features: [
      { title: "In-/utcheckning", desc: "Automatisk tidsstämpling vid start och slut." },
      { title: "Arbetspass (Snöret)", desc: "Komplett tidslogg för varje dag." },
      { title: "Löneexport", desc: "Exportera till CSV för lönehantering." },
      { title: "AI-kontrollmallar", desc: "AI föreslår steg baserat på jobbtyp." },
    ],
  },
  {
    title: "Offline & Kommunikation",
    icon: WifiOff,
    features: [
      { title: "Fungerar utan internet", desc: "Sparar allt lokalt och synkar vid uppkoppling." },
      { title: "Push-notiser", desc: "Nya jobb och schemaändringar direkt till telefonen." },
      { title: "Meddelanden", desc: "Kommunicera med planerare utan att ringa." },
      { title: "Ruttfeedback", desc: "Betygsätt dagens slinga och hjälp förbättra planeringen." },
    ],
  },
];

const TraivoGo = () => {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-hero-gradient text-white py-24 md:py-32 px-6">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute bottom-10 left-20 w-80 h-80 rounded-full bg-aurora blur-[100px]" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-white/10 border border-white/20 mb-6">
              Mobilapp för fältpersonal
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
              Traivo Go
            </h1>
            <p className="text-lg text-white/75 max-w-2xl mx-auto mb-8">
              Teknikerns digitala arbetsverktyg. Ersätter pappersprotokoll och telefonsamtal 
              med en app som fungerar — även utan uppkoppling.
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
          {featureGroups.map((group) => (
            <motion.div key={group.title} {...fadeUp}>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <group.icon className="w-5 h-5 text-accent" />
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

      {/* Offline highlight */}
      <section className="py-24 px-6 bg-section-alt">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div {...fadeUp}>
            <WifiOff className="w-12 h-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Offline-first</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Traivo Go fungerar i skogen, i källaren och på plats utan mobiltäckning. 
              Protokoll, foton och statusändringar sparas lokalt och synkas automatiskt 
              när uppkopplingen är tillbaka.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-hero-gradient text-white">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div {...fadeUp}>
            <h2 className="text-3xl font-bold mb-4">Ge era tekniker rätt verktyg</h2>
            <p className="text-white/70 mb-8">Se hur Traivo Go kan förenkla vardagen för er fältpersonal.</p>
            <Button size="lg" variant="secondary" className="font-semibold" asChild>
              <Link to="/kontakt">Boka demo <ArrowRight className="w-4 h-4 ml-1" /></Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default TraivoGo;
