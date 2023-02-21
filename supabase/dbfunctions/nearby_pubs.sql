create or replace function nearby_pubs(order_lat float, order_long float, dist_lat float, dist_long float)
returns setof record
language sql
as $$
  select id, name, address, opening_hours, phone_number, google_overview, google_photos, google_rating, google_ratings_amount, google_id, reservable, website, dog_friendly, live_sport, pool_table_amount, dart_board_amount, menu, beer_garden, kid_friendly, beer_selection, free_wifi, rooftop, foosball_table_amount, cocktails, wheelchair_accessible, photos, dancing, st_astext(location) as location, st_distance(location, st_point(dist_long, dist_lat)::geography) as dist_meters
  from public.pubs
  where hidden = false
  order by location <-> st_point(order_long, order_lat)::geography;
$$;