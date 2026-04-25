-- Tabell för betalda djupanalyser
CREATE TABLE public.deep_analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Kontaktuppgifter (krävs för faktura och leverans)
  email TEXT NOT NULL,
  company TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  org_number TEXT,

  -- Innehåll att analysera
  business_description TEXT NOT NULL,
  quick_response TEXT,

  -- Stripe / betalning
  stripe_session_id TEXT UNIQUE,
  payment_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  paid_at TIMESTAMPTZ,
  amount_paid_cents INTEGER,
  currency TEXT DEFAULT 'sek',
  environment TEXT NOT NULL DEFAULT 'sandbox',

  -- Rapportgenerering
  report_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (report_status IN ('pending', 'generating', 'ready', 'failed')),
  report_content TEXT,
  pdf_storage_path TEXT,
  report_generated_at TIMESTAMPTZ,
  generation_error TEXT
);

CREATE INDEX idx_deep_analyses_session ON public.deep_analyses(stripe_session_id);
CREATE INDEX idx_deep_analyses_payment_status ON public.deep_analyses(payment_status);
CREATE INDEX idx_deep_analyses_created ON public.deep_analyses(created_at DESC);

-- Validering
CREATE OR REPLACE FUNCTION public.validate_deep_analysis()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF length(trim(NEW.email)) < 3 OR NEW.email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' THEN
    RAISE EXCEPTION 'Ogiltig e-postadress';
  END IF;
  IF length(trim(NEW.company)) < 2 THEN
    RAISE EXCEPTION 'Företagsnamn måste vara minst 2 tecken';
  END IF;
  IF length(trim(NEW.contact_name)) < 2 THEN
    RAISE EXCEPTION 'Namn måste vara minst 2 tecken';
  END IF;
  IF length(trim(NEW.business_description)) < 30 THEN
    RAISE EXCEPTION 'Verksamhetsbeskrivning måste vara minst 30 tecken';
  END IF;
  IF length(NEW.business_description) > 5000 THEN
    RAISE EXCEPTION 'Verksamhetsbeskrivning är för lång (max 5000 tecken)';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_deep_analysis_trigger
BEFORE INSERT ON public.deep_analyses
FOR EACH ROW EXECUTE FUNCTION public.validate_deep_analysis();

-- updated_at-trigger
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER touch_deep_analyses
BEFORE UPDATE ON public.deep_analyses
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- RLS
ALTER TABLE public.deep_analyses ENABLE ROW LEVEL SECURITY;

-- Vem som helst får skapa beställningar (anonym checkout-flow)
CREATE POLICY "Anyone can create a deep analysis order"
ON public.deep_analyses
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Ingen public SELECT/UPDATE/DELETE - allt går via service role i edge functions

-- Storage bucket för PDF-rapporter (privat)
INSERT INTO storage.buckets (id, name, public)
VALUES ('deep-analysis-reports', 'deep-analysis-reports', false)
ON CONFLICT (id) DO NOTHING;

-- Inga publika storage policies - bara service role kommer åt bucketen