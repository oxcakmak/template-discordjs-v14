const { Client, GatewayIntentBits, EmbedBuilder, Permissions, PermissionsBitField  } = require('discord.js');

module.exports = {
  name: 'ban',
  description: 'Ban a user from the server with optional reason and duration.',
  usage: 's!ban [user] [reason]',
  async execute(message, args) {
    
    // Check if the author of the message is a member of a guild (server)
    if (!message.guild) {
      return message.reply({ content: 'This command can only be used in a server (guild).' });
    }

    // Check if the author of the message has the BAN_MEMBERS permission
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)){
      return message.reply({ content: 'You do not have permission to use this command.' });
    }

    if(args[0]){
      // Check if a user was mentioned or a user ID was provided
      const userToBan = await message.mentions.users.first().id || args[0];
      if (!userToBan || isNaN(userToBan) || userToBan.length !== 18) {
        return message.reply({ content: 'Please mention the user you want to ban or provide their user ID.' });
      }

      // Check if the user ID is valid
      // return message.reply({ content: 'Invalid user ID. Please mention the user or provide a valid user ID.' });

      // Get the reason from command arguments
      const reason = args.slice(1, -1).join(' ');

      // Ban the user
      await message.guild.members.ban(userToBan, {
        reason: reason || 'No reason provided',
      })
      .then(() => {
        message.reply(`Successfully banned <@${userToBan}>. Reason: ${reason || 'No reason provided'}`);
      })
      .catch((error) => {
        console.error(error);
        message.reply({ content: 'An error occurred while trying to ban the user.' });
      });
    }else{
      const banEmbed = {
        "type": "rich",
        "title": "Ban",
        "description": "Ban a user from the server with optional reason and duration.",
        "color": 0x00FFFF,
        "fields": [
            {
                "name": "",
                "value": "Usage:\n`s!ban [user] [reason]`"
            },
        ]
      }
      message.reply({ embeds: [banEmbed] });
    }
  },
};