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
const { handleWhatsappWebhookSticker } = require('../services/sticker.service');

// import check user chat exists service
const {
  checkWhatsappUserChatExists,
} = require('../services/webhook-message-save-service/whatsapp.webhook.message.save.service');

const axios = require('axios');

exports.verifyWebhook = async (req, res) => {
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

exports.acceptMessage = async (req, res) => {
  let body = req.body;

  if (
    body.entry[0].changes[0].value.messages &&
    body.entry[0].changes[0].value.messages.length > 0
  ) {
    res.status(200).send('EVENT_RECEIVED');
    handleReadStatus(body.entry[0].changes[0].value.messages[0].id);

    // cretae chat if not exists
    const chatDetails = await checkWhatsappUserChatExists(body);

    if (chatDetails.chatId && chatDetails.userId) {
      if (body.entry[0].changes[0].value.messages[0].text) {
        handleWhatsappWebhookText(body, chatDetails);
      } else if (body.entry[0].changes[0].value.messages[0].image) {
        handleWhatsappWebhookImage(body, chatDetails);
      } else if (body.entry[0].changes[0].value.messages[0].video) {
        handleWhatsappWebhookVideo(body, chatDetails);
      } else if (body.entry[0].changes[0].value.messages[0].document) {
        handleWhatsappWebhookDocument(body, chatDetails);
      } else if (body.entry[0].changes[0].value.messages[0].sticker) {
        handleWhatsappWebhookSticker(body, chatDetails);
      } else {
        console.log('Unsupported message type');
      }
    }
  }
};

async function handleReadStatus(messageId) {
  await axios
    .post(
      WHATSAPP_SEND_MESSAGE_BASE_URL +
        '/' +
        WHATSAPP_API_VERSION +
        '/' +
        WHATSAPP_PHONE_NUMBER_ID +
        '/messages',
      {
        messaging_product: 'whatsapp',
        status: 'read',
        message_id: messageId,
      },
      {
        headers: {
          Authorization: 'Bearer ' + WHATSAPP_VERIFY_TOKEN,
          'Content-Type': 'application/json',
        },
      }
    )
    .then((response) => {
      console.log('sent read status to whatsapp');
    })
    .catch((error) => {
      console.log(error.response.data);
    });
}
