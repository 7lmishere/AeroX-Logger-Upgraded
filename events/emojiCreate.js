const { sendLog } = require('../utils/logger');
module.exports = { name: 'emojiCreate', execute(emoji) {
  sendLog(emoji.guild, 'emoji_create_channel_id', '### Emoji Created', `**Emoji:** ${emoji}\n**Name:** \`${emoji.name}\`\n**ID:** \`${emoji.id}\`\n**Animated:** ${emoji.animated}`);
}};