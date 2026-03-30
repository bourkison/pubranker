DO $$ DECLARE 
    user_id uuid;
    user_two_id uuid;
    user_three_id uuid;
    user_four_id uuid;

BEGIN 
    user_id := public.create_user('harrison@gmail.com', 'password');
    user_two_id := public.create_user('test@gmail.com', 'password');
    user_three_id := public.create_user('angie@gmail.com', 'password');
    user_four_id := public.create_user('max@gmail.com', 'password');

-- First create users_public
INSERT INTO
    public.users_public (id, name, profile_photo, username)
VALUES
    (user_id, 'Harrison', '', 'bourkison'),
    (user_two_id, 'Test user', '', 'test'),
    (user_three_id, 'Angelica Miziri', '', 'miziri'),
    (user_four_id, 'Max Ford', '', 'maxford');

END $$;