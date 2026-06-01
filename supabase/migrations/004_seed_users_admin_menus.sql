-- Seed: menus + sincronização users + função para criar admin
-- Execute APÓS 001, 002 e 003
-- O usuário deve existir antes em Authentication → Users

-- ---------------------------------------------------------------------------
-- Menus padrão do site
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM menus LIMIT 1) THEN
    INSERT INTO menus (label, url, menu_type, sort_order, is_active) VALUES
      ('Início', '/', 'main', 1, true),
      ('Poesias', '/categoria/poesia', 'main', 2, true),
      ('Crônicas', '/categoria/cronica', 'main', 3, true),
      ('Revistas', '/revistas', 'main', 4, true),
      ('Buscar', '/busca', 'main', 5, true),
      ('Receba Novidades', '/receba-novidades', 'main', 6, true),
      ('Receba Novidades', '/receba-novidades', 'footer', 1, true),
      ('Buscar', '/busca', 'footer', 2, true),
      ('Revistas', '/revistas', 'footer', 3, true),
      ('Área Administrativa', '/admin/login', 'footer', 4, true),
      ('Área Administrativa', '/admin/login', 'institutional', 1, true);
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- Ao criar usuário no Auth, espelha em public.users
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  reader_role_id UUID;
BEGIN
  SELECT id INTO reader_role_id FROM roles WHERE name = 'reader' LIMIT 1;

  INSERT INTO public.users (id, email, full_name, role_id)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    reader_role_id
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      updated_at = NOW();

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_auth_user();

-- ---------------------------------------------------------------------------
-- Promove e-mail existente no Auth para administrador
-- Uso (depois de criar o usuário em Authentication):
--   SELECT public.grant_admin('seu-email@exemplo.com');
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.grant_admin(target_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid UUID;
  admin_role_id UUID;
BEGIN
  SELECT id INTO uid
  FROM auth.users
  WHERE lower(email) = lower(trim(target_email));

  IF uid IS NULL THEN
    RAISE EXCEPTION
      'Usuário não encontrado em Authentication. Crie em Authentication → Users com o e-mail: %',
      target_email;
  END IF;

  SELECT id INTO admin_role_id FROM roles WHERE name = 'admin' LIMIT 1;

  INSERT INTO public.users (id, email, role_id)
  VALUES (uid, target_email, admin_role_id)
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      role_id = admin_role_id,
      updated_at = NOW();

  INSERT INTO public.admins (user_id, email, is_active)
  VALUES (uid, target_email, true)
  ON CONFLICT (user_id) DO UPDATE
  SET email = EXCLUDED.email,
      is_active = true;

  RETURN 'Admin criado para: ' || target_email || ' (user_id: ' || uid || ')';
END;
$$;

-- Permite rodar grant_admin pelo SQL Editor (postgres / service role)
GRANT EXECUTE ON FUNCTION public.grant_admin(TEXT) TO postgres, service_role;

-- ---------------------------------------------------------------------------
-- Sincroniza usuários Auth já existentes (rodar uma vez se criou Auth antes deste script)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.sync_auth_users_to_public()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  reader_role_id UUID;
  inserted_count INTEGER := 0;
BEGIN
  SELECT id INTO reader_role_id FROM roles WHERE name = 'reader' LIMIT 1;

  INSERT INTO public.users (id, email, role_id)
  SELECT
    au.id,
    au.email,
    reader_role_id
  FROM auth.users au
  WHERE NOT EXISTS (SELECT 1 FROM public.users u WHERE u.id = au.id);

  GET DIAGNOSTICS inserted_count = ROW_COUNT;
  RETURN inserted_count;
END;
$$;

GRANT EXECUTE ON FUNCTION public.sync_auth_users_to_public() TO postgres, service_role;

-- ---------------------------------------------------------------------------
-- INSTRUÇÕES — execute manualmente após criar o usuário no Authentication:
--
-- 1) Sincronizar Auth → public.users (se o usuário já existia):
--    SELECT public.sync_auth_users_to_public();
--
-- 2) Tornar administrador (troque o e-mail):
--    SELECT public.grant_admin('diegoalbuquerque03@gmail.com');
--
-- 3) Conferir:
--    SELECT * FROM public.admins;
--    SELECT * FROM public.users;
-- ---------------------------------------------------------------------------
