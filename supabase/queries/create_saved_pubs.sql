drop function if exists saved_pubs;

create or replace function saved_pubs(input_id uuid, dist_long float, dist_lat float) returns table(
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
        menu jsonb,
        beer_garden boolean,
        kid_friendly boolean,
        free_wifi boolean,
        rooftop boolean,
        foosball_table_amount smallint,
        wheelchair_accessible boolean,
        pub_photos text[],
        opening_hours json,
        location text,
        dist_meters float
    ) language sql as $$
select p.id,
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
    array_agg(distinct pp.key) as pub_photos,
	json_agg(distinct oh) as opening_hours,
    st_asgeojson(p.location) as location,
    st_distance(
        p.location,
        st_point(dist_long, dist_lat)::geography
    ) as dist_meters
from public.pubs p
join public.saves s on p.id = s.pub_id
join users u on u.id = s.user_id
join pub_photos pp on pp.pub_id = p.id
join opening_hours oh on p.id = oh.pub_id
where s.user_id = input_id
group by p.id $$;