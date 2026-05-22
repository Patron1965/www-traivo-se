import { useEffect, useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { ArrowLeft, FileText, Shield, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import { supabase } from "@/integrations/supabase/client";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { useT, useLang } from "@/i18n/LanguageContext";
import SEO from "@/components/SEO";

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
  const t = useT();
  const { lang } = useLang();
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
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim()))
      return t({ sv: "Ogiltig e-postadress", en: "Invalid email address" });
    if (form.company.trim().length < 2)
      return t({ sv: "Ange företagsnamn", en: "Enter company name" });
    if (form.contactName.trim().length < 2)
      return t({ sv: "Ange ditt namn", en: "Enter your name" });
    const url = normalizeUrl(form.websiteUrl);
    if (!url || !/^https?:\/\/[^\s.]+\.[^\s]+/i.test(url)) {
      return t({
        sv: "Ange en giltig webbplats (t.ex. https://erforetag.se)",
        en: "Enter a valid website (e.g. https://yourcompany.com)",
      });
    }
    if (form.businessDescription.trim().length < 30) {
      return t({
        sv: "Verksamhetsbeskrivningen behöver vara minst 30 tecken",
        en: "The business description must be at least 30 characters",
      });
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
            language: lang,
          },
        }
      );

      if (invokeError) {
        throw new Error(invokeError.message || t({ sv: "Kunde inte starta checkout", en: "Could not start checkout" }));
      }
      if (!data?.clientSecret) {
        throw new Error(data?.error || t({ sv: "Inget client secret från servern", en: "No client secret from the server" }));
      }

      setClientSecret(data.clientSecret);
      setStep("checkout");
    } catch (e) {
      setError(e instanceof Error ? e.message : t({ sv: "Ett okänt fel inträffade", en: "An unknown error occurred" }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        path="/hjarna/djupanalys"
        title="Djupanalys — beställ AI-rapport | Traivo"
        description="Beställ en skräddarsydd AI-djupanalys av din fältserviceverksamhet. Konkreta insikter om rutter, schemaläggning och effektivitet."
        noindex
      />
      <PaymentTestModeBanner />
      <section className="relative min-h-screen pt-28 pb-24 px-4 sm:px-6 bg-noise">
        <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[min(500px,90vw)] h-[min(500px,90vw)] rounded-full bg-primary/[0.05] blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {t({ sv: "Tillbaka", en: "Back" })}
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
                  {t({ sv: "Traivo Djupanalys · 399 kr", en: "Traivo Deep Analysis · 399 SEK" })}
                </span>
              </div>

              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-3">
                {step === "form"
                  ? t({ sv: "Beställ er djupanalys", en: "Order your deep analysis" })
                  : t({ sv: "Slutför betalning", en: "Complete payment" })}
              </h1>
              <p className="text-sm text-muted-foreground">
                {step === "form"
                  ? t({
                      sv: "Fyll i kontaktuppgifter så genererar vi en utförlig 3-5 sidors analys av er verksamhet direkt efter betalning.",
                      en: "Fill in your contact details and we'll generate a thorough 3–5 page analysis of your operation right after payment.",
                    })
                  : t({
                      sv: "Genomför betalningen säkert nedan. Rapporten genereras direkt och visas på nästa sida.",
                      en: "Complete the payment securely below. The report is generated immediately and shown on the next page.",
                    })}
              </p>
            </div>

            {step === "form" && (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-4 rounded-xl glass-subtle">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span className="text-[11px] text-foreground/80">
                      {t({ sv: "3-5 sidor PDF", en: "3–5 page PDF" })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span className="text-[11px] text-foreground/80">
                      {t({ sv: "Direkt leverans", en: "Instant delivery" })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span className="text-[11px] text-foreground/80">
                      {t({ sv: "Säker betalning", en: "Secure payment" })}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 p-5 rounded-xl glass">
                  <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    {t({ sv: "Leverans & faktura", en: "Delivery & invoice" })}
                  </h3>

                  <div>
                    <label className="block text-xs font-medium text-foreground/80 mb-1.5">
                      {t({ sv: "E-post", en: "Email" })} <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder={t({ sv: "namn@foretag.se", en: "name@company.com" })}
                      className="w-full px-3 py-2.5 rounded-lg bg-background border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 text-base md:text-sm transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-foreground/80 mb-1.5">
                        {t({ sv: "Företag", en: "Company" })} <span className="text-destructive">*</span>
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
                        {t({ sv: "Ditt namn", en: "Your name" })} <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={form.contactName}
                        onChange={(e) => update("contactName", e.target.value)}
                        placeholder={t({ sv: "För- och efternamn", en: "First and last name" })}
                        className="w-full px-3 py-2.5 rounded-lg bg-background border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 text-base md:text-sm transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground/80 mb-1.5">
                      {t({ sv: "Webbplats", en: "Website" })} <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="url"
                      required
                      value={form.websiteUrl}
                      onChange={(e) => update("websiteUrl", e.target.value)}
                      placeholder={t({ sv: "https://erforetag.se", en: "https://yourcompany.com" })}
                      className="w-full px-3 py-2.5 rounded-lg bg-background border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 text-base md:text-sm transition-colors"
                    />
                    <p className="mt-1.5 text-[10px] text-muted-foreground">
                      {t({
                        sv: "Vår AI läser av er sajt för att göra analysen mer träffsäker.",
                        en: "Our AI reads your site to make the analysis more accurate.",
                      })}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-foreground/80 mb-1.5">
                      {t({ sv: "Org.nr", en: "Org. no." })}{" "}
                      <span className="text-muted-foreground font-normal">
                        {t({ sv: "(valfritt - för fakturaspecifikation)", en: "(optional – for invoice specification)" })}
                      </span>
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

                <div className="space-y-4 p-5 rounded-xl glass">
                  <div>
                    <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">
                      {t({ sv: "Verksamhetsbeskrivning", en: "Business description" })}
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                      {t({
                        sv: "Detta är vad vår AI analyserar. Komplettera gärna om något saknas.",
                        en: "This is what our AI analyzes. Feel free to add details if anything is missing.",
                      })}
                    </p>
                  </div>

                  <textarea
                    required
                    value={form.businessDescription}
                    onChange={(e) => update("businessDescription", e.target.value)}
                    placeholder={t({
                      sv: "Beskriv er verksamhet: antal tekniker/bilar, geografi, kundtyp, nuvarande system, största utmaningarna...",
                      en: "Describe your operation: number of technicians/vehicles, geography, customer type, current systems, biggest challenges…",
                    })}
                    rows={6}
                    maxLength={5000}
                    className="w-full px-3 py-2.5 rounded-lg bg-background border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 text-base md:text-sm leading-relaxed resize-none transition-colors"
                  />
                  <div className="text-[10px] text-muted-foreground text-right">
                    {form.businessDescription.length}/5000
                  </div>
                </div>

                {error && (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-sm text-destructive">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-xl glass border border-primary/20">
                  <div>
                    <div className="text-xs text-muted-foreground">{t({ sv: "Pris", en: "Price" })}</div>
                    <div className="text-2xl font-bold">
                      {t({ sv: "399 kr", en: "399 SEK" })}{" "}
                      <span className="text-xs font-normal text-muted-foreground">
                        {t({ sv: "exkl. moms", en: "excl. VAT" })}
                      </span>
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      {t({ sv: "498,75 kr inkl. moms (25%)", en: "498.75 SEK incl. VAT (25%)" })}
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_14px_hsl(var(--primary)/0.4)] transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {t({ sv: "Förbereder betalning...", en: "Preparing payment…" })}
                      </>
                    ) : (
                      <>
                        {t({ sv: "Gå vidare till betalning", en: "Proceed to payment" })}
                        <ArrowLeft className="w-4 h-4 rotate-180" />
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[10px] text-muted-foreground text-center">
                  {t({
                    sv: "Genom att fortsätta godkänner du att vi behandlar dina kontaktuppgifter för att leverera analysen och kvitto.",
                    en: "By continuing you agree that we process your contact details to deliver the analysis and receipt.",
                  })}
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
