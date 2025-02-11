create type "public"."collection_privacy_type" as enum ('PUBLIC', 'FRIENDS_ONLY', 'PRIVATE');

create type "public"."feed_type" as enum ('REVIEW', 'REVIEW_LIKE', 'FOLLOW');

create sequence "public"."favourites_count_seq";

drop policy "Enable users to view their own data only" on "public"."collection_follows";

alter table "public"."comment_likes" drop constraint "comment_likes_comment_id_fkey";

alter table "public"."comments" drop constraint "comments_review_id_fkey";

drop function if exists "public"."get_pub_list_item"(lat double precision, long double precision);

alter table "public"."collection_follows" drop constraint "collection_follows_pkey";

drop index if exists "public"."collection_follows_pkey";

create table "public"."collection_collaborations" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "user_id" uuid not null,
    "collection_id" bigint not null
);


alter table "public"."collection_collaborations" enable row level security;

create table "public"."favourites" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "pub_id" bigint not null,
    "user_id" uuid not null default auth.uid(),
    "count" integer not null default nextval('favourites_count_seq'::regclass)
);


alter table "public"."favourites" enable row level security;

create table "public"."feed" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "review_id" bigint,
    "review_like_id" bigint,
    "user_id" uuid not null,
    "type" feed_type not null,
    "updated_at" timestamp with time zone not null default now(),
    "follow_id" bigint
);


alter table "public"."feed" enable row level security;

create table "public"."follows" (
    "created_at" timestamp with time zone not null default now(),
    "created_by" uuid not null default auth.uid(),
    "user_id" uuid not null,
    "id" bigint generated by default as identity not null
);


alter table "public"."follows" enable row level security;

alter table "public"."collection_follows" drop column "id";

alter table "public"."collection_follows" alter column "user_id" set default auth.uid();

alter table "public"."collections" alter column "public" set default 'PRIVATE'::collection_privacy_type;

alter table "public"."collections" alter column "public" set data type collection_privacy_type using "public"::collection_privacy_type;

alter table "public"."reviews" alter column "updated_at" set not null;

alter table "public"."users_public" add column "bio" text not null default ''::text;

alter table "public"."users_public" add column "location" text not null default ''::text;

alter table "public"."users_public" alter column "profile_photo" set default ''::text;

alter table "public"."users_public" alter column "profile_photo" set not null;

alter sequence "public"."favourites_count_seq" owned by "public"."favourites"."count";

CREATE UNIQUE INDEX collection_collaborations_pkey ON public.collection_collaborations USING btree (id);

CREATE UNIQUE INDEX favourites_pkey ON public.favourites USING btree (id, pub_id, user_id);

CREATE UNIQUE INDEX feed_pkey ON public.feed USING btree (id);

CREATE UNIQUE INDEX follows_id_key ON public.follows USING btree (id);

CREATE UNIQUE INDEX follows_pkey ON public.follows USING btree (created_by, user_id, id);

CREATE UNIQUE INDEX uq_favourites_user_id_pub_id ON public.favourites USING btree (pub_id, user_id);

CREATE UNIQUE INDEX collection_follows_pkey ON public.collection_follows USING btree (user_id, collection_id);

alter table "public"."collection_collaborations" add constraint "collection_collaborations_pkey" PRIMARY KEY using index "collection_collaborations_pkey";

alter table "public"."favourites" add constraint "favourites_pkey" PRIMARY KEY using index "favourites_pkey";

alter table "public"."feed" add constraint "feed_pkey" PRIMARY KEY using index "feed_pkey";

alter table "public"."follows" add constraint "follows_pkey" PRIMARY KEY using index "follows_pkey";

alter table "public"."collection_follows" add constraint "collection_follows_pkey" PRIMARY KEY using index "collection_follows_pkey";

alter table "public"."collection_collaborations" add constraint "collection_collaborations_collection_id_fkey" FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE not valid;

alter table "public"."collection_collaborations" validate constraint "collection_collaborations_collection_id_fkey";

alter table "public"."collection_collaborations" add constraint "collection_collaborations_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users_public(id) ON DELETE CASCADE not valid;

alter table "public"."collection_collaborations" validate constraint "collection_collaborations_user_id_fkey";

alter table "public"."favourites" add constraint "ck_limit_three" CHECK ((validate_favourites_limit_three(user_id) = true)) not valid;

