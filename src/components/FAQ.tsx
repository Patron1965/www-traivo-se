import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { ChevronDown } from "lucide-react";
import { useT } from "@/i18n/LanguageContext";

export interface FAQItem {
  q: { sv: string; en: string };
  a: { sv: string; en: string };
}

interface FAQProps {
  title?: { sv: string; en: string };
  intro?: { sv: string; en: string };
  items: FAQItem[];
}

const FAQ = ({ title, intro, items }: FAQProps) => {
  const t = useT();
  const [open, setOpen] = useState<number | null>(0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q.sv,
      acceptedAnswer: { "@type": "Answer", text: it.a.sv },
    })),
  };

  return (
    <section className="relative py-20 px-4 sm:px-6 border-t border-border bg-noise">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
      <div className="relative z-10 max-w-3xl mx-auto">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-gradient-ice mb-3 text-center">
          {t(title ?? { sv: "Vanliga frågor", en: "Frequently asked questions" })}
        </h2>
        {intro && (
          <p className="text-muted-foreground text-center mb-10 max-w-xl mx-auto">
            {t(intro)}
          </p>
        )}

        <div className="space-y-3">
          {items.map((it, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className="rounded-xl border border-border bg-card/40 backdrop-blur-sm overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-card/60 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-medium text-foreground">{t(it.q)}</span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 text-muted-foreground transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-base leading-relaxed text-foreground/85">
                    {t(it.a)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
