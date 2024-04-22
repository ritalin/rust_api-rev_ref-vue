INSERT INTO type_symbol SELECT * FROM read_json_auto(? || '/type_symbol.json');
