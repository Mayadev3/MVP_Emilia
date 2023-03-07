var express = require('express');
var router = express.Router();
const db = require("../model/helper");
const { ensureIsAdmin } = require('../middleware/guards');
const { ensureUserLoggedIn } = require('../middleware/guards');


/* Get all users*/

router.get("/users", ensureIsAdmin, function(req, res, next) {
  db("SELECT * FROM users")
    .then(results => {
      res.send(results.data);
    })
    .catch(err => res.status(500).send(err.message));
});

/* Delete a user by id*/

router.delete("/users/:id", ensureIsAdmin, async function(req, res, next) {
  let userId = req.params.id;

  try {
    let result = await db(`SELECT * FROM users WHERE id = ${userId}`);
    if (result.data.length === 0) {
      res.status(404).send({ error: 'User not found.'});
    } else {
      await db(`DELETE FROM users WHERE id = ${userId}`);
      let result = await db('SELECT * FROM users');
      res.send(result.data);
    }
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
});

/* Modify a user by id*/

router.put("/users/:id", ensureIsAdmin, async function(req, res, next) {
  let userId = req.params.id;

  try {
    let result = await db(`SELECT * FROM users WHERE id = ${userId}`);
    if (result.data.length === 0) {
      res.status(404).send({ error: 'User not found.'});
    } else {
      let sql = `UPDATE users SET isAdmin = !isAdmin WHERE id = ${userId}`;
      await db(sql);
      let result = await db('SELECT * FROM users');
      res.send(result.data);
    }
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
});


module.exports = router;
