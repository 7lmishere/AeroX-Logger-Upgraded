const { AuditLogEvent } = require('discord.js');

async function findAuditExecutor(guild, type, targetId, maxAgeMs = 15000) {
  try {
    const logs = await guild.fetchAuditLogs({ limit: 10, type });
    const entry = logs.entries.find(item => {
      const age = Date.now() - item.createdTimestamp;
      const targetMatches = !targetId || item.target?.id === targetId;
      return age >= 0 && age <= maxAgeMs && targetMatches;
    });

    if (!entry) return null;
    return { entry, executor: entry.executor || null };
  } catch (error) {
    console.error(`[AUDIT] Failed to fetch audit log for ${guild.id}: ${error.message}`);
    return null;
  }
}

function userLabel(user) {
  return user ? `<@${user.id}>` : 'Unknown';
}

module.exports = { AuditLogEvent, findAuditExecutor, userLabel };
