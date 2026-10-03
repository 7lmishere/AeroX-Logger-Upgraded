const { MessageFlags } = require('discord.js');
const { getGuildSettings } = require('./database');
const { createLoggingContainer } = require('./formatters');

const queues = new Map();
const running = new Set();
const MIN_SEND_INTERVAL = 250;
const MAX_QUEUE_SIZE = 100;

function queueKey(guildId, channelId) {
  return `${guildId}:${channelId}`;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function drain(key) {
  if (running.has(key)) return;
  running.add(key);

  try {
    const queue = queues.get(key);
    while (queue && queue.length) {
      const item = queue.shift();
      try {
        await item.channel.send({
          components: [item.container],
          flags: MessageFlags.IsComponentsV2
        });
      } catch (error) {
        console.error(`[LOGGER] Failed to send log to ${item.channel.id}: ${error.message}`);
      }
      if (queue.length) await sleep(MIN_SEND_INTERVAL);
    }
  } finally {
    running.delete(key);
    if (!queues.get(key)?.length) queues.delete(key);
  }
}

function sendLog(guild, settingKey, title, content, options = {}) {
  if (!guild) return false;

  const settings = getGuildSettings(guild.id);
  const channelId = settings[settingKey];
  if (!channelId) return false;

  const channel = guild.channels.cache.get(channelId);
  if (!channel || !channel.isTextBased()) return false;

  const container = createLoggingContainer(title, content, options);
  const key = queueKey(guild.id, channel.id);
  const queue = queues.get(key) || [];

  if (queue.length >= MAX_QUEUE_SIZE) {
    queue.shift();
    console.warn(`[LOGGER] Queue overflow for ${guild.name} #${channel.name}; dropped oldest pending log.`);
  }

  queue.push({ channel, container });
  queues.set(key, queue);
  void drain(key);
  return true;
}

function getQueueStats() {
  let queued = 0;
  for (const queue of queues.values()) queued += queue.length;
  return { queues: queues.size, queued };
}

module.exports = { sendLog, getQueueStats };
