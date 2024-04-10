function handleWhatsappWebhookText(body) {
    console.log(body.entry[0].changes[0].value.messages[0].text.body);
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

module.exports = {
    handleWhatsappWebhookText: handleWhatsappWebhookText,
    handleViberWebhookText: handleViberWebhookText,
    handleMessengerWebhookText: handleMessengerWebhookText,
    handleInstagramWebhookText: handleInstagramWebhookText
}