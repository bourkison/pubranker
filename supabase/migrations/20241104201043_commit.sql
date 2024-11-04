create sequence "public"."collection_items_id_seq";

drop policy "user can view their saves" on "public"."saves";

alter table "public"."saves" drop constraint "saves_collection_id_fkey";

drop view if exists "public"."formatted_pubs";

create table "public"."collection_items" (
    "id" integer not null default nextval('collection_items_id_seq'::regclass),
    "pub_id" bigint not null,
    "collection_id" bigint not null,
    "created_by" uuid not null default auth.uid(),
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."collection_items" enable row level security;

alter table "public"."collections" add column "collaborative" boolean not null default false;

alter table "public"."collections" add column "public" boolean not null default false;

alter table "public"."saves" drop column "collection_id";

alter sequence "public"."collection_items_id_seq" owned by "public"."collection_items"."id";

CREATE UNIQUE INDEX collection_items_pkey ON public.collection_items USING btree (id, pub_id, collection_id);

alter table "public"."collection_items" add constraint "collection_items_pkey" PRIMARY KEY using index "collection_items_pkey";

alter table "public"."collection_items" add constraint "collection_items_collection_id_fkey" FOREIGN KEY (collection_id) REFERENCES collections(id) not valid;

alter table "public"."collection_items" validate constraint "collection_items_collection_id_fkey";

alter table "public"."collection_items" add constraint "collection_items_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."collection_items" validate constraint "collection_items_created_by_fkey";

alter table "public"."collection_items" add constraint "collection_items_pub_id_fkey" FOREIGN KEY (pub_id) REFERENCES pubs(id) not valid;

alter table "public"."collection_items" validate constraint "collection_items_pub_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_pub_list_item(lat double precision, long double precision)
 RETURNS TABLE(id bigint, name character varying, address character varying, saved boolean, rating double precision, num_reviews integer, dist_meters double precision, photos text[])
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
		array_remove(array_agg(DISTINCT pub_photos.key), NULL::text) AS photos
	from public.pubs
	left join saves on pubs.id = saves.pub_id
	left join reviews on pubs.id = reviews.pub_id
	left join pub_photos on pubs.id = pub_photos.pub_id
	group by pubs.id;
$function$
;

create or replace view "public"."formatted_pubs" as  SELECT p.id,
    p.name,
    p.address,
    p.phone_number,
    p.reservable,
    p.website,
    p.dog_friendly,
    p.live_sport,
    p.pool_table,
    p.dart_board,
    p.beer_garden,
    p.kid_friendly,
    p.free_wifi,
    p.rooftop,
    p.foosball_table,
    p.wheelchair_accessible,
    array_remove(array_agg(DISTINCT pp.key), NULL::text) AS photos,
    json_agg(DISTINCT oh.*) AS opening_hours,
    st_asgeojson(p.location) AS location,
    (COALESCE((avg(r.rating))::double precision, (0)::double precision) / (2)::double precision) AS rating,
    count(DISTINCT r.*) AS num_reviews,
    (count(((s.pub_id = p.id) AND (s.user_id = auth.uid()))) > 0) AS saved,
    p.google_id,
    sum(DISTINCT
        CASE
            WHEN (r.beer = true) THEN 1
            ELSE 0
        END) AS review_beer_amount,
    sum(DISTINCT
        CASE
            WHEN (r.food = true) THEN 1
            ELSE 0
        END) AS review_food_amount,
    sum(DISTINCT
        CASE
            WHEN (r.location = true) THEN 1
            ELSE 0
        END) AS review_location_amount,
    sum(DISTINCT
        CASE
            WHEN (r.music = true) THEN 1
            ELSE 0
        END) AS review_music_amount,
    sum(DISTINCT
        CASE
            WHEN (r.service = true) THEN 1
            ELSE 0
        END) AS review_service_amount,
    sum(DISTINCT
        CASE
            WHEN (r.vibe = true) THEN 1
            ELSE 0
        END) AS review_vibe_amount,
    sum(DISTINCT
        CASE
            WHEN (r.beer = false) THEN 1
            ELSE 0
        END) AS negative_review_beer_amount,
    sum(DISTINCT
        CASE
            WHEN (r.food = false) THEN 1
            ELSE 0
        END) AS negative_review_food_amount,
    sum(DISTINCT
        CASE
            WHEN (r.location = false) THEN 1
            ELSE 0
        END) AS negative_review_location_amount,
    sum(DISTINCT
        CASE
            WHEN (r.music = false) THEN 1
            ELSE 0
        END) AS negative_review_music_amount,
    sum(DISTINCT
        CASE
            WHEN (r.service = false) THEN 1
            ELSE 0
        END) AS negative_review_service_amount,
    sum(DISTINCT
        CASE
            WHEN (r.vibe = false) THEN 1
            ELSE 0
        END) AS negative_review_vibe_amount,
    ( SELECT count(*) AS count
           FROM reviews
          WHERE ((reviews.pub_id = p.id) AND (reviews.rating = 1))) AS review_ones,
    ( SELECT count(*) AS count
           FROM reviews
          WHERE ((reviews.pub_id = p.id) AND (reviews.rating = 2))) AS review_twos,
    ( SELECT count(*) AS count
           FROM reviews
          WHERE ((reviews.pub_id = p.id) AND (reviews.rating = 3))) AS review_threes,
    ( SELECT count(*) AS count
           FROM reviews
          WHERE ((reviews.pub_id = p.id) AND (reviews.rating = 4))) AS review_fours,
    ( SELECT count(*) AS count
           FROM reviews
          WHERE ((reviews.pub_id = p.id) AND (reviews.rating = 5))) AS review_fives,
    ( SELECT count(*) AS count
           FROM reviews
          WHERE ((reviews.pub_id = p.id) AND (reviews.rating = 6))) AS review_sixes,
    ( SELECT count(*) AS count
           FROM reviews
          WHERE ((reviews.pub_id = p.id) AND (reviews.rating = 7))) AS review_sevens,
    ( SELECT count(*) AS count
           FROM reviews
          WHERE ((reviews.pub_id = p.id) AND (reviews.rating = 8))) AS review_eights,
    ( SELECT count(*) AS count
           FROM reviews
          WHERE ((reviews.pub_id = p.id) AND (reviews.rating = 9))) AS review_nines,
    ( SELECT count(*) AS count
           FROM reviews
          WHERE ((reviews.pub_id = p.id) AND (reviews.rating = 10))) AS review_tens,
    p.description
   FROM ((((pubs p
     LEFT JOIN saves s ON ((p.id = s.pub_id)))
     LEFT JOIN pub_photos pp ON ((pp.pub_id = p.id)))
     LEFT JOIN opening_hours oh ON ((p.id = oh.pub_id)))
     LEFT JOIN reviews r ON ((p.id = r.pub_id)))
  GROUP BY p.id;


create or replace view "public"."user_comments" as  SELECT c.id,
    c.created_at,
    c.updated_at,
    c.content,
    c.user_id,
    c.review_id,
    u.name AS user_name,
    count(DISTINCT l.*) AS likes_amount,
    (sum(
        CASE
            WHEN ((l.comment_id = c.id) AND (l.user_id = auth.uid())) THEN 1
            ELSE 0
        END) > 0) AS liked,
    u.profile_photo AS user_profile_photo
   FROM ((comments c
     LEFT JOIN users_public u ON ((u.id = c.user_id)))
     LEFT JOIN comment_likes l ON ((l.comment_id = c.id)))
  GROUP BY c.id, u.id;


grant delete on table "public"."collection_items" to "anon";

grant insert on table "public"."collection_items" to "anon";

grant references on table "public"."collection_items" to "anon";

grant select on table "public"."collection_items" to "anon";

grant trigger on table "public"."collection_items" to "anon";

grant truncate on table "public"."collection_items" to "anon";

grant update on table "public"."collection_items" to "anon";

grant delete on table "public"."collection_items" to "authenticated";

grant insert on table "public"."collection_items" to "authenticated";

grant references on table "public"."collection_items" to "authenticated";

grant select on table "public"."collection_items" to "authenticated";

grant trigger on table "public"."collection_items" to "authenticated";

grant truncate on table "public"."collection_items" to "authenticated";

grant update on table "public"."collection_items" to "authenticated";

grant delete on table "public"."collection_items" to "service_role";

grant insert on table "public"."collection_items" to "service_role";

grant references on table "public"."collection_items" to "service_role";

grant select on table "public"."collection_items" to "service_role";

grant trigger on table "public"."collection_items" to "service_role";

grant truncate on table "public"."collection_items" to "service_role";

grant update on table "public"."collection_items" to "service_role";

create policy "users can view their own associations"
on "public"."collection_items"
as permissive
for select
to public
using ((auth.uid() = created_by));


create policy "Enable users to view their own data only"
on "public"."saves"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



