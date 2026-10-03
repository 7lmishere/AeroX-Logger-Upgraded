const { sendLog } = require('../utils/logger');
module.exports = { name: 'autoModerationActionExecution', execute(execution) {
  const guild = execution.guild;
  if (!guild) return;
  sendLog(guild, 'automod_action_channel_id', '### AutoMod Action', `**User:** <@${execution.userId}>\n**Rule:** \`${execution.ruleId}\`\n**Action:** ${execution.action?.type ?? 'Unknown'}\n**Channel:** ${execution.channelId ? `<#${execution.channelId}>` : 'None'}\n**Matched Keyword:** ${execution.matchedKeyword || 'None'}`);
}};