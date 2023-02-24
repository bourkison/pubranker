select pubs.id,
    array_agg(opening_hours.open_day) as opening_hours_days
from public.pubs
    left outer join public.opening_hours on pubs.id = opening_hours.pub_id
group by pubs.id