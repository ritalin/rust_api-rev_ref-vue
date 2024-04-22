create table prototype (
    id BIGINT not null primary key,
    symbol varchar(64) not null,
    qual_symbol varchar(256) not null
);

create table type_symbol (
    id BIGINT not null primary key,
    symbol varchar(64) not null,
    qual_symbol varchar(256) not null
);

create type type_kind as enum ('arg', 'return');

create table IF NOT EXISTS type_ref (
    prototype_id BIGINT not null,
    type_id BIGINT not null,
    kind type_kind not null,
    constraint type_ref_pk primary key (prototype_id, type_id, kind)
);