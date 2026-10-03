const { sendLog } = require('../utils/logger');
module.exports = { name: 'messageDeleteBulk', execute(messages, channel) {
  if (!channel?.guild) return;
  sendLog(channel.guild, 'message_bulk_delete_channel_id', '### Bulk Messages Deleted', `**Channel:** <#${channel.id}>\n**Messages:** ${messages.size}`);
}};