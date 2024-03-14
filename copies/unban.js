const { Client, GatewayIntentBits, EmbedBuilder, Permissions, PermissionsBitField  } = require('discord.js');

module.exports = {
    name: 'unban',
    description: 'Unban a user from the server.',
    usage: 's!unban [userID]',
    async execute(message, args) {

      // Check if the author of the message is a member of a guild (server)
      if (!message.guild) {
        return message.reply({ content: 'This command can only be used in a server (guild).' });
      }
      
      // Check if the author of the message has the BAN_MEMBERS permission
      if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
        return message.reply({ content: 'You do not have permission to use this command.' });
      }

      if(args[0]){

        // Check if a user ID was provided as an argument
        const userId = args[0];

        // Check id number or length 18 character
        if (!userId || isNaN(userId) || userId.length !== 18) {
          return message.reply({ content: 'Please provide a valid user ID to unban.' });
        }
    
        // Unban the user
        await message.guild.members
        .unban(userId)
        .then((unbannedUser) => {
          message.reply(`User with ID <@&${userId}> has been unbanned.`);
        })
        .catch((error) => {
          if (error.code === 10026) {
            message.reply({ content: 'Unknown Ban: This user may not have been banned before.' });
          } else {
            console.error(error);
            message.reply({ content: 'An error occurred while trying to unban the user.' });
          }
        });
      }else{
        const unbanEmbed = {
          "type": "rich",
          "title": "Unban",
          "description": "Unban a user from the server.",
          "color": 0x00FFFF,
          "fields": [
              {
                  "name": "",
                  "value": "Usage:\n`s!unban [user]`"
              },
          ]
        }
        message.reply({ embeds: [unbanEmbed] });
      }
    },
};