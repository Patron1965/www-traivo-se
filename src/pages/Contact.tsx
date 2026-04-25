import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Mail, MapPin, Users, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      company: String(formData.get("company") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim() || null,
      message: String(formData.get("message") ?? "").trim() || null,
    };

    if (!payload.name || !payload.company || !payload.email) {
      toast({
        title: "Fyll i obligatoriska fält",
        description: "Namn, företag och e-post behövs.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("contact_submissions").insert(payload);
    setSubmitting(false);

    if (error) {
      console.error("Contact submission failed:", error);
      toast({
        title: "Något gick fel",
        description: "Försök igen om en stund eller mejla info@traivo.se.",
        variant: "destructive",
      });
      return;
    }

    setSubmitted(true);
    toast({ title: "Tack!", description: "Vi återkommer inom kort." });
  };

  return (
    <section className="relative min-h-screen bg-noise">
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      <div className="absolute top-20 right-20 w-[300px] h-[300px] rounded-full bg-primary/[0.03] blur-[100px]" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-20 sm:py-28 grid md:grid-cols-2 gap-10 md:gap-16 items-start">
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
              <form onSubmit={handleSubmit} noValidate className="glass rounded-2xl p-5 sm:p-7 space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="name" className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5 block">Namn</label>
                  <Input id="name" name="name" placeholder="Anna Andersson" required minLength={2} className="bg-secondary/30 border-border text-base md:text-sm" />
                </div>
                <div>
                  <label htmlFor="company" className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5 block">Företag</label>
                  <Input id="company" name="company" placeholder="Ert företag" required minLength={2} className="bg-secondary/30 border-border text-base md:text-sm" />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5 block">E-post</label>
                <Input id="email" name="email" type="email" placeholder="anna@foretaget.se" required className="bg-secondary/30 border-border text-base md:text-sm" />
              </div>
              <div>
                <label htmlFor="phone" className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5 block">Telefon (valfritt)</label>
                <Input id="phone" name="phone" type="tel" placeholder="070-123 45 67" className="bg-secondary/30 border-border text-base md:text-sm" />
              </div>
              <div>
                <label htmlFor="message" className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5 block">Berätta</label>
                <Textarea id="message" name="message" placeholder="Vilken bransch? Utmaningar? Antal tekniker?" rows={4} maxLength={5000} className="bg-secondary/30 border-border text-base md:text-sm" />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider hover:bg-primary/80 transition-colors disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Skickar...
                  </>
                ) : (
                  "Skicka"
                )}
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
