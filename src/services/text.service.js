// const db = require('../configs/db');
const BASE_URL = process.env.BASE_URL;
const Chatroom = require('../models/chatroom.model');
const axios = require('axios');

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

    let chatroom = null;
    let created = false;

    try{
        const [chatroom, created] = Chatroom.findOrCreate({
            where: {
                identifier: chatroomObj.identifier
            },
            defaults: chatroomObj
        });

        this.chatroom = chatroom;
        this.created = created;

    } catch (error) {
        console.log(error);
    }
    if (created) {
        sendNotificationOfChatroomCreated(chatroom);
    }
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

async function sendNotificationOfChatroomCreated(chatroom) {
    await axios 
        .post(
            BASE_URL + '/chatroom/created/', 
        {
            chatroom: chatroom
        },
        {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((response) => {
            console.log('Notification sent', response);
        })
        .catch((error) => {
            console.log('Error sending notification', error);
        });
}

// async function 

module.exports = {
    handleWhatsappWebhookText: handleWhatsappWebhookText,
    handleViberWebhookText: handleViberWebhookText,
    handleMessengerWebhookText: handleMessengerWebhookText,
    handleInstagramWebhookText: handleInstagramWebhookText,
    handleTelegramWebhookText: handleTelegramWebhookText
};