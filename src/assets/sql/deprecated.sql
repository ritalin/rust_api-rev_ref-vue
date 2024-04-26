INSERT INTO deprecated SELECT * FROM read_json_auto(? || '/deprecated.json');
