const { sendLog } = require('../utils/logger');
const { formatUser, formatChannel, formatRole } = require('../utils/formatters');

module.exports = {
  name: 'channelUpdate',
  async execute(oldChannel, newChannel) {
    if (!newChannel.guild) return;
    const changes = [];
    if (oldChannel.name !== newChannel.name) changes.push(`**Name:** ${oldChannel.name} → ${newChannel.name}`);
    if ('topic' in oldChannel && oldChannel.topic !== newChannel.topic) changes.push(`**Topic:** ${oldChannel.topic || 'None'} → ${newChannel.topic || 'None'}`);
    if ('nsfw' in oldChannel && oldChannel.nsfw !== newChannel.nsfw) changes.push(`**NSFW:** ${oldChannel.nsfw} → ${newChannel.nsfw}`);
    if (oldChannel.parentId !== newChannel.parentId) changes.push(`**Category:** ${oldChannel.parentId ? `<#${oldChannel.parentId}>` : 'None'} → ${newChannel.parentId ? `<#${newChannel.parentId}>` : 'None'}`);
    if ('rateLimitPerUser' in oldChannel && oldChannel.rateLimitPerUser !== newChannel.rateLimitPerUser) changes.push(`**Slowmode:** ${oldChannel.rateLimitPerUser}s → ${newChannel.rateLimitPerUser}s`);
    if (!changes.length) return;
    sendLog(newChannel.guild, 'channel_update_channel_id', '### Channel Updated', `**Channel:** <#${newChannel.id}>\n**ID:** \`${newChannel.id}\`\n${changes.join('\n')}`);
  }
};
