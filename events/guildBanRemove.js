const { sendLog } = require('../utils/logger');
const { formatUser, formatChannel, formatRole } = require('../utils/formatters');

module.exports = {
  name: 'guildBanRemove',
  async execute(ban) {
    const user = ban.user;
    sendLog(ban.guild, 'ban_channel_id', '### Member Unbanned', `**User:** ${formatUser(user)}\n**ID:** \`${user.id}\`` , { thumbnailUrl: user.displayAvatarURL({ extension: 'png', size: 256 }), thumbnailDescription: `${user.username}'s Avatar` });
  }
};
