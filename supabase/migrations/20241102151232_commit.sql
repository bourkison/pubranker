create or replace view "public"."formatted_pubs" as  SELECT p.id,
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
    array_remove(array_agg(DISTINCT pp.key), NULL::text) AS photos,
    json_agg(DISTINCT oh.*) AS opening_hours,
    st_asgeojson(p.location) AS location,
    (COALESCE((avg(r.rating))::double precision, (0)::double precision) / (2)::double precision) AS rating,
    count(DISTINCT r.*) AS num_reviews,
    (count(((s.pub_id = p.id) AND (s.user_id = auth.uid()))) > 0) AS saved,
    p.google_id,
    sum(DISTINCT
        CASE
            WHEN (r.beer = true) THEN 1
            ELSE 0
        END) AS review_beer_amount,
    sum(DISTINCT
        CASE
            WHEN (r.food = true) THEN 1
            ELSE 0
        END) AS review_food_amount,
    sum(DISTINCT
        CASE
            WHEN (r.location = true) THEN 1
            ELSE 0
        END) AS review_location_amount,
    sum(DISTINCT
        CASE
            WHEN (r.music = true) THEN 1
            ELSE 0
        END) AS review_music_amount,
    sum(DISTINCT
        CASE
            WHEN (r.service = true) THEN 1
            ELSE 0
        END) AS review_service_amount,
    sum(DISTINCT
        CASE
            WHEN (r.vibe = true) THEN 1
            ELSE 0
        END) AS review_vibe_amount,
    sum(DISTINCT
        CASE
            WHEN (r.beer = false) THEN 1
            ELSE 0
        END) AS negative_review_beer_amount,
    sum(DISTINCT
        CASE
            WHEN (r.food = false) THEN 1
            ELSE 0
        END) AS negative_review_food_amount,
    sum(DISTINCT
        CASE
            WHEN (r.location = false) THEN 1
            ELSE 0
        END) AS negative_review_location_amount,
    sum(DISTINCT
        CASE
            WHEN (r.music = false) THEN 1
            ELSE 0
        END) AS negative_review_music_amount,
    sum(DISTINCT
        CASE
            WHEN (r.service = false) THEN 1
            ELSE 0
        END) AS negative_review_service_amount,
    sum(DISTINCT
        CASE
            WHEN (r.vibe = false) THEN 1
            ELSE 0
        END) AS negative_review_vibe_amount,
    ( SELECT count(*) AS count
           FROM reviews
          WHERE ((reviews.pub_id = p.id) AND (reviews.rating = 1))) AS review_ones,
    ( SELECT count(*) AS count
           FROM reviews
          WHERE ((reviews.pub_id = p.id) AND (reviews.rating = 2))) AS review_twos,
    ( SELECT count(*) AS count
           FROM reviews
          WHERE ((reviews.pub_id = p.id) AND (reviews.rating = 3))) AS review_threes,
    ( SELECT count(*) AS count
           FROM reviews
          WHERE ((reviews.pub_id = p.id) AND (reviews.rating = 4))) AS review_fours,
    ( SELECT count(*) AS count
           FROM reviews
          WHERE ((reviews.pub_id = p.id) AND (reviews.rating = 5))) AS review_fives,
    ( SELECT count(*) AS count
           FROM reviews
          WHERE ((reviews.pub_id = p.id) AND (reviews.rating = 6))) AS review_sixes,
    ( SELECT count(*) AS count
           FROM reviews
          WHERE ((reviews.pub_id = p.id) AND (reviews.rating = 7))) AS review_sevens,
    ( SELECT count(*) AS count
           FROM reviews
          WHERE ((reviews.pub_id = p.id) AND (reviews.rating = 8))) AS review_eights,
    ( SELECT count(*) AS count
           FROM reviews
          WHERE ((reviews.pub_id = p.id) AND (reviews.rating = 9))) AS review_nines,
    ( SELECT count(*) AS count
           FROM reviews
          WHERE ((reviews.pub_id = p.id) AND (reviews.rating = 10))) AS review_tens,
    p.description
   FROM ((((pubs p
     LEFT JOIN saves s ON ((p.id = s.pub_id)))
     LEFT JOIN pub_photos pp ON ((pp.pub_id = p.id)))
     LEFT JOIN opening_hours oh ON ((p.id = oh.pub_id)))
     LEFT JOIN reviews r ON ((p.id = r.pub_id)))
  GROUP BY p.id;



