ALTER TABLE public.deep_analyses ADD COLUMN IF NOT EXISTS website_url text;

-- Uppdatera validering: kräv giltig URL
CREATE OR REPLACE FUNCTION public.validate_deep_analysis()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
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
  IF NEW.website_url IS NULL OR length(trim(NEW.website_url)) < 4 THEN
    RAISE EXCEPTION 'Webbplats måste anges';
  END IF;
  IF NEW.website_url !~* '^https?://[^\s]+\.[^\s]+' THEN
    RAISE EXCEPTION 'Ogiltig webbplats-URL (måste börja med http:// eller https://)';
  END IF;
  RETURN NEW;
END;
$function$;

-- Säkerställ att triggern finns
DROP TRIGGER IF EXISTS validate_deep_analysis_trigger ON public.deep_analyses;
CREATE TRIGGER validate_deep_analysis_trigger
  BEFORE INSERT OR UPDATE ON public.deep_analyses
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_deep_analysis();

-- Uppdatera RLS-policyn så att website_url tillåts (annars blockeras inserts som anger fältet)
DROP POLICY IF EXISTS "Anyone can create a pending deep analysis order" ON public.deep_analyses;
CREATE POLICY "Anyone can create a pending deep analysis order"
ON public.deep_analyses
FOR INSERT
TO anon, authenticated
WITH CHECK (
  payment_status = 'pending'
  AND report_status = 'pending'
  AND stripe_session_id IS NULL
  AND paid_at IS NULL
  AND amount_paid_cents IS NULL
  AND pdf_storage_path IS NULL
  AND report_content IS NULL
  AND report_generated_at IS NULL
  AND generation_error IS NULL
);