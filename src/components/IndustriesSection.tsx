import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Trash2, Building2, Flame, Wrench, Store, Bug, DoorOpen, Landmark, ArrowRight } from "lucide-react";
import { useT } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";

const items = [
  { icon: Trash2, title: { sv: "Kärltvätt, avfall & renhållning", en: "Bin washing, waste & sanitation" }, desc: { sv: "Slipp papperslistor och missade kärl. Traivo håller ihop hela objektträdet, planerar rutten automatiskt och låter chauffören rapportera antal tvättade kärl, avvikelser och foto direkt i mobilen – rakt in i fakturaunderlaget till Fortnox.", en: "No more paper lists or missed bins. Traivo keeps the whole object tree together, plans the route automatically and lets the driver report washed bins, deviations and photos straight from the phone – directly into the Fortnox invoice basis." }, help: { sv: "Ni slipper papperslistor och missade kärl. Rutten planeras automatiskt och chauffören rapporterar tvättade kärl, avvikelser och foto direkt i mobilen – underlaget hamnar i faktureringen.", en: "No paper lists or missed bins. The route is planned automatically and the driver reports washed bins, deviations and photos straight from the phone – the records land in invoicing." } },
  { icon: Building2, title: { sv: "Fastighetsskötsel & utemiljö", en: "Property maintenance & grounds" }, desc: { sv: "Få full koll på både löpande ronder och akuta utryckningar. Era team ser exakt vad som ska göras på varje fastighet, rapporterar tid och material på plats, och kunden kan följa utfört arbete direkt i sin egen kundportal.", en: "Get full control of both scheduled rounds and urgent call-outs. Your teams see exactly what needs doing at each property, report time and materials on site, and the customer can follow completed work in their own customer portal." }, help: { sv: "Löpande ronder och akuta utryckningar hamnar i samma planering. Teamen rapporterar tid och material på plats och kunden kan följa utfört arbete i sin egen portal.", en: "Scheduled rounds and urgent call-outs share one plan. Teams report time and materials on site and the customer can follow completed work in their own portal." } },
  { icon: Flame, title: { sv: "Sotning & brandskydd", en: "Chimney sweeping & fire safety" }, desc: { sv: "Håll ordning på lagstadgade intervall utan krångel. Traivo skapar automatiskt kommande kontroller utifrån era avtal, samlar protokoll och fotobevis på rätt objekt och ser till att inget faller mellan stolarna.", en: "Keep track of statutory intervals without hassle. Traivo automatically creates upcoming inspections based on your contracts, collects reports and photo evidence on the right object and makes sure nothing slips through the cracks." }, help: { sv: "De lagstadgade intervallen skapas automatiskt från era avtal. Protokoll och fotobevis sparas på rätt objekt och finns redo vid inspektion.", en: "Statutory intervals are created automatically from your contracts. Reports and photo evidence are saved on the right object and ready for inspection." } },
  { icon: Wrench, title: { sv: "Teknisk service & installation", en: "Technical service & installation" }, desc: { sv: "Samla serviceavtal, anläggningshistorik och fältarbete i ett enda flöde. Teknikern har all historik och dokumentation i mobilen, kan lägga till extra artiklar på plats och skickar ett färdigt fakturaunderlag direkt när jobbet är klart.", en: "Bring service contracts, installation history and field work into one flow. The technician has all history and documentation on the phone, can add extra items on site and sends a finished invoice basis as soon as the job is done." }, help: { sv: "Teknikern har avtal, anläggningshistorik och dokumentation i mobilen, kan lägga till artiklar på plats och skickar ett färdigt fakturaunderlag direkt efter jobbet.", en: "The technician has contracts, installation history and documentation on the phone, can add items on site and sends a finished invoice basis right after the job." } },
  { icon: Store, title: { sv: "Butiks- & kedjeservice", en: "Retail & chain service" }, desc: { sv: "Hantera hundratals butiker under samma kedjeavtal utan administrativt kaos. Traivo kopplar rätt kontaktperson, instruktion och prislista till varje butik, och ger både er och kedjans huvudkontor full spårbarhet på varje utfört jobb.", en: "Manage hundreds of stores under the same chain contract without admin chaos. Traivo links the right contact, instructions and price list to each store, giving both you and the chain's head office full traceability on every job." }, help: { sv: "Rätt kontaktperson, instruktion och prislista kopplas till varje butik. Både ni och kedjans huvudkontor ser exakt vad som är utfört.", en: "The right contact, instructions and price list link to each store. Both you and the chain's head office see exactly what has been done." } },
  { icon: Bug, title: { sv: "Skadedjursbekämpning & sanering", en: "Pest control & remediation" }, desc: { sv: "Planera täta ronder med minimal körtid och dokumentera varje kontrollpunkt direkt i mobilen. Bilder, observationer och avvikelser sparas automatiskt i objektets historik så ni alltid har ett komplett underlag inför kundens revisioner.", en: "Plan frequent rounds with minimal driving and document every checkpoint on the phone. Photos, observations and deviations are saved automatically in the object's history, so you always have complete records for customer audits." }, help: { sv: "Täta ronder körs med minimal körtid och varje kontrollpunkt dokumenteras med bild i mobilen – allt sparas i objektets historik, klart inför kundens revision.", en: "Frequent rounds run with minimal driving and every checkpoint is documented with photos on the phone – everything is saved in the object's history, ready for customer audits." } },
  { icon: DoorOpen, title: { sv: "Hiss, port & säkerhet", en: "Elevators, gates & security" }, desc: { sv: "Koppla varje port, hiss eller anläggning till sin egen historik och serviceplan. Teknikern får guidade checklistor i fält, kan dokumentera fel och direkt skapa uppföljningsjobb utan att tappa spårbarheten.", en: "Link every gate, elevator or installation to its own history and service plan. Technicians get guided checklists in the field, can document faults and create follow-up jobs right away without losing traceability." }, help: { sv: "Varje hiss och port har sin egen historik och serviceplan. Teknikern får guidade checklistor i fält och skapar uppföljningsjobb direkt när ett fel upptäcks.", en: "Each elevator and gate has its own history and service plan. The technician gets guided checklists in the field and creates follow-up jobs right away when a fault is found." } },
  { icon: Landmark, title: { sv: "Kommunal drift & infrastruktur", en: "Municipal operations & infrastructure" }, desc: { sv: "Få svart på vitt vad som är utfört, var och när. Med tydlig planering, geografisk överblick och fotodokumentation per objekt får ni full kontroll på både egen personal och underentreprenörer – och ett vattentätt underlag för uppföljning och redovisning.", en: "Get it in black and white: what was done, where and when. With clear planning, a geographic overview and photo documentation per object you get full control of both your own staff and subcontractors – and watertight records for follow-up and reporting." }, help: { sv: "Ni får svart på vitt vad som är utfört, var och när – av egen personal och underentreprenörer – med geografisk överblick och foto per objekt som underlag för uppföljning.", en: "You get it in black and white: what was done, where and when – by your own staff and subcontractors – with a geographic overview and photos per object as records for follow-up." } },
];

