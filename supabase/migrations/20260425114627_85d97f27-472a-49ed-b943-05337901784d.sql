-- Ersätt den för permissiva INSERT-policyn med en striktare variant
DROP POLICY IF EXISTS "Anyone can create a deep analysis order" ON public.deep_analyses;

CREATE POLICY "Anyone can create a pending deep analysis order"
ON public.deep_analyses
FOR INSERT
TO anon, authenticated
WITH CHECK (
  -- Ny beställning får bara skapas som obetald + ingen rapport
  payment_status = 'pending'
  AND report_status = 'pending'
  -- Inga Stripe-fält får sättas av klienten
  AND stripe_session_id IS NULL
  AND paid_at IS NULL
  AND amount_paid_cents IS NULL
  -- Ingen rapport-info får sättas av klienten
  AND pdf_storage_path IS NULL
  AND report_content IS NULL
  AND report_generated_at IS NULL
  AND generation_error IS NULL
);