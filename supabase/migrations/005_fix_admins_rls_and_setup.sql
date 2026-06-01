-- Corrige RLS da tabela admins + função de diagnóstico + grant_admin melhorado
-- Execute no SQL Editor DEPOIS do 004

-- Políticas em admins (antes não existia nenhuma — login falhava mesmo com dados)
DROP POLICY IF EXISTS "Authenticated read own admin row" ON public.admins;
CREATE POLICY "Authenticated read own admin row"
  ON public.admins FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admin manage admins table" ON public.admins;
CREATE POLICY "Admin manage admins table"
  ON public.admins FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Diagnóstico: rode SELECT * FROM public.diagnose_setup();
CREATE OR REPLACE FUNCTION public.diagnose_setup()
RETURNS TABLE(etapa TEXT, resultado TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  auth_count INTEGER;
  users_count INTEGER;
  admins_count INTEGER;
BEGIN
  SELECT count(*) INTO auth_count FROM auth.users;
  SELECT count(*) INTO users_count FROM public.users;
  SELECT count(*) INTO admins_count FROM public.admins;

  RETURN QUERY SELECT 'Usuários em Authentication (auth.users)'::TEXT,
    auth_count::TEXT || ' usuário(s)';

  RETURN QUERY SELECT 'Registros em public.users'::TEXT,
    users_count::TEXT || ' registro(s)';

  RETURN QUERY SELECT 'Registros em public.admins'::TEXT,
    admins_count::TEXT || ' registro(s)';

  IF auth_count = 0 THEN
    RETURN QUERY SELECT 'Ação necessária'::TEXT,
      'Crie um usuário em Authentication → Users (Add user)'::TEXT;
  ELSIF admins_count = 0 THEN
    RETURN QUERY SELECT 'Ação necessária'::TEXT,
      'Execute: SELECT public.grant_admin(''seu-email@exemplo.com'');'::TEXT;
  ELSE
    RETURN QUERY SELECT 'Status'::TEXT, 'OK — pode testar /admin/login'::TEXT;
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.diagnose_setup() TO postgres, service_role, authenticated, anon;

-- grant_admin: usa e-mail real do auth.users
CREATE OR REPLACE FUNCTION public.grant_admin(target_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  uid UUID;
  auth_email TEXT;
  admin_role_id UUID;
BEGIN
  SELECT id, email INTO uid, auth_email
  FROM auth.users
  WHERE lower(email) = lower(trim(target_email));

  IF uid IS NULL THEN
    RAISE EXCEPTION
      'Nenhum usuário em Authentication com e-mail "%". Vá em Authentication → Users → Add user.',
      target_email;
  END IF;

  SELECT id INTO admin_role_id FROM public.roles WHERE name = 'admin' LIMIT 1;

  IF admin_role_id IS NULL THEN
    RAISE EXCEPTION 'Role "admin" não encontrada. Execute o script 001_initial_schema.sql.';
  END IF;

  INSERT INTO public.users (id, email, role_id)
  VALUES (uid, auth_email, admin_role_id)
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      role_id = admin_role_id,
      updated_at = NOW();

  INSERT INTO public.admins (user_id, email, is_active)
  VALUES (uid, auth_email, true)
  ON CONFLICT (user_id) DO UPDATE
  SET email = EXCLUDED.email,
      is_active = true;

  RETURN 'OK — Admin: ' || auth_email || ' | user_id: ' || uid::TEXT;
END;
$$;

GRANT EXECUTE ON FUNCTION public.grant_admin(TEXT) TO postgres, service_role;
