\c reviews

CREATE TABLE review (
  review_id SERIAL PRIMARY KEY, 
  product_id INT, 
  rating INT, 
  "date" TEXT, 
  summary TEXT, 
  body TEXT, 
  recommend BOOLEAN,
  reported BOOLEAN,
  reviewer_name TEXT NOT NULL,
  reviewer_email TEXT NOT NULL,
  response TEXT, 
  helpfulness INT,
  FOREIGN KEY (product_id) REFERENCES products (id)
);

COPY review(review_id, product_id, rating, "date", summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
FROM  '/Users/johnkwak/SDC/Reviews-API/db/reviews.csv'
DELIMITER ','
CSV HEADER;