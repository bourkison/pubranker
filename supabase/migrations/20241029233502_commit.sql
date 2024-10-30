alter table
    "public"."reviews"
add
    column "beer" boolean;

alter table
    "public"."reviews"
add
    column "food" boolean;

alter table
    "public"."reviews"
add
    column "location" boolean;

alter table
    "public"."reviews"
add
    column "music" boolean;

alter table
    "public"."reviews"
add
    column "rating" integer not null;

alter table
    "public"."reviews"
add
    column "service" boolean;

alter table
    "public"."reviews"
add
    column "vibe" boolean;

create
or replace view "public"."formatted_pubs" as
SELECT
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
    array_remove(array_agg(DISTINCT pp.key), NULL :: text) AS photos,
    json_agg(DISTINCT oh.*) AS opening_hours,
    st_asgeojson(p.location) AS location,
    COALESCE(
        (avg(r.rating)) :: double precision,
        (0) :: double precision
    ) AS rating,
    count(DISTINCT r.*) AS num_reviews,
    (
        count(
            (
                (s.pub_id = p.id)
                AND (s.user_id = auth.uid())
            )
        ) > 0
    ) AS saved,
    p.google_id,
    sum(
        DISTINCT CASE
            WHEN (r.beer = true) THEN 1
            ELSE 0
        END
    ) AS review_beer_amount,
    sum(
        DISTINCT CASE
            WHEN (r.food = true) THEN 1
            ELSE 0
        END
    ) AS review_food_amount,
    sum(
        DISTINCT CASE
            WHEN (r.location = true) THEN 1
            ELSE 0
        END
    ) AS review_location_amount,
    sum(
        DISTINCT CASE
            WHEN (r.music = true) THEN 1
            ELSE 0
        END
    ) AS review_music_amount,
    sum(
        DISTINCT CASE
            WHEN (r.service = true) THEN 1
            ELSE 0
        END
    ) AS review_service_amount,
    sum(
        DISTINCT CASE
            WHEN (r.vibe = true) THEN 1
            ELSE 0
        END
    ) AS review_vibe_amount,
    sum(
        DISTINCT CASE
            WHEN (r.beer = false) THEN 1
            ELSE 0
        END
    ) AS negative_review_beer_amount,
    sum(
        DISTINCT CASE
            WHEN (r.food = false) THEN 1
            ELSE 0
        END
    ) AS negative_review_food_amount,
    sum(
        DISTINCT CASE
            WHEN (r.location = false) THEN 1
            ELSE 0
        END
    ) AS negative_review_location_amount,
    sum(
        DISTINCT CASE
            WHEN (r.music = false) THEN 1
            ELSE 0
        END
    ) AS negative_review_music_amount,
    sum(
        DISTINCT CASE
            WHEN (r.service = false) THEN 1
            ELSE 0
        END
    ) AS negative_review_service_amount,
    sum(
        DISTINCT CASE
            WHEN (r.vibe = false) THEN 1
            ELSE 0
        END
    ) AS negative_review_vibe_amount,
    sum(
        DISTINCT CASE
            WHEN (r.rating = 1) THEN 1
            ELSE 0
        END
    ) AS review_stars_one,
    sum(
        DISTINCT CASE
            WHEN (r.rating = 2) THEN 1
            ELSE 0
        END
    ) AS review_stars_two,
    sum(
        DISTINCT CASE
            WHEN (r.rating = 3) THEN 1
            ELSE 0
        END
    ) AS review_stars_three,
    sum(
        DISTINCT CASE
            WHEN (r.rating = 4) THEN 1
            ELSE 0
        END
    ) AS review_stars_four,
    sum(
        DISTINCT CASE
            WHEN (r.rating = 5) THEN 1
            ELSE 0
        END
    ) AS review_stars_five,
    p.description
FROM
    (
        (
            (
                (
                    pubs p
                    LEFT JOIN saves s ON ((p.id = s.pub_id))
                )
                LEFT JOIN pub_photos pp ON ((pp.pub_id = p.id))
            )
            LEFT JOIN opening_hours oh ON ((p.id = oh.pub_id))
        )
        LEFT JOIN reviews r ON ((p.id = r.pub_id))
    )
GROUP BY
    p.id;