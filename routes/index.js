var express = require('express');
var router = express.Router();
const db = require("../db/queries");

/* GET home page. */
router.get('/', async function(req, res, next) {
  const messages = await db.getMessages();
  res.render('index', { title: 'Mini Messageboard', messages: messages });
});

router.get('/new', function(req, res) {
  res.render('new', { title: 'New Message' });
}); 

router.post('/new', async function(req, res) {
  const { user, message } = req.body;
  await db.insertMessage(user, message);
  res.redirect('/');
});

router.get('/message/:id', async function(req, res) {
  const { id } = req.params;
  const message = await db.getMessage(id);
  res.render('message', { title: 'Message Details', message: message });
});

module.exports = router;
