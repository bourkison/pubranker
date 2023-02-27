drop function pubs_in_polygon;

create or replace function pubs_in_polygon(geojson text, dist_long float, dist_lat float) returns table(
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
        location text,
        dist_meters float
    ) language sql as $$
select id,
    google_rating,
    name,
    address,
    phone_number,
    google_overview,
    google_ratings_amount,
    reservable,
    website,
    dog_friendly,
    live_sport,
    pool_table_amount,
    dart_board_amount,
    menu,
    beer_garden,
    kid_friendly,
    free_wifi,
    rooftop,
    foosball_table_amount,
    wheelchair_accessible,
    st_astext(location) as location,
    st_distance(
        location,
        st_point(dist_long, dist_lat)::geography
    ) as dist_meters
from public.pubs
where ST_Within(location::geometry, ST_GeomFromGeoJSON(geojson)) $$;