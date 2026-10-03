const { sendLog } = require('../utils/logger');
const { formatUser, formatChannel, formatRole } = require('../utils/formatters');

module.exports = {
  name: 'messageDelete',
  async execute(message) {
    if (!message.guild || !message.author || message.author.bot) return;
    const attachments = message.attachments?.size ? `\n**Attachments:** ${[...message.attachments.values()].map(a => `[${a.name || 'file'}](${a.url})`).join(', ')}` : '';
    const content = `**Author:** ${formatUser(message.author)}\n**Channel:** ${formatChannel(message.channel)}\n**ID:** \`${message.id}\`\n${message.content ? `**Content:**\n\`\`\`\n${message.content.slice(0,1500)}\n\`\`\`` : '**Content:** No cached text'}${attachments}`;
    sendLog(message.guild, 'message_delete_channel_id', '### Message Deleted', content, { thumbnailUrl: message.author.displayAvatarURL({ extension:'png', size:256 }), thumbnailDescription: `${message.author.username}'s Avatar` });
  }
};
