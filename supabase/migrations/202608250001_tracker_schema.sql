create schema if not exists tracker;

create table if not exists tracker.profiles (
  account_id uuid primary key references auth.users(id) on delete restrict,
  timezone varchar(64) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists tracker.tasks (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references auth.users(id) on delete restrict,
  title varchar(160) not null,
  due_date timestamptz not null,
  recurrence varchar(16) not null default 'none' check (recurrence in ('none', 'daily', 'weekly')),
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists tasks_account_due_date_idx on tracker.tasks (account_id, due_date);

create table if not exists tracker.habits (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references auth.users(id) on delete restrict,
  name varchar(120) not null,
  target integer not null default 1 check (target >= 1),
  frequency varchar(16) not null check (frequency in ('daily', 'weekly')),
  check_ins date[] not null default array[]::date[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists habits_account_created_at_idx on tracker.habits (account_id, created_at);

create table if not exists tracker.workouts (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references auth.users(id) on delete restrict,
  activity varchar(120) not null,
  performed_at timestamptz not null,
  duration_minutes integer not null check (duration_minutes >= 0),
  metrics jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists workouts_account_performed_at_idx on tracker.workouts (account_id, performed_at desc);

create table if not exists tracker.food_entries (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references auth.users(id) on delete restrict,
  name varchar(160) not null,
  meal varchar(16) not null check (meal in ('breakfast', 'lunch', 'dinner', 'snack')),
  kcal integer not null check (kcal >= 0),
  carbohydrates integer not null check (carbohydrates >= 0),
  fat integer not null check (fat >= 0),
  protein integer not null check (protein >= 0),
  occurred_at timestamptz not null,
  metrics jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists food_entries_account_occurred_at_idx on tracker.food_entries (account_id, occurred_at desc);

create table if not exists tracker.audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid not null references auth.users(id) on delete restrict,
  action varchar(80) not null,
  resource_type varchar(40) not null,
  resource_id varchar(64) not null,
  outcome varchar(16) not null check (outcome in ('accepted', 'denied')),
  correlation_id varchar(128) not null,
  created_at timestamptz not null default now()
);
create index if not exists audit_events_actor_created_at_idx on tracker.audit_events (actor_id, created_at desc);

revoke all on schema tracker from public;
revoke all on all tables in schema tracker from public;

alter table tracker.profiles enable row level security;
alter table tracker.tasks enable row level security;
alter table tracker.habits enable row level security;
alter table tracker.workouts enable row level security;
alter table tracker.food_entries enable row level security;
alter table tracker.audit_events enable row level security;
alter table tracker.profiles force row level security;
alter table tracker.tasks force row level security;
alter table tracker.habits force row level security;
alter table tracker.workouts force row level security;
alter table tracker.food_entries force row level security;
alter table tracker.audit_events force row level security;

create policy account_isolation_profiles on tracker.profiles using (account_id = nullif(current_setting('request.account_id', true), '')::uuid) with check (account_id = nullif(current_setting('request.account_id', true), '')::uuid);
create policy account_isolation_tasks on tracker.tasks using (account_id = nullif(current_setting('request.account_id', true), '')::uuid) with check (account_id = nullif(current_setting('request.account_id', true), '')::uuid);
create policy account_isolation_habits on tracker.habits using (account_id = nullif(current_setting('request.account_id', true), '')::uuid) with check (account_id = nullif(current_setting('request.account_id', true), '')::uuid);
create policy account_isolation_workouts on tracker.workouts using (account_id = nullif(current_setting('request.account_id', true), '')::uuid) with check (account_id = nullif(current_setting('request.account_id', true), '')::uuid);
create policy account_isolation_food_entries on tracker.food_entries using (account_id = nullif(current_setting('request.account_id', true), '')::uuid) with check (account_id = nullif(current_setting('request.account_id', true), '')::uuid);
create policy account_isolation_audit_events on tracker.audit_events using (actor_id = nullif(current_setting('request.account_id', true), '')::uuid) with check (actor_id = nullif(current_setting('request.account_id', true), '')::uuid);
