\c reviews

CREATE TABLE photos (
  id SERIAL PRIMARY KEY, 
  review_id INT, 
  "url" TEXT,
  FOREIGN KEY (review_id) REFERENCES review (id)
);

COPY photos(id, review_id, "url")
FROM  '/Users/johnkwak/SDC/Reviews-API/db/reviews_photos.csv'
DELIMITER ','
CSV HEADER;