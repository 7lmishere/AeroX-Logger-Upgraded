const { sendLog } = require('../utils/logger');
module.exports = { name: 'stickerUpdate', execute(oldSticker, newSticker) {
  const changes=[];
  if (oldSticker.name !== newSticker.name) changes.push(`**Name:** ${oldSticker.name} → ${newSticker.name}`);
  if (oldSticker.description !== newSticker.description) changes.push('**Description:** Changed');
  if (!changes.length) return;
  sendLog(newSticker.guild, 'sticker_update_channel_id', '### Sticker Updated', `**ID:** \`${newSticker.id}\`\n${changes.join('\n')}`);
}};