\c reviews

CREATE TABLE characteristics (
  id SERIAL PRIMARY KEY, 
  product_id INT, 
  "name" TEXT,
  FOREIGN KEY (product_id) REFERENCES products (id)
);

COPY characteristics(id, product_id, "name")
FROM  '/Users/johnkwak/SDC/Reviews-API/db/characteristics.csv'
DELIMITER ','
CSV HEADER;