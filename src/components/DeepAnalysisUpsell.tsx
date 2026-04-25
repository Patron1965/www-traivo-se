import { motion } from "framer-motion";
import { FileText, Sparkles, ArrowRight, Shield } from "lucide-react";
import { Link } from "react-router-dom";

interface DeepAnalysisUpsellProps {
  businessDescription: string;
  quickResponse: string;
}

const DeepAnalysisUpsell = ({ businessDescription, quickResponse }: DeepAnalysisUpsellProps) => {
  // Encode payload via sessionStorage so the checkout page picks it up
  const handleClick = () => {
    try {
      sessionStorage.setItem(
        "deepAnalysisPayload",
        JSON.stringify({ businessDescription, quickResponse })
      );
    } catch {
      // ignore storage errors
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="mt-4"
    >
      <div className="relative rounded-2xl overflow-hidden border-2 border-primary/30 bg-gradient-to-br from-primary/[0.08] via-card to-card p-5 md:p-6 shadow-[0_0_40px_-12px_hsl(var(--primary)/0.4)]">
        {/* Glow accent */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

        <div className="relative">
          {/* Label */}
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-primary" strokeWidth={2.5} />
            <span className="text-[10px] uppercase tracking-[0.25em] text-primary font-bold">
              Premium - Djupanalys
            </span>
          </div>

          <h3 className="font-display text-xl md:text-2xl font-bold leading-tight mb-2">
            Vill ni gå djupare?
          </h3>

          <p className="text-sm text-muted-foreground leading-relaxed mb-5">
            Få en utförlig <span className="text-foreground font-semibold">3-5 sidors djupanalys</span> av er verksamhet.
            Konkreta risker, möjligheter, ROI-beräkning, prioriterad åtgärdsplan på 30/60/90 dagar
            och vilka Traivo-moduler som löser exakt vad. Levereras direkt och som nedladdningsbar PDF.
          </p>

          {/* What you get */}
          <div className="grid grid-cols-2 gap-2 mb-5">
            {[
              "Risker & flaskhalsar",
              "Möjligheter med värde",
              "Konkret ROI-uppskattning",
              "Prioriterad åtgärdsplan",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-xs text-foreground/80">
                <div className="w-1 h-1 rounded-full bg-primary" />
                {item}
              </div>
            ))}
          </div>

          {/* Price + CTA */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-border/40">
            <div>
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="text-3xl font-bold text-foreground">399 kr</span>
                <span className="text-xs text-muted-foreground">exkl. moms · engångsbetalning</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <Shield className="w-3 h-3 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">Säker betalning via Stripe</span>
              </div>
            </div>

            <Link
              to="/hjarna/djupanalys"
              onClick={handleClick}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_4px_14px_hsl(var(--primary)/0.4)] outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <FileText className="w-4 h-4" strokeWidth={2.5} />
              Beställ djupanalys
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DeepAnalysisUpsell;
