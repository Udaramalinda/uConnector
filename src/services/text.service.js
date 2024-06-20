// import message save service
const { saveMessageInFirebase } = require('./webhook-message-save-service/whatsapp.webhook.message.save.service');


// import text message generators for each chat platform
const { generateWhatsappTextMessageObject } = require('./object-generator-service/whatsapp.object.generator');


// import sending method for each chat platform
const { sendMessageToWhatsapp } = require('./platform-send-services/whatsapp.send.service');

async function handleWhatsappWebhookText(body, chatDetails) {
    
    messageBody = {
        sendByMe: false,
        messageType: 'TEXT',
        message: body.entry[0].changes[0].value.messages[0].text.body,
        createdAt: Date.now()
    }
    const response = await saveMessageInFirebase(messageBody, chatDetails);
    console.log(response);
}

function handleViberWebhookText(body) {
    return null;
}

function handleMessengerWebhookText(body) {
    return null;
}

function handleInstagramWebhookText(body) {
    return null;
}

function handleTelegramWebhookText(body) {
    return null;
}

// Sending text to relavant chat platform
async function sendTextToChatPlatform(messageContent) {
    
    if (messageContent.chatDetails.receiverChannel === 'WHATSAPP') {
        const whatsappTextMessageObject = await generateWhatsappTextMessageObject(messageContent);
        return sendMessageToWhatsapp(whatsappTextMessageObject);
    } else if (messageContent.chatDetails.receiverChannel === 'MESSENGER') {
        // return sendTextToMessenger(messageContent);
    } else if (messageContent.chatDetails.receiverChannel === 'INSTAGRAM') {
        // return sendTextToInstagram(messageContent);
    } else {
        return {
            status: 400,
            message: 'Invalid chat platform'
        }
    }

} 

module.exports = {
    handleWhatsappWebhookText: handleWhatsappWebhookText,
    handleViberWebhookText: handleViberWebhookText,
    handleMessengerWebhookText: handleMessengerWebhookText,
    handleInstagramWebhookText: handleInstagramWebhookText,
    handleTelegramWebhookText: handleTelegramWebhookText,
    sendTextToChatPlatform: sendTextToChatPlatform
};