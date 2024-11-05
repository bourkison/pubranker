CREATE UNIQUE INDEX uq_collection_items ON public.collection_items USING btree (pub_id, collection_id);

alter table "public"."collection_items" add constraint "uq_collection_items" UNIQUE using index "uq_collection_items";

create policy "Enable insert for users based on user_id"
on "public"."collection_items"
as permissive
for insert
to public
with check ((( SELECT auth.uid() AS uid) = created_by));



