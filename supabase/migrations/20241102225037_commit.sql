create or replace view "public"."user_comments" as  SELECT c.id,
    c.created_at,
    c.updated_at,
    c.content,
    c.user_id,
    c.review_id,
    u.name AS user_name,
    count(DISTINCT l.*) AS likes_amount,
    (sum(
        CASE
            WHEN ((l.comment_id = c.id) AND (l.user_id = auth.uid())) THEN 1
            ELSE 0
        END) > 0) AS liked
   FROM ((comments c
     LEFT JOIN users_public u ON ((u.id = c.user_id)))
     LEFT JOIN comment_likes l ON ((l.comment_id = c.id)))
  GROUP BY c.id, u.id;



