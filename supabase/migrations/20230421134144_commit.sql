drop policy "users can access their own data" on "public"."users_public";

drop function if exists "public"."get_pub"(input_id integer, dist_long double precision, dist_lat double precision);

drop function if exists "public"."saved_pubs"(dist_long double precision, dist_lat double precision);

drop function if exists "public"."nearby_pubs"(order_lat double precision, order_long double precision, dist_lat double precision, dist_long double precision);

drop function if exists "public"."pubs_in_polygon"(geojson text, dist_long double precision, dist_lat double precision);

create table "public"."pub_schema" (
    "id" integer not null,
    "google_rating" real not null,
    "name" text not null,
    "address" text not null,
    "phone_number" text not null,
    "google_overview" text not null,
    "google_ratings_amount" integer not null,
    "reservable" boolean,
    "website" text not null,
    "dog_friendly" boolean,
    "live_sport" boolean,
    "pool_table" boolean,
    "dart_board" boolean,
    "beer_garden" boolean,
    "kid_friendly" boolean,
    "free_wifi" boolean,
    "rooftop" boolean,
    "foosball_table" boolean,
    "wheelchair_accessible" boolean,
    "photos" text[] not null,
    "opening_hours" jsonb not null,
    "location" text not null,
    "review_vibe" double precision,
    "review_beer" double precision,
    "review_music" double precision,
    "review_service" double precision,
    "review_location" double precision,
    "review_food" double precision,
    "num_reviews" integer,
    "saved" boolean not null,
    "google_id" text not null,
    "dist_meters" double precision not null
);


alter table "public"."pub_schema" enable row level security;

alter table "public"."users_public" alter column "name" set not null;

CREATE UNIQUE INDEX test_t_pkey ON public.pub_schema USING btree (id);

alter table "public"."pub_schema" add constraint "test_t_pkey" PRIMARY KEY using index "test_t_pkey";

set check_function_bodies = off;

create or replace view "public"."formatted_pubs" as  SELECT p.id,
    p.google_rating,
    p.name,
    p.address,
    p.phone_number,
    p.google_overview,
    p.google_ratings_amount,
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
    avg(r.vibe) AS review_vibe,
    avg(r.beer) AS review_beer,
    avg(r.music) AS review_music,
    avg(r.service) AS review_service,
    avg(r.location) AS review_location,
    avg(r.food) AS review_food,
    count(DISTINCT r.*) AS num_reviews,
    (count(((s.pub_id = p.id) AND (s.user_id = auth.uid()))) > 0) AS saved,
    p.google_id
   FROM ((((pubs p
     LEFT JOIN saves s ON ((p.id = s.pub_id)))
     LEFT JOIN pub_photos pp ON ((pp.pub_id = p.id)))
     LEFT JOIN opening_hours oh ON ((p.id = oh.pub_id)))
     LEFT JOIN reviews r ON ((p.id = r.pub_id)))
  GROUP BY p.id;


CREATE OR REPLACE FUNCTION public.get_pub(dist_long double precision, dist_lat double precision)
 RETURNS SETOF pub_schema
 LANGUAGE sql
AS $function$
select
    p.*,
    st_distance(
        ST_GeomFromGeoJSON(p.location),
        st_point(dist_long, dist_lat) :: geography
    ) as dist_meters
from
    public.formatted_pubs p $function$
;

create or replace view "public"."user_reviews" as  SELECT r.id,
    r.created_at,
    r.updated_at,
    r.pub_id,
    r.user_id,
    r.content,
    r.vibe,
    COALESCE(r.beer, (1)::real) AS beer,
    r.music,
    r.service,
    r.location,
    r.food,
    r.editors_review,
    u.name AS user_name,
    count(DISTINCT rh.*) AS helpfuls
   FROM ((reviews r
     LEFT JOIN users_public u ON ((u.id = r.user_id)))
     LEFT JOIN review_helpfuls rh ON ((r.id = rh.review_id)))
  GROUP BY r.id, u.id;


CREATE OR REPLACE FUNCTION public.nearby_pubs(order_lat double precision, order_long double precision, dist_lat double precision, dist_long double precision)
 RETURNS SETOF pub_schema
 LANGUAGE sql
AS $function$
select
    p.*,
    st_distance(
        st_GeomFromGeoJSON(p.location),
        st_point(dist_long, dist_lat) :: geography
    ) as dist_meters
from
    public.formatted_pubs p
order by
    st_GeomFromGeoJSON(p.location) <-> st_point(order_long, order_lat) :: geography;

$function$
;

CREATE OR REPLACE FUNCTION public.pubs_in_polygon(geojson text, dist_long double precision, dist_lat double precision)
 RETURNS SETOF pub_schema
 LANGUAGE sql
AS $function$
select
	p.*,
	st_distance(
		st_GeomFromGeoJSON(p.location),
		st_point(dist_long, dist_lat) :: geography
	) as dist_meters
from
	public.formatted_pubs p
where
	ST_Within(
		st_GeomFromGeoJSON(p.location) :: geometry,
		ST_GeomFromGeoJSON(geojson)
	)
$function$
;

create policy "all can access public data"
on "public"."users_public"
as permissive
for select
to public
using (true);



