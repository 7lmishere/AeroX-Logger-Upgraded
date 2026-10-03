const { sendLog } = require('../utils/logger');
module.exports = { name: 'stickerCreate', execute(sticker) {
  sendLog(sticker.guild, 'sticker_create_channel_id', '### Sticker Created', `**Name:** \`${sticker.name}\`\n**Description:** ${sticker.description || 'None'}\n**ID:** \`${sticker.id}\``);
}};