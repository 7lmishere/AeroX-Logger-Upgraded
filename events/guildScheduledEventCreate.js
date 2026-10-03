const { sendLog } = require('../utils/logger');
module.exports = { name: 'guildScheduledEventCreate', execute(event) {
  sendLog(event.guild, 'scheduled_event_create_channel_id', '### Scheduled Event Created', `**Name:** ${event.name}\n**ID:** \`${event.id}\`\n**Start:** ${event.scheduledStartAt ? `<t:${Math.floor(event.scheduledStartAtTimestamp/1000)}:F>` : 'Unknown'}`);
}};