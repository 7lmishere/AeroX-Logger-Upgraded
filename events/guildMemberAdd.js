const { sendLog } = require('../utils/logger');
const { formatUser, formatChannel, formatRole } = require('../utils/formatters');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member) {
    const content = `**User:** ${formatUser(member.user)}\n**ID:** \`${member.id}\`\n**Account Created:** <t:${Math.floor(member.user.createdTimestamp / 1000)}:F>\n**Joined:** <t:${Math.floor(member.joinedTimestamp / 1000)}:F>`;
    sendLog(member.guild, 'join_channel_id', '### Member Joined', content, { thumbnailUrl: member.user.displayAvatarURL({ extension: 'png', size: 256 }), thumbnailDescription: `${member.user.username}'s Avatar` });
  }
};
