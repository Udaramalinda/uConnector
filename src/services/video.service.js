// import message save service
const {
  saveMessageInFirebase,
} = require('./webhook-message-save-service/whatsapp.webhook.message.save.service');

// import video message generator for each chat platform
const {
  generateWhatsappVideoMessageObject,
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

async function handleWhatsappWebhookVideo(body, chatDetails) {
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
        messageType: 'VIDEO',
        message: fileUrl,
        createdAt: Date.now(),
      };

      const response = await saveMessageInFirebase(messageBody, chatDetails);
      console.log(response);
    }
  }
}

function handleViberWebhookVideo(body) {
  return null;
}

function handleMessengerWebhookVideo(body) {
  return null;
}

function handleInstagramWebhookVideo(body) {
  return null;
}

function handleTelegramWebhookVideo(body) {
  return null;
}

// Sending video to relavant chat platform
async function sendVideoToChatPlatform(messageContent) {
  if (messageContent.chatDetails.receiverChannel === 'WHATSAPP') {
    const whatsappVideoMessageObject = await generateWhatsappVideoMessageObject(
      messageContent
    );
    return sendMessageToWhatsapp(whatsappVideoMessageObject);
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
  handleWhatsappWebhookVideo: handleWhatsappWebhookVideo,
  handleViberWebhookVideo: handleViberWebhookVideo,
  handleMessengerWebhookVideo: handleMessengerWebhookVideo,
  handleInstagramWebhookVideo: handleInstagramWebhookVideo,
  handleTelegramWebhookVideo: handleTelegramWebhookVideo,
  sendVideoToChatPlatform: sendVideoToChatPlatform,
};
