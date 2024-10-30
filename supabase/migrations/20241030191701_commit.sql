create policy "users can create their own collections"
on "public"."collections"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "users can view their own collection"
on "public"."collections"
as permissive
for select
to public
using ((auth.uid() = user_id));



