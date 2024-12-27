// module.exports = (app) => {
//     const instagramWebhook = require('../controllers/instagram.webhook.controller.js');
    
//     const router = require('express').Router();

//     router.post('/webhook', instagramWebhook.acceptMessage);
//     router.get('/webhook', instagramWebhook.verifyWebhook);

//     app.use('/instagram', router);

// }