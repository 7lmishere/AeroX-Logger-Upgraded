const { sendLog } = require('../utils/logger');
module.exports = { name: 'guildScheduledEventUserRemove', execute(event, user) {
  sendLog(event.guild, 'scheduled_event_user_channel_id', '### Scheduled Event Interest Removed', `**Event:** ${event.name}\n**User:** <@${user.id}>\n**ID:** \`${user.id}\``);
}};