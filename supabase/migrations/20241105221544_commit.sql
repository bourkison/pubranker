alter table "public"."collections" drop constraint "collections_user_id_fkey";

drop function if exists "public"."get_pub_list_item"(lat double precision, long double precision);

alter table "public"."collections" add column "description" text;

alter table "public"."collections" add constraint "collections_user_id_fkey1" FOREIGN KEY (user_id) REFERENCES users_public(id) ON DELETE CASCADE not valid;

alter table "public"."collections" validate constraint "collections_user_id_fkey1";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_pub_list_item(lat double precision, long double precision)
 RETURNS TABLE(id bigint, name character varying, address character varying, saved boolean, rating double precision, num_reviews integer, dist_meters double precision, photos text[], primary_photo text)
 LANGUAGE sql
AS $function$
	select
		pubs.id,
		pubs.name,
		pubs.address,
		count(saves.pub_id = pubs.id AND saves.user_id = auth.uid()) > 0 AS saved,
		COALESCE(avg(reviews.rating)::double precision, 0::double precision) / 2::double precision AS rating,
		count(DISTINCT reviews.*) as num_reviews,
		st_distance(
	        pubs.location,
	        st_point(long, lat) :: geography
	    ) as dist_meters,
		array_remove(array_agg(DISTINCT pub_photos.key), NULL::text) AS photos,
		pubs.primary_photo
	from public.pubs
	left join saves on pubs.id = saves.pub_id
	left join reviews on pubs.id = reviews.pub_id
	left join pub_photos on pubs.id = pub_photos.pub_id
	group by pubs.id;
$function$
;