const IndustriesSection = () => {
  const t = useT();
  const [selected, setSelected] = useState(0);
  const sel = items[selected];
  return (
  <section id="branscher" className="py-20 md:py-24 px-4 sm:px-6 border-t border-border">
    <div className="max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
        <h2 className="font-display text-2xl md:text-4xl font-bold mb-3 text-gradient-ice">{t({ sv: "Branscher vi skapar kontroll för", en: "Industries we bring control to" })}</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">{t({ sv: "Sömlös styrning från planering till fakturering – anpassad för verksamheter i fält.", en: "Seamless control from planning to invoicing – built for field operations." })}</p>
        <p className="text-base text-muted-foreground mt-4">{t({ sv: "Klicka på en bransch för att se hur Traivo hjälper er.", en: "Select an industry to see how Traivo helps you." })}</p>
      </motion.div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((it, i) => (
          <motion.div key={t(it.title)} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
            <button
              type="button"
              onClick={() => setSelected(i)}
              aria-pressed={selected === i}
              className={`w-full h-full text-left rounded-xl border p-5 backdrop-blur-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                selected === i ? "border-primary/60 bg-primary/10" : "border-border bg-card/60 hover:border-primary/30"
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                <it.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2">{t(it.title)}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t(it.desc)}</p>
            </button>
          </motion.div>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={selected}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="mt-8 max-w-3xl mx-auto rounded-xl border border-border bg-card/60 backdrop-blur-sm p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <sel.icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-display font-semibold text-lg text-foreground">{t(sel.title)}</h3>
          </div>
          <p className="font-display font-semibold text-primary mb-2">{t({ sv: "Så hjälper Traivo er", en: "How Traivo helps you" })}</p>
          <p className="text-base text-muted-foreground leading-relaxed">{t(sel.help)}</p>
        </motion.div>
      </AnimatePresence>
      <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
        <p className="font-display font-semibold text-foreground"><span className="text-primary">TRAIVO</span>{t({ sv: " – Från kundens behov till företagets resultat.", en: " – From customer needs to business results." })}</p>
        <Button asChild><Link to="/kontakt">{t({ sv: "Boka demo", en: "Book a demo" })} <ArrowRight className="w-4 h-4" /></Link></Button>
      </div>
    </div>
  </section>
  );
};

export default IndustriesSection;
