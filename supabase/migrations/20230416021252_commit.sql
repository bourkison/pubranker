drop policy "user can access their own data" on "public"."users";

alter table "public"."users" drop constraint "users_id_fkey";

drop function if exists "public"."nearby_pubs"(order_lat double precision, order_long double precision, dist_lat double precision, dist_long double precision);

drop function if exists "public"."pubs_in_polygon"(geojson text, dist_long double precision, dist_lat double precision);

drop function if exists "public"."saved_pubs"(dist_long double precision, dist_lat double precision);

alter table "public"."users" drop constraint "users_pkey";

drop index if exists "public"."users_pkey";

drop table "public"."users";

create table "public"."users_public" (
    "id" uuid not null,
    "created_at" timestamp with time zone default now(),
    "name" text
);


alter table "public"."users_public" enable row level security;

alter table "public"."pubs" drop column "dart_board_amount";

alter table "public"."pubs" drop column "foosball_table_amount";

alter table "public"."pubs" drop column "is_brewery";

alter table "public"."pubs" drop column "pool_table_amount";

alter table "public"."pubs" add column "brewery" boolean default false;

alter table "public"."pubs" add column "dart_board" boolean;

alter table "public"."pubs" add column "foosball_table" boolean;

alter table "public"."pubs" add column "pool_table" boolean;

alter table "public"."reviews" alter column "created_at" set not null;

CREATE UNIQUE INDEX users_pkey ON public.users_public USING btree (id);

alter table "public"."users_public" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."users_public" add constraint "users_public_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) not valid;

alter table "public"."users_public" validate constraint "users_public_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.nearby_pubs(order_lat double precision, order_long double precision, dist_lat double precision, dist_long double precision)
 RETURNS TABLE(id integer, google_rating real, name text, address text, phone_number text, google_overview text, google_ratings_amount integer, reservable boolean, website text, dog_friendly boolean, live_sport boolean, pool_table boolean, dart_board boolean, beer_garden boolean, kid_friendly boolean, free_wifi boolean, rooftop boolean, foosball_table boolean, wheelchair_accessible boolean, location text, dist_meters double precision, photos text[], opening_hours json, saved boolean, review_vibe double precision, review_beer double precision, review_music double precision, review_service double precision, review_location double precision, review_food double precision, num_reviews integer)
 LANGUAGE sql
AS $function$
select
    p.id,
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
    st_asgeojson(p.location) as location,
    st_distance(
        p.location,
        st_point(dist_long, dist_lat) :: geography
    ) as dist_meters,
    array_remove(array_agg(distinct pp.key), NULL) as photos,
    json_agg(distinct oh) as opening_hours,
    count(
        s.pub_id = p.id
        and s.user_id = auth.uid()
    ) > 0 as saved,
    avg(r.vibe) as review_vibe,
    avg(r.beer) as review_beer,
    avg(r.music) as review_music,
    avg(r.service) as review_service,
    avg(r.location) as review_location,
    avg(r.food) as review_food,
    count(distinct r) as num_reviews
from
    public.pubs p
    left join public.saves s on p.id = s.pub_id
    left join pub_photos pp on pp.pub_id = p.id
    left join opening_hours oh on p.id = oh.pub_id
    left join public.reviews r on p.id = r.pub_id
group by
    p.id
order by
    p.location <-> st_point(order_long, order_lat) :: geography;

$function$
;

CREATE OR REPLACE FUNCTION public.pubs_in_polygon(geojson text, dist_long double precision, dist_lat double precision)
 RETURNS TABLE(id integer, google_rating real, name text, address text, phone_number text, google_overview text, google_ratings_amount integer, reservable boolean, website text, dog_friendly boolean, live_sport boolean, pool_table boolean, dart_board boolean, beer_garden boolean, kid_friendly boolean, free_wifi boolean, rooftop boolean, foosball_table boolean, wheelchair_accessible boolean, location text, dist_meters double precision, photos text[], opening_hours json, saved boolean, review_vibe double precision, review_beer double precision, review_music double precision, review_service double precision, review_location double precision, review_food double precision, num_reviews integer)
 LANGUAGE sql
AS $function$
select
	p.id,
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
	st_asgeojson(p.location) as location,
	st_distance(
		p.location,
		st_point(dist_long, dist_lat) :: geography
	) as dist_meters,
	array_remove(array_agg(distinct pp.key), NULL) as photos,
	json_agg(distinct oh) as opening_hours,
	count(
		s.pub_id = p.id
		and s.user_id = auth.uid()
	) > 0 as saved,
	avg(r.vibe) as review_vibe,
	avg(r.beer) as review_beer,
	avg(r.music) as review_music,
	avg(r.service) as review_service,
	avg(r.location) as review_location,
	avg(r.food) as review_food,
	count(distinct r) as num_reviews
from
	public.pubs p
	left join public.saves s on p.id = s.pub_id
	left join pub_photos pp on pp.pub_id = p.id
	left join opening_hours oh on p.id = oh.pub_id
	left join reviews r on p.id = r.pub_id
where
	ST_Within(
		p.location :: geometry,
		ST_GeomFromGeoJSON(geojson)
	)
group by
	p.id $function$
;

CREATE OR REPLACE FUNCTION public.saved_pubs(dist_long double precision, dist_lat double precision)
 RETURNS TABLE(id integer, created_at timestamp with time zone, google_rating real, name text, address text, phone_number text, google_overview text, google_ratings_amount integer, reservable boolean, website text, dog_friendly boolean, live_sport boolean, pool_table boolean, dart_board boolean, beer_garden boolean, kid_friendly boolean, free_wifi boolean, rooftop boolean, foosball_table boolean, wheelchair_accessible boolean, photos text[], opening_hours jsonb, location text, dist_meters double precision, review_vibe double precision, review_beer double precision, review_music double precision, review_service double precision, review_location double precision, review_food double precision, num_reviews integer, saved boolean)
 LANGUAGE sql
AS $function$
select
    p.id,
    s.created_at,
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
    array_remove(array_agg(distinct pp.key), NULL) as photos,
    json_agg(distinct oh) as opening_hours,
    st_asgeojson(p.location) as location,
    st_distance(
        p.location,
        st_point(dist_long, dist_lat) :: geography
    ) as dist_meters,
    avg(r.vibe) as review_vibe,
    avg(r.beer) as review_beer,
    avg(r.music) as review_music,
    avg(r.service) as review_service,
    avg(r.location) as review_location,
    avg(r.food) as review_food,
    count(distinct r) as num_reviews,
    true as saved
from
    public.pubs p
    join public.saves s on p.id = s.pub_id
    left join pub_photos pp on pp.pub_id = p.id
    join opening_hours oh on p.id = oh.pub_id
    left join reviews r on p.id = r.pub_id
where
    s.user_id = auth.uid()
group by
    p.id,
    s.id $function$
;

create policy "users can delete their own reviews"
on "public"."reviews"
as permissive
for delete
to public
using ((auth.uid() = user_id));


create policy "users can update their own reviews"
on "public"."reviews"
as permissive
for update
to public
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));


create policy "user can access all data"
on "public"."users_public"
as permissive
for select
to public
using (true);



