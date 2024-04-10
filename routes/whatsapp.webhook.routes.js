module.exports = (app) => {
    const whatsappWebhook = require('../controllers/whatsapp.webhook.controller');

    const router = require('express').Router();

    router.post('/webhook', whatsappWebhook.acceptMessage);
    router.get('/webhook', whatsappWebhook.verifyWebhook);

    app.use('/whatsapp', router);

}