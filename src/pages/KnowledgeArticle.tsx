import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useT } from "@/i18n/LanguageContext";
import SEO from "@/components/SEO";
import { articles } from "./KnowledgeIndex";

interface ArticleBody {
  slug: string;
  intro: { sv: string; en: string };
  sections: { heading: { sv: string; en: string }; body: { sv: string; en: string } }[];
}

const bodies: ArticleBody[] = [
  {
    slug: "ruttoptimering-fordon",
    intro: {
      sv: "När någon säger \"ruttoptimering\" menar de oftast att jobben sorteras efter koordinater. Det räcker sällan i verkligheten. En tung sopbil har andra begränsningar än en servicebil — och ett tidsfönster på 30 minuter är värdelöst om trafiken är oförutsägbar.",
      en: "When someone says \"route optimization\", they usually mean jobs sorted by coordinates. That rarely holds up in real life. A heavy waste truck has different constraints than a service van — and a 30-minute time window is useless if traffic is unpredictable.",
    },
    sections: [
      {
        heading: { sv: "Vad bra ruttoptimering faktiskt räknar på", en: "What good route optimization actually computes" },
        body: {
          sv: "Verkliga vägar (inte fågelvägen), aktuell trafik, fordonstyp och vikt, tidsfönster per stopp, teknikerns kompetens, och hur länge varje besök tar i snitt. När en parameter ändras — en kund avbokar, en akutorder dyker upp, en bro stängs — räknas hela schemat om på sekunder.",
          en: "Real roads (not as the crow flies), current traffic, vehicle type and weight, time windows per stop, technician skills, and how long each visit takes on average. When one parameter changes — a customer cancels, an urgent order pops up, a bridge closes — the whole schedule is recalculated in seconds.",
        },
      },
      {
        heading: { sv: "Det som ger störst effekt först", en: "What gives the biggest effect first" },
        body: {
          sv: "Geofencing av varje stopp så att jobbet automatiskt markeras som utfört. Det tar bort 5–10 minuter administration per tekniker och dag. Att gruppera stopp efter geografi snarare än turordning sparar mellan 10 och 25 procent restid på en typisk dag — utan att tekniker behöver tänka på det.",
          en: "Geofencing each stop so the job is automatically marked as done. That removes 5–10 minutes of admin per technician per day. Grouping stops by geography rather than order saves between 10 and 25 percent travel time on a typical day — without the technician having to think about it.",
        },
      },
      {
        heading: { sv: "Vad som inte fungerar", en: "What doesn't work" },
        body: {
          sv: "Att tvinga in optimering i ett system där planeraren inte litar på resultatet. Då görs det manuellt ändå. Lösningen är inte mer AI — den är att visa varför ett visst förslag lades, och låta planeraren ändra utan friktion.",
          en: "Forcing optimization into a system where the planner doesn't trust the result. Then it's done manually anyway. The solution isn't more AI — it's showing why a suggestion was made, and letting the planner override it without friction.",
        },
      },
    ],
  },
  {
    slug: "digital-faltservice-guide",
    intro: {
      sv: "Att gå från papperslappar till digitala protokoll låter enkelt — tills den första tekniker säger \"jag fyller i det när jag är hemma ikväll\". Då är hela poängen borta.",
      en: "Going from paper notes to digital reports sounds simple — until the first technician says \"I'll fill it in when I'm home tonight\". Then the whole point is gone.",
    },
    sections: [
      {
        heading: { sv: "Bygg för dem som har handskar på sig", en: "Build for people wearing gloves" },
        body: {
          sv: "Stora knappar, få fält, foto istället för fritext där det går. En digital protokollsida ska gå att fylla i på under en minut. Annars kommer den inte fyllas i alls.",
          en: "Large buttons, few fields, photos instead of free text where possible. A digital report page should take less than a minute to complete. Otherwise it won't be completed at all.",
        },
      },
      {
        heading: { sv: "Offline är inte en feature, det är ett krav", en: "Offline isn't a feature, it's a requirement" },
        body: {
          sv: "Källare, hisschakt, glesbygd, parkeringshus. Om appen inte fungerar utan nät kommer tekniker tappa förtroendet på vecka två. Bygg så att jobb och protokoll synkar automatiskt när täckningen kommer tillbaka.",
          en: "Basements, elevator shafts, rural areas, parking garages. If the app doesn't work without coverage, technicians will lose trust by week two. Build so jobs and reports sync automatically when coverage returns.",
        },
      },
      {
        heading: { sv: "Mätbart värde, inte mätbara klick", en: "Measurable value, not measurable clicks" },
        body: {
          sv: "Mät tid sparad per protokoll, andel jobb klarmarkerade i fält, andel fakturor skickade samma dag. Inte hur många knappar som tryckts. Det första visar verkligt värde — det andra leder till funktioner ingen vill ha.",
          en: "Measure time saved per report, share of jobs closed in the field, share of invoices sent the same day. Not how many buttons were pressed. The first shows real value — the second leads to features nobody wants.",
        },
      },
    ],
  },
  {
    slug: "ai-schemalaggning-faltservice",
    intro: {
      sv: "AI-schemaläggning är ett av de mest överanvända begreppen i branschen just nu. Här är en uppdelning av var det faktiskt gör skillnad — och var en regelmotor från 2008 hade varit lika bra.",
      en: "AI scheduling is one of the most overused terms in the industry right now. Here's a breakdown of where it actually makes a difference — and where a rules engine from 2008 would have done just as well.",
    },
    sections: [
      {
        heading: { sv: "Där AI faktiskt hjälper", en: "Where AI actually helps" },
        body: {
          sv: "När antalet stopp och variabler blir för stort för att en planerare ska överblicka — säg 80+ jobb om dagen, flera fordonstyper, varierande kompetenser. När mönster över tid ska upptäckas: en specifik tekniker tar konsekvent 20 procent längre på ett visst jobbtyp, eller en kund bokar alltid extratömning på torsdagar.",
          en: "When the number of stops and variables becomes too large for a planner to oversee — say 80+ jobs per day, multiple vehicle types, varying skills. When patterns over time need to be discovered: a specific technician consistently takes 20 percent longer on a certain job type, or a customer always books an extra pickup on Thursdays.",
        },
      },
      {
        heading: { sv: "Där en enkel regel räcker", en: "Where a simple rule is enough" },
        body: {
          sv: "\"Lägg jobb med kompetens X på tekniker som har certifikat Y\". \"Inte mer än 8 timmar per tekniker\". \"Stopp inom 500 meter grupperas\". Detta behöver ingen maskininlärning — bara tydlig logik och en planerare som litar på systemet.",
          en: "\"Assign jobs requiring skill X to technicians with certification Y\". \"No more than 8 hours per technician\". \"Stops within 500 meters are grouped\". This needs no machine learning — just clear logic and a planner who trusts the system.",
        },
      },
      {
        heading: { sv: "Det som spelar roll på riktigt", en: "What actually matters" },
        body: {
          sv: "Att förslag är förklarbara. Att en planerare kan ändra utan att hela schemat går sönder. Att systemet lär sig av ändringarna istället för att föreslå samma fel nästa dag. Hur tekniken är byggd är mindre viktigt — vad användaren upplever är allt.",
          en: "That suggestions are explainable. That a planner can override without breaking the whole schedule. That the system learns from changes instead of suggesting the same mistake the next day. How the tech is built matters less — what the user experiences is everything.",
        },
      },
    ],
  },
];

