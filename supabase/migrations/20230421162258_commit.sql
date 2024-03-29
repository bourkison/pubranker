create table "public"."comments" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "content" text not null,
    "user_id" uuid not null default auth.uid(),
    "review_id" bigint not null
);


alter table "public"."comments" enable row level security;

CREATE UNIQUE INDEX comments_pkey ON public.comments USING btree (id);

alter table "public"."comments" add constraint "comments_pkey" PRIMARY KEY using index "comments_pkey";

alter table "public"."comments" add constraint "comments_review_id_fkey" FOREIGN KEY (review_id) REFERENCES reviews(id) not valid;

alter table "public"."comments" validate constraint "comments_review_id_fkey";

alter table "public"."comments" add constraint "comments_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."comments" validate constraint "comments_user_id_fkey";

create or replace view "public"."user_comments" as  SELECT c.id,
    c.created_at,
    c.updated_at,
    c.content,
    c.user_id,
    c.review_id,
    u.name AS user_name
   FROM (comments c
     LEFT JOIN users_public u ON ((u.id = c.user_id)))
  GROUP BY c.id, u.id;


create policy "anyone can see comments"
on "public"."comments"
as permissive
for select
to public
using (true);


create policy "users can create their own comments"
on "public"."comments"
as permissive
for insert
to public
with check ((auth.uid() = user_id));



