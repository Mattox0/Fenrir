import {CommandInteraction, SlashCommandBuilder} from "discord.js";

module.exports = {
  name: "pof",
  example: "/pof",
  data: new SlashCommandBuilder()
    .setName('pof')
    .setDescription('Un choix aléatoire entre pile ou face'),
  async execute(interaction: CommandInteraction) {
    let choice: string[] = ['🪙 Pile !','🪙 Face !'];
    return interaction.reply({content:`> ${choice[Math.floor(Math.random() * choice.length)]}`});
  }
}