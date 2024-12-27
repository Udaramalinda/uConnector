module.exports = (app) => {
  const messengerWebhook = require('../controllers/messenger.webhook.controller.js');

  const router = require('express').Router();

  router.post('/webhook', messengerWebhook.acceptMessage);
  router.get('/webhook', messengerWebhook.verifyWebhook);

  app.use('/messenger', router);
};
