// import message save service
const {
  saveMessageInFirebase,
} = require('./webhook-message-save-service/whatsapp.webhook.message.save.service');

// import document message generator for each chat platform
const {
  generateWhatsappDocumentMessageObject,
} = require('./object-generator-service/whatsapp.object.generator');

// import sending method for each chat platform
const {
  sendMessageToWhatsapp,
} = require('./platform-send-services/whatsapp.send.service');

// import platform attachment download service
const {
  downloadWhatsappAttachment,
} = require('./platform-attachment-download-service/whatsapp.attachment.download.service');

const {
  uploadMessageAttachment,
} = require('../library/uploadMessageAttachment');

async function handleWhatsappWebhookDocument(body, chatDetails) {
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
        messageType: 'DOCUMENT',
        message: fileUrl,
        createdAt: Date.now(),
      };

      const response = await saveMessageInFirebase(messageBody, chatDetails);
      console.log(response);
    }
  }
}

async function handleViberWebhookDocument(body) {
  return null;
}

async function handleMessengerWebhookDocument(body) {
  return null;
}

async function handleInstagramWebhookDocument(body) {
  return null;
}

async function handleTelegramWebhookDocument(body) {
  return null;
}

async function sendDocumentToChatPlatform(messageContent) {
  if (messageContent.chatDetails.receiverChannel === 'WHATSAPP') {
    const whatsappDocumentMessageObject =
      await generateWhatsappDocumentMessageObject(messageContent);
    return sendMessageToWhatsapp(whatsappDocumentMessageObject);
  } else if (messageContent.chatDetails.receiverChannel === 'MESSENGER') {
    // return sendTextToMessenger(messageContent);
  } else if (messageContent.chatDetails.receiverChannel === 'INSTAGRAM') {
    // return sendTextToInstagram(messageContent);
  } else {
    return {
      status: 400,
      message: 'Invalid chat platform',
    };
  }
}

module.exports = {
  handleWhatsappWebhookDocument: handleWhatsappWebhookDocument,
  handleViberWebhookDocument: handleViberWebhookDocument,
  handleMessengerWebhookDocument: handleMessengerWebhookDocument,
  handleInstagramWebhookDocument: handleInstagramWebhookDocument,
  handleTelegramWebhookDocument: handleTelegramWebhookDocument,
  sendDocumentToChatPlatform: sendDocumentToChatPlatform,
};
