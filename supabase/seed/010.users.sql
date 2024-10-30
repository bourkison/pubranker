insert into
    auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        raw_app_meta_data,
        raw_user_meta_data,
        email_confirmed_at,
        created_at
    )
values
    (
        '00000000-0000-0000-0000-000000000000',
        '185f2f83-d63a-4c9b-b4a0-7e4a885799e2',
        'authenticated',
        'authenticated',
        'harrisonbourke97@gmail.com',
        '$2a$10$54Nv3gssrFzEo424i9ycdOwqcY0f8VFb1nqoxS2uVzapylTIIhdYy',
        '{"provider":"email","providers":["email"]}',
        '{}',
        timezone('utc' :: text, now()),
        timezone('utc' :: text, now())
    );

insert into
    auth.identities (id, user_id, identity_data, provider, created_at)
values