var express = require('express');
var router = express.Router();
const pool = require('../config/mysql');

// findAll
router.get('/', function (request, response) {
  pool.query('SELECT * FROM message', (error, results) => {
    if (error) {
      response.status(500).send(error);
    } else {
      response.send(results);
    }
  });
});

// findById
router.get('/:id', function (request, response) {
  const id = request.params.id;
  pool.query('SELECT * FROM message WHERE id = ?', [id], (error, results) => {
    if (error) {
      response.status(500).send(error);
    } else if (results.length > 0) {
      response.send(results[0]);
    } else {
      response.sendStatus(404);
    }
  });
});

// query : /messages?sort=asc > trier ou filtrer
// params : /messages/:id > sélection
// body : corps attaché à la requête : { id: 1, content: 'it works' } > créer ou mettre à jour
// create
router.post('/', (request, response) => {
  const message = request.body;
  pool.query(
    `INSERT INTO message(content) VALUES (?)`,
    [message.content],
    (error, results) => {
      if (error) {
        response.status(500).send(error);
      } else {
        response.status(201).send({
          id: results.insertId,
          ...message,
        });
      }
    }
  );
});

// TODO update

// TODO delete

module.exports = router;
