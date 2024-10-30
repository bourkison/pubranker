alter table "public"."pubs" alter column "address" set not null;

alter table "public"."pubs" alter column "created_at" set not null;

alter table "public"."pubs" alter column "google_id" set not null;

alter table "public"."pubs" alter column "location" set not null;

alter table "public"."pubs" alter column "name" set not null;

alter table "public"."pubs" alter column "updated_at" set not null;

alter table "public"."pubs" alter column "website" set not null;

alter table "public"."reviews" drop column "rating";


