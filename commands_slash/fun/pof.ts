import {BaseInteraction, CommandInteraction, Interaction} from "discord.js";

module.exports = {
  name:'pof',
  description:'Pof',
  exemple:`/pof`,
  async execute(interaction: CommandInteraction) {
    await interaction.reply('Pof');
  }
}