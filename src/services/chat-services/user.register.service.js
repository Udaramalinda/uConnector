const { db } = require('../../library/firebase');
const {
  arrayUnion,
  collection,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} = require('firebase/firestore');

async function registerChatUser(body) {
  const chatRef = collection(db, 'chats');
  const userChatsRef = collection(db, 'userchats');

  try {
    const newChatRef = doc(chatRef);

    await setDoc(newChatRef, {
      name: body.name,
      email: body.email,
      channel: body.channel,
      channelId: body.channelId,
      avatar: body.avatar,
      createdAt: serverTimestamp(),
      messages: [],
    });

    await updateDoc(doc(userChatsRef, body.currentUser.id), {
      chats: arrayUnion({
        chatId: newChatRef.id,
        lastMessage: '',
        updatedAt: Date.now(),
        receiverName: body.name,
        receiverChannel: body.channel,
        receiverChannelId: body.channelId,
        receiverAvatar: body.avatar,
      }),
    });
    return {
      status: 200,
      message: 'Chat user registered successfully',
    };
  } catch (error) {
    
    console.error(error);
    return {
      status: 500,
      message: 'Error registering chat user',
    };
  }
}

module.exports = {
  registerChatUser: registerChatUser,
};
