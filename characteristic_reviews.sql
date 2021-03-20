\c reviews

CREATE TABLE characteristics_reviews (
  id SERIAL PRIMARY KEY, 
  characteristics_id INT, 
  review_id INT, 
  "value" TEXT,
  FOREIGN KEY (characteristics_id) REFERENCES characteristics (id),
  FOREIGN KEY (review_id) REFERENCES review (id)
);

COPY characteristics_reviews(id, characteristics_id, review_id, "value")
FROM  '/Users/johnkwak/SDC/Reviews-API/db/characteristic_reviews.csv'
DELIMITER ','
CSV HEADER;