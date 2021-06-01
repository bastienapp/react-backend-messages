const express = require('express');
require('dotenv').config();
var cors = require('cors');
const app = express();
const pool = require('./config/mysql');

const port = process.env.PORT || 8000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);

app.get('/messages', function (request, response) {
  pool.query('SELECT * FROM message', (error, results) => {
    if (error) {
      response.status(500).send(error);
    } else {
      response.send(results);
    }
  });
});

app.listen(port, () => {
  console.log(`Listen on port ${port}`);
});
