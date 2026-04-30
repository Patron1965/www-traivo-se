import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Lang = "sv" | "en";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: <T extends { sv: any; en: any }>(o: T) => T["sv"];
};

const LanguageContext = createContext<Ctx | null>(null);

const STORAGE_KEY = "traivo-lang";

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === "undefined") return "sv";
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "en" ? "en" : "sv";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Lang) => setLangState(l);

  /** t({ sv: "Hej", en: "Hi" }) → returns the active-language value */
  const t = <T extends { sv: any; en: any }>(o: T) => (lang === "en" ? o.en : o.sv);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
};

/** Convenience hook for components that only need the t() helper */
export const useT = () => useLang().t;
