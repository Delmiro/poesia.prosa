# Prosa & Poesia — Portal Literário

Portal literário moderno inspirado no Prosa & Poesia: poesias, crônicas, contos, artigos, revistas digitais em PDF e notícias culturais, com painel administrativo completo.

## Stack

- **Next.js 16** (App Router, SSR)
- **React 19** + **TypeScript**
- **Tailwind CSS 4**
- **Supabase** (Auth, Database, Storage, Realtime)
- **Framer Motion**
- **PWA** (`@ducanh2912/next-pwa`)

## Início rápido

```bash
npm install
cp .env.example .env.local
# Preencha NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

Sem Supabase configurado, o site funciona em **modo demonstração** com conteúdo de exemplo.

## Supabase

1. Crie um projeto em [supabase.com](https://supabase.com).
2. Execute o SQL em `supabase/migrations/001_initial_schema.sql` no SQL Editor.
3. Crie buckets de Storage (públicos):
   - `magazines` — PDFs das revistas
   - `publications` — capas e imagens
4. Em **Authentication → Users**, crie um usuário administrador.
5. Insira o admin na tabela `admins`:

```sql
INSERT INTO admins (user_id, email)
VALUES ('UUID-DO-USUARIO-AUTH', 'admin@seudominio.com');
```

6. Configure `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # opcional, para operações server-side
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Prosa & Poesia
```

## Ler a Edição 20 (revista em PDF)

O arquivo foi colocado em `public/magazines/edicao-20.pdf`. Abra no navegador:

**http://localhost:3000/revistas/edicao-20**

Também aparece na home em “Revistas Digitais” e no destaque do banner.

## Área administrativa

1. Configure o Supabase no `.env.local` (obrigatório para login).
2. Crie um usuário em **Supabase → Authentication → Users**.
3. Registre-o na tabela `admins` (SQL no README acima).
4. Acesse: **http://localhost:3000/admin/login**
5. Entre com o e-mail e senha do usuário criado no Supabase.

Sem Supabase configurado, o login admin exibirá aviso — o site público funciona em modo demo.

## Rotas principais

| Rota | Descrição |
|------|-----------|
| `/` | Home (banner, poesias, crônicas, revistas, frase do dia) |
| `/leitura/[tipo]/[slug]` | Página de leitura |
| `/revistas` | Lista de revistas |
| `/revistas/[slug]` | Leitor PDF |
| `/busca` | Busca por título, autor, conteúdo |
| `/categoria/[slug]` | Listagem por categoria |
| `/receba-novidades` | Cadastro público (e-mail / WhatsApp) |
| `/admin/login` | Login administrativo |
| `/admin` | Painel (conteúdo, menus, home, assinantes, SEO) |

## Painel administrativo

- Gestão de poemas, crônicas, contos, artigos e notícias
- Upload de revistas (PDF + capa)
- Edição de menus (principal, rodapé, institucional)
- Configuração da home (frase do dia, destaques)
- Assinantes com exportação Excel e filtro por data
- SEO configurável (meta tags, OG)

## PWA e ícones

Adicione ícones em `public/icons/icon-192.png` e `icon-512.png` para instalação completa. O `manifest.json` já está configurado.

## Build

```bash
npm run build
npm start
```

## Estrutura

```
src/
  app/(site)/          # Site público
  app/admin/           # Painel admin
  app/api/             # APIs (assinantes, likes, admin)
  components/          # UI e blocos da home
  lib/services/        # Camada de dados Supabase + demo
supabase/migrations/   # Schema SQL
```

## Licença

Projeto privado — uso conforme acordado com o cliente.
