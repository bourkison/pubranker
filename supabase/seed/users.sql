DO $$ DECLARE user_id uuid;

BEGIN user_id := public.create_user('harrison@gmail.com', 'password');

-- First create users_public
INSERT INTO
    public.users_public (id, name, profile_photo, username)
VALUES
    (user_id, 'Harrison', '', 'bourkison');

-- Then create reviews
insert into
    public.reviews (
        id,
        created_at,
        updated_at,
        pub_id,
        user_id,
        content,
        editors_review,
        rating
    )
values
    (
        1,
        timezone('utc' :: text, now()),
        timezone('utc' :: text, now()),
        56,
        user_id,
        'Lorem ipsom dolor sit amet',
        false,
        4
    );

END $$;