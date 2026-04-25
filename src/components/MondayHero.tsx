import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Brain, Lock } from "lucide-react";
import MondaySplitVisual from "./MondaySplitVisual";

/**
 * Hero — "Måndag 06:32"
 * Inga AI-buzzwords. Inga "next-gen" eller "AI-driven".
 * Visar smärtan vs lugnet, sen en lugn primär CTA + en sekundär (Hjärnan).
 */
const MondayHero = () => {
  return (
    <section className="relative overflow-hidden bg-noise px-4 sm:px-6 pt-24 pb-16 md:pt-32 md:pb-20">
      {/* Subtila bakgrundsljus */}
      <div className="absolute top-0 right-0 w-[min(500px,90vw)] h-[min(500px,90vw)] rounded-full bg-primary/[0.03] blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[min(300px,80vw)] h-[min(300px,80vw)] rounded-full bg-accent/[0.03] blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-3 mb-6"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-slow" />
          <span className="font-medium uppercase tracking-[0.25em] text-muted-foreground text-xs sm:text-sm">
            Plattform för fältservice · Norden
          </span>
        </motion.div>

        {/* Rubrik */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight text-center mb-5 max-w-4xl mx-auto"
        >
          <span className="text-gradient-ice">Så här kan måndag morgon</span>
          <br />
          <span className="text-gradient-ice">kännas istället.</span>
        </motion.h1>

        {/* Underrubrik */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-xl mx-auto text-center mb-10 md:mb-12"
        >
          Två sjukanmälda. En akutläcka. Kunden ringer för andra gången.
          <br className="hidden sm:block" />
          <span className="text-foreground/70">
            Det går att börja måndagen utan att redan vara efter.
          </span>
        </motion.p>

        {/* Split-visual */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-4xl mx-auto mb-10 md:mb-12 relative pt-3"
        >
          <MondaySplitVisual />
        </motion.div>

        {/* Primär CTA-rad */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col items-center gap-5"
        >
          <Link
            to="/kontakt"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm sm:text-base shadow-[0_4px_20px_hsl(var(--primary)/0.35)] hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.99] transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Boka 20 min — vi visar er måndag
            <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
          </Link>

          {/* Sekundär: Hjärnan — diskret, för den som hellre testar själv först */}
          <Link
            id="ai-chat"
            to="/hjarna#brain-input"
            className="group inline-flex items-center gap-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Brain className="w-3.5 h-3.5 text-primary/70 group-hover:text-primary transition-colors" strokeWidth={2.5} />
            <span>
              Vill du hellre prova själv först?{" "}
              <span className="underline underline-offset-4 decoration-dotted decoration-muted-foreground/40 group-hover:decoration-primary/60">
                Beskriv din verksamhet anonymt
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-muted-foreground/70">
            <Lock className="w-3 h-3" />
            <span>Inget loggas · Inga säljsamtal · Helt anonymt</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MondayHero;
