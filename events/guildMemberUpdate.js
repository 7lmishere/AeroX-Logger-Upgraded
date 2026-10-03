const { sendLog } = require('../utils/logger');
const { formatUser, formatChannel, formatRole } = require('../utils/formatters');

module.exports = {
  name: 'guildMemberUpdate',
  async execute(oldMember, newMember) {
    if (oldMember.nickname !== newMember.nickname) {
      sendLog(newMember.guild, 'nickname_change_channel_id', '### Nickname Changed', `**User:** ${formatUser(newMember.user)}\n**Old:** ${oldMember.nickname || 'None'}\n**New:** ${newMember.nickname || 'None'}\n**ID:** \`${newMember.id}\``, { thumbnailUrl: newMember.user.displayAvatarURL({ extension: 'png', size: 256 }), thumbnailDescription: `${newMember.user.username}'s Avatar` });
    }

    const added = newMember.roles.cache.filter(r => !oldMember.roles.cache.has(r.id));
    const removed = oldMember.roles.cache.filter(r => !newMember.roles.cache.has(r.id));
    if (added.size || removed.size) {
      const lines = [`**User:** ${formatUser(newMember.user)}`, `**ID:** \`${newMember.id}\``];
      if (added.size) lines.push(`**Added:** ${added.map(formatRole).join(', ')}`);
      if (removed.size) lines.push(`**Removed:** ${removed.map(formatRole).join(', ')}`);
      sendLog(newMember.guild, 'role_update_channel_id', '### Member Roles Updated', lines.join('\n'), { thumbnailUrl: newMember.user.displayAvatarURL({ extension: 'png', size: 256 }), thumbnailDescription: `${newMember.user.username}'s Avatar` });
    }

    if (oldMember.communicationDisabledUntilTimestamp !== newMember.communicationDisabledUntilTimestamp) {
      const state = newMember.communicationDisabledUntilTimestamp ? `Until <t:${Math.floor(newMember.communicationDisabledUntilTimestamp / 1000)}:F>` : 'Removed';
      sendLog(newMember.guild, 'member_update_channel_id', '### Member Timeout Updated', `**User:** ${formatUser(newMember.user)}\n**Timeout:** ${state}\n**ID:** \`${newMember.id}\``);
    }
  }
};
