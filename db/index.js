const { Client } = require('pg');

const connection = new Client({
  user: 'johnkwak', 
  host: 'localhost',
  password: 'student',
  database: 'reviews'
});

connection.connect((err) => {
  if (err) {
    console.log('db connect err', err);
  } else {
    console.log('connected to db!');
  }
});

module.exports = connection; 