const { sendLog } = require('../utils/logger');
module.exports = { name: 'stageInstanceCreate', execute(stage) {
  sendLog(stage.guild, 'stage_create_channel_id', '### Stage Started', `**Channel:** <#${stage.channelId}>\n**Topic:** ${stage.topic || 'None'}\n**ID:** \`${stage.id}\``);
}};