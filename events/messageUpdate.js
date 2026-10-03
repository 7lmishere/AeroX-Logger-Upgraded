const { sendLog } = require('../utils/logger');
const { formatUser, formatChannel, formatRole } = require('../utils/formatters');

module.exports = {
  name: 'messageUpdate',
  async execute(oldMessage, newMessage) {
    if (!newMessage.guild || !newMessage.author || newMessage.author.bot) return;
    if (oldMessage.content === newMessage.content) return;
    const oldContent = (oldMessage.content || 'No cached text').slice(0, 700);
    const newContent = (newMessage.content || 'No text content').slice(0, 700);
    const content = `**Author:** ${formatUser(newMessage.author)}\n**Channel:** ${formatChannel(newMessage.channel)}\n**Message:** [Jump](https://discord.com/channels/${newMessage.guild.id}/${newMessage.channel.id}/${newMessage.id})\n**Old:**\n\`\`\`\n${oldContent}\n\`\`\`\n**New:**\n\`\`\`\n${newContent}\n\`\`\``;
    sendLog(newMessage.guild, 'message_edit_channel_id', '### Message Edited', content, { thumbnailUrl: newMessage.author.displayAvatarURL({ extension:'png', size:256 }), thumbnailDescription: `${newMessage.author.username}'s Avatar` });
  }
};
