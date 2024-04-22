INSERT INTO prototype SELECT * FROM read_json_auto(? || '/prototype.json');
