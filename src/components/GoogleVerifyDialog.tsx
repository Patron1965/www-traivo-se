import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { CheckCircle2, Loader2, Copy, ExternalLink, AlertTriangle } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

type StepState = "idle" | "loading" | "ok" | "error";

type LogLevel = "info" | "ok" | "error";
interface LogEntry {
  ts: string;
  level: LogLevel;
  step: string;
  message: string;
}

export function GoogleVerifyDialog({ open, onOpenChange }: Props) {
  const [token, setToken] = useState<string | null>(null);
  const [tokenState, setTokenState] = useState<StepState>("idle");
  const [verifyState, setVerifyState] = useState<StepState>("idle");
  const [addState, setAddState] = useState<StepState>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [log, setLog] = useState<LogEntry[]>([]);

  const setErr = (k: string, m: string | null) =>
    setErrors((e) => {
      const n = { ...e };
      if (m) n[k] = m;
      else delete n[k];
      return n;
    });

  const append = (level: LogLevel, step: string, message: string) =>
    setLog((l) => [
      ...l,
      { ts: new Date().toISOString(), level, step, message },
    ]);

  const call = async (action: "token" | "verify" | "add-site") => {
    const { data, error } = await supabase.functions.invoke("gsc-verify", {
      body: { action },
    });
    if (error) throw new Error(error.message);
    if (!data?.ok) throw new Error(data?.error ?? "Okänt fel");
    return data.result;
  };

  const handleToken = async () => {
    setTokenState("loading");
    setErr("token", null);
    append("info", "Token", "Hämtar verifierings-token från Google…");
    try {
      const r = (await call("token")) as { token: string };
      setToken(r.token);
      setTokenState("ok");
      append("ok", "Token", "Token mottagen.");
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setErr("token", msg);
      setTokenState("error");
      append("error", "Token", msg);
    }
  };

  const handleVerify = async () => {
    setVerifyState("loading");
    setErr("verify", null);
    append("info", "Verifiera", "Begär att Google verifierar META-taggen…");
    try {
      await call("verify");
      setVerifyState("ok");
      append("ok", "Verifiera", "Google bekräftade ägarskap.");
      toast({ title: "Verifierat", description: "Google har bekräftat ägarskap." });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setErr("verify", msg);
      setVerifyState("error");
      append("error", "Verifiera", msg);
    }
  };

  const handleAdd = async () => {
    setAddState("loading");
    setErr("add", null);
    append("info", "Lägg till", "Lägger till sajten i Search Console…");
    try {
      await call("add-site");
      setAddState("ok");
      append("ok", "Lägg till", "Sajten finns nu som property.");
      toast({ title: "Tillagd", description: "Sajten finns nu i Search Console." });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setErr("add", msg);
      setAddState("error");
      append("error", "Lägg till", msg);
    }
  };

  const handleVerifyAndAdd = async () => {
    setVerifyState("loading");
    setErr("verify", null);
    append("info", "Verifiera", "Begär att Google verifierar META-taggen…");
    try {
      await call("verify");
      setVerifyState("ok");
      append("ok", "Verifiera", "Google bekräftade ägarskap.");
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setErr("verify", msg);
      setVerifyState("error");
      append("error", "Verifiera", msg);
      return;
    }
    await handleAdd();
  };

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast({ title: "Kopierat" });
  };

  const metaTag = token ? `<meta name="google-site-verification" content="${token}" />` : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Verifiera traivo.se i Google Search Console</DialogTitle>
          <DialogDescription>
            Fyra steg. Du behöver klistra in en meta-tag i index.html och publicera mellan steg 1 och 3.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 flex items-center justify-between gap-3 mt-2">
          <div className="text-sm">
            <div className="font-medium text-foreground">Snabbflöde</div>
            <div className="text-xs text-muted-foreground">
              Kör steg 3 (Verifiera) och steg 4 (Lägg till site) automatiskt.
            </div>
          </div>
          <Button
            onClick={handleVerifyAndAdd}
            disabled={verifyState === "loading" || addState === "loading"}
            size="sm"
          >
            {(verifyState === "loading" || addState === "loading") && (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            )}
            Kör 3 + 4
          </Button>
        </div>

        <div className="space-y-6 mt-2">
          {/* Step 1 */}
          <Step n={1} title="Hämta verifierings-token från Google" state={tokenState}>
            <Button onClick={handleToken} disabled={tokenState === "loading"} size="sm">
              {tokenState === "loading" && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
              {token ? "Hämta ny token" : "Hämta token"}
            </Button>
            {errors.token && <ErrorLine msg={errors.token} />}
            {token && (
              <div className="mt-3 bg-background/60 rounded border border-border/60 px-3 py-2 text-xs">
                <code className="break-all text-foreground">{token}</code>
              </div>
            )}
          </Step>

          {/* Step 2 */}
          <Step n={2} title="Klistra in meta-taggen i index.html och publicera" state={token ? "idle" : "idle"} muted={!token}>
            <p className="text-sm text-muted-foreground mb-2">
              Lägg in följande rad i <code>&lt;head&gt;</code> i <code>index.html</code> och tryck
              sedan på <strong>Publish</strong> uppe till höger i Lovable.
            </p>
            <div className="bg-background/60 rounded border border-border/60 px-3 py-2 text-xs flex items-start gap-2">
              <code className="break-all text-foreground flex-1">
                {token ? metaTag : "Hämta token i steg 1 först."}
              </code>
              {token && (
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 shrink-0" onClick={() => copy(metaTag)}>
                  <Copy className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          </Step>

          {/* Step 3 */}
          <Step n={3} title="Be Google verifiera" state={verifyState} muted={!token}>
            <p className="text-sm text-muted-foreground mb-2">
              Säkerställ att den publicerade sidan på <code>https://traivo.se/</code> innehåller
              meta-taggen innan du kör.
            </p>
            <Button onClick={handleVerify} disabled={!token || verifyState === "loading"} size="sm">
              {verifyState === "loading" && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
              Kör verifiering
            </Button>
            {errors.verify && <ErrorLine msg={errors.verify} />}
          </Step>

          {/* Step 4 */}
          <Step n={4} title="Lägg till site i Search Console" state={addState} muted={verifyState !== "ok"}>
            <Button
              onClick={handleAdd}
              disabled={verifyState !== "ok" || addState === "loading"}
              size="sm"
            >
              {addState === "loading" && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
              Lägg till site
            </Button>
            {errors.add && <ErrorLine msg={errors.add} />}
            {addState === "ok" && (
              <a
                href="https://search.google.com/search-console"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline text-sm mt-3"
              >
                Öppna Search Console <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </Step>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Step({
  n,
  title,
  state,
  muted,
  children,
}: {
  n: number;
  title: string;
  state: StepState;
  muted?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-lg border border-border/60 p-4 ${muted ? "opacity-60" : ""}`}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-full bg-primary/15 text-primary text-xs font-semibold flex items-center justify-center">
          {n}
        </div>
        <h3 className="text-sm font-semibold text-foreground flex-1">{title}</h3>
        {state === "ok" && <CheckCircle2 className="w-4 h-4 text-primary" />}
      </div>
      {children}
    </div>
  );
}

function ErrorLine({ msg }: { msg: string }) {
  return (
    <div className="mt-3 flex items-start gap-2 text-xs text-destructive">
      <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
      <code className="break-all">{msg}</code>
    </div>
  );
}
