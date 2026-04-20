CREATE OR REPLACE FUNCTION public.validate_contact_submission()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF length(trim(NEW.name)) < 2 THEN
    RAISE EXCEPTION 'Namn måste vara minst 2 tecken';
  END IF;
  IF length(trim(NEW.company)) < 2 THEN
    RAISE EXCEPTION 'Företag måste vara minst 2 tecken';
  END IF;
  IF NEW.email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' THEN
    RAISE EXCEPTION 'Ogiltig e-postadress';
  END IF;
  IF NEW.message IS NOT NULL AND length(NEW.message) > 5000 THEN
    RAISE EXCEPTION 'Meddelandet är för långt';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_contact_submission_trigger
BEFORE INSERT ON public.contact_submissions
FOR EACH ROW
EXECUTE FUNCTION public.validate_contact_submission();