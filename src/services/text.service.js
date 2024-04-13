// const db = require('../configs/db');
const Chatroom = require('../models/chatroom.model');

const WHATSAPP_NAME = process.env.WHATSAPP_NAME;

function handleWhatsappWebhookText(body) {
    // console.log(body.entry[0].changes[0].value.messages[0].text.body);

    const chatroomObj = {
        identifier: WHATSAPP_NAME + body.entry[0].changes[0].value.messages[0].from,
        senderNumber: body.entry[0].changes[0].value.messages[0].from,
        sender: body.entry[0].changes[0].value.contacts[0].profile.name,
        timestampApplicatpion: body.entry[0].changes[0].value.messages[0].timestamp,
        timestamp: new Date(body.entry[0].changes[0].value.messages[0].timestamp * 1000),
        channel: WHATSAPP_NAME
    }

    console.log(chatroomObj);
    try{
        const [chatroom, created] = Chatroom.findOrCreate({
            where: {
                identifier: chatroomObj.identifier
            },
            defaults: chatroomObj
        });
    } catch (error) {
        console.log(error);
    }

    console.log(chatroom);
    console.log(created);
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

module.exports = {
    handleWhatsappWebhookText: handleWhatsappWebhookText,
    handleViberWebhookText: handleViberWebhookText,
    handleMessengerWebhookText: handleMessengerWebhookText,
    handleInstagramWebhookText: handleInstagramWebhookText,
    handleTelegramWebhookText: handleTelegramWebhookText
}