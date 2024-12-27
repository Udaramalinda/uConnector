module.exports = (app) => {
    const userRegister = require('../../controllers/chat-controllers/user.register.controller.js');
    
    const router = require('express').Router();
    
    router.post('/register', userRegister.registerUser);
    
    app.use('/chat/user', router);
    };