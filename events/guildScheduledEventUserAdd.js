const { sendLog } = require('../utils/logger');
module.exports = { name: 'guildScheduledEventUserAdd', execute(event, user) {
  sendLog(event.guild, 'scheduled_event_user_channel_id', '### Scheduled Event Interest Added', `**Event:** ${event.name}\n**User:** <@${user.id}>\n**ID:** \`${user.id}\``);
}};