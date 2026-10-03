const { sendLog } = require('../utils/logger');
module.exports = { name: 'guildScheduledEventUpdate', execute(oldEvent, newEvent) {
  const changes=[];
  if (oldEvent.name !== newEvent.name) changes.push(`**Name:** ${oldEvent.name} → ${newEvent.name}`);
  if (oldEvent.status !== newEvent.status) changes.push(`**Status:** ${oldEvent.status} → ${newEvent.status}`);
  if (oldEvent.scheduledStartTimestamp !== newEvent.scheduledStartTimestamp) changes.push('**Start:** Changed');
  if (oldEvent.scheduledEndTimestamp !== newEvent.scheduledEndTimestamp) changes.push('**End:** Changed');
  if (!changes.length) return;
  sendLog(newEvent.guild, 'scheduled_event_update_channel_id', '### Scheduled Event Updated', `**Event:** ${newEvent.name}\n**ID:** \`${newEvent.id}\`\n${changes.join('\n')}`);
}};