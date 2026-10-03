const { sendLog } = require('../utils/logger');
module.exports = { name: 'emojiDelete', execute(emoji) {
  sendLog(emoji.guild, 'emoji_delete_channel_id', '### Emoji Deleted', `**Name:** \`${emoji.name}\`\n**ID:** \`${emoji.id}\``);
}};