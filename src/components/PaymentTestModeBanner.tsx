import { useT } from "@/i18n/LanguageContext";

const clientToken = import.meta.env.VITE_PAYMENTS_CLIENT_TOKEN;

export function PaymentTestModeBanner() {
  const t = useT();
  if (!clientToken?.startsWith("pk_test_")) return null;

  return (
    <div className="w-full bg-yellow-500/10 border-b border-yellow-500/30 px-4 py-2 text-center text-xs text-yellow-200">
      {t({
        sv: "Testläge - inga riktiga pengar dras. Använd kort 4242 4242 4242 4242, valfritt framtida datum, valfri 3-siffrig CVC.",
        en: "Test mode - no real money is charged. Use card 4242 4242 4242 4242, any future date, any 3-digit CVC.",
      })}
    </div>
  );
}
