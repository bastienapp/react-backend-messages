var express = require('express');
var router = express.Router();
const pool = require('../config/mysql');

// query : /messages?sort=asc > trier ou filtrer
// params : /messages/:id > sélection
// body : corps attaché à la requête : { id: 1, content: 'it works' } > créer ou mettre à jour

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
router.put('/:id', (request, response) => {
  // query : '/messages/1?content=tacos
  // params : '/messages/1/tacos
  // body : '/messages/1' body: {message: 'tacos'}
  const { content } = request.body;
  const id = request.params.id;
  pool.query(
    'UPDATE message SET content = ? WHERE id = ?',
    [content, id],
    (error, results) => {
      if (error) {
        response.status(500).send(error);
      } else {
        if (results.affectedRows > 0) {
          response.status(202).send({ id: id, content: content });
        } else {
          response.sendStatus(404);
        }
      }
    }
  );
});

// TODO delete
router.delete('/:id', (request, response) => {
  const id = request.params.id;
  pool.query('DELETE FROM message WHERE id = ?', [id], (error, results) => {
    if (error) {
      response.status(500).send(error);
    } else {
      if (results.affectedRows > 0) {
        response.sendStatus(204);
      } else {
        response.status(404).send({ error: `no message with id ${id}` });
      }
    }
  });
});

module.exports = router;
