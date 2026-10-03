const { sendLog } = require('../utils/logger');
module.exports = { name: 'threadDelete', execute(thread) {
  if (!thread.guild) return;
  sendLog(thread.guild, 'thread_delete_channel_id', '### Thread Deleted', `**Name:** \`${thread.name}\`\n**Parent:** ${thread.parentId ? `<#${thread.parentId}>` : 'Unknown'}\n**ID:** \`${thread.id}\``);
}};