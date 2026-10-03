const { sendLog } = require('../utils/logger');
const { formatUser, formatChannel, formatRole } = require('../utils/formatters');

module.exports = {
  name: 'channelDelete',
  async execute(channel) {
    if (!channel.guild) return;
    const content = `**Channel:** \`#${channel.name}\`\n**Type:** \`${channel.type}\`\n**ID:** \`${channel.id}\``;
    sendLog(channel.guild, 'channel_delete_channel_id', '### Channel Deleted', content);
  }
};
