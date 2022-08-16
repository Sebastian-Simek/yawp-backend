-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS restaurants CASCADE;

CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email VARCHAR,
    username VARCHAR NOT NULL,
    password_hash TEXT NOT NULL
);

CREATE TABLE restaurants(
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR,
    location VARCHAR
);
CREATE TABLE reviews (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    review VARCHAR NOT NULL, 
    detail VARCHAR NOT NULL,   
    user_id BIGINT,
    restaurant_id BIGINT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
);


INSERT INTO users (
    email,
    username,
    password_hash
)
VALUES
('test@test.com', 'MR. Test', 'not@HasH'),
('teeeest@tesasdft.com', 'MRasdf. Teasdfst', 'notasdf@HasH');

INSERT INTO restaurants (
    name,
    location
)
VALUES
('Pok Pok', 'Portland, OR'),
('Luigies', 'San Antonio, TX'),
('Whataburger', 'Dallas, TX'),
('Katz', 'New York City, NY');

INSERT INTO reviews (
    restaurant_id,
    user_id,
    review,
    detail
)
VALUES
(1, 1, '5', 'this place is great'),
(1, 2, '1', 'this place is not great'),
(3, 2, '3', 'this place okay'),
(1, 1, '1', 'I like it here'),
(2, 2, '4', 'the agent is stupid'),
(1, 1, '4', 'woohoo'),
(4, 1, '5', 'blablabla'),
(3, 1, '5', 'toodle doo')
