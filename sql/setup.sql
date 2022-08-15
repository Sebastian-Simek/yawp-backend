-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS restuarants CASCADE;

CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email VARCHAR,
    username VARCHAR NOT NULL,
    password_hash TEXT NOT NULL
);

CREATE TABLE reviews (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    review VARCHAR NOT NULL,    
    user_id BIGINT,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE restuarants(
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR,
    location VARCHAR,
    review_id BIGINT,
    FOREIGN KEY (review_id) REFERENCES reviews (id)
);

INSERT INTO users (
    email,
    username,
    password_hash
)
VALUES
('test@test.com', 'MR. Test', 'not@HasH'),
('teeeest@tesasdft.com', 'MRasdf. Teasdfst', 'notasdf@HasH');

