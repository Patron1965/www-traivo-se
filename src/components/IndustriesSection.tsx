import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Trash2, Building2, Flame, Wrench, Store, Bug, DoorOpen, Landmark, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const items = [
  { icon: Trash2, title: "Kärltvätt, avfall & renhållning", desc: "Slipp papperslistor och missade kärl. Traivo håller ihop hela objektträdet, planerar rutten automatiskt och låter chauffören rapportera antal tvättade kärl, avvikelser och foto direkt i mobilen – rakt in i fakturaunderlaget till Fortnox." },
  { icon: Building2, title: "Fastighetsskötsel & utemiljö", desc: "Få full koll på både löpande ronder och akuta utryckningar. Era team ser exakt vad som ska göras på varje fastighet, rapporterar tid och material på plats, och kunden kan följa utfört arbete direkt i sin egen kundportal." },
  { icon: Flame, title: "Sotning & brandskydd", desc: "Håll ordning på lagstadgade intervall utan krångel. Traivo skapar automatiskt kommande kontroller utifrån era avtal, samlar protokoll och fotobevis på rätt objekt och ser till att inget faller mellan stolarna." },
  { icon: Wrench, title: "Teknisk service & installation", desc: "Samla serviceavtal, anläggningshistorik och fältarbete i ett enda flöde. Teknikern har all historik och dokumentation i mobilen, kan lägga till extra artiklar på plats och skickar ett färdigt fakturaunderlag direkt när jobbet är klart." },
  { icon: Store, title: "Butiks- & kedjeservice", desc: "Hantera hundratals butiker under samma kedjeavtal utan administrativt kaos. Traivo kopplar rätt kontaktperson, instruktion och prislista till varje butik, och ger både er och kedjans huvudkontor full spårbarhet på varje utfört jobb." },
  { icon: Bug, title: "Skadedjursbekämpning & sanering", desc: "Planera täta ronder med minimal körtid och dokumentera varje kontrollpunkt direkt i mobilen. Bilder, observationer och avvikelser sparas automatiskt i objektets historik så ni alltid har ett komplett underlag inför kundens revisioner." },
  { icon: DoorOpen, title: "Hiss, port & säkerhet", desc: "Koppla varje port, hiss eller anläggning till sin egen historik och serviceplan. Teknikern får guidade checklistor i fält, kan dokumentera fel och direkt skapa uppföljningsjobb utan att tappa spårbarheten." },
  { icon: Landmark, title: "Kommunal drift & infrastruktur", desc: "Få svart på vitt vad som är utfört, var och när. Med tydlig planering, geografisk överblick och fotodokumentation per objekt får ni full kontroll på både egen personal och underentreprenörer – och ett vattentätt underlag för uppföljning och redovisning." },
];

const IndustriesSection = () => (
  <section id="branscher" className="py-20 md:py-24 px-4 sm:px-6 border-t border-border">
    <div className="max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
        <h2 className="font-display text-2xl md:text-4xl font-bold mb-3 text-gradient-ice">Branscher vi skapar kontroll för</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">Sömlös styrning från planering till fakturering – anpassad för verksamheter i fält.</p>
      </motion.div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((it, i) => (
          <motion.div key={it.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
            className="rounded-xl border border-border bg-card/60 backdrop-blur-sm p-5 hover:border-primary/30 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
              <it.icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-display font-semibold text-foreground mb-2">{it.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{it.desc}</p>
          </motion.div>
        ))}
      </div>
      <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
        <p className="font-display font-semibold text-foreground"><span className="text-primary">TRAIVO</span> – Från kundens behov till företagets resultat.</p>
        <Button asChild><Link to="/kontakt">Boka demo <ArrowRight className="w-4 h-4" /></Link></Button>
      </div>
    </div>
  </section>
);

export default IndustriesSection;
