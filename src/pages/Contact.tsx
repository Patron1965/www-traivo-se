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
import { useT } from "@/i18n/LanguageContext";
import SEO from "@/components/SEO";

const Contact = () => {
  const t = useT();
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
        title: t({ sv: "Fyll i obligatoriska fält", en: "Please fill in required fields" }),
        description: t({ sv: "Namn, företag och e-post behövs.", en: "Name, company and email are required." }),
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
        title: t({ sv: "Något gick fel", en: "Something went wrong" }),
        description: t({ sv: "Försök igen om en stund eller mejla info@traivo.se.", en: "Please try again shortly or email info@traivo.se." }),
        variant: "destructive",
      });
      return;
    }

    setSubmitted(true);
    toast({
      title: t({ sv: "Tack!", en: "Thanks!" }),
      description: t({ sv: "Vi återkommer inom kort.", en: "We’ll get back to you shortly." }),
    });
  };

  return (
    <>
      <SEO
        path="/kontakt"
        title={t({ sv: "Kontakt – Boka demo av Traivo", en: "Contact – Book a Traivo demo" })}
        description={t({ sv: "Kontakta Traivo för en demo eller diskussion. Vi svarar inom en arbetsdag.", en: "Contact Traivo for a demo or conversation. We reply within one business day." })}
      />
      <section className="relative min-h-screen bg-noise">
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      <div className="absolute top-20 right-20 w-[min(300px,80vw)] h-[min(300px,80vw)] rounded-full bg-primary/[0.03] blur-[100px]" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-20 sm:py-28 grid md:grid-cols-2 gap-10 md:gap-16 items-start">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-primary mb-4 block">
            {t({ sv: "Kontakt", en: "Contact" })}
          </span>
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold leading-[1.05] tracking-tight mb-5">
            <span className="text-gradient-ice">
              {t({
                sv: "Har ni frågor om plattformen, vill se en demo eller bara prata fältservice?",
                en: "Have questions about the platform, want a demo, or just want to talk field service?",
              })}
            </span>
          </h1>
          <p className="text-sm text-muted-foreground mb-8 leading-relaxed max-w-sm">
            {t({ sv: "Fyll i formuläret så återkommer vi.", en: "Fill in the form and we’ll get back to you." })}
          </p>

          <div className="space-y-2.5 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-primary/50" />
              <a href="mailto:info@traivo.se" className="hover:text-primary hover:underline transition-colors">
                info@traivo.se
              </a>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-primary/50" />
              <span>{t({ sv: "Sverige", en: "Sweden" })}</span>
            </div>
          </div>
          <div className="mt-6">
            <Dialog>
              <DialogTrigger asChild>
                <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary/20 text-xs font-medium text-foreground/90 hover:border-primary/40 hover:bg-primary/[0.04] transition-all duration-300">
                  <Users className="w-3.5 h-3.5 text-primary/60" />
                  {t({ sv: "Vem är Traivo till för?", en: "Who is Traivo for?" })}
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle className="font-display text-xl font-bold">
                    {t({ sv: "Vem är Traivo till för?", en: "Who is Traivo for?" })}
                  </DialogTitle>
                </DialogHeader>
                <div className="text-sm text-muted-foreground leading-relaxed space-y-4 pt-2">
                  <p>{t({ sv: "Traivo är till för dig som driver serviceverksamhet där tekniker åker ut till kund – VVS, el, kyla, hissar, fastighet, IT, säkerhet, vitvaror, maskinservice eller sophantering.", en: "Traivo is for you if you run a service operation where technicians go out to customers — plumbing, electrical, cooling, elevators, property, IT, security, appliances, machinery or waste." })}</p>
                  <p>{t({ sv: "Om dina tekniker kör rutter och du schemalägger uppdrag varje dag, är Traivo byggt för dig.", en: "If your technicians drive routes and you schedule jobs every day, Traivo is built for you." })}</p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
          {submitted ? (
            <div className="glass rounded-2xl p-10 text-center">
              <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="w-7 h-7 text-accent" />
              </div>
              <h2 className="font-display text-lg font-bold mb-2">{t({ sv: "Tack!", en: "Thanks!" })}</h2>
              <p className="text-sm text-muted-foreground">
                {t({ sv: "Vi hör av oss inom 24 timmar.", en: "We’ll be in touch within 24 hours." })}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="glass rounded-2xl p-5 sm:p-7 space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="name" className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5 block">
                    {t({ sv: "Namn", en: "Name" })}
                  </label>
                  <Input id="name" name="name" placeholder={t({ sv: "Anna Andersson", en: "Anna Andersson" })} required minLength={2} className="bg-secondary/30 border-border text-base md:text-sm" />
                </div>
                <div>
                  <label htmlFor="company" className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5 block">
                    {t({ sv: "Företag", en: "Company" })}
                  </label>
                  <Input id="company" name="company" placeholder={t({ sv: "Ert företag", en: "Your company" })} required minLength={2} className="bg-secondary/30 border-border text-base md:text-sm" />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5 block">
                  {t({ sv: "E-post", en: "Email" })}
                </label>
                <Input id="email" name="email" type="email" placeholder="anna@foretaget.se" required className="bg-secondary/30 border-border text-base md:text-sm" />
              </div>
              <div>
                <label htmlFor="phone" className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5 block">
                  {t({ sv: "Telefon (valfritt)", en: "Phone (optional)" })}
                </label>
                <Input id="phone" name="phone" type="tel" placeholder="070-123 45 67" className="bg-secondary/30 border-border text-base md:text-sm" />
              </div>
              <div>
                <label htmlFor="message" className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5 block">
                  {t({ sv: "Berätta", en: "Tell us more" })}
                </label>
                <Textarea id="message" name="message" placeholder={t({ sv: "Vilken bransch? Utmaningar? Antal tekniker?", en: "Which industry? Challenges? Number of technicians?" })} rows={4} maxLength={5000} className="bg-secondary/30 border-border text-base md:text-sm" />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider hover:bg-primary/80 transition-colors disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    {t({ sv: "Skickar...", en: "Sending..." })}
                  </>
                ) : (
                  t({ sv: "Skicka", en: "Send" })
                )}
              </button>
              <p className="text-[10px] text-muted-foreground/50 text-center">
                {t({ sv: "Vi delar aldrig din information.", en: "We never share your information." })}
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
    </>
  );
};

export default Contact;
