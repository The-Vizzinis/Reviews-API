\c reviews

CREATE TABLE products (
  id SERIAL PRIMARY KEY, 
  "name" TEXT, 
  slogan TEXT, 
  "description" TEXT, 
  category TEXT, 
  default_price TEXT
);

COPY products(id, "name", slogan, "description", category, default_price)
FROM  '/Users/johnkwak/SDC/Reviews-API/db/product.csv'
DELIMITER ','
CSV HEADER;