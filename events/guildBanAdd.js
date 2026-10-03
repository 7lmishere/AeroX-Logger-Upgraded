const { sendLog } = require('../utils/logger');
const { formatUser, formatChannel, formatRole } = require('../utils/formatters');

module.exports = {
  name: 'guildBanAdd',
  async execute(ban) {
    const user = ban.user;
    sendLog(ban.guild, 'ban_channel_id', '### Member Banned', `**User:** ${formatUser(user)}\n**ID:** \`${user.id}\`\n**Server:** \`${ban.guild.name}\`` , { thumbnailUrl: user.displayAvatarURL({ extension: 'png', size: 256 }), thumbnailDescription: `${user.username}'s Avatar` });
  }
};
