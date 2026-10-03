const { sendLog } = require('../utils/logger');
const { formatUser, formatChannel, formatRole } = require('../utils/formatters');

module.exports = {
  name: 'inviteCreate',
  async execute(invite) {
    if (!invite.guild) return;
    const content = `**Channel:** ${invite.channel ? `<#${invite.channel.id}>` : 'Unknown'}\n**Code:** \`${invite.code}\`\n**Created By:** ${invite.inviter ? formatUser(invite.inviter) : 'Unknown'}\n**Uses:** ${invite.uses || 0}\n**Max Uses:** ${invite.maxUses || 'Unlimited'}\n**Expires:** ${invite.expiresTimestamp ? `<t:${Math.floor(invite.expiresTimestamp/1000)}:F>` : 'Never'}`;
    sendLog(invite.guild, 'invite_create_channel_id', '### Invite Created', content, invite.inviter ? { thumbnailUrl: invite.inviter.displayAvatarURL({ extension:'png', size:256 }), thumbnailDescription: `${invite.inviter.username}'s Avatar` } : {});
  }
};
