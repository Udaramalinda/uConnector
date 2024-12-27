const {
  sendMessageToUser,
} = require('../../services/chat-services/common.message.service');

exports.sendMessage = async (req, res) => {
  const status = await sendMessageToUser(req.body);
  res.status(status.status).json({ message: status.message });
};
