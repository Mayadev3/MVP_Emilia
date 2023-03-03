var express = require('express');
var router = express.Router();
const db = require("../model/helper");
const { ensureIsAdmin } = require('../middleware/guards');
const { ensureUserLoggedIn } = require('../middleware/guards');

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.get("/", ensureUserLoggedIn, function(req, res, next) {
  const search = req.query.search;
  db(` 
    SELECT 
      DISTINCT influencer_name,
      handle,
      platform,
      MAX(followers) AS followers,
      price_ex_vat,
      MAX(date) AS date
      FROM influencers
      WHERE influencer_name LIKE "${search}%"
      GROUP BY 1,2,3,5
      ORDER BY influencer_name, platform
    ;`)
    .then(results => {
      res.send(results.data);
    })
    .catch(err => res.status(500).send(err.message));
});

module.exports = router;
