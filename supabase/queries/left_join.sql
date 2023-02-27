select p.* from pubs p
join saves s on p.id = s.pub_id
join users u on u.id = s.user_id
where s.user_id = 'c37803a0-d4f6-4e57-b5d8-535309958c3c'