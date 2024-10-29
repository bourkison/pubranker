-- View: public.user_comments
-- DROP VIEW public.user_comments;
CREATE
OR REPLACE VIEW public.user_comments AS
SELECT
    c.id,
    c.created_at,
    c.updated_at,
    c.content,
    c.user_id,
    c.review_id,
    u.name AS user_name,
    count(DISTINCT l.*) AS likes_amount,
    count(
        l.comment_id = c.id
        AND c.user_id = auth.uid()
    ) > 0 AS liked
FROM
    comments c
    LEFT JOIN users_public u ON u.id = c.user_id
    LEFT JOIN comment_likes l ON l.comment_id = c.id
GROUP BY
    c.id,
    u.id;

ALTER TABLE
    public.user_comments OWNER TO postgres;

GRANT ALL ON TABLE public.user_comments TO anon;

GRANT ALL ON TABLE public.user_comments TO authenticated;

GRANT ALL ON TABLE public.user_comments TO postgres;

GRANT ALL ON TABLE public.user_comments TO service_role;