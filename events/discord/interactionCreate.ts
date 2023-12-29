import {BaseInteraction, EmbedBuilder} from "discord.js";
import {client} from "../../index";

module.exports = {
  name: 'interactionCreate',
  async execute(interaction: BaseInteraction) {
    if (!interaction.isCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      const errorEmbed: EmbedBuilder = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle('Oops !')
        .setURL(process.env.SUPPORT_URL as string)
        .setDescription(`Une erreur est survenue ! Contactez un administrateur si le problème persiste.`)
        .setTimestamp()
        .setFooter({text:`${process.env.BOT_NAME}`, iconURL:process.env.ICON_URL})
      await interaction.reply({embeds:[errorEmbed], ephemeral: true});
    }
  },
}