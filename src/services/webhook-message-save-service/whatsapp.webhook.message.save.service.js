const { db } = require('../../library/firebase');
const {
  arrayUnion,
  doc,
  updateDoc,
  getDoc,
  where,
  collection,
  query,
  getDocs,
  setDoc,
} = require('firebase/firestore');

async function checkWhatsappUserChatExists(body) {
  try {
    const userRef = collection(db, 'users');
    const q = query(
      userRef,
      where(
        'phone',
        '==',
        body.entry[0].changes[0].value.metadata.display_phone_number
      )
    );
    const userSnapshot = await getDocs(q);

    if (userSnapshot.docs.length > 0) {
      user = userSnapshot.docs[0].data();

      userChatRef = doc(db, 'userchats', user.id);
      const userChatsSnapshot = await getDoc(userChatRef);

      if (userChatsSnapshot.exists()) {
        const userChatsData = userChatsSnapshot.data();
        const chats = userChatsData.chats;

        const chatIndex = chats.findIndex(
          (chat) =>
            chat.receiverChannelId ===
            body.entry[0].changes[0].value.contacts[0].wa_id
        );

        if (chatIndex === -1) {
          chatId = await createChatForUser(body, user);

          return { chatId: chatId, userId: user.id };
        } else {
          return { chatId: chats[chatIndex].chatId, userId: user.id };
        }
      }
    }
  } catch (error) {
    console.log('Error checking whatsapp user chat exists: ', error);
  }
}

async function createChatForUser(body, user, userChatsData) {
  const chatRef = collection(db, 'chats');
  const userChatsRef = collection(db, 'userchats');

  try {
    const newChatRef = doc(chatRef);

    await setDoc(newChatRef, {
      name: body.entry[0].changes[0].value.contacts[0].profile.name,
      email: '',
      channel: 'WHATSAPP',
      channelId: body.entry[0].changes[0].value.contacts[0].wa_id,
      avatar: '',
      createdAt: serverTimestamp(),
      messages: [],
    });

    await updateDoc(doc(userChatsRef, user.id), {
      chats: arrayUnion({
        chatId: newChatRef.id,
        lastMessage: '',
        updatedAt: Date.now(),
        receiverName: body.entry[0].changes[0].value.contacts[0].profile.name,
        receiverChannel: 'WHATSAPP',
        receiverChannelId: body.entry[0].changes[0].value.contacts[0].wa_id,
        receiverAvatar: '',
      }),
    });

    return newChatRef.id;
  } catch (error) {
    console.log('Error creating chat for user: ', error);
  }
}

async function saveMessageInFirebase(body, chatDetails) {
  try {
    await updateDoc(doc(db, 'chats', chatDetails.chatId), {
      messages: arrayUnion({
        sendByMe: body.sendByMe,
        messageType: body.messageType,
        message: body.message,
        createdAt: body.createdAt,
      }),
    });

    const userChatRef = doc(db, 'userchats', chatDetails.userId);
    const userChatsSnapshot = await getDoc(userChatRef);

    if (userChatsSnapshot.exists()) {
      const userChatsData = userChatsSnapshot.data();

      const chats = userChatsData.chats;
      const chatIndex = chats.findIndex(
        (chat) => chat.chatId === chatDetails.chatId
      );

      let lastMessage;
      if (body.messageType === 'TEXT') {
        lastMessage = body.message;
      } else {
        lastMessage = body.messageType;
      }

      chats[chatIndex].lastMessage = lastMessage;
      chats[chatIndex].updatedAt = body.createdAt;

      await updateDoc(userChatRef, {
        chats: chats,
      });
    }
    return {
      status: 200,
      message: 'Message saved successfully',
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: 'Error sending message',
    };
  }
}

module.exports = { checkWhatsappUserChatExists, saveMessageInFirebase };
