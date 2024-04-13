const WHATSAPP_WEBHOOK_VERIFY_TOKEN = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;
const WHATSAPP_VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;
const WHATSAPP_SEND_MESSAGE_BASE_URL =
  process.env.WHATSAPP_SEND_MESSAGE_BASE_URL;
const WHATSAPP_API_VERSION = process.env.WHATSAPP_API_VERSION;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

const { handleWhatsappWebhookText } = require('../services/text.service');
const { handleWhatsappWebhookImage } = require('../services/image.service');
const { handleWhatsappWebhookVideo } = require('../services/video.service');
const {
  handleWhatsappWebhookDocument,
} = require('../services/document.service');
const {
  handleWhatsappWebhookSticker,
} = require('../services/sticker.service');

const axios = require('axios');

exports.verifyWebhook = (req, res) => {
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
  let mode = req.query['hub.mode'];

  if (mode && token) {
    if (mode === 'subscribe' && token === WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
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

  if (
    body.entry[0].changes[0].value.messages &&
    body.entry[0].changes[0].value.messages.length > 0
  ) {
    res.status(200).send('EVENT_RECEIVED');
    handleReadStatus(body.entry[0].changes[0].value.messages[0].id);

    if (body.entry[0].changes[0].value.messages[0].text) {
      handleWhatsappWebhookText(body);
    } else if (body.entry[0].changes[0].value.messages[0].image) {
      handleWhatsappWebhookImage(body);
    } else if (body.entry[0].changes[0].value.messages[0].video) {
      handleWhatsappWebhookVideo(body);
    } else if (body.entry[0].changes[0].value.messages[0].document) {
      handleWhatsappWebhookDocument(body);
    } else if (body.entry[0].changes[0].value.messages[0].sticker) {
      handleWhatsappWebhookSticker(body);
    } else {
      console.log('Unsupported message type');
    }
  } else {
    res.sendStatus(404);
  }
};

async function handleReadStatus(messageId) {
  await axios
    .post(
      `${WHATSAPP_SEND_MESSAGE_BASE_URL}/${WHATSAPP_API_VERSION}/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        status: 'read',
        message_id: messageId,
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_VERIFY_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    )
    .then((response) => {
      console.log('Read status sent successfully');
    })
    .catch((error) => {
      console.log('Error sending read status');
    });
}
