const { Pool } = require('pg');

const connection = new Pool({
  user: 'postgres', // postgres
  host: '3.101.31.131', // aws instance  // host.docker.internal // localhost
  password: '1qa2ws!QA@WS',
  database: 'postgres',
  port: 5432
});

connection.connect((err) => {
  if (err) {
    console.log('db connect err', err);
  } else {
    console.log('connected to db!');
  }
});

module.exports = connection; 