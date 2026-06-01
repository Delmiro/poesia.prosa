# Configurar Supabase — Prosa & Poesia

Guia passo a passo para conectar o portal ao Supabase.

---

## 1. Criar o projeto

1. Acesse [https://supabase.com](https://supabase.com) e faça login.
2. Clique em **New project**.
3. Escolha organização, **nome** (ex.: `poesia-prosa`), **senha do banco** (guarde em local seguro).
4. Região: preferencialmente mais próxima do Brasil (ex.: `South America`).
5. Aguarde o projeto ficar **Active** (1–2 minutos).

---

## 2. Copiar as chaves da API

1. No painel: **Project Settings** (ícone de engrenagem).
2. Menu **API**.
3. Anote:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** (secret) → `SUPABASE_SERVICE_ROLE_KEY` (não exponha no front-end)

---

## 3. Arquivo `.env.local`

Na raiz do projeto (`poesia.prosa`):

```bash
cp .env.example .env.local
```

Edite `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Prosa & Poesia
```

**Na Vercel (produção):** Settings → Environment Variables — mesmo conteúdo, **sem aspas** no valor.

Exemplo correto da URL:
`https://qzedlqjlaarpoctdqmdm.supabase.co`

Errado: `qzedlqjlaarpoctdqmdm.supabase.co` (sem https), `"https://..."` (com aspas), ou só o ID do projeto.

Reinicie o servidor após salvar:

```bash
npm run dev
```

---

## 4. Criar tabelas (migrations SQL)

1. No Supabase: **SQL Editor** → **New query**.
2. Execute **na ordem**, copiando o conteúdo de cada arquivo:

| Ordem | Arquivo |
|-------|---------|
| 1 | `supabase/migrations/001_initial_schema.sql` |
| 2 | `supabase/migrations/002_admin_policies.sql` |
| 3 | `supabase/migrations/003_storage_buckets.sql` |
| 4 | `supabase/migrations/004_seed_users_admin_menus.sql` |

3. Clique em **Run** em cada um. Deve aparecer “Success”.

Isso cria tabelas (poems, chronicles, subscribers, menus, admins, etc.) e políticas de segurança (RLS).

---

## 5. Storage (revistas PDF e capas)

Se o script `003_storage_buckets.sql` rodou com sucesso, os buckets já existem:

- `magazines` — PDFs das revistas
- `publications` — imagens de capa

Confira em **Storage** no painel. Se preferir criar manualmente:

1. **Storage** → **New bucket**
2. Nome: `magazines`, marque **Public bucket**
3. Repita para `publications`

---

## 6. Criar usuário administrador

### 6.1 Usuário no Auth

1. **Authentication** → **Users** → **Add user** → **Create new user**
2. E-mail: `admin@seudominio.com`
3. Senha: defina uma senha forte
4. Marque **Auto Confirm User** (para não precisar confirmar e-mail em dev)
5. Salve

### 6.2 Promover a admin (script `004`)

No **SQL Editor** (troque o e-mail):

```sql
-- Se o usuário já existia antes do script 004:
SELECT public.sync_auth_users_to_public();

-- Cria registro em public.users e public.admins automaticamente:
SELECT public.grant_admin('admin@seudominio.com');
```

Conferir:

```sql
SELECT * FROM public.admins;
SELECT * FROM public.users;
```

**Alternativa manual** (sem função):

```sql
INSERT INTO admins (user_id, email, is_active)
SELECT id, email, true FROM auth.users WHERE email = 'admin@seudominio.com';
```

---

## 7. Testar

| O quê | URL |
|-------|-----|
| Site público | http://localhost:3000 |
| Login admin | http://localhost:3000/admin/login |
| Rodapé → Área Administrativa | mesmo link |

Entre com o e-mail e senha criados no passo 6.

---

## 8. Produção (Vercel / hospedagem)

Nas variáveis de ambiente do provedor, configure as mesmas chaves:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (se usar APIs server-side)
- `NEXT_PUBLIC_SITE_URL` → URL real (ex.: `https://seusite.com.br`)

No Supabase: **Authentication** → **URL Configuration** → adicione a URL do site em **Site URL** e **Redirect URLs**.

---

## Problemas comuns

| Erro | Solução |
|------|---------|
| Login admin: “Supabase não configurado” | Confira `.env.local` e reinicie `npm run dev` |
| “Você não tem permissão de administrador” | Usuário não está na tabela `admins` ou `is_active = false` |
| Upload de revista falha | Rode `003_storage_buckets.sql` ou crie buckets públicos |
| Site sem conteúdo | Normal até publicar no painel; ou use modo demo sem `.env` |
| RLS bloqueia insert | Execute `002_admin_policies.sql` após `001` |

---

## Ordem resumida

```
1. Projeto no supabase.com
2. .env.local com URL + anon key
3. SQL: 001 → 002 → 003
4. Usuário Auth + INSERT em admins
5. npm run dev → /admin/login
```
