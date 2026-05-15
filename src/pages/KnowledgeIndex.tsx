import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";
import { useT } from "@/i18n/LanguageContext";
import SEO from "@/components/SEO";

export interface KnowledgeArticle {
  slug: string;
  title: { sv: string; en: string };
  excerpt: { sv: string; en: string };
  readTime: { sv: string; en: string };
}

export const articles: KnowledgeArticle[] = [
  {
    slug: "ruttoptimering-fordon",
    title: {
      sv: "Ruttoptimering i praktiken — så minskar du kötid och bränsleförbrukning",
      en: "Route optimization in practice — how to cut wait time and fuel use",
    },
    excerpt: {
      sv: "Riktig ruttoptimering räknar inte fågelvägen. Vi går igenom hur trafikdata, fordonstyp och tidsfönster påverkar dagens schema.",
      en: "Real route optimization doesn't measure as the crow flies. We walk through how traffic data, vehicle type and time windows shape the day's schedule.",
    },
    readTime: { sv: "6 min läsning", en: "6 min read" },
  },
  {
    slug: "digital-faltservice-guide",
    title: {
      sv: "Guide: Digitalisera fältservice utan att tappa teknikerna på vägen",
      en: "Guide: Digitalize field service without losing the technicians along the way",
    },
    excerpt: {
      sv: "Vad krävs för att gå från papperslappar till digitala protokoll? Vi summerar vad som faktiskt fungerar — och vad som får tekniker att sluta använda systemet.",
      en: "What does it take to go from paper notes to digital reports? We summarize what actually works — and what makes technicians stop using the system.",
    },
    readTime: { sv: "8 min läsning", en: "8 min read" },
  },
  {
    slug: "ai-schemalaggning-faltservice",
    title: {
      sv: "AI-schemaläggning för fältservice — vad är hype och vad är värde?",
      en: "AI scheduling for field service — what's hype and what's value?",
    },
    excerpt: {
      sv: "Inte all AI är användbar i fält. Vi reder ut var maskininlärning gör skillnad i schemaläggning — och var en enkel regel räcker.",
      en: "Not all AI is useful in the field. We sort out where machine learning makes a difference in scheduling — and where a simple rule is enough.",
    },
    readTime: { sv: "5 min läsning", en: "5 min read" },
  },
];

const KnowledgeIndex = () => {
  const t = useT();
  return (
    <>
      <SEO
        path="/kunskap"
        title={t({
          sv: "Kunskap — guider om ruttoptimering, fältservice och AI | Traivo",
          en: "Knowledge — guides on route optimization, field service and AI | Traivo",
        })}
        description={t({
          sv: "Praktiska guider om ruttoptimering, digital fältservice och AI-schemaläggning för verksamheter med många stopp per dag.",
          en: "Practical guides on route optimization, digital field service and AI scheduling for operations with many stops per day.",
        })}
      />

      <section className="relative pt-28 pb-12 px-4 sm:px-6 bg-noise overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-xs uppercase tracking-[0.25em] text-muted-foreground mb-6">
            <BookOpen className="w-3 h-3 text-primary" />
            {t({ sv: "Kunskap", en: "Knowledge" })}
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold leading-tight text-gradient-ice mb-5">
            {t({
              sv: "Vad vi har lärt oss av att bygga med kunder i fält",
              en: "What we've learned from building with customers in the field",
            })}
          </h1>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            {t({
              sv: "Korta, raka guider om ruttoptimering, digital fältservice och var AI faktiskt gör skillnad. Inga buzzwords, inga säljpitcher.",
              en: "Short, honest guides about route optimization, digital field service and where AI actually makes a difference. No buzzwords, no sales pitch.",
            })}
          </p>
        </div>
      </section>

      <section className="px-4 sm:px-6 py-16">
        <div className="max-w-4xl mx-auto grid gap-5">
          {articles.map((a, i) => (
            <motion.div
              key={a.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <Link
                to={`/kunskap/${a.slug}`}
                className="block rounded-xl border border-border bg-card/40 backdrop-blur-sm p-6 hover:border-primary/40 hover:bg-card/60 transition-all"
              >
                <p className="text-xs text-muted-foreground mb-2">{t(a.readTime)}</p>
                <h2 className="font-display text-xl md:text-2xl font-semibold text-foreground mb-2">
                  {t(a.title)}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {t(a.excerpt)}
                </p>
                <span className="inline-flex items-center gap-1.5 text-sm text-primary">
                  {t({ sv: "Läs mer", en: "Read more" })}
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
};

export default KnowledgeIndex;
