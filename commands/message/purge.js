const { PermissionsBitField, SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription("Delete messages")
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Number of messages to delete (up to 50)")
        .setMinValue(1)
        .setMaxValue(50)
    )
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Filter messages by a specific user")
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Filter messages by a specific channel")
    ),
  async execute(interaction) {
    // Check if the user has permission to manage messages
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.ManageMessages
      )
    ) {
      return await interaction.reply({
        content: "You do not have permission to use this command.",
        ephemeral: true,
      });
    }

    const amount = interaction.options.getInteger("amount");
    const user = interaction.options.getUser("user");
    const channel = interaction.options.getChannel("channel");

    // Determine the channel to delete messages from
    const targetChannel = channel ? channel : interaction.channel;
    const deleteAmount = amount ? amount : 50;

    if (deleteAmount > 50 || deleteAmount < 1)
      return await interaction.reply({
        content:
          "Please specify an amount between 1 and 50 before deleting messages.",
        ephemeral: true,
      });

    try {
      // Fetch messages from the target channel
      const messages = await targetChannel.messages.fetch();

      if (messages.size === 0)
        return await interaction.reply({
          content: "No messages found to delete.",
          ephemeral: true,
        });

      let messagesToDelete = [];

      if (user) {
        let i = 0;
        messages.forEach(async (msg) => {
          if (
            msg.author.id === user.id &&
            messagesToDelete.length < deleteAmount
          ) {
            await messagesToDelete.push(msg);
            i++;
          }
        });
      } else {
        messagesToDelete = await messages.first(deleteAmount);
      }

      if (messagesToDelete.length > 0) {
        await targetChannel.bulkDelete(messagesToDelete, true);
        await interaction.reply({
          content: "Message deleted successfully!",
          ephemeral: true,
        });
      }
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "Failed to delete messages.",
        ephemeral: true,
      });
    }
  },
};
