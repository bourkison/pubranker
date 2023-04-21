drop policy "another test" on "public"."review_helpfuls";

drop policy "blah" on "public"."review_helpfuls";

drop policy "test 234" on "public"."review_helpfuls";

drop policy "ensure unique values" on "public"."rls_table";

drop policy "user can access all data" on "public"."users_public";

alter table "public"."rls_table" drop constraint "rls_table_pkey";

drop index if exists "public"."rls_table_pkey";

drop table "public"."rls_table";

create policy "users can delete their helpfuls"
on "public"."review_helpfuls"
as permissive
for delete
to public
using ((auth.uid() = user_id));


create policy "users can mark reviews as helpful"
on "public"."review_helpfuls"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "users can pull all helpfuls"
on "public"."review_helpfuls"
as permissive
for select
to public
using (true);


create policy "users can update their helpfuls"
on "public"."review_helpfuls"
as permissive
for update
to public
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));


create policy "users can access their own data"
on "public"."users_public"
as permissive
for select
to public
using ((auth.uid() = id));



