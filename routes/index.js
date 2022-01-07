const express = require('express');
const dfWebhook = require('./dfWebhook');

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).send('OK');
});

router.use(dfWebhook);

module.exports = router;
