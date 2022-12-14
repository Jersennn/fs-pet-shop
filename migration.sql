DROP TABLE IF EXISTS pets;

CREATE TABLE pets (
    id SERIAL PRIMARY KEY,
    age INTEGER,
    kind TEXT,
    name TEXT
);

INSERT INTO pets (age, kind, name) VALUES (7, 'rainbow', 'fido');
INSERT INTO pets (age, kind, name) VALUES (5,'snake', 'Buttons');
INSERT INTO pets (age, kind, name) VALUES (3, 'parakeet', 'Cornflake');
INSERT INTO pets (age, kind, name) VALUES (1, 'capybara', 'marco');