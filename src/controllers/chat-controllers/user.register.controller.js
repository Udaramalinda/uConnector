const { registerChatUser } = require('../../services/chat-services/user.register.service');

exports.registerUser = async (req, res) => {
    const status = await registerChatUser(req.body);
    if (status.status === 200) {
        res.status(200).json({ message: status.message });
    } else {
        res.status(500).json({ message: status.message });
    }
}  