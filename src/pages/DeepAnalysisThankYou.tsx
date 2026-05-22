import { useEffect, useState, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  CheckCircle2,
  Loader2,
  Download,
  AlertCircle,
  FileText,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useT } from "@/i18n/LanguageContext";
import SEO from "@/components/SEO";

interface OrderStatus {
  orderId: string;
  company: string;
  contactName: string;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  reportStatus: "pending" | "generating" | "ready" | "failed";
  reportContent?: string;
  generationError?: string;
}

const POLL_INTERVAL = 3500;
const MAX_POLLS = 60;

const DeepAnalysisThankYou = () => {
  const t = useT();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = useState<OrderStatus | null>(null);
  const [error, setError] = useState("");
  const [pollCount, setPollCount] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sessionId) {
      setError(t({ sv: "Saknar session-id i URL", en: "Missing session id in URL" }));
      return;
    }

    let cancelled = false;
    let timeoutId: number | undefined;

    const poll = async () => {
      if (cancelled) return;

      try {
        const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-deep-analysis?session_id=${encodeURIComponent(sessionId)}`;
        const resp = await fetch(url, {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
        });
        const data = await resp.json();

        if (cancelled) return;

        if (!resp.ok) {
          setError(data.error || t({ sv: "Kunde inte hämta status", en: "Could not fetch status" }));
          return;
        }

        setStatus(data);
        setPollCount((c) => c + 1);

        const done = data.reportStatus === "ready" || data.reportStatus === "failed";
        if (!done && pollCount < MAX_POLLS) {
          timeoutId = window.setTimeout(poll, POLL_INTERVAL);
        } else if (!done) {
          setError(t({
            sv: "Det tog för lång tid att generera rapporten. Vi har dina uppgifter och kontaktar dig.",
            en: "It took too long to generate the report. We have your details and will contact you.",
          }));
        }
      } catch (e) {
        if (cancelled) return;
        timeoutId = window.setTimeout(poll, POLL_INTERVAL);
      }
    };

    poll();

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  const handleDownloadPdf = async () => {
    if (!reportRef.current || !status?.reportContent) return;
    setIsExporting(true);

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const availableWidth = pageWidth - margin * 2;
      const imgWidth = availableWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = margin;

      pdf.addImage(imgData, "JPEG", margin, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - margin * 2;

      while (heightLeft > 0) {
        position = margin - (imgHeight - heightLeft);
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", margin, position, imgWidth, imgHeight);
        heightLeft -= pageHeight - margin * 2;
      }

      const safeCompany = status.company.replace(/[^a-z0-9åäö-]+/gi, "_").toLowerCase();
      pdf.save(`Traivo-${t({ sv: "Djupanalys", en: "Deep-Analysis" })}-${safeCompany}.pdf`);
    } catch (e) {
      console.error("PDF export failed:", e);
      setError(t({
        sv: "Kunde inte skapa PDF. Försök igen eller ta en skärmdump.",
        en: "Could not create PDF. Try again or take a screenshot.",
      }));
    } finally {
      setIsExporting(false);
    }
  };

  const isWaiting = !status || status.reportStatus === "pending" || status.reportStatus === "generating";

  return (
    <>
    <SEO
      path="/hjarna/djupanalys/tack"
      title="Tack — din djupanalys förbereds | Traivo"
      description="Tack för din beställning. Din AI-djupanalys genereras nu och blir tillgänglig för nedladdning inom kort."
      noindex
    />
    <section className="relative min-h-screen pt-28 pb-24 px-4 sm:px-6 bg-noise">
      <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-primary/[0.05] blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/15 border border-primary/30 mb-4">
            <CheckCircle2 className="w-8 h-8 text-primary" strokeWidth={2.5} />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            {t({ sv: "Tack för din beställning!", en: "Thanks for your order!" })}
          </h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            {t({ sv: "Betalningen är genomförd. ", en: "Payment is complete. " })}
            {isWaiting
              ? t({
                  sv: "Vår AI analyserar nu er verksamhet - detta tar 30-90 sekunder.",
                  en: "Our AI is now analyzing your operation – this takes 30–90 seconds.",
                })
              : t({
                  sv: "Här är er djupanalys - ladda ner som PDF nedan.",
                  en: "Here is your deep analysis – download it as PDF below.",
                })}
          </p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/30 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="text-sm text-destructive">{error}</div>
          </motion.div>
        )}

        {isWaiting && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl glass p-8 md:p-10 text-center"
          >
            <div className="flex justify-center mb-5">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl animate-pulse" />
                <Loader2 className="relative w-12 h-12 text-primary animate-spin" />
              </div>
            </div>
            <h2 className="font-display text-xl font-bold mb-2">
              {t({ sv: "Analyserar er verksamhet...", en: "Analyzing your operation…" })}
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              {t({
                sv: "Vår AI går igenom er beskrivning, identifierar risker och möjligheter, räknar ut ROI och skriver en prioriterad åtgärdsplan. Stanna kvar på sidan - den uppdateras automatiskt.",
                en: "Our AI reviews your description, identifies risks and opportunities, calculates ROI and writes a prioritized action plan. Stay on the page – it updates automatically.",
              })}
            </p>
            <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
              <Sparkles className="w-3 h-3 text-primary animate-pulse" />
              <span>Powered by Lovable AI · Gemini 2.5 Pro</span>
            </div>
          </motion.div>
        )}

        {status?.reportStatus === "ready" && status.reportContent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-6 p-4 rounded-xl glass border border-primary/20">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-sm font-semibold">
                    {t({ sv: "Er djupanalys är klar", en: "Your deep analysis is ready" })}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {t({
                      sv: "Spara PDF:en lokalt - vi sparar inte rapporten åt er.",
                      en: "Save the PDF locally – we don't keep the report for you.",
                    })}
                  </div>
                </div>
              </div>
              <button
                onClick={handleDownloadPdf}
                disabled={isExporting}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 disabled:opacity-50 transition-all shadow-[0_4px_14px_hsl(var(--primary)/0.4)] outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t({ sv: "Skapar PDF...", en: "Creating PDF…" })}
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    {t({ sv: "Ladda ner PDF", en: "Download PDF" })}
                  </>
                )}
              </button>
            </div>

            <div className="rounded-2xl bg-white text-gray-900 shadow-2xl overflow-hidden">
              <div ref={reportRef} className="p-8 md:p-12">
                <div className="prose prose-sm md:prose-base max-w-none prose-headings:text-gray-900 prose-h1:text-3xl prose-h1:font-bold prose-h2:text-xl prose-h2:font-bold prose-h2:mt-8 prose-h2:pb-2 prose-h2:border-b prose-h2:border-gray-200 prose-h3:text-base prose-h3:font-bold prose-strong:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-em:text-gray-500">
                  <ReactMarkdown>{status.reportContent}</ReactMarkdown>
                </div>
              </div>
            </div>

            <div className="mt-8 p-5 rounded-xl glass">
              <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                {t({ sv: "Nästa steg", en: "Next step" })}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                {t({
                  sv: "Vill ni gå vidare? Boka en demo så går vi igenom analysen tillsammans och visar systemet i praktiken.",
                  en: "Want to go further? Book a demo and we'll walk through the analysis together and show the system in practice.",
                })}
              </p>
              <Link
                to="/kontakt"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
              >
                {t({ sv: "Boka demo", en: "Book a demo" })}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        )}

        {status?.reportStatus === "failed" && (
          <div className="p-6 rounded-2xl glass border border-destructive/30">
            <h2 className="font-display text-lg font-bold mb-2 text-destructive">
              {t({ sv: "Något gick fel vid genereringen", en: "Something went wrong during generation" })}
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              {t({
                sv: "Din betalning gick igenom men vi kunde inte färdigställa rapporten. Vi har fått en notis och kontaktar dig på ",
                en: "Your payment went through but we couldn't complete the report. We've been notified and will contact ",
              })}
              <strong className="text-foreground">{status.contactName}</strong>{" "}
              {t({ sv: "inom kort.", en: "shortly." })}
            </p>
            <Link
              to="/kontakt"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              {t({ sv: "Eller hör av dig direkt →", en: "Or reach out directly →" })}
            </Link>
          </div>
        )}
      </div>
    </section>
    </>
  );
};

export default DeepAnalysisThankYou;
