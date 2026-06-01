-- Políticas de escrita para administradores autenticados

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM admins
    WHERE user_id = auth.uid() AND is_active = true
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Admins podem gerenciar conteúdo
CREATE POLICY "Admin all poems" ON poems FOR ALL USING (is_admin());
CREATE POLICY "Admin all chronicles" ON chronicles FOR ALL USING (is_admin());
CREATE POLICY "Admin all stories" ON stories FOR ALL USING (is_admin());
CREATE POLICY "Admin all articles" ON articles FOR ALL USING (is_admin());
CREATE POLICY "Admin all news" ON news FOR ALL USING (is_admin());
CREATE POLICY "Admin all magazines" ON magazines FOR ALL USING (is_admin());
CREATE POLICY "Admin all menus" ON menus FOR ALL USING (is_admin());
CREATE POLICY "Admin all banners" ON banners FOR ALL USING (is_admin());
CREATE POLICY "Admin all homepage_settings" ON homepage_settings FOR ALL USING (is_admin());
CREATE POLICY "Admin all seo_settings" ON seo_settings FOR ALL USING (is_admin());
CREATE POLICY "Admin read subscribers" ON subscribers FOR SELECT USING (is_admin());
CREATE POLICY "Public insert likes" ON publication_likes FOR INSERT WITH CHECK (true);

ALTER TABLE publication_likes ENABLE ROW LEVEL SECURITY;
