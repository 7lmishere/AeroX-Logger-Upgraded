const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const config = require('../../config');

const dbPath = config.DATABASE_PATH;
if (!fs.existsSync(dbPath)) {
  fs.mkdirSync(dbPath, { recursive: true });
}

const db = new Database(path.join(dbPath, 'logging.db'));
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS guild_settings (
    guild_id TEXT PRIMARY KEY,
    ban_channel_id TEXT,
    kick_channel_id TEXT,
    join_channel_id TEXT,
    leave_channel_id TEXT,
    role_update_channel_id TEXT,
    role_create_channel_id TEXT,
    role_delete_channel_id TEXT,
    channel_delete_channel_id TEXT,
    channel_create_channel_id TEXT,
    channel_update_channel_id TEXT,
    perms_update_channel_id TEXT,
    nickname_change_channel_id TEXT,
    voice_change_channel_id TEXT,
    message_delete_channel_id TEXT,
    message_edit_channel_id TEXT,
    message_bulk_delete_channel_id TEXT,
    member_update_channel_id TEXT,
    server_update_channel_id TEXT,
    invite_create_channel_id TEXT,
    invite_delete_channel_id TEXT,
    user_update_channel_id TEXT,
    thread_create_channel_id TEXT,
    thread_delete_channel_id TEXT,
    thread_update_channel_id TEXT,
    emoji_create_channel_id TEXT,
    emoji_delete_channel_id TEXT,
    emoji_update_channel_id TEXT,
    sticker_create_channel_id TEXT,
    sticker_delete_channel_id TEXT,
    sticker_update_channel_id TEXT,
    webhook_update_channel_id TEXT,
    scheduled_event_create_channel_id TEXT,
    scheduled_event_delete_channel_id TEXT,
    scheduled_event_update_channel_id TEXT,
    scheduled_event_user_channel_id TEXT,
    stage_create_channel_id TEXT,
    stage_delete_channel_id TEXT,
    stage_update_channel_id TEXT,
    automod_action_channel_id TEXT,
    automod_rule_create_channel_id TEXT,
    automod_rule_delete_channel_id TEXT,
    automod_rule_update_channel_id TEXT,
    audit_log_channel_id TEXT,
    reaction_add_channel_id TEXT,
    reaction_remove_channel_id TEXT,
    reaction_clear_channel_id TEXT,
    pin_update_channel_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Safe migrations for databases created by older AeroX versions.
const requiredColumns = {
  ban_channel_id: 'TEXT', kick_channel_id: 'TEXT', join_channel_id: 'TEXT', leave_channel_id: 'TEXT',
  role_update_channel_id: 'TEXT', role_create_channel_id: 'TEXT', role_delete_channel_id: 'TEXT',
  channel_delete_channel_id: 'TEXT', channel_create_channel_id: 'TEXT', channel_update_channel_id: 'TEXT',
  perms_update_channel_id: 'TEXT', nickname_change_channel_id: 'TEXT', voice_change_channel_id: 'TEXT',
  message_delete_channel_id: 'TEXT', message_edit_channel_id: 'TEXT', message_bulk_delete_channel_id: 'TEXT',
  member_update_channel_id: 'TEXT', server_update_channel_id: 'TEXT', invite_create_channel_id: 'TEXT',
  invite_delete_channel_id: 'TEXT', user_update_channel_id: 'TEXT', thread_create_channel_id: 'TEXT',
  thread_delete_channel_id: 'TEXT', thread_update_channel_id: 'TEXT', emoji_create_channel_id: 'TEXT',
  emoji_delete_channel_id: 'TEXT', emoji_update_channel_id: 'TEXT', sticker_create_channel_id: 'TEXT',
  sticker_delete_channel_id: 'TEXT', sticker_update_channel_id: 'TEXT', webhook_update_channel_id: 'TEXT',
  scheduled_event_create_channel_id: 'TEXT', scheduled_event_delete_channel_id: 'TEXT',
  scheduled_event_update_channel_id: 'TEXT', scheduled_event_user_channel_id: 'TEXT', stage_create_channel_id: 'TEXT',
  stage_delete_channel_id: 'TEXT', stage_update_channel_id: 'TEXT', automod_action_channel_id: 'TEXT',
  automod_rule_create_channel_id: 'TEXT', automod_rule_delete_channel_id: 'TEXT', automod_rule_update_channel_id: 'TEXT',
  audit_log_channel_id: 'TEXT', reaction_add_channel_id: 'TEXT', reaction_remove_channel_id: 'TEXT',
  reaction_clear_channel_id: 'TEXT', pin_update_channel_id: 'TEXT'
};

const existingColumns = new Set(
  db.prepare('PRAGMA table_info(guild_settings)').all().map(column => column.name)
);

for (const [column, type] of Object.entries(requiredColumns)) {
  if (!existingColumns.has(column)) {
    db.exec(`ALTER TABLE guild_settings ADD COLUMN ${column} ${type}`);
  }
}

const ALLOWED_COLUMNS = new Set([
  'ban_channel_id', 'kick_channel_id', 'join_channel_id', 'leave_channel_id',
  'role_update_channel_id', 'role_create_channel_id', 'role_delete_channel_id',
  'channel_delete_channel_id', 'channel_create_channel_id', 'channel_update_channel_id',
  'perms_update_channel_id', 'nickname_change_channel_id', 'voice_change_channel_id',
  'message_delete_channel_id', 'message_edit_channel_id', 'message_bulk_delete_channel_id',
  'member_update_channel_id', 'server_update_channel_id', 'invite_create_channel_id',
  'invite_delete_channel_id', 'user_update_channel_id', 'thread_create_channel_id',
  'thread_delete_channel_id', 'thread_update_channel_id', 'emoji_create_channel_id',
  'emoji_delete_channel_id', 'emoji_update_channel_id', 'sticker_create_channel_id',
  'sticker_delete_channel_id', 'sticker_update_channel_id', 'webhook_update_channel_id',
  'scheduled_event_create_channel_id', 'scheduled_event_delete_channel_id',
  'scheduled_event_update_channel_id', 'scheduled_event_user_channel_id', 'stage_create_channel_id',
  'stage_delete_channel_id', 'stage_update_channel_id', 'automod_action_channel_id',
  'automod_rule_create_channel_id', 'automod_rule_delete_channel_id', 'automod_rule_update_channel_id',
  'audit_log_channel_id', 'reaction_add_channel_id', 'reaction_remove_channel_id',
  'reaction_clear_channel_id', 'pin_update_channel_id'
]);

const getGuildSettings = (guildId) => {
  const stmt = db.prepare('SELECT * FROM guild_settings WHERE guild_id = ?');
  const result = stmt.get(guildId);
  return result || {};
};

const updateGuildSettings = (guildId, settings = {}) => {
  const safeSettings = {};
  for (const [key, value] of Object.entries(settings)) {
    if (ALLOWED_COLUMNS.has(key)) safeSettings[key] = value || null;
  }

  if (!Object.keys(safeSettings).length) {
    db.prepare(`INSERT OR IGNORE INTO guild_settings (guild_id) VALUES (?)`).run(guildId);
    return { changes: 0 };
  }

  const columns = Object.keys(safeSettings);
  const values = columns.map(column => safeSettings[column]);
  const placeholders = columns.map(() => '?').join(', ');
  const updates = columns.map(column => `${column} = excluded.${column}`).join(', ');

  const stmt = db.prepare(`
    INSERT INTO guild_settings (guild_id, ${columns.join(', ')}, updated_at)
    VALUES (?, ${placeholders}, CURRENT_TIMESTAMP)
    ON CONFLICT(guild_id) DO UPDATE SET
      ${updates},
      updated_at = CURRENT_TIMESTAMP
  `);

  return stmt.run(guildId, ...values);
};

module.exports = {
  db,
  getGuildSettings,
  updateGuildSettings,
  ALLOWED_COLUMNS
};
