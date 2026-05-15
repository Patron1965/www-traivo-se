import { useEffect, useState, useCallback } from "react";

function setMeta(title: string, description: string) {
  if (typeof document === "undefined") return;
  document.title = title;
  let m = document.querySelector('meta[name="description"]');
  if (!m) {
    m = document.createElement("meta");
    m.setAttribute("name", "description");
    document.head.appendChild(m);
  }
  m.setAttribute("content", description);
}
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Loader2,
  RefreshCw,
  ExternalLink,
  Copy,
} from "lucide-react";
import { GoogleVerifyDialog } from "@/components/GoogleVerifyDialog";

type DerivedStatus = "Active" | "Verifying" | "Failed" | "Offline" | "Unknown";

interface DomainResult {
  domain: string;
  a_records: string[];
  expected_ip_found: boolean;
  txt_verify_found: boolean;
  txt_verify_value: string | null;
  txt_verify_matches_expected: boolean;
  expected_token: string;
  txt_records: string[];
  txt_record_name: string;
  https_ok: boolean;
  http_status: number | null;
  ssl_ok: boolean;
  error: string | null;
  derived_status: DerivedStatus;
  checked_at: string;
}

interface ApiResponse {
  results: DomainResult[];
  expected_ip: string;
  expected_token: string;
}

const STATUS_META: Record<
  DerivedStatus,
  { label: string; tone: string; icon: typeof CheckCircle2; description: string }
> = {
  Active: {
    label: "Active",
    tone: "bg-primary/15 text-primary border-primary/30",
    icon: CheckCircle2,
    description: "Domänen är live och svarar normalt.",
  },
  Verifying: {
    label: "Verifying",
    tone: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    icon: Loader2,
    description: "Väntar på DNS-propagering eller verifiering.",
  },
  Failed: {
    label: "Failed",
    tone: "bg-destructive/15 text-destructive border-destructive/30",
    icon: XCircle,
    description: "DNS pekar rätt men SSL eller upstream svarar inte.",
  },
  Offline: {
    label: "Offline",
    tone: "bg-destructive/15 text-destructive border-destructive/30",
    icon: XCircle,
    description: "DNS pekar mot fel IP eller saknas.",
  },
  Unknown: {
    label: "Okänd",
    tone: "bg-muted text-muted-foreground border-border",
    icon: HelpCircle,
    description: "Inga DNS-svar hittades.",
  },
};

function formatTime(iso: string) {
  try {
    return new Date(iso).toLocaleString("sv-SE", {
      timeZone: "Europe/Stockholm",
      dateStyle: "short",
      timeStyle: "medium",
    });
  } catch {
    return iso;
  }
}