alter table "public"."favourites" validate constraint "ck_limit_three";

alter table "public"."favourites" add constraint "favourites_pub_id_fkey" FOREIGN KEY (pub_id) REFERENCES pubs(id) ON DELETE CASCADE not valid;

alter table "public"."favourites" validate constraint "favourites_pub_id_fkey";

alter table "public"."favourites" add constraint "favourites_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users_public(id) ON DELETE CASCADE not valid;

alter table "public"."favourites" validate constraint "favourites_user_id_fkey";

alter table "public"."favourites" add constraint "uq_favourites_user_id_pub_id" UNIQUE using index "uq_favourites_user_id_pub_id";

alter table "public"."feed" add constraint "feed_follow_id_fkey" FOREIGN KEY (follow_id) REFERENCES follows(id) ON DELETE CASCADE not valid;

alter table "public"."feed" validate constraint "feed_follow_id_fkey";

alter table "public"."feed" add constraint "feed_review_id_fkey" FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE not valid;

alter table "public"."feed" validate constraint "feed_review_id_fkey";

alter table "public"."feed" add constraint "feed_review_like_id_fkey" FOREIGN KEY (review_like_id) REFERENCES review_likes(id) ON DELETE CASCADE not valid;

alter table "public"."feed" validate constraint "feed_review_like_id_fkey";

alter table "public"."feed" add constraint "feed_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users_public(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."feed" validate constraint "feed_user_id_fkey";

alter table "public"."follows" add constraint "follows_created_by_fkey" FOREIGN KEY (created_by) REFERENCES users_public(id) ON DELETE CASCADE not valid;

alter table "public"."follows" validate constraint "follows_created_by_fkey";

alter table "public"."follows" add constraint "follows_id_key" UNIQUE using index "follows_id_key";

alter table "public"."follows" add constraint "follows_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users_public(id) ON DELETE CASCADE not valid;

alter table "public"."follows" validate constraint "follows_user_id_fkey";

alter table "public"."comment_likes" add constraint "comment_likes_comment_id_fkey" FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE not valid;

alter table "public"."comment_likes" validate constraint "comment_likes_comment_id_fkey";

alter table "public"."comments" add constraint "comments_review_id_fkey" FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE not valid;

alter table "public"."comments" validate constraint "comments_review_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_feed_follow()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
	INSERT INTO feed (user_id, follow_id, type)
	VALUES (NEW.created_by, NEW.id, 'FOLLOW');

	RETURN NEW;
END;$function$
;

CREATE OR REPLACE FUNCTION public.create_feed_review()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
	INSERT INTO feed (user_id, review_id, type)
	VALUES (NEW.user_id, NEW.id, 'REVIEW');

	RETURN NEW;
END;$function$
;

CREATE OR REPLACE FUNCTION public.create_feed_review_like()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
	INSERT INTO feed (user_id, review_like_id, type)
	VALUES (NEW.user_id, NEW.id, 'REVIEW_LIKE');

	RETURN NEW;
END;$function$
;

create or replace view "public"."location_pubs" as  SELECT pubs.id,
    pubs.created_at,
    pubs.updated_at,
    pubs.name,
    pubs.address,
    pubs.phone_number,
    pubs.google_id,
    pubs.reservable,
    pubs.website,
    pubs.dog_friendly,
    pubs.live_sport,
    pubs.beer_garden,
    pubs.kid_friendly,
    pubs.free_wifi,
    pubs.rooftop,
    pubs.wheelchair_accessible,
    pubs.hidden,
    pubs.location,
    pubs.brewery,
    pubs.dart_board,
    pubs.foosball_table,
    pubs.pool_table,
    pubs.description,
    pubs.primary_photo,
    st_asgeojson(pubs.location) AS geoj_location
   FROM pubs;


CREATE OR REPLACE FUNCTION public.update_review_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
	-- Update feed updated_at
	UPDATE feed
	SET updated_at = now()
	WHERE type = 'REVIEW'
	AND review_id = NEW.id
	AND user_id = NEW.user_id;

	NEW.updated_at = now();
	RETURN NEW;
END$function$
;

