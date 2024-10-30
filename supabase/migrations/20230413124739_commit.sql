drop function if exists "public"."nearby_pubs"(order_lat double precision, order_long double precision, dist_lat double precision, dist_long double precision);

drop function if exists "public"."pubs_in_polygon"(geojson text, dist_long double precision, dist_lat double precision);

drop function if exists "public"."saved_pubs"(dist_long double precision, dist_lat double precision);

alter table "public"."pubs" drop column "google_photos";

alter table "public"."pubs" drop column "latitude";

alter table "public"."pubs" drop column "longitude";

alter table "public"."pubs" drop column "menu";

alter table "public"."reviews" alter column "beer" set not null;

alter table "public"."reviews" alter column "food" set not null;

alter table "public"."reviews" alter column "location" set not null;

alter table "public"."reviews" alter column "music" set not null;

alter table "public"."reviews" alter column "pub_id" set not null;

alter table "public"."reviews" alter column "service" set not null;

alter table "public"."reviews" alter column "user_id" set default auth.uid();

alter table "public"."reviews" alter column "user_id" set not null;

alter table "public"."reviews" alter column "vibe" set not null;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.nearby_pubs(order_lat double precision, order_long double precision, dist_lat double precision, dist_long double precision)
 RETURNS TABLE(id integer, google_rating real, name text, address text, phone_number text, google_overview text, google_ratings_amount integer, reservable boolean, website text, dog_friendly boolean, live_sport boolean, pool_table_amount smallint, dart_board_amount smallint, beer_garden boolean, kid_friendly boolean, free_wifi boolean, rooftop boolean, foosball_table_amount smallint, wheelchair_accessible boolean, location text, dist_meters double precision, photos text[], opening_hours json, saved boolean)
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
    p.pool_table_amount,
    p.dart_board_amount,
    p.beer_garden,
    p.kid_friendly,
    p.free_wifi,
    p.rooftop,
    p.foosball_table_amount,
    p.wheelchair_accessible,
    st_asgeojson(p.location) as location,
    st_distance(
        location,
        st_point(dist_long, dist_lat) :: geography
    ) as dist_meters,
    array_remove(array_agg(distinct pp.key), NULL) as photos,
    json_agg(distinct oh) as opening_hours,
    count(
        s.pub_id = p.id
        and s.user_id = auth.uid()
    ) > 0 as saved
from
    public.pubs p
    left join public.saves s on p.id = s.pub_id
    left join pub_photos pp on pp.pub_id = p.id
    left join opening_hours oh on p.id = oh.pub_id
group by
    p.id
order by
    location <-> st_point(order_long, order_lat) :: geography;

$function$
;

CREATE OR REPLACE FUNCTION public.pubs_in_polygon(geojson text, dist_long double precision, dist_lat double precision)
 RETURNS TABLE(id integer, google_rating real, name text, address text, phone_number text, google_overview text, google_ratings_amount integer, reservable boolean, website text, dog_friendly boolean, live_sport boolean, pool_table_amount smallint, dart_board_amount smallint, beer_garden boolean, kid_friendly boolean, free_wifi boolean, rooftop boolean, foosball_table_amount smallint, wheelchair_accessible boolean, location text, dist_meters double precision, photos text[], opening_hours json, saved boolean)
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
	p.pool_table_amount,
	p.dart_board_amount,
	p.beer_garden,
	p.kid_friendly,
	p.free_wifi,
	p.rooftop,
	p.foosball_table_amount,
	p.wheelchair_accessible,
	st_asgeojson(p.location) as location,
	st_distance(
		location,
		st_point(dist_long, dist_lat) :: geography
	) as dist_meters,
	array_remove(array_agg(distinct pp.key), NULL) as photos,
	json_agg(distinct oh) as opening_hours,
	count(
		s.pub_id = p.id
		and s.user_id = auth.uid()
	) > 0 as saved
from
	public.pubs p
	left join public.saves s on p.id = s.pub_id
	left join pub_photos pp on pp.pub_id = p.id
	left join opening_hours oh on p.id = oh.pub_id
where
	ST_Within(
		location :: geometry,
		ST_GeomFromGeoJSON(geojson)
	)
group by
	p.id $function$
;

CREATE OR REPLACE FUNCTION public.saved_pubs(dist_long double precision, dist_lat double precision)
 RETURNS TABLE(id integer, created_at timestamp with time zone, google_rating real, name text, address text, phone_number text, google_overview text, google_ratings_amount integer, reservable boolean, website text, dog_friendly boolean, live_sport boolean, pool_table_amount smallint, dart_board_amount smallint, beer_garden boolean, kid_friendly boolean, free_wifi boolean, rooftop boolean, foosball_table_amount smallint, wheelchair_accessible boolean, photos text[], opening_hours jsonb, location text, dist_meters double precision, saved boolean)
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
    p.pool_table_amount,
    p.dart_board_amount,
    p.beer_garden,
    p.kid_friendly,
    p.free_wifi,
    p.rooftop,
    p.foosball_table_amount,
    p.wheelchair_accessible,
    array_remove(array_agg(distinct pp.key), NULL) as photos,
    json_agg(distinct oh) as opening_hours,
    st_asgeojson(p.location) as location,
    st_distance(
        p.location,
        st_point(dist_long, dist_lat) :: geography
    ) as dist_meters,
    true as saved
from
    public.pubs p
    join public.saves s on p.id = s.pub_id
    left join pub_photos pp on pp.pub_id = p.id
    join opening_hours oh on p.id = oh.pub_id
where
    s.user_id = auth.uid()
group by
    p.id,
    s.id $function$
;

create policy "anyone can read reviews"
on "public"."reviews"
as permissive
for select
to public
using (true);


create policy "authenticated users can create unique reviews"
on "public"."reviews"
as permissive
for insert
to public
with check (((auth.uid() = user_id) AND (NOT (EXISTS ( SELECT 1
   FROM reviews r
  WHERE ((r.user_id = reviews.user_id) AND (r.pub_id = reviews.pub_id)))))));



