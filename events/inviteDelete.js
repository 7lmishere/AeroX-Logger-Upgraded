const { sendLog } = require('../utils/logger');
const { formatUser, formatChannel, formatRole } = require('../utils/formatters');

module.exports = {
  name: 'inviteDelete',
  async execute(invite) {
    if (!invite.guild) return;
    sendLog(invite.guild, 'invite_delete_channel_id', '### Invite Deleted', `**Channel:** ${invite.channel ? `<#${invite.channel.id}>` : 'Unknown'}\n**Code:** \`${invite.code}\``);
  }
};
