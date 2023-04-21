alter table "public"."pub_schema" alter column "num_reviews" set not null;

alter table "public"."pub_schema" alter column "review_beer" set not null;

alter table "public"."pub_schema" alter column "review_food" set not null;

alter table "public"."pub_schema" alter column "review_location" set not null;

alter table "public"."pub_schema" alter column "review_music" set not null;

alter table "public"."pub_schema" alter column "review_service" set not null;

alter table "public"."pub_schema" alter column "review_vibe" set not null;

create or replace view "public"."formatted_pubs" as  SELECT p.id,
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
    array_remove(array_agg(DISTINCT pp.key), NULL::text) AS photos,
    json_agg(DISTINCT oh.*) AS opening_hours,
    st_asgeojson(p.location) AS location,
    COALESCE(avg(r.vibe), (0)::double precision) AS review_vibe,
    COALESCE(avg(r.beer), (0)::double precision) AS review_beer,
    COALESCE(avg(r.music), (0)::double precision) AS review_music,
    COALESCE(avg(r.service), (0)::double precision) AS review_service,
    COALESCE(avg(r.location), (0)::double precision) AS review_location,
    COALESCE(avg(r.food), (0)::double precision) AS review_food,
    COALESCE(count(DISTINCT r.*), (0)::bigint) AS num_reviews,
    (count(((s.pub_id = p.id) AND (s.user_id = auth.uid()))) > 0) AS saved,
    p.google_id
   FROM ((((pubs p
     LEFT JOIN saves s ON ((p.id = s.pub_id)))
     LEFT JOIN pub_photos pp ON ((pp.pub_id = p.id)))
     LEFT JOIN opening_hours oh ON ((p.id = oh.pub_id)))
     LEFT JOIN reviews r ON ((p.id = r.pub_id)))
  GROUP BY p.id;