CREATE OR REPLACE FUNCTION public.validate_favourites_limit_three(u_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
BEGIN
IF (
	SELECT COUNT(*) 
	FROM public.favourites f 
	WHERE f.user_id = u_id
) >= 3 THEN 
	RETURN False;
END IF;

RETURN True;
END
$function$
;

CREATE OR REPLACE FUNCTION public.create_collection_follow()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
  INSERT INTO collection_follows (collection_id, user_id)
	VALUES (NEW.id, NEW.user_id);

  RETURN NEW;
END$function$
;

CREATE OR REPLACE FUNCTION public.get_pub_list_item(lat double precision, long double precision)
 RETURNS TABLE(id bigint, name character varying, address character varying, saved boolean, rating double precision, num_reviews integer, dist_meters double precision, photos text[], primary_photo text, location text)
 LANGUAGE sql
AS $function$
	select
		pubs.id,
		pubs.name,
		pubs.address,
		count(saves.pub_id = pubs.id AND saves.user_id = auth.uid()) > 0 AS saved,
		COALESCE(avg(reviews.rating)::double precision, 0::double precision) / 2::double precision AS rating,
		count(DISTINCT reviews.*) as num_reviews,
		st_distance(
	        pubs.location,
	        st_point(long, lat) :: geography
	    ) as dist_meters,
		array_remove(array_agg(DISTINCT pub_photos.key), NULL::text) AS photos,
		pubs.primary_photo,
		st_asgeojson(pubs.location) AS location
	from public.pubs
	left join saves on pubs.id = saves.pub_id
	left join reviews on pubs.id = reviews.pub_id
	left join pub_photos on pubs.id = pub_photos.pub_id
	group by pubs.id;
$function$
;

grant delete on table "public"."collection_collaborations" to "anon";

grant insert on table "public"."collection_collaborations" to "anon";

grant references on table "public"."collection_collaborations" to "anon";

grant select on table "public"."collection_collaborations" to "anon";

grant trigger on table "public"."collection_collaborations" to "anon";

grant truncate on table "public"."collection_collaborations" to "anon";

grant update on table "public"."collection_collaborations" to "anon";

grant delete on table "public"."collection_collaborations" to "authenticated";

grant insert on table "public"."collection_collaborations" to "authenticated";

grant references on table "public"."collection_collaborations" to "authenticated";

grant select on table "public"."collection_collaborations" to "authenticated";

grant trigger on table "public"."collection_collaborations" to "authenticated";

grant truncate on table "public"."collection_collaborations" to "authenticated";

grant update on table "public"."collection_collaborations" to "authenticated";

grant delete on table "public"."collection_collaborations" to "service_role";

grant insert on table "public"."collection_collaborations" to "service_role";

grant references on table "public"."collection_collaborations" to "service_role";

grant select on table "public"."collection_collaborations" to "service_role";

grant trigger on table "public"."collection_collaborations" to "service_role";

grant truncate on table "public"."collection_collaborations" to "service_role";

grant update on table "public"."collection_collaborations" to "service_role";

grant delete on table "public"."favourites" to "anon";

grant insert on table "public"."favourites" to "anon";

grant references on table "public"."favourites" to "anon";

grant select on table "public"."favourites" to "anon";

grant trigger on table "public"."favourites" to "anon";

grant truncate on table "public"."favourites" to "anon";

grant update on table "public"."favourites" to "anon";

grant delete on table "public"."favourites" to "authenticated";

grant insert on table "public"."favourites" to "authenticated";

grant references on table "public"."favourites" to "authenticated";

grant select on table "public"."favourites" to "authenticated";

grant trigger on table "public"."favourites" to "authenticated";

grant truncate on table "public"."favourites" to "authenticated";

grant update on table "public"."favourites" to "authenticated";

grant delete on table "public"."favourites" to "service_role";

grant insert on table "public"."favourites" to "service_role";

grant references on table "public"."favourites" to "service_role";

grant select on table "public"."favourites" to "service_role";

grant trigger on table "public"."favourites" to "service_role";

grant truncate on table "public"."favourites" to "service_role";

grant update on table "public"."favourites" to "service_role";

grant delete on table "public"."feed" to "anon";

grant insert on table "public"."feed" to "anon";

grant references on table "public"."feed" to "anon";

grant select on table "public"."feed" to "anon";

grant trigger on table "public"."feed" to "anon";

grant truncate on table "public"."feed" to "anon";

grant update on table "public"."feed" to "anon";

grant delete on table "public"."feed" to "authenticated";

grant insert on table "public"."feed" to "authenticated";

grant references on table "public"."feed" to "authenticated";

grant select on table "public"."feed" to "authenticated";

grant trigger on table "public"."feed" to "authenticated";

grant truncate on table "public"."feed" to "authenticated";

grant update on table "public"."feed" to "authenticated";

grant delete on table "public"."feed" to "service_role";

grant insert on table "public"."feed" to "service_role";

grant references on table "public"."feed" to "service_role";

grant select on table "public"."feed" to "service_role";

grant trigger on table "public"."feed" to "service_role";

grant truncate on table "public"."feed" to "service_role";

grant update on table "public"."feed" to "service_role";

grant delete on table "public"."follows" to "anon";

grant insert on table "public"."follows" to "anon";

grant references on table "public"."follows" to "anon";

grant select on table "public"."follows" to "anon";

grant trigger on table "public"."follows" to "anon";

grant truncate on table "public"."follows" to "anon";

grant update on table "public"."follows" to "anon";

grant delete on table "public"."follows" to "authenticated";

grant insert on table "public"."follows" to "authenticated";

grant references on table "public"."follows" to "authenticated";

grant select on table "public"."follows" to "authenticated";

grant trigger on table "public"."follows" to "authenticated";

grant truncate on table "public"."follows" to "authenticated";

grant update on table "public"."follows" to "authenticated";

grant delete on table "public"."follows" to "service_role";

grant insert on table "public"."follows" to "service_role";

grant references on table "public"."follows" to "service_role";

grant select on table "public"."follows" to "service_role";

grant trigger on table "public"."follows" to "service_role";

grant truncate on table "public"."follows" to "service_role";

grant update on table "public"."follows" to "service_role";

create policy "Enable delete for users based on user_id"
on "public"."collection_follows"
as permissive
for delete
to public
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "users can view public collection follows"
on "public"."collection_follows"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM collections
  WHERE ((collection_follows.collection_id = collections.id) AND (collections.public = 'PUBLIC'::collection_privacy_type)))));


