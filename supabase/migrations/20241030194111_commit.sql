drop view if exists "public"."formatted_pubs";

alter table "public"."pub_schema" drop column "review_stars_five";

alter table "public"."pub_schema" drop column "review_stars_four";

alter table "public"."pub_schema" drop column "review_stars_one";

alter table "public"."pub_schema" drop column "review_stars_three";

alter table "public"."pub_schema" drop column "review_stars_two";

alter table "public"."pub_schema" add column "review_eights" integer not null;

alter table "public"."pub_schema" add column "review_fives" integer not null;

alter table "public"."pub_schema" add column "review_fours" integer not null;

alter table "public"."pub_schema" add column "review_nines" integer not null;

alter table "public"."pub_schema" add column "review_ones" integer not null;

alter table "public"."pub_schema" add column "review_sevens" integer not null;

alter table "public"."pub_schema" add column "review_sixes" integer not null;

alter table "public"."pub_schema" add column "review_tens" integer;

alter table "public"."pub_schema" add column "review_threes" integer not null;

alter table "public"."pub_schema" add column "review_twos" integer not null;

set check_function_bodies = off;

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
    sum(
        DISTINCT CASE
            WHEN (r.rating = 1) THEN 1
            ELSE 0
        END
    ) AS review_ones,
    sum(
        DISTINCT CASE
            WHEN (r.rating = 2) THEN 1
            ELSE 0
        END
    ) AS review_twos,
    sum(
        DISTINCT CASE
            WHEN (r.rating = 3) THEN 1
            ELSE 0
        END
    ) AS review_threes,
    sum(
        DISTINCT CASE
            WHEN (r.rating = 4) THEN 1
            ELSE 0
        END
    ) AS review_fours,
    sum(
        DISTINCT CASE
            WHEN (r.rating = 5) THEN 1
            ELSE 0
        END
    ) AS review_fives,
    sum(
        DISTINCT CASE
            WHEN (r.rating = 6) THEN 1
            ELSE 0
        END
    ) AS review_sixes,
    sum(
        DISTINCT CASE
            WHEN (r.rating = 7) THEN 1
            ELSE 0
        END
    ) AS review_sevens,
    sum(
        DISTINCT CASE
            WHEN (r.rating = 8) THEN 1
            ELSE 0
        END
    ) AS review_eights,
    sum(
        DISTINCT CASE
            WHEN (r.rating = 9) THEN 1
            ELSE 0
        END
    ) AS review_nines,
    sum(
        DISTINCT CASE
            WHEN (r.rating = 10) THEN 1
            ELSE 0
        END
    ) AS review_tens,
    p.description
   FROM ((((pubs p
     LEFT JOIN saves s ON ((p.id = s.pub_id)))
     LEFT JOIN pub_photos pp ON ((pp.pub_id = p.id)))
     LEFT JOIN opening_hours oh ON ((p.id = oh.pub_id)))
     LEFT JOIN reviews r ON ((p.id = r.pub_id)))
  GROUP BY p.id;


CREATE OR REPLACE FUNCTION public.nearby_pubs(order_lat double precision, order_long double precision, dist_lat double precision, dist_long double precision)
 RETURNS SETOF pub_schema
 LANGUAGE sql
AS $function$
select
    p.id,
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
	p.photos,
	p.opening_hours,
	p.location,
	p.num_reviews,
	p.saved,
	p.google_id,
    st_distance(
        st_GeomFromGeoJSON(p.location),
        st_point(dist_long, dist_lat) :: geography
    ) as dist_meters,
	p.description,
	p.rating,
	p.review_beer_amount,
	p.review_food_amount,
	p.review_location_amount,
	p.review_music_amount,
	p.negative_review_beer_amount,
	p.negative_review_food_amount,
	p.negative_review_location_amount,
	p.negative_review_music_amount,
	p.negative_review_service_amount,
	p.negative_review_vibe_amount,
	p.review_service_amount,
	p.review_tens,
	p.review_nines,
	p.review_eights,
	p.review_sevens,
	p.review_sixes,
	p.review_fives,
	p.review_fours,
	p.review_ones,
	p.review_threes,
	p.review_twos,
	p.review_vibe_amount
from
    public.formatted_pubs p
order by
    st_GeomFromGeoJSON(p.location) <-> st_point(order_long, order_lat) :: geography;

$function$
;


