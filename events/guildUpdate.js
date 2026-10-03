const { sendLog } = require('../utils/logger');
const { formatUser, formatChannel, formatRole } = require('../utils/formatters');

module.exports = {
  name: 'guildUpdate',
  async execute(oldGuild, newGuild) {
    const changes=[];
    if (oldGuild.name !== newGuild.name) changes.push(`**Name:** ${oldGuild.name} → ${newGuild.name}`);
    if (oldGuild.icon !== newGuild.icon) changes.push('**Icon:** Changed');
    if (oldGuild.banner !== newGuild.banner) changes.push('**Banner:** Changed');
    if (oldGuild.description !== newGuild.description) changes.push('**Description:** Changed');
    if (oldGuild.verificationLevel !== newGuild.verificationLevel) changes.push(`**Verification:** ${oldGuild.verificationLevel} → ${newGuild.verificationLevel}`);
    if (oldGuild.afkChannelId !== newGuild.afkChannelId) changes.push(`**AFK Channel:** ${oldGuild.afkChannelId ? `<#${oldGuild.afkChannelId}>` : 'None'} → ${newGuild.afkChannelId ? `<#${newGuild.afkChannelId}>` : 'None'}`);
    if (oldGuild.afkTimeout !== newGuild.afkTimeout) changes.push(`**AFK Timeout:** ${oldGuild.afkTimeout}s → ${newGuild.afkTimeout}s`);
    if (!changes.length) return;
    sendLog(newGuild, 'server_update_channel_id', '### Server Updated', `**Server:** ${newGuild.name}\n**ID:** \`${newGuild.id}\`\n${changes.join('\n')}`);
  }
};
