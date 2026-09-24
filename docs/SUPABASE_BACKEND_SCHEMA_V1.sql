-- DocenteDigital — esquema backend v1 (BORRADOR PARA REVISIÓN)
-- No ejecutar en producción sin revisión de RLS, índices y políticas de retención.
-- Diseñado para Supabase/Postgres con auth.users.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'docente' check (role in ('docente','director','docente_director','owner')),
  plan_code text not null default 'beta',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.institutions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  modular_code text,
  local_code text,
  ugel text,
  dre_gre text,
  region text,
  province text,
  district text,
  locality_type text,
  locality_name text,
  geographic_area text,
  organization_type text,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.institution_members (
  institution_id uuid not null references public.institutions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  member_role text not null default 'docente' check (member_role in ('docente','director','docente_director')),
  primary key (institution_id,user_id)
);

create table if not exists public.teacher_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  level text,
  ie_type text,
  grades jsonb not null default '[]'::jsonb,
  areas jsonb not null default '[]'::jsonb,
  linguistic_mode text,
  language text,
  original_language text,
  communal_calendar text,
  notes text,
  updated_at timestamptz not null default now()
);

create table if not exists public.planning_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  institution_id uuid references public.institutions(id) on delete set null,
  document_type text not null check (document_type in ('annual','unit','project','session','diagnostic')),
  title text not null,
  status text not null default 'draft' check (status in ('draft','reviewed','archived')),
  parent_id uuid references public.planning_documents(id) on delete set null,
  level text,
  grades jsonb not null default '[]'::jsonb,
  areas jsonb not null default '[]'::jsonb,
  content jsonb not null default '{}'::jsonb,
  version integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.materials (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  institution_id uuid references public.institutions(id) on delete set null,
  source_document_id uuid references public.planning_documents(id) on delete set null,
  material_type text not null,
  title text not null,
  level text,
  grade text,
  area text,
  language text,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.evaluation_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  institution_id uuid references public.institutions(id) on delete set null,
  planning_document_id uuid references public.planning_documents(id) on delete set null,
  student_code text not null,
  grade text,
  area text,
  criterion text not null,
  achievement_level text,
  evidence_note text,
  next_step text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.director_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  institution_id uuid references public.institutions(id) on delete set null,
  document_type text not null,
  title text not null,
  content jsonb not null default '{}'::jsonb,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.library_assets (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references auth.users(id) on delete set null,
  institution_id uuid references public.institutions(id) on delete set null,
  visibility text not null default 'private' check (visibility in ('private','institution','public')),
  level text,
  area text,
  topic text,
  kind text,
  title text not null,
  storage_path text,
  preview_url text,
  source_name text,
  source_url text,
  author text,
  license text,
  reusable boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_usage (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  institution_id uuid references public.institutions(id) on delete set null,
  request_kind text not null,
  model text,
  input_tokens integer not null default 0,
  output_tokens integer not null default 0,
  estimated_cost_usd numeric(12,6) not null default 0,
  cache_hit boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.user_quotas (
  user_id uuid primary key references auth.users(id) on delete cascade,
  period_start date not null,
  period_end date not null,
  text_budget_usd numeric(10,4) not null default 0,
  image_credits integer not null default 0,
  used_text_usd numeric(10,4) not null default 0,
  used_image_credits integer not null default 0,
  updated_at timestamptz not null default now()
);

create index if not exists idx_planning_user on public.planning_documents(user_id,updated_at desc);
create index if not exists idx_planning_parent on public.planning_documents(parent_id);
create index if not exists idx_eval_user on public.evaluation_records(user_id,updated_at desc);
create index if not exists idx_eval_doc on public.evaluation_records(planning_document_id);
create index if not exists idx_assets_topic on public.library_assets(level,area,topic);
create index if not exists idx_usage_user on public.ai_usage(user_id,created_at desc);

alter table public.profiles enable row level security;
alter table public.institutions enable row level security;
alter table public.institution_members enable row level security;
alter table public.teacher_settings enable row level security;
alter table public.planning_documents enable row level security;
alter table public.materials enable row level security;
alter table public.evaluation_records enable row level security;
alter table public.director_documents enable row level security;
alter table public.library_assets enable row level security;
alter table public.ai_usage enable row level security;
alter table public.user_quotas enable row level security;

create policy "profiles_self_select" on public.profiles for select using (auth.uid() = user_id);
create policy "profiles_self_update" on public.profiles for update using (auth.uid() = user_id);

create policy "members_self_select" on public.institution_members for select using (auth.uid() = user_id);

create policy "institutions_member_select" on public.institutions for select using (
  exists (
    select 1 from public.institution_members m
    where m.institution_id = institutions.id and m.user_id = auth.uid()
  )
);

create policy "teacher_settings_self_all" on public.teacher_settings for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "planning_self_all" on public.planning_documents for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "materials_self_all" on public.materials for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "evaluation_self_all" on public.evaluation_records for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "director_docs_self_all" on public.director_documents for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "usage_self_select" on public.ai_usage for select using (auth.uid() = user_id);
create policy "quota_self_select" on public.user_quotas for select using (auth.uid() = user_id);

create policy "assets_visible_select" on public.library_assets for select using (
  visibility = 'public'
  or owner_user_id = auth.uid()
  or (
    visibility = 'institution'
    and exists (
      select 1 from public.institution_members m
      where m.institution_id = library_assets.institution_id and m.user_id = auth.uid()
    )
  )
);

-- Escritura de ai_usage y user_quotas debe hacerse desde backend/Edge Function con rol de servicio,
-- nunca confiando en valores enviados por el navegador.