function CheckRow({
  ok,
  label,
  detail,
}: {
  ok: boolean | null;
  label: string;
  detail?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-border/50 last:border-0">
      <div className="flex items-start gap-2 text-sm">
        {ok === true && <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary shrink-0" />}
        {ok === false && <XCircle className="w-4 h-4 mt-0.5 text-destructive shrink-0" />}
        {ok === null && <HelpCircle className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />}
        <div>
          <div className="text-foreground">{label}</div>
          {detail && <div className="text-xs text-muted-foreground mt-0.5 break-all">{detail}</div>}
        </div>
      </div>
    </div>
  );
}

function NextSteps({ status }: { status: DerivedStatus }) {
  if (status === "Active") {
    return (
      <p className="text-sm text-muted-foreground">
        Allt fungerar som det ska. Inget behöver göras.
      </p>
    );
  }
  if (status === "Verifying") {
    return (
      <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
        <li>DNS-propagering kan ta upp till 72 timmar — vänta gärna lite till.</li>
        <li>
          Kontrollera hos Loopia att A-record (<code>@</code> och <code>www</code>) pekar på{" "}
          <code>185.158.133.1</code>.
        </li>
        <li>
          Kontrollera att TXT-record <code>_lovable</code> finns med värdet{" "}
          <code>lovable_verify=...</code>.
        </li>
        <li>
          <a
            href="https://dnschecker.org/#A/traivo.se"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            Kontrollera global propagering på dnschecker.org
            <ExternalLink className="w-3 h-3" />
          </a>
        </li>
      </ul>
    );
  }
  if (status === "Offline") {
    return (
      <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
        <li>
          Logga in hos Loopia och uppdatera A-record till <code>185.158.133.1</code> för både{" "}
          <code>@</code> och <code>www</code>.
        </li>
        <li>Ta bort eventuella gamla A-records som pekar mot annan IP.</li>
        <li>Vänta på propagering och kör om kontrollen.</li>
      </ul>
    );
  }
  if (status === "Failed") {
    return (
      <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
        <li>SSL-certifikatet kunde inte utfärdas. Kontrollera CAA-records hos Loopia.</li>
        <li>Säkerställ att inget annat hostar domänen samtidigt.</li>
        <li>Kontakta Lovable-support om problemet kvarstår mer än några timmar.</li>
      </ul>
    );
  }
  return (
    <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
      <li>Inga DNS-svar — kontrollera att domänen har A-records satta hos Loopia.</li>
    </ul>
  );
}

function TxtVerificationPanel({ result }: { result: DomainResult }) {
  const found = result.txt_verify_found;
  const matches = result.txt_verify_matches_expected;
  const value = result.txt_verify_value;
  const expected = result.expected_token;

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: "Kopierat", description: `${label} kopierat till urklipp.` });
    } catch {
      toast({ title: "Kunde inte kopiera", description: "Försök igen manuellt.", variant: "destructive" });
    }
  };

  const verdict = matches
    ? { tone: "border-primary/30 bg-primary/5", icon: CheckCircle2, color: "text-primary", label: "Verifierad – token matchar Lovable" }
    : found
      ? { tone: "border-destructive/30 bg-destructive/5", icon: XCircle, color: "text-destructive", label: "TXT-record finns men token matchar INTE" }
      : { tone: "border-amber-500/30 bg-amber-500/5", icon: AlertTriangle, color: "text-amber-400", label: "Ingen TXT-record hittad" };
  const VerdictIcon = verdict.icon;

  return (
    <div className={`rounded-lg border p-4 ${verdict.tone}`}>
      <div className="flex items-center gap-2 mb-3">
        <VerdictIcon className={`w-4 h-4 ${verdict.color}`} />
        <h4 className="text-sm font-semibold text-foreground">
          Loopia TXT-verifiering ({result.txt_record_name})
        </h4>
      </div>

      <p className={`text-sm font-medium mb-3 ${verdict.color}`}>{verdict.label}</p>

      <div className="space-y-2 text-xs">
        <div className="bg-background/60 rounded border border-border/60 px-3 py-2">
          <div className="text-muted-foreground mb-1">Förväntat värde (från Lovable)</div>
          <div className="flex items-center gap-2">
            <code className="text-foreground break-all flex-1">lovable_verify={expected}</code>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 shrink-0"
              onClick={() => copy(`lovable_verify=${expected}`, "Förväntat värde")}
              aria-label="Kopiera förväntat värde"
            >
              <Copy className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        <div className="bg-background/60 rounded border border-border/60 px-3 py-2">
          <div className="text-muted-foreground mb-1">Hittat i DNS hos Loopia</div>
          {found && value ? (
            <code className={`break-all ${matches ? "text-primary" : "text-destructive"}`}>
              lovable_verify={value}
            </code>
          ) : result.txt_records.length > 0 ? (
            <code className="text-muted-foreground break-all">
              {result.txt_records.join(" · ")}
            </code>
          ) : (
            <span className="text-muted-foreground">Inga TXT-records på {result.txt_record_name}</span>
          )}
        </div>
      </div>

      {!matches && (
        <div className="mt-3 text-xs text-muted-foreground space-y-1.5">
          <div className="font-medium text-foreground">Åtgärd hos Loopia:</div>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Logga in på Loopia DNS för {result.domain.replace(/^www\./, "")}.</li>
            <li>Hitta (eller skapa) subdomänen <code>_lovable</code>.</li>
            <li>Lägg till en TXT-record med exakt det förväntade värdet ovan.</li>
            <li>Vänta 10–60 minuter och kör om kontrollen.</li>
          </ol>
        </div>
      )}
    </div>
  );
}

