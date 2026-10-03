const { sendLog } = require('../utils/logger');
module.exports = { name: 'stickerDelete', execute(sticker) {
  sendLog(sticker.guild, 'sticker_delete_channel_id', '### Sticker Deleted', `**Name:** \`${sticker.name}\`\n**ID:** \`${sticker.id}\``);
}};