-- View: public.formatted_pubs
-- DROP VIEW public.formatted_pubs;
CREATE
OR REPLACE VIEW public.formatted_pubs AS
SELECT
    p.id as id,
    p.name as name,
    p.address as address,
    p.phone_number as phone_number,
    p.reservable as reservable,
    p.website as website,
    p.dog_friendly as dog_friendly,
    p.live_sport as live_sport,
    p.pool_table as pool_table,
    p.dart_board as dart_board,
    p.beer_garden as beer_garden,
    p.kid_friendly as kid_friendly,
    p.free_wifi as free_wifi,
    p.rooftop as rooftop,
    p.foosball_table as foosball_table,
    p.wheelchair_accessible as wheelchair_accessible,
    array_remove(array_agg(DISTINCT pp.key), NULL :: text) AS photos,
    json_agg(DISTINCT oh.*) AS opening_hours,
    st_asgeojson(p.location) AS location,
    coalesce(avg(r.rating), 0 :: double precision) as rating,
    count(DISTINCT r.*),
    0 :: bigint AS num_reviews,
    count(
        s.pub_id = p.id
        AND s.user_id = auth.uid()
    ) > 0 AS saved,
    p.google_id as google_id,
    sum(
        distinct case
            when r.beer = true then 1
            else 0
        end
    ) as review_beer_amount,
    sum(
        distinct case
            when r.food = true then 1
            else 0
        end
    ) as review_food_amount,
    sum(
        distinct case
            when r.location = true then 1
            else 0
        end
    ) as review_location_amount,
    sum(
        distinct case
            when r.music = true then 1
            else 0
        end
    ) as review_music_amount,
    sum(
        distinct case
            when r.service = true then 1
            else 0
        end
    ) as review_service_amount,
    sum(
        distinct case
            when r.vibe = true then 1
            else 0
        end
    ) as review_vibe_amount,
    sum(
        distinct case
            when r.beer = false then 1
            else 0
        end
    ) as negative_review_beer_amount,
    sum(
        distinct case
            when r.food = false then 1
            else 0
        end
    ) as negative_review_food_amount,
    sum(
        distinct case
            when r.location = false then 1
            else 0
        end
    ) as negative_review_location_amount,
    sum(
        distinct case
            when r.music = false then 1
            else 0
        end
    ) as negative_review_music_amount,
    sum(
        distinct case
            when r.service = false then 1
            else 0
        end
    ) as negative_review_service_amount,
    sum(
        distinct case
            when r.vibe = false then 1
            else 0
        end
    ) as negative_review_vibe_amount,
    sum(
        distinct case
            when r.rating = 1 then 1
            else 0
        end
    ) as review_stars_one,
    sum(
        distinct case
            when r.rating = 2 then 1
            else 0
        end
    ) as review_stars_two,
    sum(
        distinct case
            when r.rating = 3 then 1
            else 0
        end
    ) as review_stars_three,
    sum(
        distinct case
            when r.rating = 4 then 1
            else 0
        end
    ) as review_stars_four,
    sum(
        distinct case
            when r.rating = 5 then 1
            else 0
        end
    ) as review_stars_five,
    p.description as description
FROM
    pubs p
    LEFT JOIN saves s ON p.id = s.pub_id
    LEFT JOIN pub_photos pp ON pp.pub_id = p.id
    LEFT JOIN opening_hours oh ON p.id = oh.pub_id
    LEFT JOIN reviews r ON p.id = r.pub_id
GROUP BY
    p.id;

ALTER TABLE
    public.formatted_pubs OWNER TO postgres;

GRANT ALL ON TABLE public.formatted_pubs TO anon;

GRANT ALL ON TABLE public.formatted_pubs TO authenticated;

GRANT ALL ON TABLE public.formatted_pubs TO postgres;

GRANT ALL ON TABLE public.formatted_pubs TO service_role;