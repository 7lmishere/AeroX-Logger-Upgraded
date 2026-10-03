const { sendLog } = require('../utils/logger');
const { formatUser, formatChannel, formatRole } = require('../utils/formatters');

module.exports = {
  name: 'roleUpdate',
  async execute(oldRole, newRole) {
    const changes=[];
    if (oldRole.name !== newRole.name) changes.push(`**Name:** ${oldRole.name} → ${newRole.name}`);
    if (oldRole.color !== newRole.color) changes.push(`**Color:** ${oldRole.hexColor} → ${newRole.hexColor}`);
    if (oldRole.hoist !== newRole.hoist) changes.push(`**Hoisted:** ${oldRole.hoist} → ${newRole.hoist}`);
    if (oldRole.mentionable !== newRole.mentionable) changes.push(`**Mentionable:** ${oldRole.mentionable} → ${newRole.mentionable}`);
    if (oldRole.permissions.bitfield !== newRole.permissions.bitfield) changes.push('**Permissions:** Changed');
    if (!changes.length) return;
    sendLog(newRole.guild, 'role_update_channel_id', '### Role Updated', `**Role:** ${formatRole(newRole)}\n**ID:** \`${newRole.id}\`\n${changes.join('\n')}`);
  }
};
