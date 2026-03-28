import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Mail, MapPin, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
      <div className="absolute inset-0 bg-grid-pattern opacity-15" />
      <div className="absolute top-20 right-20 w-[400px] h-[400px] rounded-full bg-primary/[0.03] blur-[120px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-28 md:py-36 grid md:grid-cols-2 gap-16 items-start">
        {/* Left */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-4 block">
            Kontakt
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold leading-[0.95] tracking-tight mb-6">
            <span className="text-gradient-ice">Boka en</span>
            <br />
            <span className="text-gradient-aurora">kostnadsfri demo</span>
          </h1>
          <p className="text-muted-foreground mb-10 leading-relaxed max-w-md">
            Vi visar hur Traivo kan effektivisera just er verksamhet. 
            Ingen bindningstid, inget krångel.
          </p>

          <div className="space-y-4 text-sm mb-12">
            {["30 minuters personlig demo", "Anpassad efter er bransch", "Ingen bindningstid"].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span className="text-foreground/80">{item}</span>
              </div>
            ))}
          </div>

          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-primary/60" />
              <span>hello@traivo.se</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-primary/60" />
              <span>Sverige</span>
            </div>
          </div>
        </motion.div>

        {/* Right — form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {submitted ? (
            <div className="glass rounded-2xl p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-accent" />
              </div>
              <h2 className="font-display text-xl font-bold mb-2">Tack!</h2>
              <p className="text-muted-foreground">Vi hör av oss inom 24 timmar.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2 block">
                    Namn
                  </label>
                  <Input
                    placeholder="Anna Andersson"
                    required
                    className="bg-secondary/50 border-border focus:border-primary/40"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2 block">
                    Företag
                  </label>
                  <Input
                    placeholder="Ert företag"
                    required
                    className="bg-secondary/50 border-border focus:border-primary/40"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2 block">
                  E-post
                </label>
                <Input
                  type="email"
                  placeholder="anna@foretaget.se"
                  required
                  className="bg-secondary/50 border-border focus:border-primary/40"
                />
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2 block">
                  Telefon (valfritt)
                </label>
                <Input
                  type="tel"
                  placeholder="070-123 45 67"
                  className="bg-secondary/50 border-border focus:border-primary/40"
                />
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2 block">
                  Berätta om er verksamhet
                </label>
                <Textarea
                  placeholder="Vilken bransch? Hur många tekniker? Vilka utmaningar?"
                  rows={4}
                  className="bg-secondary/50 border-border focus:border-primary/40"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full h-12 font-display font-semibold text-sm tracking-wide uppercase"
              >
                Boka demo <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <p className="text-[11px] text-muted-foreground text-center">
                Vi delar aldrig din information med tredje part.
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
