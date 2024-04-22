INSERT INTO type_ref SELECT * FROM read_json_auto(? || '/type_ref.json');
