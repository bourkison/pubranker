drop function if exists "public"."saved_pubs"(input_id uuid, dist_long double precision, dist_lat double precision);

drop function if exists "public"."nearby_pubs"(order_lat double precision, order_long double precision, dist_lat double precision, dist_long double precision);

drop function if exists "public"."pubs_in_polygon"(geojson text, dist_long double precision, dist_lat double precision);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.saved_pubs(dist_long double precision, dist_lat double precision)
 RETURNS TABLE(id integer, created_at timestamp with time zone, google_rating real, name text, address text, phone_number text, google_overview text, google_ratings_amount integer, reservable boolean, website text, dog_friendly boolean, live_sport boolean, pool_table_amount smallint, dart_board_amount smallint, menu jsonb, beer_garden boolean, kid_friendly boolean, free_wifi boolean, rooftop boolean, foosball_table_amount smallint, wheelchair_accessible boolean, pub_photos text[], opening_hours jsonb, location text, dist_meters double precision)
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
    p.menu,
    p.beer_garden,
    p.kid_friendly,
    p.free_wifi,
    p.rooftop,
    p.foosball_table_amount,
    p.wheelchair_accessible,
    array_remove(array_agg(distinct pp.key), NULL) as pub_photos,
    json_agg(distinct oh) as opening_hours,
    st_asgeojson(p.location) as location,
    st_distance(
        p.location,
        st_point(dist_long, dist_lat) :: geography
    ) as dist_meters
from
    public.pubs p
    join public.saves s on p.id = s.pub_id
    left join pub_photos pp on pp.pub_id = p.id
    join opening_hours oh on p.id = oh.pub_id
where
    s.user_id = auth.uid()
group by
    p.id, s.id $function$
;

CREATE OR REPLACE FUNCTION public.nearby_pubs(order_lat double precision, order_long double precision, dist_lat double precision, dist_long double precision)
 RETURNS TABLE(id integer, google_rating real, name text, address text, phone_number text, google_overview text, google_ratings_amount integer, reservable boolean, website text, dog_friendly boolean, live_sport boolean, pool_table_amount smallint, dart_board_amount smallint, menu jsonb, beer_garden boolean, kid_friendly boolean, free_wifi boolean, rooftop boolean, foosball_table_amount smallint, wheelchair_accessible boolean, location text, dist_meters double precision, photos text[], opening_hours json, saved boolean)
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
    p.menu,
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
 RETURNS TABLE(id integer, google_rating real, name text, address text, phone_number text, google_overview text, google_ratings_amount integer, reservable boolean, website text, dog_friendly boolean, live_sport boolean, pool_table_amount smallint, dart_board_amount smallint, menu jsonb, beer_garden boolean, kid_friendly boolean, free_wifi boolean, rooftop boolean, foosball_table_amount smallint, wheelchair_accessible boolean, location text, dist_meters double precision, photos text[], opening_hours json, saved boolean)
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
	p.menu,
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


