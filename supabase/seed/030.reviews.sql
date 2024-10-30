(
    '185f2f83-d63a-4c9b-b4a0-7e4a885799e2',
    '185f2f83-d63a-4c9b-b4a0-7e4a885799e2',
    '{"sub": "185f2f83-d63a-4c9b-b4a0-7e4a885799e2"}',
    'harrisonbourke97@gmail.com',
    timezone('utc' :: text, now())
);

insert into
    public.users_public
values
    (
        '185f2f83-d63a-4c9b-b4a0-7e4a885799e2',
        timezone('utc' :: text, now()),
        'Harrison',
        '123'
    );

-- REVIEWS
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
        '185f2f83-d63a-4c9b-b4a0-7e4a885799e2',
        'Lorem ipsom dolor sit amet',
        false,
        4
    )