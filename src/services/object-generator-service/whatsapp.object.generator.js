async function generateWhatsappTextMessageObject(messageContent) {
  const textMessageObject = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: messageContent.chatDetails.receiverChannelId,
    type: 'text',
    text: {
      body: messageContent.messageData.message,
    },
  };

  return textMessageObject;
}

async function generateWhatsappImageMessageObject(messageContent) {
  const imageMessageObject = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: messageContent.chatDetails.receiverChannelId,
    type: 'image',
    image: {
      link: messageContent.messageData.message,
    },
  };

  return imageMessageObject;
}

async function generateWhatsappVideoMessageObject(messageContent) {
  const videoMessageObject = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: messageContent.chatDetails.receiverChannelId,
    type: 'video',
    video: {
      link: messageContent.messageData.message,
    },
  };

  return videoMessageObject;
}

async function generateWhatsappDocumentMessageObject(messageContent) {
  const documentMessageObject = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: messageContent.chatDetails.receiverChannelId,
    type: 'document',
    document: {
      link: messageContent.messageData.message,
    },
  };

  return documentMessageObject;
}

module.exports = {
  generateWhatsappTextMessageObject: generateWhatsappTextMessageObject,
  generateWhatsappImageMessageObject: generateWhatsappImageMessageObject,
  generateWhatsappVideoMessageObject: generateWhatsappVideoMessageObject,
  generateWhatsappDocumentMessageObject: generateWhatsappDocumentMessageObject,
};
