import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Mail, Phone, MapPin } from "lucide-react";
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
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16">
        {/* Left — info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-extrabold mb-4">
            Boka en <span className="text-gradient-ocean">kostnadsfri demo</span>
          </h1>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Vi visar hur Traivo kan effektivisera just er verksamhet. Ingen bindningstid, 
            inget krångel — bara en ärlig genomgång av plattformen.
          </p>

          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
              <span>30 minuters personlig demo</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
              <span>Anpassad efter er bransch</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
              <span>Ingen bindningstid</span>
            </div>
          </div>

          <div className="mt-12 space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>hello@traivo.se</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
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
            <div className="rounded-2xl border border-border bg-card p-12 text-center">
              <CheckCircle2 className="w-12 h-12 text-accent mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Tack för din intresseanmälan!</h2>
              <p className="text-muted-foreground">Vi hör av oss inom 24 timmar.</p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-border bg-card p-8 space-y-5"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Namn</label>
                  <Input placeholder="Anna Andersson" required />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Företag</label>
                  <Input placeholder="Ert företag" required />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">E-post</label>
                <Input type="email" placeholder="anna@foretaget.se" required />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Telefon (valfritt)</label>
                <Input type="tel" placeholder="070-123 45 67" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Berätta om er verksamhet</label>
                <Textarea
                  placeholder="Vilken bransch? Hur många tekniker? Vilka utmaningar har ni idag?"
                  rows={4}
                />
              </div>
              <Button type="submit" size="lg" className="w-full font-semibold">
                Boka demo
              </Button>
              <p className="text-xs text-muted-foreground text-center">
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
