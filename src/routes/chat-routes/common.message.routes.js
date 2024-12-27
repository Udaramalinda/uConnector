module.exports = (app) => {
  const commonMessage = require('../../controllers/chat-controllers/common.message.controller');

  const router = require('express').Router();

  router.post('/message', commonMessage.sendMessage);

  app.use('/chat', router);
};
