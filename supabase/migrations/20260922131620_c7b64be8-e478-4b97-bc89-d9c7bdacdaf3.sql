-- Storage: remove redundant no-op policies; private bucket defaults to deny for client roles
DROP POLICY IF EXISTS "Block public reads of deep-analysis-reports" ON storage.objects;
DROP POLICY IF EXISTS "Block public writes to deep-analysis-reports" ON storage.objects;
DROP POLICY IF EXISTS "Block public updates of deep-analysis-reports" ON storage.objects;
DROP POLICY IF EXISTS "Block public deletes of deep-analysis-reports" ON storage.objects;

-- Contact form: replace WITH CHECK (true) with a real predicate
DROP POLICY IF EXISTS "Anyone can submit a contact form" ON public.contact_submissions;
CREATE POLICY "Anyone can submit a contact form"
ON public.contact_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(btrim(name)) BETWEEN 2 AND 100
  AND length(btrim(company)) BETWEEN 2 AND 200
  AND length(btrim(email)) BETWEEN 5 AND 254
  AND email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND (phone IS NULL OR length(btrim(phone)) <= 40)
  AND (message IS NULL OR length(message) <= 5000)
);