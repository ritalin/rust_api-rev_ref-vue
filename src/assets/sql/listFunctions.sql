with ph as materialized (
    select 
        $crate_id::int as crate_id, 
        $ret_phrase::varchar as ret_phrase,
        $ret_cat_1::type_category as ret_cat_1,
        $ret_cat_2::type_category as ret_cat_2,
        $arg_phrase::varchar as arg_phrase,
        $arg_cat_1::type_category as arg_cat_1,
        $arg_cat_2::type_category as arg_cat_2,
)
select v1.*, v2.*
from (
    select t1.id, t1.qual_symbol
    from prototype t1
    cross join ph
    where
        exists (
            from prototype_type_ref ts1
            join type_symbol ts2 on ts1.type_id = ts2.id
            where 
                ts1.prototype_id = t1.id
                and ts1.kind = 'return'
                and ts1.category = any (select unnest(['nominal', ph.ret_cat_1, ph.ret_cat_2])) 
                and (ts2.symbol = ph.ret_phrase) is not false
        )
        and exists (
            from prototype_type_ref ts1
            join type_symbol ts2 on ts1.type_id = ts2.id
            where 
                ts1.prototype_id = t1.id
                and ts1.kind = 'arg'
                and ts1.category = any (select unnest(['nominal', ph.arg_cat_1, ph.arg_cat_2]))
                and (ts2.symbol = ph.arg_phrase) is not false
        )
        and exists (
            from prototype_crate_ref ts1
            where
                ts1.prototype_id = t1.id
                and (ts1.crate_id = ph.crate_id) is not false
        )
) v1
left outer join lateral (
    select ts2.since,
    from prototype_deprecated_ref ts1
    join deprecated ts2 on ts1.deprecated_id = ts2.id
    where ts1.prototype_id = v1.id
) v2 on true
order by v1.qual_symbol;