const KnowledgeArticle = () => {
  const { slug } = useParams();
  const t = useT();
  const meta = articles.find((a) => a.slug === slug);
  const body = bodies.find((b) => b.slug === slug);

  if (!meta || !body) return <Navigate to="/kunskap" replace />;

  const idx = articles.findIndex((a) => a.slug === slug);
  const next = articles[(idx + 1) % articles.length];

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: meta.title.sv,
    description: meta.excerpt.sv,
    author: { "@type": "Organization", name: "Traivo" },
    publisher: { "@type": "Organization", name: "Traivo", url: "https://traivo.se/" },
    mainEntityOfPage: `https://traivo.se/kunskap/${slug}`,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Hem", item: "https://traivo.se/" },
      { "@type": "ListItem", position: 2, name: "Kunskap", item: "https://traivo.se/kunskap" },
      { "@type": "ListItem", position: 3, name: meta.title.sv, item: `https://traivo.se/kunskap/${slug}` },
    ],
  };

  return (
    <>
      <SEO
        path={`/kunskap/${slug}`}
        title={t(meta.metaTitle)}
        description={t(meta.excerpt)}
        type="article"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(articleJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
      </Helmet>


      <article className="relative pt-24 pb-20 px-4 sm:px-6 bg-noise">
        <div className="max-w-2xl mx-auto">
          <Link
            to="/kunskap"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {t({ sv: "Tillbaka till Kunskap", en: "Back to Knowledge" })}
          </Link>

          <p className="text-xs text-muted-foreground mb-3">{t(meta.readTime)}</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold leading-tight text-gradient-ice mb-6">
            {t(meta.title)}
          </h1>
          <p className="text-lg text-foreground/85 leading-relaxed mb-10">
            {t(body.intro)}
          </p>

          {body.sections.map((s, i) => (
            <section key={i} className="mb-8">
              <h2 className="font-display text-xl md:text-2xl font-semibold text-foreground mb-3">
                {t(s.heading)}
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                {t(s.body)}
              </p>
            </section>
          ))}

          <div className="mt-12 p-6 rounded-xl border border-primary/30 bg-primary/5">
            <p className="text-sm text-foreground/85 mb-3">
              {t({
                sv: "Vill du se hur det här skulle se ut för er verksamhet?",
                en: "Want to see how this would look for your operation?",
              })}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/hjarna"
                className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
              >
                {t({ sv: "Beskriv anonymt för Hjärnan", en: "Describe anonymously to the Brain" })}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/kontakt"
                className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
              >
                {t({ sv: "Boka demo", en: "Book a demo" })}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-border">
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
              {t({ sv: "Läs nästa", en: "Read next" })}
            </p>
            <Link
              to={`/kunskap/${next.slug}`}
              className="inline-flex items-center gap-2 text-base font-medium text-foreground hover:text-primary"
            >
              {t(next.title)} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </article>
    </>
  );
};

export default KnowledgeArticle;
