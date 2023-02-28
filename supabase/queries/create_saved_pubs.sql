drop function if exists saved_pubs;

create
or replace function saved_pubs(dist_long float, dist_lat float) returns table(
    id int,
    created_at timestamptz,
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
    pub_photos text [],
    opening_hours jsonb,
    location text,
    dist_meters float
) language sql as $ $
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
    p.id,
    s.id $ $;