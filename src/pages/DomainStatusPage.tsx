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
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Loader2,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

type DerivedStatus = "Active" | "Verifying" | "Failed" | "Offline" | "Unknown";

interface DomainResult {
  domain: string;
  a_records: string[];
  expected_ip_found: boolean;
  txt_verify_found: boolean;
  txt_records: string[];
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
            ok={result.txt_verify_found}
            label="TXT _lovable (lovable_verify=...)"
            detail={
              result.txt_records.length
                ? result.txt_records.join(" · ")
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
    const interval = setInterval(fetchStatus, 60_000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

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
              Transparent översikt över DNS, SSL och svar för traivo.se. Sidan kontrollerar
              automatiskt var 60:e sekund.
            </p>
            <div className="mt-5">
              <Button onClick={fetchStatus} disabled={loading} variant="outline" size="sm">
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                Kör om kontrollen
              </Button>
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
    </>
  );
};

export default DomainStatusPage;
