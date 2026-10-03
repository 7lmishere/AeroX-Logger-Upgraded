const { sendLog } = require('../utils/logger');
const { formatUser, formatChannel, formatRole } = require('../utils/formatters');

module.exports = {
  name: 'userUpdate',
  async execute(oldUser, newUser) {
    const changes=[];
    if (oldUser.username !== newUser.username) changes.push(`**Username:** ${oldUser.username} → ${newUser.username}`);
    if (oldUser.globalName !== newUser.globalName) changes.push(`**Display Name:** ${oldUser.globalName || 'None'} → ${newUser.globalName || 'None'}`);
    if (oldUser.avatar !== newUser.avatar) changes.push('**Avatar:** Changed');
    if (oldUser.banner !== newUser.banner) changes.push('**Banner:** Changed');
    if (oldUser.accentColor !== newUser.accentColor) changes.push('**Accent Color:** Changed');
    if (!changes.length) return;
    const client = newUser.client;
    for (const guild of client.guilds.cache.values()) {
      if (!guild.members.cache.has(newUser.id)) continue;
      sendLog(guild, 'user_update_channel_id', '### User Updated', `**User:** ${formatUser(newUser)}\n**ID:** \`${newUser.id}\`\n${changes.join('\n')}`, { thumbnailUrl: newUser.displayAvatarURL({ extension:'png', size:256 }), thumbnailDescription: `${newUser.username}'s Avatar` });
    }
  }
};
