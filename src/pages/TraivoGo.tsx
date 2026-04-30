import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import AIChatLink from "@/components/AIChatLink";
import FieldVisual from "@/components/FieldVisual";
import { Smartphone, CheckSquare, Clock, WifiOff } from "lucide-react";
import { useT } from "@/i18n/LanguageContext";

const fadeIn = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const TraivoGo = () => {
  const t = useT();

  const sections = [
    {
      id: "01", title: t({ sv: "Jobbhantering", en: "Job handling" }), icon: Smartphone,
      intro: t({ sv: "Dagens jobb, i ordning, med allt teknikern behöver. Inga papper, inga samtal till kontoret.", en: "Today’s jobs, in order, with everything the technician needs. No paper, no calls to the office." }),
      items: [
        { t: t({ sv: "Dagens uppdrag", en: "Today’s jobs" }), d: t({ sv: "Tydlig lista med adresser, kundinfo och instruktioner.", en: "Clear list of addresses, customer info and instructions." }) },
        { t: t({ sv: "Ett-tryck navigation", en: "One-tap navigation" }), d: t({ sv: "GPS-navigation till nästa stopp direkt.", en: "GPS navigation to the next stop instantly." }) },
        { t: t({ sv: "Restid per jobb", en: "Travel time per job" }), d: t({ sv: "Avstånd och beräknad restid synligt.", en: "Distance and estimated travel time visible." }) },
        { t: t({ sv: "Akutjobb", en: "Urgent jobs" }), d: t({ sv: "Accept/avböj brådskande uppdrag i realtid.", en: "Accept/decline urgent jobs in real time." }) },
      ],
    },
    {
      id: "02", title: t({ sv: "Rapportering", en: "Reporting" }), icon: CheckSquare,
      intro: t({ sv: "Protokoll fylls i på plats – inte i bilen efter sista jobbet.", en: "Reports are filled in on site — not in the van after the last job." }),
      items: [
        { t: t({ sv: "Digitala protokoll", en: "Digital checklists" }), d: t({ sv: "Checklistor anpassade per jobbtyp.", en: "Checklists tailored per job type." }) },
        { t: t({ sv: "Fotodokumentation", en: "Photo documentation" }), d: t({ sv: "Bilder bifogas jobbet direkt.", en: "Photos attached to the job instantly." }) },
        { t: t({ sv: "Digital signatur", en: "Digital signature" }), d: t({ sv: "Kunden signerar på skärmen.", en: "The customer signs on the screen." }) },
        { t: t({ sv: "Materiallogg", en: "Materials log" }), d: t({ sv: "Registrera förbrukat material.", en: "Register consumed materials." }) },
      ],
    },
    {
      id: "03", title: t({ sv: "Tidsrapportering", en: "Time tracking" }), icon: Clock,
      intro: t({ sv: "Tid, pass och löneunderlag – utan att någon behöver räkna timmar i efterhand.", en: "Time, shifts and payroll data — without anyone counting hours after the fact." }),
      items: [
        { t: t({ sv: "In-/utcheckning", en: "Check-in/out" }), d: t({ sv: "Automatisk tidsstämpling.", en: "Automatic timestamping." }) },
        { t: t({ sv: "Arbetspass", en: "Work shifts" }), d: t({ sv: "Komplett tidslogg per dag.", en: "Complete time log per day." }) },
        { t: t({ sv: "Löneexport", en: "Payroll export" }), d: t({ sv: "CSV-export för lönehantering.", en: "CSV export for payroll." }) },
        { t: t({ sv: "AI-kontrollmallar", en: "AI checklist templates" }), d: t({ sv: "AI föreslår steg per jobbtyp.", en: "AI suggests steps per job type." }) },
      ],
    },
    {
      id: "04", title: t({ sv: "Offline & Kommunikation", en: "Offline & Communication" }), icon: WifiOff,
      intro: t({ sv: "Fungerar i källaren, i skogen och på taket. Synkar när nätet kommer tillbaka.", en: "Works in basements, forests and on rooftops. Syncs when coverage returns." }),
      items: [
        { t: t({ sv: "Offline-first", en: "Offline-first" }), d: t({ sv: "Sparar allt lokalt, synkar vid uppkoppling.", en: "Saves everything locally, syncs when online." }) },
        { t: t({ sv: "Push-notiser", en: "Push notifications" }), d: t({ sv: "Nya jobb och ändringar direkt.", en: "New jobs and changes instantly." }) },
        { t: t({ sv: "Meddelanden", en: "Messages" }), d: t({ sv: "Kommunicera utan att ringa.", en: "Communicate without calling." }) },
        { t: t({ sv: "Ruttfeedback", en: "Route feedback" }), d: t({ sv: "Betygsätt och förbättra planeringen.", en: "Rate and improve planning." }) },
      ],
    },
  ];

  return (
    <>
      <section className="relative min-h-[50vh] flex items-center overflow-hidden bg-noise">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="absolute bottom-0 right-0 w-[min(400px,90vw)] h-[min(400px,90vw)] rounded-full bg-accent/[0.03] blur-[150px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full py-20 sm:py-28 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4">
              <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-accent">
                {t({ sv: "Mobil · Tekniker i fält", en: "Mobile · Field technicians" })}
              </span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="font-display text-3xl sm:text-4xl md:text-6xl font-bold leading-[0.95] tracking-tight mb-5 max-w-2xl">
              <span className="text-gradient-ice">Traivo Go</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-muted-foreground max-w-xl leading-relaxed">
              {t({
                sv: "Teknikerns arbetsverktyg. Jobb, rutt, protokoll och signatur i fickan – och allt fungerar även när nätet inte gör det.",
                en: "The technician’s work tool. Jobs, route, reports and signatures in your pocket — all working even when the network isn’t.",
              })}
            </motion.p>
          </div>
          <div className="hidden lg:flex justify-end">
            <FieldVisual />
          </div>
        </div>
      </section>

      {sections.map((section, si) => (
        <section key={section.id} className={`py-20 px-4 sm:px-6 border-t border-border ${si % 2 === 1 ? "bg-noise" : ""}`}>
          <div className="max-w-7xl mx-auto">
            <motion.div {...fadeIn} className="flex items-start gap-3 sm:gap-5 mb-6">
              <span className="font-display text-4xl sm:text-5xl md:text-7xl font-bold text-border/50 leading-none select-none">{section.id}</span>
              <div className="flex items-center gap-3 pt-2 sm:pt-3 flex-wrap">
                <section.icon className="w-5 h-5 text-accent opacity-60" />
                <h2 className="font-display text-lg sm:text-xl md:text-2xl font-bold">{section.title}</h2>
              </div>
            </motion.div>

            <motion.p {...fadeIn} className="text-sm md:text-base text-muted-foreground max-w-2xl mb-10 leading-relaxed">
              {section.intro}
            </motion.p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {section.items.map((item, fi) => (
                <motion.div key={item.t} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: fi * 0.06 }} className="glass-subtle rounded-xl p-5 group hover:border-accent/15 transition-all duration-300">
                  <h3 className="text-sm font-semibold mb-1.5 group-hover:text-accent transition-colors">{item.t}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.d}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="py-24 px-4 sm:px-6 border-t border-border relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] rounded-full bg-accent/[0.05] blur-[80px]" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <motion.div {...fadeIn}>
            <WifiOff className="w-10 h-10 text-accent mx-auto mb-5 opacity-50" />
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
              {t({ sv: "Bygger inte på täckning", en: "Doesn’t depend on coverage" })}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {t({
                sv: "Källaren, hisschaktet, skogsvägen utan en stapel – där ute hjälper det inte att appen \"borde\" fungera. Traivo Go sparar lokalt, jobbar vidare och synkar tyst när nätet kommer tillbaka.",
                en: "The basement, the elevator shaft, the forest road without a single bar — out there it doesn’t help that the app ‘should’ work. Traivo Go saves locally, keeps going, and quietly syncs when coverage returns.",
              })}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 border-t border-border bg-noise relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <motion.p {...fadeIn} className="font-display text-xl md:text-2xl font-medium leading-relaxed text-foreground/90 mb-6">
            {t({ sv: "Byggt för dem som faktiskt jobbar i fält – inte för demos i ett konferensrum.", en: "Built for those who actually work in the field — not for demos in a conference room." })}
          </motion.p>
          <motion.p {...fadeIn} className="text-sm text-muted-foreground">
            {t({ sv: "Vill du se hur den skulle fungera för era tekniker?", en: "Want to see how it would work for your technicians?" })}{" "}
            <AIChatLink className="text-accent hover:underline">{t({ sv: "Beskriv er verksamhet", en: "Describe your business" })}</AIChatLink>
            {" "}{t({ sv: "eller", en: "or" })}{" "}
            <Link to="/kontakt" className="text-accent hover:underline">{t({ sv: "hör av dig", en: "get in touch" })}</Link>.
          </motion.p>
        </div>
      </section>
    </>
  );
};

export default TraivoGo;
