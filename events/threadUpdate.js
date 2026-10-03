const { sendLog } = require('../utils/logger');
module.exports = { name: 'threadUpdate', execute(oldThread, newThread) {
  if (!newThread.guild) return;
  const changes=[];
  if (oldThread.name !== newThread.name) changes.push(`**Name:** ${oldThread.name} → ${newThread.name}`);
  if (oldThread.archived !== newThread.archived) changes.push(`**Archived:** ${oldThread.archived} → ${newThread.archived}`);
  if (oldThread.locked !== newThread.locked) changes.push(`**Locked:** ${oldThread.locked} → ${newThread.locked}`);
  if (!changes.length) return;
  sendLog(newThread.guild, 'thread_update_channel_id', '### Thread Updated', `**Thread:** <#${newThread.id}>\n${changes.join('\n')}`);
}};