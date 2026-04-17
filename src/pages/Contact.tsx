import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Mail, MapPin, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    toast({ title: "Tack!", description: "Vi återkommer inom kort." });
  };

  return (
    <section className="relative min-h-screen bg-noise">
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      <div className="absolute top-20 right-20 w-[300px] h-[300px] rounded-full bg-primary/[0.03] blur-[100px]" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-28 grid md:grid-cols-2 gap-16 items-start">
        {/* Left */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-primary mb-4 block">
            Kontakt
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-bold leading-[0.95] tracking-tight mb-5">
            <span className="text-gradient-ice">Har ni frågor om plattformen, vill se en demo eller bara prata fältservice?</span>
          </h1>
          <p className="text-sm text-muted-foreground mb-8 leading-relaxed max-w-sm">
            Fyll i formuläret så återkommer vi.
          </p>


          <div className="space-y-2.5 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-primary/50" />
              <span>info@traivo.se</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-primary/50" />
              <span>Sverige</span>
            </div>
          </div>
          <div className="mt-6">
            <Dialog>
              <DialogTrigger asChild>
                <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary/20 text-xs font-medium text-foreground/90 hover:border-primary/40 hover:bg-primary/[0.04] transition-all duration-300">
                  <Users className="w-3.5 h-3.5 text-primary/60" />
                  Vem är Traivo till för?
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle className="font-display text-xl font-bold">
                    Vem är Traivo till för?
                  </DialogTitle>
                </DialogHeader>
                <div className="text-sm text-muted-foreground leading-relaxed space-y-4 pt-2">
                  <p>
                    Traivo är till för dig som driver serviceverksamhet där tekniker åker ut till kund –
                    VVS, el, kyla, hissar, fastighet, IT, säkerhet, vitvaror, maskinservice eller sophantering.
                  </p>
                  <p>
                    Om dina tekniker kör rutter och du schemalägger uppdrag varje dag, är Traivo byggt för dig.
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* Right */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          {submitted ? (
            <div className="glass rounded-2xl p-10 text-center">
              <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="w-7 h-7 text-accent" />
              </div>
              <h2 className="font-display text-lg font-bold mb-2">Tack!</h2>
              <p className="text-sm text-muted-foreground">Vi hör av oss inom 24 timmar.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="glass rounded-2xl p-7 space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5 block">Namn</label>
                  <Input placeholder="Anna Andersson" required className="bg-secondary/30 border-border text-sm" />
                </div>
                <div>
                  <label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5 block">Företag</label>
                  <Input placeholder="Ert företag" required className="bg-secondary/30 border-border text-sm" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5 block">E-post</label>
                <Input type="email" placeholder="anna@foretaget.se" required className="bg-secondary/30 border-border text-sm" />
              </div>
              <div>
                <label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5 block">Telefon (valfritt)</label>
                <Input type="tel" placeholder="070-123 45 67" className="bg-secondary/30 border-border text-sm" />
              </div>
              <div>
                <label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5 block">Berätta</label>
                <Textarea placeholder="Vilken bransch? Utmaningar? Antal tekniker?" rows={4} className="bg-secondary/30 border-border text-sm" />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider hover:bg-primary/80 transition-colors"
              >
                Skicka
              </button>
              <p className="text-[10px] text-muted-foreground/50 text-center">
                Vi delar aldrig din information.
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
