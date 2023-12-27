import {BaseInteraction, EmbedBuilder} from "discord.js";
import {client} from "../../index";

module.exports = {
  name: 'interactionCreate',
  async execute(interaction: BaseInteraction) {
    if (!interaction.isCommand()) return;
    const command = client.slash_commands.commands.get(interaction.commandName);
    if (!command) return;
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      // faire embed d'erreur
    }
  },
}