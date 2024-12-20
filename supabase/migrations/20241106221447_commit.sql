create table "public"."collection_follows" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "collection_id" bigint not null,
    "user_id" uuid not null
);


alter table "public"."collection_follows" enable row level security;

CREATE UNIQUE INDEX collection_follows_pkey ON public.collection_follows USING btree (id);

alter table "public"."collection_follows" add constraint "collection_follows_pkey" PRIMARY KEY using index "collection_follows_pkey";

alter table "public"."collection_follows" add constraint "collection_follows_collection_id_fkey" FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE not valid;

alter table "public"."collection_follows" validate constraint "collection_follows_collection_id_fkey";

alter table "public"."collection_follows" add constraint "collection_follows_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users_public(id) ON DELETE CASCADE not valid;

alter table "public"."collection_follows" validate constraint "collection_follows_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_collection_follow()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
  INSERT INTO collection_follows (collection_id, user_id)
	VALUES (NEW.id, auth.uid());

  RETURN NEW;
END$function$
;

grant delete on table "public"."collection_follows" to "anon";

grant insert on table "public"."collection_follows" to "anon";

grant references on table "public"."collection_follows" to "anon";

grant select on table "public"."collection_follows" to "anon";

grant trigger on table "public"."collection_follows" to "anon";

grant truncate on table "public"."collection_follows" to "anon";

grant update on table "public"."collection_follows" to "anon";

grant delete on table "public"."collection_follows" to "authenticated";

grant insert on table "public"."collection_follows" to "authenticated";

grant references on table "public"."collection_follows" to "authenticated";

grant select on table "public"."collection_follows" to "authenticated";

grant trigger on table "public"."collection_follows" to "authenticated";

grant truncate on table "public"."collection_follows" to "authenticated";

grant update on table "public"."collection_follows" to "authenticated";

grant delete on table "public"."collection_follows" to "service_role";

grant insert on table "public"."collection_follows" to "service_role";

grant references on table "public"."collection_follows" to "service_role";

grant select on table "public"."collection_follows" to "service_role";

grant trigger on table "public"."collection_follows" to "service_role";

grant truncate on table "public"."collection_follows" to "service_role";

grant update on table "public"."collection_follows" to "service_role";

create policy "Enable insert for users based on user_id"
on "public"."collection_follows"
as permissive
for insert
to public
with check ((( SELECT auth.uid() AS uid) = user_id));


CREATE TRIGGER follow_user_created_collection AFTER INSERT ON public.collections FOR EACH ROW EXECUTE FUNCTION create_collection_follow();


