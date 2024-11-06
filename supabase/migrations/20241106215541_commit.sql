alter table "public"."comments" drop constraint "comments_user_id_fkey";

alter table "public"."reviews" drop constraint "reviews_user_id_fkey";

drop view if exists "public"."user_comments";

drop view if exists "public"."user_reviews";

alter table "public"."comments" add constraint "comments_user_id_fkey1" FOREIGN KEY (user_id) REFERENCES users_public(id) ON DELETE CASCADE not valid;

alter table "public"."comments" validate constraint "comments_user_id_fkey1";

alter table "public"."reviews" add constraint "reviews_user_id_fkey1" FOREIGN KEY (user_id) REFERENCES users_public(id) ON DELETE CASCADE not valid;

alter table "public"."reviews" validate constraint "reviews_user_id_fkey1";


