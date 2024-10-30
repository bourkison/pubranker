create or replace view "public"."user_comments" as  SELECT c.id,
    c.created_at,
    c.updated_at,
    c.content,
    c.user_id,
    c.review_id,
    u.name AS user_name,
    count(DISTINCT l.*) AS likes_amount,
    (count(((l.comment_id = c.id) AND (c.user_id = auth.uid()))) > 0) AS liked
   FROM ((comments c
     LEFT JOIN users_public u ON ((u.id = c.user_id)))
     LEFT JOIN comment_likes l ON ((l.comment_id = c.id)))
  GROUP BY c.id, u.id;


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
    count(
        CASE rh.is_helpful
            WHEN true THEN 1
            ELSE NULL::integer
        END) AS is_helpfuls,
    count(DISTINCT rh.*) AS total_helpfuls
   FROM ((reviews r
     LEFT JOIN users_public u ON ((u.id = r.user_id)))
     LEFT JOIN review_helpfuls rh ON ((r.id = rh.review_id)))
  GROUP BY r.id, u.id;



