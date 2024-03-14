const db = require('../common/database');
const { detectNumber } = require('../common/utils');


module.exports = {
    name: 'purge',
    description: 'purge',
    usage: 's!purge',
    async execute(message, args) {
        if (message.author.bot) return; // Ignore messages from bots

        // Get server id
        const serverId = message.guild.id;

        // Check message author admin role
        const isAdmin = await message.member.roles.cache.some((role) => role.permissions.has('Administrator'));

        // Get the user ID of the author of the message
        const userId = message.author.id; 

        // Another definitions
        let purgeEmbed = {};
        let amount = 50;
        let maxAmount = 1000;
        const purgeChannel = args[0];
        let mentionedUser = "";
        let mentionedUserTag = "";

        if(purgeChannel){
            const purgeUser = args[1];
            const purgeAmount = args[2];

            // Mentioned channel
            const channelMention = await message.mentions.channels.first().id || purgeChannel;
            // Mentioned user
            const userMention = await message.mentions.users.first() || purgeUser;

            // Check if the author of the message is a member of a guild (server)
            if (!message.guild) {
                return message.reply({ content: 'This command can only be used in a server (guild).' });
            }

            // Check if the admin permission
            if (!isAdmin){
                return message.reply({ content: 'You do not have permission to use this command.' });
            }
            
            if(purgeUser && purgeUser.length == 18){
                amount = purgeAmount; // Number of messages to delete
                mentionedUser = userMention.id;
                mentionedUserTag = userMention.tag;
            }else{
                amount = purgeUser; // If not user mentioned, call args index 1
            }

            if (!purgeChannel || !channelMention) {
                message.reply('Please mention a channel to delete messages from.');
                return;
            }

            if (detectNumber(amount) || amount <= 0 || amount > 100) {
                message.reply('Please provide a valid number of messages to delete (1-100).');
                return;
            }

            // Find the channel by its ID
            const channel = await message.guild.channels.cache.get(channelMention);

            if (!channel) {
                message.reply('Channel not found.');
                return;
            }

            // Fetch messages from the channel
            const messages = await channel.messages.fetch({ limit: amount });
        
            if (purgeUser && purgeUser.length == 18) {
                // If a user is mentioned, filter messages by the user
                const userMessages = await messages.filter((msg) => msg.author.id === mentionedUser);
                try {
                    await channel.bulkDelete(userMessages, true); // 'true' deletes messages older than 14 days
                    message.channel.send(`Deleted **${userMessages.size} messages** by **${mentionedUserTag}** in **${channel.name} channel**.`);
                } catch (error) {
                    console.error('Error deleting messages:', error);
                    message.channel.send('An error occurred while deleting messages.');
                }
            } else {
                // If no user is mentioned, delete the specified number of messages
                try {
                    await channel.bulkDelete(messages, true); // 'true' deletes messages older than 14 days
                    message.channel.send(`Deleted **${messages.size} messages** in **${channel.name} channel**.`);
                } catch (error) {
                    console.error('Error deleting messages:', error);
                    message.channel.send('An error occurred while deleting messages.');
                }
            }
        }else{
            purgeEmbed = {
                "type": "rich",
                "title": "",
                "description": "",
                "color": 0x00FFFF,
                "fields": [
                    {
                        "name": "",
                        "value": "```fix\nPurge```"
                    },
                    {
                        "name": "",
                        "value": "50 messages are deleted by default\n\nUsage:\n`s!purge [channel or channelId] [user or userId] [all or limit]`\n\nExample #1:\n`s!purge #bot-command 50`\n> Remove last 50 messages from bot-command channel.\n\nExample #2:\n`s!purge #bot-command @sawddit`\n> Remove last 50 messages from bot-command channel.\n\nExample #2:\n`s!purge #bot-command @admin 50`\n> Remove last 50 posts by admin from bot-command channel.\n\n"
                    },
                ]
            }
            message.reply({ embeds: [purgeEmbed] });
        }
    }
};