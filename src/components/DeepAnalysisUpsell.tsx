import { motion } from "framer-motion";
import { FileText, Sparkles, ArrowRight, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useT } from "@/i18n/LanguageContext";

interface DeepAnalysisUpsellProps {
  businessDescription: string;
  quickResponse: string;
}

const DeepAnalysisUpsell = ({ businessDescription, quickResponse }: DeepAnalysisUpsellProps) => {
  const t = useT();
  const handleClick = () => {
    try {
      sessionStorage.setItem("deepAnalysisPayload", JSON.stringify({ businessDescription, quickResponse }));
    } catch { /* ignore */ }
  };

  const items = [
    t({ sv: "Risker & flaskhalsar", en: "Risks & bottlenecks" }),
    t({ sv: "Möjligheter med värde", en: "Opportunities with value" }),
    t({ sv: "Konkret ROI-uppskattning", en: "Concrete ROI estimate" }),
    t({ sv: "Prioriterad åtgärdsplan", en: "Prioritized action plan" }),
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }} className="mt-4">
      <div className="relative rounded-2xl overflow-hidden border-2 border-primary/30 bg-gradient-to-br from-primary/[0.08] via-card to-card p-5 md:p-6 shadow-[0_0_40px_-12px_hsl(var(--primary)/0.4)]">
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-primary" strokeWidth={2.5} />
            <span className="text-[10px] uppercase tracking-[0.25em] text-primary font-bold">
              {t({ sv: "Premium - Djupanalys", en: "Premium — Deep analysis" })}
            </span>
          </div>

          <h3 className="font-display text-xl md:text-2xl font-bold leading-tight mb-2">
            {t({ sv: "Vill ni gå djupare?", en: "Want to go deeper?" })}
          </h3>

          <p className="text-sm text-muted-foreground leading-relaxed mb-5">
            {t({
              sv: "Få en utförlig ",
              en: "Get a detailed ",
            })}
            <span className="text-foreground font-semibold">
              {t({ sv: "3-5 sidors djupanalys", en: "3–5 page deep analysis" })}
            </span>
            {t({
              sv: " av er verksamhet. Konkreta risker, möjligheter, ROI-beräkning, prioriterad åtgärdsplan på 30/60/90 dagar och vilka Traivo-moduler som löser exakt vad. Levereras direkt och som nedladdningsbar PDF.",
              en: " of your business. Concrete risks, opportunities, ROI calculation, a prioritized 30/60/90-day action plan and which Traivo modules solve exactly what. Delivered instantly and as a downloadable PDF.",
            })}
          </p>

          <div className="grid grid-cols-2 gap-2 mb-5">
            {items.map((item) => (
              <div key={item} className="flex items-center gap-2 text-xs text-foreground/80">
                <div className="w-1 h-1 rounded-full bg-primary" />
                {item}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-border/40">
            <div>
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="text-3xl font-bold text-foreground">{t({ sv: "399 kr", en: "399 SEK" })}</span>
                <span className="text-xs text-muted-foreground">
                  {t({ sv: "exkl. moms · engångsbetalning", en: "ex. VAT · one-time payment" })}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <Shield className="w-3 h-3 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">
                  {t({ sv: "Säker betalning via Stripe", en: "Secure payment via Stripe" })}
                </span>
              </div>
            </div>

            <Link
              to="/hjarna/djupanalys"
              onClick={handleClick}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_4px_14px_hsl(var(--primary)/0.4)] outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <FileText className="w-4 h-4" strokeWidth={2.5} />
              {t({ sv: "Beställ djupanalys", en: "Order deep analysis" })}
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DeepAnalysisUpsell;
