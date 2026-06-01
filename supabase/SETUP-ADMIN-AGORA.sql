-- =============================================================================
-- PASSO A: Execute ANTES este arquivo (se ainda não rodou):
--   supabase/migrations/005_fix_admins_rls_and_setup.sql
--
-- PASSO B: Troque o e-mail na linha "grant_admin" abaixo e clique RUN
-- =============================================================================

-- Quantos usuários existem no Authentication?
SELECT count(*) AS total_auth_users FROM auth.users;

SELECT id, email, created_at FROM auth.users;

-- Se total_auth_users = 0 → pare aqui!
-- Crie em: Authentication → Users → Add user (Auto Confirm User)

-- Sincronizar para public.users
SELECT public.sync_auth_users_to_public() AS linhas_inseridas_em_users;

-- ⚠️ TROQUE O E-MAIL ⚠️
SELECT public.grant_admin('diegoalbuquerque03@gmail.com');

-- Deve retornar: OK — Admin: seu@email.com | user_id: ...

SELECT * FROM public.admins;
SELECT * FROM public.users;
