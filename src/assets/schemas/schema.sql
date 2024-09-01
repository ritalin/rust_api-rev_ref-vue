
CREATE SEQUENCE crate_symbol_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 4 NO CYCLE;
CREATE SEQUENCE deprecated_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 8 NO CYCLE;
CREATE SEQUENCE prototype_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 3148 NO CYCLE;
CREATE SEQUENCE type_symbol_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 12614 NO CYCLE;

CREATE TABLE crate_symbol(id BIGINT PRIMARY KEY DEFAULT(nextval('crate_symbol_seq')), symbol VARCHAR NOT NULL);
CREATE TABLE deprecated(id BIGINT PRIMARY KEY DEFAULT(nextval('deprecated_seq')), since VARCHAR NOT NULL);
CREATE TABLE prototype_deprecated_ref(prototype_id BIGINT, deprecated_id BIGINT, PRIMARY KEY(prototype_id, deprecated_id));
CREATE TABLE prototype(id BIGINT PRIMARY KEY, symbol VARCHAR NOT NULL, qual_symbol VARCHAR NOT NULL, brief_symbol VARCHAR NOT NULL);
CREATE TABLE prototype_crate_ref(crate_id BIGINT, prototype_id BIGINT, PRIMARY KEY(crate_id, prototype_id));
CREATE TABLE prototype_type_ref(prototype_id BIGINT, type_id BIGINT, kind ENUM('arg', 'return'), category ENUM('nominal', 'slice', 'tuple', 'owner'), PRIMARY KEY(prototype_id, type_id, kind, category));
CREATE TABLE type_symbol(id BIGINT PRIMARY KEY, symbol VARCHAR NOT NULL);




