drop function if exists pubs_in_polygon;

create
or replace function pubs_in_polygon(geojson text, dist_long float, dist_lat float) returns table(
	id int,
	google_rating real,
	name text,
	address text,
	phone_number text,
	google_overview text,
	google_ratings_amount integer,
	reservable boolean,
	website text,
	dog_friendly boolean,
	live_sport boolean,
	pool_table_amount smallint,
	dart_board_amount smallint,
	beer_garden boolean,
	kid_friendly boolean,
	free_wifi boolean,
	rooftop boolean,
	foosball_table_amount smallint,
	wheelchair_accessible boolean,
	location text,
	dist_meters float,
	photos text [],
	opening_hours json,
	saved boolean
) language sql as $ $
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
	p.id $ $;