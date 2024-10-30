set check_function_bodies = off;

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
	p.review_stars_five,
	p.review_stars_four,
	p.review_stars_one,
	p.review_stars_three,
	p.review_stars_two,
	p.review_vibe_amount
from
    public.formatted_pubs p
order by
    st_GeomFromGeoJSON(p.location) <-> st_point(order_long, order_lat) :: geography;

$function$
;


