import { useEffect, useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { ArrowLeft, FileText, Shield, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import { supabase } from "@/integrations/supabase/client";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";

interface FormData {
  email: string;
  company: string;
  contactName: string;
  orgNumber: string;
  websiteUrl: string;
  businessDescription: string;
  quickResponse: string;
}

const normalizeUrl = (raw: string): string => {
  const v = raw.trim();
  if (!v) return v;
  if (/^https?:\/\//i.test(v)) return v;
  return `https://${v}`;
};

const DeepAnalysisCheckout = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"form" | "checkout">("form");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<FormData>({
    email: "",
    company: "",
    contactName: "",
    orgNumber: "",
    websiteUrl: "",
    businessDescription: "",
    quickResponse: "",
  });

  // Pick up payload from /hjarna
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("deepAnalysisPayload");
      if (raw) {
        const data = JSON.parse(raw);
        setForm((f) => ({
          ...f,
          businessDescription: data.businessDescription || "",
          quickResponse: data.quickResponse || "",
        }));
      }
    } catch {
      // ignore
    }
  }, []);

  const update = <K extends keyof FormData>(key: K, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const validate = (): string | null => {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim())) return "Ogiltig e-postadress";
    if (form.company.trim().length < 2) return "Ange företagsnamn";
    if (form.contactName.trim().length < 2) return "Ange ditt namn";
    const url = normalizeUrl(form.websiteUrl);
    if (!url || !/^https?:\/\/[^\s.]+\.[^\s]+/i.test(url)) {
      return "Ange en giltig webbplats (t.ex. https://erforetag.se)";
    }
    if (form.businessDescription.trim().length < 30) {
      return "Verksamhetsbeskrivningen behöver vara minst 30 tecken";
    }
    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      const returnUrl = `${window.location.origin}/hjarna/djupanalys/tack`;
      const { data, error: invokeError } = await supabase.functions.invoke(
        "create-deep-analysis-checkout",
        {
          body: {
            email: form.email.trim(),
            company: form.company.trim(),
            contactName: form.contactName.trim(),
            orgNumber: form.orgNumber.trim() || undefined,
            websiteUrl: normalizeUrl(form.websiteUrl),
            businessDescription: form.businessDescription.trim(),
            quickResponse: form.quickResponse || undefined,
            returnUrl,
            environment: getStripeEnvironment(),
          },
        }
      );

      if (invokeError) {
        throw new Error(invokeError.message || "Kunde inte starta checkout");
      }
      if (!data?.clientSecret) {
        throw new Error(data?.error || "Inget client secret från servern");
      }

      setClientSecret(data.clientSecret);
      setStep("checkout");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ett okänt fel inträffade");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PaymentTestModeBanner />
      <section className="relative min-h-screen pt-28 pb-24 px-4 sm:px-6 bg-noise">
        <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-primary/[0.05] blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Tillbaka
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-subtle mb-4">
                <FileText className="w-3 h-3 text-primary" strokeWidth={2.5} />
                <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-medium">
                  Traivo Djupanalys · 399 kr
                </span>
              </div>

              <h1 className="font-display text-3xl md:text-4xl font-bold leading-tight mb-3">
                {step === "form" ? "Beställ er djupanalys" : "Slutför betalning"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {step === "form"
                  ? "Fyll i kontaktuppgifter så genererar vi en utförlig 3-5 sidors analys av er verksamhet direkt efter betalning."
                  : "Genomför betalningen säkert nedan. Rapporten genereras direkt och visas på nästa sida."}
              </p>
            </div>

            {step === "form" && (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Trust row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-4 rounded-xl glass-subtle">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span className="text-[11px] text-foreground/80">3-5 sidor PDF</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span className="text-[11px] text-foreground/80">Direkt leverans</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span className="text-[11px] text-foreground/80">Säker betalning</span>
                  </div>
                </div>

                {/* Contact */}
                <div className="space-y-4 p-5 rounded-xl glass">
                  <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    Leverans & faktura
                  </h3>

                  <div>
                    <label className="block text-xs font-medium text-foreground/80 mb-1.5">
                      E-post <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder="namn@foretag.se"
                      className="w-full px-3 py-2.5 rounded-lg bg-background border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 text-base md:text-sm transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-foreground/80 mb-1.5">
                        Företag <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={form.company}
                        onChange={(e) => update("company", e.target.value)}
                        placeholder="Acme AB"
                        className="w-full px-3 py-2.5 rounded-lg bg-background border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 text-base md:text-sm transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-foreground/80 mb-1.5">
                        Ditt namn <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={form.contactName}
                        onChange={(e) => update("contactName", e.target.value)}
                        placeholder="För- och efternamn"
                        className="w-full px-3 py-2.5 rounded-lg bg-background border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 text-base md:text-sm transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground/80 mb-1.5">
                      Webbplats <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="url"
                      required
                      value={form.websiteUrl}
                      onChange={(e) => update("websiteUrl", e.target.value)}
                      placeholder="https://erforetag.se"
                      className="w-full px-3 py-2.5 rounded-lg bg-background border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 text-base md:text-sm transition-colors"
                    />
                    <p className="mt-1.5 text-[10px] text-muted-foreground">
                      Vår AI läser av er sajt för att göra analysen mer träffsäker.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground/80 mb-1.5">
                      Org.nr <span className="text-muted-foreground font-normal">(valfritt - för fakturaspecifikation)</span>
                    </label>
                    <input
                      type="text"
                      value={form.orgNumber}
                      onChange={(e) => update("orgNumber", e.target.value)}
                      placeholder="556677-8899"
                      className="w-full px-3 py-2.5 rounded-lg bg-background border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 text-base md:text-sm transition-colors"
                    />
                  </div>
                </div>

                {/* Business description */}
                <div className="space-y-4 p-5 rounded-xl glass">
                  <div>
                    <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">
                      Verksamhetsbeskrivning
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                      Detta är vad vår AI analyserar. Komplettera gärna om något saknas.
                    </p>
                  </div>

                  <textarea
                    required
                    value={form.businessDescription}
                    onChange={(e) => update("businessDescription", e.target.value)}
                    placeholder="Beskriv er verksamhet: antal tekniker/bilar, geografi, kundtyp, nuvarande system, största utmaningarna..."
                    rows={6}
                    maxLength={5000}
                    className="w-full px-3 py-2.5 rounded-lg bg-background border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 text-base md:text-sm leading-relaxed resize-none transition-colors"
                  />
                  <div className="text-[10px] text-muted-foreground text-right">
                    {form.businessDescription.length}/5000
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-sm text-destructive">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Total + CTA */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-xl glass border border-primary/20">
                  <div>
                    <div className="text-xs text-muted-foreground">Totalt att betala</div>
                    <div className="text-2xl font-bold">399 kr <span className="text-xs font-normal text-muted-foreground">inkl. moms</span></div>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_14px_hsl(var(--primary)/0.4)] transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Förbereder betalning...
                      </>
                    ) : (
                      <>
                        Gå vidare till betalning
                        <ArrowLeft className="w-4 h-4 rotate-180" />
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[10px] text-muted-foreground text-center">
                  Genom att fortsätta godkänner du att vi behandlar dina kontaktuppgifter för att leverera analysen och kvitto.
                </p>
              </form>
            )}

            {step === "checkout" && clientSecret && (
              <div className="rounded-xl overflow-hidden border border-border bg-card">
                <EmbeddedCheckoutProvider
                  stripe={getStripe()}
                  options={{ fetchClientSecret: async () => clientSecret }}
                >
                  <EmbeddedCheckout />
                </EmbeddedCheckoutProvider>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default DeepAnalysisCheckout;
