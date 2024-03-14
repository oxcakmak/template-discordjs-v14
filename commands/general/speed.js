const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ButtonBuilder,
} = require("discord.js");

const { botColor } = require("../../config.json");

module.exports = {
  data: new SlashCommandBuilder().setName("speed").setDescription("Speed test"),
  async execute(interaction, client) {
    const embed = new EmbedBuilder()
      .setColor(botColor)
      .setDescription(`${client.ws.ping}ms`);
    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
