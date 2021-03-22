const express = require('express');
const morgan = require('morgan');
const axios = require('axios');
const path = require('path');
const db = require('../db');
const app = express();
const PORT = 3004;

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/reviews', (req, res) => {
  const { product_id, count, sort } = req.query;
  let queryString;
  if (sort === 'newest') {
    queryString = 
    `SELECT review_id, rating, summary, recommend,response, body, date, reviewer_name, helpfulness, 
    (
      SELECT array_to_json(array_agg(row_to_json(d))) 
      FROM (
      SELECT id, "url" FROM photos WHERE review_id=review.review_id
      ) d
    ) as photos
    FROM review WHERE product_id=${product_id} AND reported=false order by date desc limit ${count}`;
  } else if (sort === 'helpful') {
    queryString = 
    `SELECT review_id, rating, summary, recommend,response, body, date, reviewer_name, helpfulness, 
    (
      SELECT array_to_json(array_agg(row_to_json(d))) 
      FROM (
      SELECT id, "url" FROM photos WHERE review_id=review.review_id
      ) d
    ) as photos
    FROM review WHERE product_id=${product_id} AND reported=false order by helpfulness desc limit ${count}`;
  } else if (sort === 'relevant') {
      queryString = 
      `SELECT review_id, rating, summary, recommend,response, body, date, reviewer_name, helpfulness, 
      (
        SELECT array_to_json(array_agg(row_to_json(d))) 
        FROM (
        SELECT id, "url" FROM photos WHERE review_id=review.review_id
        ) d
      ) as photos
      FROM review WHERE product_id=${product_id} AND reported=false order by helpfulness desc, date desc limit ${count}`;
  }
  
  db.query(queryString)
    .then((response) => {

      for (let i = 0; i < response.rows.length; i++) {
        if (response.rows[i].photos === null) {
          response.rows[i].photos = [];
        }
      }
      const data = {
        product_id: product_id,
        page: 0,
        count: count,
        results: response.rows
      };
      res.send(data)
    })
    .catch((err) => {
      console.log(err);
      res.status(500);
    });
})

app.get('/reviews/meta', (req, res) => {
  const { product_id } = req.query;

  const results = {
    product_id: product_id,
    ratings: {
      '1': 0,
      '2': 0, 
      '3': 0, 
      '4': 0, 
      '5': 0 
    }, 
    recommended: {
      'true': 0, 
      'false': 0
    },
    characteristics: {},
  };

  const queryStr = 
  `select rating from review where product_id=${product_id}; 

  select recommend from review where product_id=${product_id};

  select avg(value) as avgVal, characteristics_id, name from characteristics join characteristics_reviews using(id) where product_id=${product_id} group by name, characteristics_id`; 

  db.query(queryStr) 
    .then((response) => {
      // console.log(response[0].rows);
      for (let i = 0; i < response[0].rows.length; i++) {
        results.ratings[response[0].rows[i].rating] += 1
      }

      // console.log(response[1].rows);
      for (let j = 0; j < response[1].rows.length; j++) {
        results.recommended[response[1].rows[j].recommend] += 1
      }

      // console.log(response[2].rows);
      for (let k = 0; k < response[2].rows.length; k++) {
        results.characteristics[response[2].rows[k].name] = {
          id: response[2].rows[k].characteristics_id,
          value: response[2].rows[k].avgval
        }
      }
      res.send(results);
    })
    .catch((err) => {
      console.log(err);
      res.status(500)
    });
})

app.post('/reviews', (req, res) => {
  const { product_id, rating, summary, body, date, recommend, reported, name, email, helpfulness, photos, characteristics } = req.body;
  console.log(req.body);

  const queryStr = `INSERT INTO review (product_id, rating, summary, body, date, recommend, reported, reviewer_name, reviewer_email, helpfulness) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING(review_id);`

  db.query(queryStr, [product_id, rating, summary, body, new Date().toISOString(), recommend, false, name, email, 0])
    .then((response) => {
      // console.log(response);
      res.status(201);
      res.send('Created');
    })
    .catch(() => res.status(500))
})

app.put('/reviews/:review_id/helpful', (req, res) => {
  const { review_id } = req.body;
  const queryStr = `update review set helpfulness = helpfulness + 1 where review_id=$1`

  db.query(queryStr, [review_id])
    .then((response) => {
      // console.log('put server res', response)
      res.status(201);
      res.send('1');
    })
    .catch((err) => {
      console.log(err);
      res.status(500);
    })
})

app.put('/reviews/:review_id/report', (req, res) => {
  const { review_id } = req.body;
  const queryStr = `update review set reported=true where review_id=$1`

  db.query(queryStr, [review_id])
    .then((response) => {
      // console.log('put server res', response)
      res.status(201);
      res.send('1');
    })
    .catch((err) => {
      console.log(err);
      res.status(500);
    })
})

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});

// select name, characteristics_id, value from characteristics join characteristics_reviews using(id) where product_id=${product_id}

// select name, characteristics_id, value from characteristics join characteristics_reviews using (characteristics_id) where product_id=${product_id};

// select value, characteristics_id, name from characteristics join characteristics_reviews using(id) where product_id=${product_id}