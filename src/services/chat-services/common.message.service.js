const { db } = require('../../library/firebase');
const { arrayUnion, doc, updateDoc, getDoc } = require('firebase/firestore');

// import serveices
const { sendTextToChatPlatform } = require('../text.service');
const { sendImageToChatPlatform } = require('../image.service');
const { sendVideoToChatPlatform } = require('../video.service');
const { sendDocumentToChatPlatform } = require('../document.service');

async function sendMessageToUser(body) {
  try {
    let responseOfSendingMessage;
    if (body.messageData.messageType === 'TEXT') {
      console.log('sending text message');
      responseOfSendingMessage = await sendTextToChatPlatform(body);
    } else if (body.messageData.messageType === 'IMAGE') {
      console.log('sending image message');
      responseOfSendingMessage = await sendImageToChatPlatform(body);
    } else if (body.messageData.messageType === 'VIDEO') {
      console.log('sending video message');
      responseOfSendingMessage = await sendVideoToChatPlatform(body);
    } else if (body.messageData.messageType === 'DOCUMENT') {
      console.log('sending document message');
      responseOfSendingMessage = await sendDocumentToChatPlatform(body);
    }

    console.log('Message sending status: ', responseOfSendingMessage.status);

    // save the firebase
    if (responseOfSendingMessage.status === 200) {
      await updateDoc(doc(db, 'chats', body.chatDetails.chatId), {
        messages: arrayUnion({
          sendByMe: body.messageData.sendByMe,
          messageType: body.messageData.messageType,
          message: body.messageData.message,
          createdAt: body.messageData.createdAt,
        }),
      });

      const userChatRef = doc(db, 'userchats', body.currentUser.id);
      const userChatsSnapshot = await getDoc(userChatRef);

      if (userChatsSnapshot.exists()) {
        const userChatsData = userChatsSnapshot.data();

        const chats = userChatsData.chats;
        const chatIndex = chats.findIndex(
          (chat) => chat.chatId === body.chatDetails.chatId
        );

        let lastMessage;
        if (body.messageData.messageType === 'TEXT') {
          lastMessage = body.messageData.message;
        } else {
          lastMessage = body.messageData.messageType;
        }

        chats[chatIndex].lastMessage = lastMessage;
        chats[chatIndex].updatedAt = body.messageData.createdAt;

        await updateDoc(userChatRef, {
          chats: chats,
        });
      }

      return {
        status: 200,
        message: 'Message sent',
      };
    }
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: 'Error sending message',
    };
  }
}

module.exports = {
  sendMessageToUser: sendMessageToUser,
};
