drop view if exists "public"."formatted_pubs";

drop view if exists "public"."user_comments";

drop view if exists "public"."user_reviews";

alter table "public"."pub_schema" drop column "google_overview";

alter table "public"."pub_schema" drop column "google_rating";

alter table "public"."pub_schema" drop column "google_ratings_amount";

alter table "public"."pub_schema" drop column "overall_reviews";

alter table "public"."pub_schema" drop column "review_beer";

alter table "public"."pub_schema" drop column "review_food";

alter table "public"."pub_schema" drop column "review_location";

alter table "public"."pub_schema" drop column "review_music";

alter table "public"."pub_schema" drop column "review_service";

alter table "public"."pub_schema" drop column "review_vibe";

alter table "public"."pub_schema" add column "description" text not null;

alter table "public"."pub_schema" add column "rating" double precision not null;

alter table "public"."pub_schema" add column "review_beer_amount" integer not null;

alter table "public"."pub_schema" add column "review_food_amount" integer not null;

alter table "public"."pub_schema" add column "review_location_amount" integer not null;

alter table "public"."pub_schema" add column "review_music_amount" integer not null;

alter table "public"."pub_schema" add column "review_negative_beer_amount" integer not null;

alter table "public"."pub_schema" add column "review_negative_food_amount" integer not null;

alter table "public"."pub_schema" add column "review_negative_location_amount" integer not null;

alter table "public"."pub_schema" add column "review_negative_music_amount" integer not null;

alter table "public"."pub_schema" add column "review_negative_service_amount" integer not null;

alter table "public"."pub_schema" add column "review_negative_vibe_amount" integer not null;

alter table "public"."pub_schema" add column "review_service_amount" integer not null;

alter table "public"."pub_schema" add column "review_stars_five" integer not null;

alter table "public"."pub_schema" add column "review_stars_four" integer not null;

alter table "public"."pub_schema" add column "review_stars_one" integer not null;

alter table "public"."pub_schema" add column "review_stars_three" integer not null;

alter table "public"."pub_schema" add column "review_stars_two" integer not null;

alter table "public"."pub_schema" add column "review_vibe_amount" integer not null;

alter table "public"."pubs" drop column "google_overview";

alter table "public"."pubs" drop column "google_rating";

alter table "public"."pubs" drop column "google_ratings_amount";

alter table "public"."pubs" add column "description" text not null;

alter table "public"."reviews" add column "rating" integer not null;

alter table "public"."reviews" alter column "beer" drop not null;

alter table "public"."reviews" alter column "beer" set data type boolean using "beer"::boolean;

alter table "public"."reviews" alter column "food" drop not null;

alter table "public"."reviews" alter column "food" set data type boolean using "food"::boolean;

alter table "public"."reviews" alter column "location" drop not null;

alter table "public"."reviews" alter column "location" set data type boolean using "location"::boolean;

alter table "public"."reviews" alter column "music" drop not null;

alter table "public"."reviews" alter column "music" set data type boolean using "music"::boolean;

alter table "public"."reviews" alter column "service" drop not null;

alter table "public"."reviews" alter column "service" set data type boolean using "service"::boolean;

alter table "public"."reviews" alter column "vibe" drop not null;

alter table "public"."reviews" alter column "vibe" set data type boolean using "vibe"::boolean;

alter table "public"."users_public" add column "profile_photo" text;


