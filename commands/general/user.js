const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("user")
    .setDescription("Get User Info!")
    .addUserOption((option) =>
      option.setName("user").setDescription("The user to show info about")
    ),
  async execute(interaction) {
    if (interaction.bot) return;

    let target = interaction.options.get("user");

    // If no user is mentioned, default to the message sender
    if (!target) target = interaction.user;

    // Fetch the corresponding member from the guild
    const member = await interaction.guild.members.fetch(target);

    const embed = {
      type: "rich",
      title: "",
      description: "",
      color: 0x00ffff,
      fields: [
        // { name: `id`, value: member.user.id, },

        {
          name: `Username`,
          value: member.user.username,
        },
        {
          name: `Globalname`,
          value: member.user.globalName,
        },
        {
          name: `Discriminator`,
          value: member.user.discriminator,
        },
        {
          name: `Tag`,
          value: member.user.tag,
        },
        {
          name: `Tag Alternative`,
          value: member.user.username + "#" + member.user.discriminator,
        },
        {
          name: `Avatar`,
          value: " ",
        },
      ],
      image: {
        url: member.user.displayAvatarURL(),
        height: 0,
        width: 0,
      },
      author: {
        name: `${member.user.tag} Information`,
      },
    };

    // Display user information
    await interaction.reply({ embeds: [embed] });
  },
};
