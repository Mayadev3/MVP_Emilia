var express = require('express');
var router = express.Router();
const db = require("../model/helper");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { BCRYPT_WORK_FACTOR, SECRET_KEY } = require('../config');

/* POST new user, default isAdmin to be false*/

router.post("/register", async (req, res, next) => {
  let { username, password, email, isAdmin } = req.body;
  let hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

  try {
    let sql = `INSERT INTO users (username, password, email, isAdmin)
    VALUES ('${username}', '${hashedPassword}', '${email}', false)`;
    await db(sql);
    res.send({ message: 'Registration succesful.'});
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

/* POST login existing user, if exists*/
router.post("/login", async (req, res, next) => {
  let { username, password } = req.body;

  try {
    let results = await db(`SELECT * FROM users WHERE username = '${username}'`);
    if (results.data.length === 0) {
      res.status(401).send({ error: "Login failed." });
    } else {
      let user = results.data[0];
      let passwordsEqual = await bcrypt.compare(password, user.password);
      if (passwordsEqual) {
        let payload = {userId: user.id};
        let token = jwt.sign(payload, SECRET_KEY);
        delete user.password;
        res.send ({
          message: "Login successful.",
          token: token,
          user: user
        })
      } else {
        res.status(401).send({ error: "Login failed." });
      }
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

module.exports = router;
