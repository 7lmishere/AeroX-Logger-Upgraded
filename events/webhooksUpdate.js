const { sendLog } = require('../utils/logger');
module.exports = { name: 'webhooksUpdate', execute(channel) {
  if (!channel.guild) return;
  sendLog(channel.guild, 'webhook_update_channel_id', '### Webhooks Updated', `**Channel:** <#${channel.id}>\n**ID:** \`${channel.id}\`\nWebhook configuration changed.`);
}};