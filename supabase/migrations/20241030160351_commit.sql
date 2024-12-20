create table "public"."collections" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "name" text not null,
    "user_id" uuid not null
);


alter table "public"."collections" enable row level security;

alter table "public"."saves" add column "collection_id" bigint;

alter table "public"."users_public" add column "username" text not null;

CREATE UNIQUE INDEX collections_pkey ON public.collections USING btree (id);

alter table "public"."collections" add constraint "collections_pkey" PRIMARY KEY using index "collections_pkey";

alter table "public"."collections" add constraint "collections_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."collections" validate constraint "collections_user_id_fkey";

alter table "public"."saves" add constraint "saves_collection_id_fkey" FOREIGN KEY (collection_id) REFERENCES collections(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."saves" validate constraint "saves_collection_id_fkey";

alter table "public"."users_public" add constraint "users_public_username_check" CHECK ((length(username) > 2)) not valid;

alter table "public"."users_public" validate constraint "users_public_username_check";

grant delete on table "public"."collections" to "anon";

grant insert on table "public"."collections" to "anon";

grant references on table "public"."collections" to "anon";

grant select on table "public"."collections" to "anon";

grant trigger on table "public"."collections" to "anon";

grant truncate on table "public"."collections" to "anon";

grant update on table "public"."collections" to "anon";

grant delete on table "public"."collections" to "authenticated";

grant insert on table "public"."collections" to "authenticated";

grant references on table "public"."collections" to "authenticated";

grant select on table "public"."collections" to "authenticated";

grant trigger on table "public"."collections" to "authenticated";

grant truncate on table "public"."collections" to "authenticated";

grant update on table "public"."collections" to "authenticated";

grant delete on table "public"."collections" to "service_role";

grant insert on table "public"."collections" to "service_role";

grant references on table "public"."collections" to "service_role";

grant select on table "public"."collections" to "service_role";

grant trigger on table "public"."collections" to "service_role";

grant truncate on table "public"."collections" to "service_role";

grant update on table "public"."collections" to "service_role";


