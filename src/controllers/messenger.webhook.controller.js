const MESSENGER_WEBHOOK_VERIFY_TOKEN =
  process.env.MESSENGER_WEBHOOK_VERIFY_TOKEN;
const MESSENGER_VERIFY_TOKEN = process.env.MESSENGER_VERIFY_TOKEN;
const MESSENGER_SEND_MESSAGE_BASE_URL =
  process.env.MESSENGER_SEND_MESSAGE_BASE_URL;
const MESSENGER_API_VERSION = process.env.MESSENGER_API_VERSION;
const MESSENGER_PAGE_ID = process.env.MESSENGER_PAGE_ID;

const { handleMessengerWebhookText } = require('../services/text.service');
const {
  handleMessengerWebhookImage,
} = require('../services/image.service');
const {
  handleMessengerWebhookVideo,
} = require('../services/video.service');
const {
  handleMessengerWebhookDocument,
} = require('../services/document.service');
const {
  handleMessengerWebhookSticker,
} = require('../services/sticker.service');

const axios = require('axios');

exports.verifyWebhook = (req, res) => {
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
  let mode = req.query['hub.mode'];

  if (mode && token) {
    if (mode === 'subscribe' && token === MESSENGER_WEBHOOK_VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(403);
  }
};

exports.acceptMessage = (req, res) => {
  let body = req.body;

  if (body.object === 'page') {
    body.entry.forEach((entry) => {
      entry.messaging.forEach((event) => {
        if (event.message) {
          handleMessengerWebhookText(event);
        } else if (event.message.attachments) {
          event.message.attachments.forEach((attachment) => {
            if (attachment.type === 'image') {
              handleMessengerWebhookImage(attachment);
            } else if (attachment.type === 'video') {
              handleMessengerWebhookVideo(attachment);
            } else if (attachment.type === 'file') {
              handleMessengerWebhookDocument(attachment);
            } else if (attachment.type === 'sticker') {
              handleMessengerWebhookSticker(attachment);
            } else {
              console.log('Unsupported attachment type');
            }
          });
        } else {
          console.log('Unsupported message type');
        }
      });
    });
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
};