function DomainCard({ result, expectedIp }: { result: DomainResult; expectedIp: string }) {
  const meta = STATUS_META[result.derived_status];
  const Icon = meta.icon;

  return (
    <Card className="border-border/60">
      <CardHeader>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <CardTitle className="font-display text-xl">{result.domain}</CardTitle>
          <Badge variant="outline" className={`${meta.tone} gap-1.5 px-3 py-1`}>
            <Icon className={`w-3.5 h-3.5 ${result.derived_status === "Verifying" ? "animate-spin" : ""}`} />
            {meta.label}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{meta.description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <CheckRow
            ok={result.expected_ip_found}
            label="A-record"
            detail={
              result.a_records.length
                ? `Förväntad ${expectedIp} — hittade ${result.a_records.join(", ")}`
                : `Förväntad ${expectedIp} — inga A-records hittades`
            }
          />
          <CheckRow
            ok={result.txt_verify_matches_expected}
            label="TXT _lovable (token matchar Lovable)"
            detail={
              result.txt_verify_matches_expected
                ? "Verifierad – exakt matchning"
                : result.txt_verify_found
                  ? `Hittade lovable_verify=${result.txt_verify_value} — matchar inte förväntat token`
                  : result.txt_records.length
                    ? `Inga lovable_verify-rader. Hittade: ${result.txt_records.join(" · ")}`
                    : "Ingen TXT-record hittades"
            }
          />
          <CheckRow
            ok={result.https_ok}
            label="HTTPS-svar"
            detail={
              result.http_status !== null
                ? `Status ${result.http_status}${result.http_status === 530 ? " (Cloudflare 1001)" : ""}`
                : result.error ?? "Inget svar"
            }
          />
          <CheckRow ok={result.ssl_ok} label="SSL/TLS" detail={result.ssl_ok ? "Certifikat OK" : "SSL-problem"} />
        </div>

        <TxtVerificationPanel result={result} />

        <div className="pt-2 border-t border-border/50">
          <h4 className="text-sm font-semibold text-foreground mb-2">Nästa steg</h4>
          <NextSteps status={result.derived_status} />
        </div>

        <p className="text-xs text-muted-foreground">
          Senast kontrollerad: {formatTime(result.checked_at)}
        </p>
      </CardContent>
    </Card>
  );
}

const STATUS_GLOSSARY: { status: DerivedStatus; text: string }[] = [
  { status: "Active", text: "Domänen är live, DNS pekar rätt och SSL fungerar." },
  { status: "Verifying", text: "DNS- eller verifieringssteg pågår. Inget akut att göra." },
  { status: "Failed", text: "DNS pekar rätt men SSL eller upstream svarar inte." },
  { status: "Offline", text: "DNS pekar mot fel IP eller saknas helt." },
];

const DomainStatusPage = () => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [nextIn, setNextIn] = useState<number>(0);
  const [gscOpen, setGscOpen] = useState(false);

  const allActive = !!data?.results.length && data.results.every((r) => r.derived_status === "Active");
  const intervalSec = allActive ? 300 : 15;

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.functions.invoke<ApiResponse>(
        "check-domain-status",
        { body: { domain: "traivo.se" } },
      );
      if (error) throw error;
      setData(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Kunde inte hämta status");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  useEffect(() => {
    if (!autoRefresh) return;
    setNextIn(intervalSec);
    const tick = setInterval(() => {
      if (typeof document !== "undefined" && document.hidden) return;
      setNextIn((n) => {
        if (n <= 1) {
          fetchStatus();
          return intervalSec;
        }
        return n - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, [autoRefresh, intervalSec, fetchStatus]);

  useEffect(() => {
    const onVis = () => {
      if (typeof document !== "undefined" && !document.hidden && autoRefresh) {
        fetchStatus();
        setNextIn(intervalSec);
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [autoRefresh, intervalSec, fetchStatus]);

  useEffect(() => {
    setMeta(
      "Domänstatus – Traivo",
      "Live-status för traivo.se: visar om domänen är aktiv, under verifiering eller har problem, samt nästa steg.",
    );
  }, []);

  return (
    <>

      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <header className="mb-10">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
              Driftstatus
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-gradient-ocean mb-3">
              Domänstatus
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Transparent översikt över DNS, SSL och svar för traivo.se. Sidan uppdateras
              automatiskt {allActive ? "var 5:e minut" : "var 15:e sekund"} tills allt är Active.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Button onClick={fetchStatus} disabled={loading} variant="outline" size="sm">
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                Kör om nu
              </Button>
              <Button onClick={() => setAutoRefresh((v) => !v)} variant="ghost" size="sm">
                {autoRefresh ? "Pausa auto-uppdatering" : "Återuppta auto-uppdatering"}
              </Button>
              <Button
                onClick={() => setGscOpen(true)}
                disabled={!allActive}
                variant="default"
                size="sm"
                title={allActive ? undefined : "Aktiveras när båda domänerna är Active"}
              >
                {allActive
                  ? "Verifiera i Google Search Console"
                  : "Verifiera i Google Search Console (väntar på Active)"}
              </Button>
              {autoRefresh && !loading && (
                <span className="text-xs text-muted-foreground">
                  Nästa kontroll om {nextIn}s
                </span>
              )}
            </div>
          </header>

          {error && (
            <Card className="mb-6 border-destructive/40 bg-destructive/5">
              <CardContent className="pt-6 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                <div className="text-sm">
                  <div className="font-semibold text-destructive">Kunde inte köra kontrollen</div>
                  <div className="text-muted-foreground mt-1">{error}</div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-6">
            {!data && loading && (
              <Card>
                <CardContent className="py-12 flex items-center justify-center text-muted-foreground gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Hämtar domänstatus…
                </CardContent>
              </Card>
            )}

            {data?.results.map((r) => (
              <DomainCard key={r.domain} result={r} expectedIp={data.expected_ip} />
            ))}
          </div>

          <section className="mt-12">
            <h2 className="font-display text-xl font-semibold mb-4">Vad statusarna betyder</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {STATUS_GLOSSARY.map(({ status, text }) => {
                const meta = STATUS_META[status];
                const Icon = meta.icon;
                return (
                  <div
                    key={status}
                    className="flex items-start gap-3 p-4 rounded-lg border border-border/60 bg-card"
                  >
                    <Badge variant="outline" className={`${meta.tone} shrink-0 gap-1`}>
                      <Icon className="w-3 h-3" />
                      {meta.label}
                    </Badge>
                    <p className="text-sm text-muted-foreground">{text}</p>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
      <GoogleVerifyDialog open={gscOpen} onOpenChange={setGscOpen} />
    </>
  );
};

export default DomainStatusPage;
