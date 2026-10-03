const { sendLog } = require('../utils/logger');
const { formatUser, formatChannel, formatRole } = require('../utils/formatters');

module.exports = {
  name: 'channelCreate',
  async execute(channel) {
    if (!channel.guild) return;
    const content = `**Channel:** <#${channel.id}>\n**Name:** \`${channel.name}\`\n**Type:** \`${channel.type}\`\n**ID:** \`${channel.id}\``;
    sendLog(channel.guild, 'channel_create_channel_id', '### Channel Created', content);
  }
};
