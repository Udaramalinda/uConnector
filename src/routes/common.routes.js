module.exports = (app) => {
  const allMessagesType = require('../controllers/all.messages.controller.js');

  const router = require('express').Router();

  router.post('/text', allMessagesType.handleCommonText);
  router.post('/image', allMessagesType.handleCommonImage);
  router.post('/video', allMessagesType.handleCommonVideo);
  router.post('/sticker', allMessagesType.handleCommonSticker);
  router.post('/document', allMessagesType.handleCommonDocument);

  app.use('/messages', router);
};
