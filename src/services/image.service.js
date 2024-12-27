// import message save service
const {
  saveMessageInFirebase,
} = require('./webhook-message-save-service/whatsapp.webhook.message.save.service');

// import image message generator for each chat platform
const {
  generateWhatsappImageMessageObject,
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

async function handleWhatsappWebhookImage(body, chatDetails) {
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

function handleViberWebhookImage(body) {
  return null;
}

function handleMessengerWebhookImage(body) {
  return null;
}

function handleInstagramWebhookImage(body) {
  return null;
}

function handleTelegramWebhookImage(body) {
  return null;
}

// Sending image to relavant chat platform
async function sendImageToChatPlatform(messageContent) {
  if (messageContent.chatDetails.receiverChannel === 'WHATSAPP') {
    const whatsappImageMessageObject = await generateWhatsappImageMessageObject(
      messageContent
    );
    return sendMessageToWhatsapp(whatsappImageMessageObject);
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
  handleWhatsappWebhookImage: handleWhatsappWebhookImage,
  handleViberWebhookImage: handleViberWebhookImage,
  handleMessengerWebhookImage: handleMessengerWebhookImage,
  handleInstagramWebhookImage: handleInstagramWebhookImage,
  handleTelegramWebhookImage: handleTelegramWebhookImage,
  sendImageToChatPlatform: sendImageToChatPlatform,
};
