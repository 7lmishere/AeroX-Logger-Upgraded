const { sendLog } = require('../utils/logger');
const { formatUser, formatChannel, formatRole } = require('../utils/formatters');

module.exports = {
  name: 'roleCreate',
  async execute(role) {
    sendLog(role.guild, 'role_create_channel_id', '### Role Created', `**Role:** ${formatRole(role)}\n**ID:** \`${role.id}\`\n**Color:** ${role.hexColor}\n**Hoisted:** ${role.hoist}`);
  }
};
