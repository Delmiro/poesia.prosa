-- Buckets para revistas (PDF) e imagens de publicações

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('magazines', 'magazines', true, 52428800, ARRAY['application/pdf']),
  ('publications', 'publications', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO NOTHING;

-- Leitura pública dos arquivos
CREATE POLICY "Public read magazines"
ON storage.objects FOR SELECT
USING (bucket_id = 'magazines');

CREATE POLICY "Public read publications"
ON storage.objects FOR SELECT
USING (bucket_id = 'publications');

-- Admins podem enviar e gerenciar arquivos
CREATE POLICY "Admin upload magazines"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'magazines' AND is_admin());

CREATE POLICY "Admin update magazines"
ON storage.objects FOR UPDATE
USING (bucket_id = 'magazines' AND is_admin());

CREATE POLICY "Admin delete magazines"
ON storage.objects FOR DELETE
USING (bucket_id = 'magazines' AND is_admin());

CREATE POLICY "Admin upload publications"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'publications' AND is_admin());

CREATE POLICY "Admin update publications"
ON storage.objects FOR UPDATE
USING (bucket_id = 'publications' AND is_admin());

CREATE POLICY "Admin delete publications"
ON storage.objects FOR DELETE
USING (bucket_id = 'publications' AND is_admin());
