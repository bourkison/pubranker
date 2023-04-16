drop function if exists nearby_pubs;

create
or replace function nearby_pubs(
    order_lat float,
    order_long float,
    dist_lat float,
    dist_long float
) returns table(
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
    pool_table boolean,
    dart_board boolean,
    beer_garden boolean,
    kid_friendly boolean,
    free_wifi boolean,
    rooftop boolean,
    foosball_table boolean,
    wheelchair_accessible boolean,
    location text,
    dist_meters float,
    photos text [],
    opening_hours json,
    saved boolean,
    review_vibe float,
    review_beer float,
    review_music float,
    review_service float,
    review_location float,
    review_food float,
    num_reviews int
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
    p.location < -> st_point(order_long, order_lat) :: geography;

$ $;