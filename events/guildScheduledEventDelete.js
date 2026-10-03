const { sendLog } = require('../utils/logger');
module.exports = { name: 'guildScheduledEventDelete', execute(event) {
  sendLog(event.guild, 'scheduled_event_delete_channel_id', '### Scheduled Event Deleted', `**Name:** ${event.name}\n**ID:** \`${event.id}\``);
}};