create policy "users can view their own follows"
on "public"."collection_follows"
as permissive
for select
to public
using ((user_id = auth.uid()));


create policy "users can view public collections"
on "public"."collections"
as permissive
for select
to public
using ((public = 'PUBLIC'::collection_privacy_type));


create policy "Enable delete for users based on user_id"
on "public"."favourites"
as permissive
for delete
to public
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable insert for users based on user_id"
on "public"."favourites"
as permissive
for insert
to public
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable read access for all users"
on "public"."favourites"
as permissive
for select
to public
using (true);


create policy "Enable insert for users based on user_id"
on "public"."feed"
as permissive
for insert
to public
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable read access for all users"
on "public"."feed"
as permissive
for select
to public
using (true);


create policy "Enable update for users based on user_id"
on "public"."feed"
as permissive
for update
to public
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable delete for users based on created_by"
on "public"."follows"
as permissive
for delete
to public
using ((( SELECT auth.uid() AS uid) = created_by));


create policy "Enable insert for users based on created_by"
on "public"."follows"
as permissive
for insert
to public
with check ((( SELECT auth.uid() AS uid) = created_by));


create policy "Enable read access for all users"
on "public"."follows"
as permissive
for select
to public
using (true);


create policy "Enable update for users based on id"
on "public"."users_public"
as permissive
for update
to public
using ((auth.uid() = id))
with check ((auth.uid() = id));


create policy "Users can insert their own row"
on "public"."users_public"
as permissive
for insert
to public
with check ((auth.uid() = id));


CREATE TRIGGER update_collection_updated_at_after_collection_item_insert AFTER INSERT ON public.collection_items FOR EACH ROW EXECUTE FUNCTION update_collection_updated_at();

CREATE TRIGGER create_feed_follow AFTER INSERT ON public.follows FOR EACH ROW EXECUTE FUNCTION create_feed_follow();

CREATE TRIGGER create_feed_on_create AFTER INSERT ON public.review_likes FOR EACH ROW EXECUTE FUNCTION create_feed_review_like();

CREATE TRIGGER create_feed_review AFTER INSERT ON public.reviews FOR EACH ROW EXECUTE FUNCTION create_feed_review();

CREATE TRIGGER update_review_updated_at_on_update BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION update_review_updated_at();


