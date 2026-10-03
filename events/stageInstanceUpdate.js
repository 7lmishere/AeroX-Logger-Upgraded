const { sendLog } = require('../utils/logger');
module.exports = { name: 'stageInstanceUpdate', execute(oldStage, newStage) {
  const changes=[];
  if (oldStage.topic !== newStage.topic) changes.push(`**Topic:** ${oldStage.topic || 'None'} → ${newStage.topic || 'None'}`);
  if (!changes.length) return;
  sendLog(newStage.guild, 'stage_update_channel_id', '### Stage Updated', `**Channel:** <#${newStage.channelId}>\n${changes.join('\n')}`);
}};