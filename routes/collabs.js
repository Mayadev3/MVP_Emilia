var express = require('express');
var router = express.Router();
const db = require("../model/helper");
const { ensureIsAdmin } = require('../middleware/guards');
const { ensureUserLoggedIn } = require('../middleware/guards');


router.get("/", ensureUserLoggedIn, function(req, res, next) {
  db("SELECT * FROM collabs ORDER BY date ASC;")
    .then(results => {
      res.send(results.data);
    })
    .catch(err => res.status(500).send(err.message));
});

router.get("/:id", ensureUserLoggedIn, async (req, res, next) => {
  let id = req.params.id;

  try {
    let result = await db(`SELECT * FROM collabs WHERE collab_id = ${id};`);

    if (result.data.length !== 0) {
      res.send(result.data);
    } else {
      res.status(404).send({ error: "collaboration not found" });
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post("/", ensureIsAdmin, async (req, res, next) => {
  let { influencer_name, 
    handle, 
    platform,
    date,
    brief,
    status_collab,
    followers,
    price_ex_vat,
    ig_post,
    ig_story,
    boosted,
    comments,
    country_code } = req.body;

  try {
    await db(`INSERT INTO collabs (influencer_name, 
      handle, 
      platform,
      date,
      brief,
      status_collab,
      followers,
      price_ex_vat,
      ig_post,
      ig_story,
      boosted,
      comments,
      country_code
      )
      VALUES ('${influencer_name}', 
      '${handle}',
      '${platform}',
      '${date}',
      '${brief}',
      '${status_collab}',
      '${followers}',
      '${price_ex_vat}',
      '${ig_post}',
      '${ig_story}',
      '${boosted}',
      '${comments}',
      '${country_code}')`);

    let result = await db("SELECT * FROM collabs ORDER BY date ASC");
    res.send(result.data);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.put("/:collab_id", ensureIsAdmin, async (req, res) => {
  let collab_id = req.params.collab_id;

  let { influencer_name, 
    handle, 
    platform,
    date,
    brief,
    status_collab,
    followers,
    price_ex_vat,
    ig_post,
    ig_story,
    boosted,
    comments,
    country_code } = req.body;

  try {
      let result = await db(`SELECT * FROM collabs WHERE collab_id = ${collab_id}`); 
      if (result.data.length === 0) {
          res.status(404).send({ error: 'Collaboration not found' });
      } else {
          let sql = `
              UPDATE collabs 
              SET influencer_name = '${influencer_name}', 
              handle = '${handle}', 
              platform = '${platform}',
              date = '${date}',
              brief = '${brief}',
              status_collab = '${status_collab}',
              followers = '${followers}',
              price_ex_vat = '${price_ex_vat}',
              ig_post= '${ig_post}',
              ig_story = '${ig_story}',
              boosted = '${boosted}',
              comments = '${comments}',
              country_code = '${country_code}'
              WHERE collab_id = ${collab_id}
          `;

          await db(sql);  
          let result = await db('SELECT * FROM collabs ORDER BY date ASC');
          let collabs = result.data;
          res.send(collabs); 
      }
  } catch (err) {
      res.status(500).send({ error: err.message });
  }
});

router.delete("/:collab_id", ensureIsAdmin, async (req, res, next) => {
  let id = req.params.collab_id;

  try {
    let result = await db(`SELECT * FROM collabs WHERE collab_id = ${id}`);

    if (result.data.length !== 0) {
      await db(`DELETE FROM collabs WHERE collab_id = ${id}`);
      let result = await db("SELECT * FROM collabs");
      res.send(result.data);
    } else {
      res.status(404).send({ error: "collab not found" });
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
