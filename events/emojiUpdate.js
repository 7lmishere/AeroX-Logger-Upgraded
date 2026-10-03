const { sendLog } = require('../utils/logger');
module.exports = { name: 'emojiUpdate', execute(oldEmoji, newEmoji) {
  const changes=[];
  if (oldEmoji.name !== newEmoji.name) changes.push(`**Name:** ${oldEmoji.name} → ${newEmoji.name}`);
  if (oldEmoji.animated !== newEmoji.animated) changes.push(`**Animated:** ${oldEmoji.animated} → ${newEmoji.animated}`);
  if (!changes.length) return;
  sendLog(newEmoji.guild, 'emoji_update_channel_id', '### Emoji Updated', `**Emoji:** ${newEmoji}\n**ID:** \`${newEmoji.id}\`\n${changes.join('\n')}`);
}};