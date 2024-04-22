select t1.qual_symbol as "name", args, "returns"
from prototype t1
join lateral (
    select list(t3.symbol) as args
    from type_ref t2
    join type_symbol t3 on t2.type_id = t3.id
    where
        t1.id = t2.prototype_id
        and exists (
            from type_ref ts1
            join type_symbol ts2 on ts1.type_id = ts2.id
            where 
                ts1.prototype_id = t1.id
                and ts1.kind = 'return'
                and (ts2.symbol = ?) is not false
        )
        and exists (
            from type_ref ts1
            join type_symbol ts2 on ts1.type_id = ts2.id
            where 
                ts1.prototype_id = t1.id
                and ts1.kind = 'arg'
                and (ts2.symbol = ?) is not false
        )
        and t2.kind = 'arg'
    group by t2.prototype_id
) on true
join lateral (
	select ts2,symbol as "returns"
	from type_ref ts1
	join type_symbol ts2 on ts1.type_id = ts2.id
	where 
		ts1.prototype_id = t1.id
		and ts1.kind = 'return'
) on true
order by t1.id