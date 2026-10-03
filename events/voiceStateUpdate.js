const { sendLog } = require('../utils/logger');
const { formatUser, formatChannel, formatRole } = require('../utils/formatters');

module.exports = {
  name: 'voiceStateUpdate',
  async execute(oldState, newState) {
    const member = newState.member || oldState.member;
    if (!member) return;
    let title = null, detail = null;
    if (!oldState.channelId && newState.channelId) { title='### Voice Joined'; detail=`**Channel:** ${formatChannel(newState.channel)}`; }
    else if (oldState.channelId && !newState.channelId) { title='### Voice Left'; detail=`**Channel:** ${formatChannel(oldState.channel)}`; }
    else if (oldState.channelId !== newState.channelId) { title='### Voice Moved'; detail=`**From:** ${formatChannel(oldState.channel)}\n**To:** ${formatChannel(newState.channel)}`; }
    else if (oldState.serverMute !== newState.serverMute) { title=newState.serverMute ? '### Server Muted' : '### Server Unmuted'; detail=`**Channel:** ${formatChannel(newState.channel)}`; }
    else if (oldState.serverDeaf !== newState.serverDeaf) { title=newState.serverDeaf ? '### Server Deafened' : '### Server Undeafened'; detail=`**Channel:** ${formatChannel(newState.channel)}`; }
    else if (oldState.streaming !== newState.streaming) { title=newState.streaming ? '### Streaming Started' : '### Streaming Stopped'; detail=`**Channel:** ${formatChannel(newState.channel)}`; }
    else if (oldState.selfVideo !== newState.selfVideo) { title=newState.selfVideo ? '### Camera Enabled' : '### Camera Disabled'; detail=`**Channel:** ${formatChannel(newState.channel)}`; }
    else return;
    sendLog(newState.guild, 'voice_change_channel_id', title, `**User:** ${formatUser(member.user)}\n**ID:** \`${member.id}\`\n${detail}` , { thumbnailUrl: member.user.displayAvatarURL({ extension:'png', size:256 }), thumbnailDescription: `${member.user.username}'s Avatar` });
  }
};
