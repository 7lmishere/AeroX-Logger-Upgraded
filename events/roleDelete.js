const { sendLog } = require('../utils/logger');
const { formatUser, formatChannel, formatRole } = require('../utils/formatters');

module.exports = {
  name: 'roleDelete',
  async execute(role) {
    sendLog(role.guild, 'role_delete_channel_id', '### Role Deleted', `**Role:** \`${role.name}\`\n**ID:** \`${role.id}\``);
  }
};
