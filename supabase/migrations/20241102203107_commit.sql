alter table "public"."pubs" add column "primary_photo" text;

create or replace view "public"."user_reviews" as  SELECT r.id,
    r.created_at,
    r.updated_at,
    r.pub_id,
    r.user_id,
    r.content,
    r.vibe,
    r.beer,
    r.music,
    r.service,
    r.location,
    r.food,
    r.editors_review,
    u.name AS user_name,
    r.rating,
    sum(DISTINCT
        CASE rh.is_helpful
            WHEN true THEN 1
            ELSE 0
        END) AS is_helpfuls,
    count(DISTINCT rh.*) AS total_helpfuls,
    u.profile_photo AS user_profile_photo,
    u.username,
    p.name AS pub_name,
    p.primary_photo AS pub_primary_photo,
    p.address AS pub_address
   FROM (((reviews r
     LEFT JOIN users_public u ON ((u.id = r.user_id)))
     LEFT JOIN review_helpfuls rh ON ((r.id = rh.review_id)))
     LEFT JOIN pubs p ON ((p.id = r.pub_id)))
  GROUP BY r.id, u.id, p.id;



