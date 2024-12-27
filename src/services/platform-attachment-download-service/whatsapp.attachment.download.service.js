const axios = require('axios');

const WHATSAPP_SEND_MESSAGE_BASE_URL =
  process.env.WHATSAPP_SEND_MESSAGE_BASE_URL;
const WHATSAPP_API_VERSION = process.env.WHATSAPP_API_VERSION;
const WHATSAPP_VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

async function downloadWhatsappAttachment(body) {
  try {
    const attachmentDownloadURL = await getWhatsappAttachmentDownloadURL(body);

    if (attachmentDownloadURL) {
      const response = await axios({
        method: 'get',
        url: attachmentDownloadURL.url,
        responseType: 'stream',
        headers: {
          Authorization: `Bearer ${WHATSAPP_VERIFY_TOKEN}`,
        },
      });

      const chunks = [];
      response.data.on('data', (chunk) => chunks.push(chunk));

      await new Promise((resolve, reject) => {
        response.data.on('end', resolve);
        response.data.on('error', reject);
      });

      const file = Buffer.concat(chunks);
      const fileType = attachmentDownloadURL.type;
      const attachmentName = `${
        body.entry[0].changes[0].value.messages[0].id
      }.${fileType.split('/')[1]}`;

      return {
        status: 200,
        message: 'Attachment downloaded successfully',
        attachmentName,
        file,
        fileType,
      };
    }
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: 'Error downloading attachment',
      error: error,
    };
  }
}

async function getWhatsappAttachmentDownloadURL(body) {
  try {
    let mediaId;
    if (body.entry[0].changes[0].value.messages[0].image) {
      mediaId = body.entry[0].changes[0].value.messages[0].image.id;
    } else if (body.entry[0].changes[0].value.messages[0].video) {
      mediaId = body.entry[0].changes[0].value.messages[0].video.id;
    } else if (body.entry[0].changes[0].value.messages[0].document) {
      mediaId = body.entry[0].changes[0].value.messages[0].document.id;
    } else if (body.entry[0].changes[0].value.messages[0].sticker) {
      mediaId = body.entry[0].changes[0].value.messages[0].sticker.id;
    }

    const getAttachmentDownloadURL = `${WHATSAPP_SEND_MESSAGE_BASE_URL}/${WHATSAPP_API_VERSION}/${mediaId}`;

    const response = await axios.get(getAttachmentDownloadURL, {
      headers: {
        Authorization: `Bearer ${WHATSAPP_VERIFY_TOKEN}`,
      },
    });

    return {
      url: response.data.url,
      type: response.data.mime_type,
    };
  } catch (error) {
    console.error(error);
  }
}

module.exports = { downloadWhatsappAttachment };
