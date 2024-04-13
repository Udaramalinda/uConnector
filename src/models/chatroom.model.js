const Sequelize = require('sequelize');
const db = require('../configs/db');

const Chatroom = db.define('chatroom', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    identifier: {
        type: Sequelize.STRING
    },
    senderNumber: {
        type: Sequelize.STRING
    },
    sender: {
        type: Sequelize.STRING
    },
    timestampApplicatpion: {
        type: Sequelize.STRING
    },
    timestamp: {
        type: Sequelize.DATE
    },
    channel: {
        type: Sequelize.STRING
    }
});

module.exports = Chatroom;