const { sendLog } = require('../utils/logger');
module.exports = { name: 'stageInstanceDelete', execute(stage) {
  sendLog(stage.guild, 'stage_delete_channel_id', '### Stage Ended', `**Channel:** <#${stage.channelId}>\n**Topic:** ${stage.topic || 'None'}\n**ID:** \`${stage.id}\``);
}};