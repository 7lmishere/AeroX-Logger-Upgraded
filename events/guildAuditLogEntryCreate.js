const { sendLog } = require('../utils/logger');
const { AuditLogEvent } = require('discord.js');

const settingForAction = new Map([
  [AuditLogEvent.MemberKick, 'kick_channel_id'],
  [AuditLogEvent.ChannelOverwriteCreate, 'perms_update_channel_id'],
  [AuditLogEvent.ChannelOverwriteUpdate, 'perms_update_channel_id'],
  [AuditLogEvent.ChannelOverwriteDelete, 'perms_update_channel_id'],
]);

const labels = new Map([
  [AuditLogEvent.MemberKick, 'Member Kicked'],
  [AuditLogEvent.MemberUpdate, 'Member Updated'],
  [AuditLogEvent.MemberMove, 'Members Moved'],
  [AuditLogEvent.MemberDisconnect, 'Member Disconnected'],
  [AuditLogEvent.MemberPrune, 'Member Pruned'],
  [AuditLogEvent.MemberRoleUpdate, 'Member Roles Updated'],
  [AuditLogEvent.MemberMute, 'Member Muted'],
  [AuditLogEvent.MemberDeafen, 'Member Deafened'],
  [AuditLogEvent.MessagePin, 'Message Pinned'],
  [AuditLogEvent.MessageUnpin, 'Message Unpinned'],
  [AuditLogEvent.IntegrationCreate, 'Integration Created'],
  [AuditLogEvent.IntegrationUpdate, 'Integration Updated'],
  [AuditLogEvent.IntegrationDelete, 'Integration Deleted'],
  [AuditLogEvent.BotAdd, 'Bot Added'],
  [AuditLogEvent.GuildScheduledEventCreate, 'Scheduled Event Created'],
  [AuditLogEvent.GuildScheduledEventUpdate, 'Scheduled Event Updated'],
  [AuditLogEvent.GuildScheduledEventDelete, 'Scheduled Event Deleted'],
  [AuditLogEvent.AutoModerationRuleCreate, 'AutoMod Rule Created'],
  [AuditLogEvent.AutoModerationRuleUpdate, 'AutoMod Rule Updated'],
  [AuditLogEvent.AutoModerationRuleDelete, 'AutoMod Rule Deleted']
]);

const ignored = new Set([
  AuditLogEvent.ChannelCreate, AuditLogEvent.ChannelUpdate, AuditLogEvent.ChannelDelete,
  AuditLogEvent.RoleCreate, AuditLogEvent.RoleUpdate, AuditLogEvent.RoleDelete,
  AuditLogEvent.MemberBanAdd, AuditLogEvent.MemberBanRemove,
  AuditLogEvent.InviteCreate, AuditLogEvent.InviteDelete,
  AuditLogEvent.WebhookCreate, AuditLogEvent.WebhookUpdate, AuditLogEvent.WebhookDelete
]);

module.exports = {
  name: 'guildAuditLogEntryCreate',
  execute(entry, guild) {
    if (!guild || ignored.has(entry.action)) return;
    const title = labels.get(entry.action) || 'Audit Log Action';
    const settingKey = settingForAction.get(entry.action) || 'audit_log_channel_id';
    const executor = entry.executor ? `<@${entry.executor.id}>` : 'Unknown';
    const target = entry.target?.id ? `<@${entry.target.id}>` : (entry.target?.name || 'Unknown');
    const reason = entry.reason || 'No reason provided';
    sendLog(guild, settingKey, `### ${title}`, `**Executor:** ${executor}\n**Target:** ${target}\n**Action:** \`${entry.action}\`\n**Reason:** ${reason}\n**Entry:** \`${entry.id}\``);
  }
};
