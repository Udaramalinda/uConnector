const axios = require('axios');

// import environment variables
const WHATSAPP_VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;
const WHATSAPP_SEND_MESSAGE_BASE_URL = process.env.WHATSAPP_SEND_MESSAGE_BASE_URL;
const WHATSAPP_API_VERSION = process.env.WHATSAPP_API_VERSION;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

async function sendMessageToWhatsapp(whatsappMessageObject) {

    const response = await axios.post(
        WHATSAPP_SEND_MESSAGE_BASE_URL + '/' + WHATSAPP_API_VERSION + '/' + WHATSAPP_PHONE_NUMBER_ID + '/messages',
        whatsappMessageObject,
        {
            headers: {
                'Authorization': 'Bearer ' + WHATSAPP_VERIFY_TOKEN,
                'Content-Type': 'application/json'
            }
        }
    );

    return response;
}

module.exports = {
    sendMessageToWhatsapp: sendMessageToWhatsapp
};

