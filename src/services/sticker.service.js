// import message save service
const {
  saveMessageInFirebase,
} = require('./webhook-message-save-service/whatsapp.webhook.message.save.service');

// import platform attachment download service
const {
  downloadWhatsappAttachment,
} = require('./platform-attachment-download-service/whatsapp.attachment.download.service');

const {
  uploadMessageAttachment,
} = require('../library/uploadMessageAttachment');

async function handleWhatsappWebhookSticker(body, chatDetails) {
  const fileDetails = await downloadWhatsappAttachment(body);

  if (fileDetails.status === 200) {
    const fileUrl = await uploadMessageAttachment(
      fileDetails.file,
      fileDetails.fileType,
      fileDetails.attachmentName
    );

    if (fileUrl) {
      const messageBody = {
        sendByMe: false,
        messageType: 'IMAGE',
        message: fileUrl,
        createdAt: Date.now(),
      };

      const response = await saveMessageInFirebase(messageBody, chatDetails);
      console.log(response);
    }
  }
}

function handleViberWebhookSticker(body) {
  return null;
}

function handleMessengerWebhookSticker(body) {
  return null;
}

function handleInstagramWebhookSticker(body) {
  return null;
}

function handleTelegramWebhookSticker(body) {
  return null;
}

module.exports = {
  handleWhatsappWebhookSticker: handleWhatsappWebhookSticker,
  handleViberWebhookSticker: handleViberWebhookSticker,
  handleMessengerWebhookSticker: handleMessengerWebhookSticker,
  handleInstagramWebhookSticker: handleInstagramWebhookSticker,
  handleTelegramWebhookSticker: handleTelegramWebhookSticker,
};
