const { sendLog } = require('../utils/logger');
module.exports = { name: 'threadCreate', execute(thread, newlyCreated) {
  if (!thread.guild || newlyCreated === false) return;
  sendLog(thread.guild, 'thread_create_channel_id', '### Thread Created', `**Thread:** <#${thread.id}>\n**Name:** \`${thread.name}\`\n**Parent:** ${thread.parentId ? `<#${thread.parentId}>` : 'Unknown'}\n**ID:** \`${thread.id}\``);
}};