import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  MapPin, Calendar, Route, Smartphone, Zap, BarChart3,
  ArrowRight, CheckCircle2, Clock, Fuel, FileText, MessageSquare, Users
} from "lucide-react";

const stats = [
  { value: "30%", label: "Kortare körsträckor", icon: Route },
  { value: "100%", label: "Realtidsövervakning", icon: MapPin },
  { value: "AI", label: "Planering som lär sig", icon: Zap },
  { value: "Offline", label: "Fungerar utan nät", icon: Smartphone },
];

const comparisonRows = [
  { without: "Planering i Excel och på whiteboard", withTraivo: "AI-optimerade scheman med ett klick" },
  { without: "Telefonsamtal vid ändringar", withTraivo: "Realtidsuppdateringar till alla direkt" },
  { without: "Körning kors och tvärs", withTraivo: "Ruttoptimerade dagar sparar bränsle och tid" },
  { without: "Pappersprotokoll som tappas bort", withTraivo: "Digital dokumentation med foton och signatur" },
  { without: "Kunder ringer och frågar 'när kommer ni?'", withTraivo: "Automatiskt SMS med ETA" },
  { without: "Akutjobb via telefon och kaos", withTraivo: "Närmaste tekniker med ett klick" },
  { without: "Separata system för allt", withTraivo: "Allt i en plattform" },
];

const industries = [
  "Avfallshantering", "Fastighetsskötsel", "Teknisk fältservice",
  "Snöröjning & markskötsel", "Miljö- & energitjänster"
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const Index = () => {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-hero-gradient text-primary-foreground">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-teal blur-[120px]" />
          <div className="absolute bottom-10 left-10 w-72 h-72 rounded-full bg-aurora blur-[100px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-36">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-white/10 border border-white/20 mb-6">
              AI-driven fältserviceplattform för Norden
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 tracking-tight">
              Sluta planera.
              <br />
              <span className="text-aurora">Börja optimera.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/75 leading-relaxed mb-8 max-w-2xl">
              Traivo ersätter Excel-planering och pappersprotokoll med intelligent 
              automation, realtidsövervakning och AI-stödd optimering — 
              för fältserviceföretag som vill växa.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" variant="secondary" className="font-semibold" asChild>
                <Link to="/kontakt">
                  Boka demo <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
              <Button size="lg" variant="ghost" className="text-white border border-white/20 hover:bg-white/10 hover:text-white" asChild>
                <Link to="/traivo-one">Utforska plattformen</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              {...fadeUp}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <s.icon className="w-6 h-6 text-primary mx-auto mb-2" />
              <div className="text-2xl md:text-3xl font-bold text-foreground">{s.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Two products overview */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Två produkter. <span className="text-gradient-ocean">En plattform.</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Traivo One för planerare och arbetsledare. Traivo Go för teknikern i fält. 
              Tillsammans täcker de hela kedjan.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Traivo One card */}
            <motion.div {...fadeUp} className="rounded-2xl border border-border bg-card p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Traivo One</h3>
              <p className="text-sm text-muted-foreground mb-1">Planeringsplattformen</p>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Kontrollcentret där arbetsledare schemalägger, optimerar och övervakar hela 
                fältoperationen i realtid.
              </p>
              <div className="space-y-2 mb-6">
                {["AI-autoschemaläggning", "Ruttoptimering", "Live-karta med GPS", "Fakturering & Fortnox"].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              <Button variant="outline" asChild>
                <Link to="/traivo-one">Läs mer <ArrowRight className="w-4 h-4 ml-1" /></Link>
              </Button>
            </motion.div>

            {/* Traivo Go card */}
            <motion.div {...fadeUp} className="rounded-2xl border border-border bg-card p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-5">
                <Smartphone className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">Traivo Go</h3>
              <p className="text-sm text-muted-foreground mb-1">Mobilappen för fältet</p>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Teknikerns digitala arbetsverktyg. Ersätter pappersprotokoll och telefonsamtal 
                med en app som fungerar — även utan uppkoppling.
              </p>
              <div className="space-y-2 mb-6">
                {["Dagliga uppdrag med navigation", "Digital dokumentation & signatur", "Offline-first", "Push-notiser i realtid"].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              <Button variant="outline" asChild>
                <Link to="/traivo-go">Läs mer <ArrowRight className="w-4 h-4 ml-1" /></Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-24 px-6 bg-section-alt">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Varför <span className="text-gradient-ocean">Traivo?</span>
            </h2>
          </motion.div>

          <motion.div {...fadeUp} className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="grid grid-cols-2 text-sm font-semibold border-b border-border">
              <div className="px-6 py-4 text-destructive/80 bg-destructive/5">Utan Traivo</div>
              <div className="px-6 py-4 text-accent bg-accent/5">Med Traivo</div>
            </div>
            {comparisonRows.map((row, i) => (
              <div key={i} className="grid grid-cols-2 text-sm border-b border-border last:border-0">
                <div className="px-6 py-4 text-muted-foreground">{row.without}</div>
                <div className="px-6 py-4 font-medium">{row.withTraivo}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Byggt för nordisk fältservice</h2>
            <p className="text-muted-foreground">Traivo passar företag som har tekniker, fordon och uppdrag ute i fält.</p>
          </motion.div>

          <motion.div {...fadeUp} className="flex flex-wrap justify-center gap-3">
            {industries.map((ind) => (
              <span key={ind} className="px-5 py-2.5 rounded-full border border-border bg-card text-sm font-medium">
                {ind}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-hero-gradient text-white">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div {...fadeUp}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Redo att optimera er fältservice?
            </h2>
            <p className="text-white/70 mb-8 text-lg">
              Boka en kostnadsfri demo och se hur Traivo kan effektivisera just er verksamhet.
            </p>
            <Button size="lg" variant="secondary" className="font-semibold" asChild>
              <Link to="/kontakt">
                Boka demo <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Index;
