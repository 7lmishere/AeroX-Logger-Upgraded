const { sendLog } = require('../utils/logger');
const { formatUser, formatChannel, formatRole } = require('../utils/formatters');

module.exports = {
  name: 'guildMemberRemove',
  async execute(member) {
    const content = `**User:** ${formatUser(member.user)}\n**ID:** \`${member.id}\`\n**Server:** \`${member.guild.name}\``;
    sendLog(member.guild, 'leave_channel_id', '### Member Left', content, { thumbnailUrl: member.user.displayAvatarURL({ extension: 'png', size: 256 }), thumbnailDescription: `${member.user.username}'s Avatar` });
  }
};
