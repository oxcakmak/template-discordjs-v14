module.exports = {
    name: 'user',
    description: 'Get user info.',
    usage: 's!user [userID or mention]',
    async execute(message, args) {
        
        // Check if a user was mentioned
        let targetUser = message.mentions.users.first();

        // If no user is mentioned, default to the message sender
        if (!targetUser) {
          targetUser = message.author;
        }

        // Fetch the corresponding member from the guild
        const targetMember = await message.guild.members.fetch(targetUser.id);

        const tmTag = targetMember.user.tag;
        const tmTagAlternative = targetMember.user.username+"#"+targetMember.user.discriminator;
        const tmId = targetMember.user.id;
        const tmUsername = targetMember.user.username;
        const tmGlobalName = targetMember.user.globalName;
        const tmDiscriminator = targetMember.user.discriminator;
        const tmAvatarUrl = targetMember.user.displayAvatarURL();

        const embedUser = {
            "type": "rich",
            "title": "",
            "description": "",
            "color": 0x00FFFF,
            "fields": [
              {
                "name": `id`,
                "value": tmId
              },
              {
                "name": `Username`,
                "value": tmUsername
              },
              {
                "name": `Globalname`,
                "value": tmGlobalName
              },
              {
                "name": `Discriminator`,
                "value": tmDiscriminator
              },
              {
                "name": `Tag`,
                "value": tmTag
              },
              {
                "name": `Tag Alternative`,
                "value": tmTagAlternative
              },
              {
                "name": `Avatar`,
                "value": " "
              }
            ],
            "image": {
              "url": tmAvatarUrl,
              "height": 0,
              "width": 0
            },
            "author": {
              "name": `${targetMember.user.tag} Information`
            }
          }

        // Display user information
        message.reply({ embeds: [embedUser] });
    }
};