import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Trash2, Building2, Flame, Wrench, Store, Bug, DoorOpen, Landmark, ArrowRight } from "lucide-react";
import { useT } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";

const items = [
  { icon: Trash2, title: { sv: "Kärltvätt, avfall & renhållning", en: "Bin washing, waste & sanitation" }, desc: { sv: "Slipp papperslistor och missade kärl. Traivo håller ihop hela objektträdet, planerar rutten automatiskt och låter chauffören rapportera antal tvättade kärl, avvikelser och foto direkt i mobilen – rakt in i fakturaunderlaget till Fortnox.", en: "No more paper lists or missed bins. Traivo keeps the whole object tree together, plans the route automatically and lets the driver report washed bins, deviations and photos straight from the phone – directly into the Fortnox invoice basis." } },
  { icon: Building2, title: { sv: "Fastighetsskötsel & utemiljö", en: "Property maintenance & grounds" }, desc: { sv: "Få full koll på både löpande ronder och akuta utryckningar. Era team ser exakt vad som ska göras på varje fastighet, rapporterar tid och material på plats, och kunden kan följa utfört arbete direkt i sin egen kundportal.", en: "Get full control of both scheduled rounds and urgent call-outs. Your teams see exactly what needs doing at each property, report time and materials on site, and the customer can follow completed work in their own customer portal." } },
  { icon: Flame, title: { sv: "Sotning & brandskydd", en: "Chimney sweeping & fire safety" }, desc: { sv: "Håll ordning på lagstadgade intervall utan krångel. Traivo skapar automatiskt kommande kontroller utifrån era avtal, samlar protokoll och fotobevis på rätt objekt och ser till att inget faller mellan stolarna.", en: "Keep track of statutory intervals without hassle. Traivo automatically creates upcoming inspections based on your contracts, collects reports and photo evidence on the right object and makes sure nothing slips through the cracks." } },
  { icon: Wrench, title: { sv: "Teknisk service & installation", en: "Technical service & installation" }, desc: { sv: "Samla serviceavtal, anläggningshistorik och fältarbete i ett enda flöde. Teknikern har all historik och dokumentation i mobilen, kan lägga till extra artiklar på plats och skickar ett färdigt fakturaunderlag direkt när jobbet är klart.", en: "Bring service contracts, installation history and field work into one flow. The technician has all history and documentation on the phone, can add extra items on site and sends a finished invoice basis as soon as the job is done." } },
  { icon: Store, title: { sv: "Butiks- & kedjeservice", en: "Retail & chain service" }, desc: { sv: "Hantera hundratals butiker under samma kedjeavtal utan administrativt kaos. Traivo kopplar rätt kontaktperson, instruktion och prislista till varje butik, och ger både er och kedjans huvudkontor full spårbarhet på varje utfört jobb.", en: "Manage hundreds of stores under the same chain contract without admin chaos. Traivo links the right contact, instructions and price list to each store, giving both you and the chain's head office full traceability on every job." } },
  { icon: Bug, title: { sv: "Skadedjursbekämpning & sanering", en: "Pest control & remediation" }, desc: { sv: "Planera täta ronder med minimal körtid och dokumentera varje kontrollpunkt direkt i mobilen. Bilder, observationer och avvikelser sparas automatiskt i objektets historik så ni alltid har ett komplett underlag inför kundens revisioner.", en: "Plan frequent rounds with minimal driving and document every checkpoint on the phone. Photos, observations and deviations are saved automatically in the object's history, so you always have complete records for customer audits." } },
  { icon: DoorOpen, title: { sv: "Hiss, port & säkerhet", en: "Elevators, gates & security" }, desc: { sv: "Koppla varje port, hiss eller anläggning till sin egen historik och serviceplan. Teknikern får guidade checklistor i fält, kan dokumentera fel och direkt skapa uppföljningsjobb utan att tappa spårbarheten.", en: "Link every gate, elevator or installation to its own history and service plan. Technicians get guided checklists in the field, can document faults and create follow-up jobs right away without losing traceability." } },
  { icon: Landmark, title: { sv: "Kommunal drift & infrastruktur", en: "Municipal operations & infrastructure" }, desc: { sv: "Få svart på vitt vad som är utfört, var och när. Med tydlig planering, geografisk överblick och fotodokumentation per objekt får ni full kontroll på både egen personal och underentreprenörer – och ett vattentätt underlag för uppföljning och redovisning.", en: "Get it in black and white: what was done, where and when. With clear planning, a geographic overview and photo documentation per object you get full control of both your own staff and subcontractors – and watertight records for follow-up and reporting." } },
];

const IndustriesSection = () => {
  const t = useT();
  return (
  <section id="branscher" className="py-20 md:py-24 px-4 sm:px-6 border-t border-border">
    <div className="max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
        <h2 className="font-display text-2xl md:text-4xl font-bold mb-3 text-gradient-ice">{t({ sv: "Branscher vi skapar kontroll för", en: "Industries we bring control to" })}</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">{t({ sv: "Sömlös styrning från planering till fakturering – anpassad för verksamheter i fält.", en: "Seamless control from planning to invoicing – built for field operations." })}</p>
      </motion.div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((it, i) => (
          <motion.div key={t(it.title)} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
            className="rounded-xl border border-border bg-card/60 backdrop-blur-sm p-5 hover:border-primary/30 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
              <it.icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-display font-semibold text-foreground mb-2">{t(it.title)}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{t(it.desc)}</p>
          </motion.div>
        ))}
      </div>
      <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
        <p className="font-display font-semibold text-foreground"><span className="text-primary">TRAIVO</span>{t({ sv: " – Från kundens behov till företagets resultat.", en: " – From customer needs to business results." })}</p>
        <Button asChild><Link to="/kontakt">{t({ sv: "Boka demo", en: "Book a demo" })} <ArrowRight className="w-4 h-4" /></Link></Button>
      </div>
    </div>
  </section>
  );
};

export default IndustriesSection;
