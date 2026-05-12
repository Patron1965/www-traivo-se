
-- Explicit deny of SELECT to anon/authenticated on contact_submissions
CREATE POLICY "Block public reads of contact submissions"
ON public.contact_submissions
FOR SELECT
TO anon, authenticated
USING (false);

-- Explicit deny of UPDATE/DELETE too (defence in depth)
CREATE POLICY "Block public updates of contact submissions"
ON public.contact_submissions
FOR UPDATE
TO anon, authenticated
USING (false) WITH CHECK (false);

CREATE POLICY "Block public deletes of contact submissions"
ON public.contact_submissions
FOR DELETE
TO anon, authenticated
USING (false);

-- Same for deep_analyses
CREATE POLICY "Block public reads of deep analyses"
ON public.deep_analyses
FOR SELECT
TO anon, authenticated
USING (false);

CREATE POLICY "Block public updates of deep analyses"
ON public.deep_analyses
FOR UPDATE
TO anon, authenticated
USING (false) WITH CHECK (false);

CREATE POLICY "Block public deletes of deep analyses"
ON public.deep_analyses
FOR DELETE
TO anon, authenticated
USING (false);

-- Storage policies: deny all anon/authenticated access to deep-analysis-reports bucket
CREATE POLICY "Block public reads of deep-analysis-reports"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'deep-analysis-reports' AND false);

CREATE POLICY "Block public writes to deep-analysis-reports"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'deep-analysis-reports' AND false);

CREATE POLICY "Block public updates of deep-analysis-reports"
ON storage.objects
FOR UPDATE
TO anon, authenticated
USING (bucket_id = 'deep-analysis-reports' AND false)
WITH CHECK (bucket_id = 'deep-analysis-reports' AND false);

CREATE POLICY "Block public deletes of deep-analysis-reports"
ON storage.objects
FOR DELETE
TO anon, authenticated
USING (bucket_id = 'deep-analysis-reports' AND false);
