const Sequelize = require('sequelize');
const db = require('../configs/db');

const Chatroom = require('./chatroom.model');

const ChatMessage = db.define('chatmessage', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    isUserMessage: {
        type: Sequelize.BOOLEAN
    },
    timestamp: {
        type: Sequelize.DATE
    },
    messageType: {
        type: Sequelize.STRING
    },
    message: {
        type: Sequelize.STRING
    }
});

ChatMessage.belongsTo(Chatroom, {
    foreignKey: 'id'
});

Chatroom.hasMany(ChatMessage, {
    foreignKey: 'id'
});

module.exports = ChatMessage;