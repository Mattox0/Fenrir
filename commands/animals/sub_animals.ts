import {ChatInputCommandInteraction, SlashCommandSubcommandBuilder} from "discord.js";

const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  subcommand: true,
  data: new SlashCommandBuilder()
    .setName('animal')
    .setDescription('Affiche vos animaux préférées')
    .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
      subcommand
        .setName('bunny')
        .setDescription('Affiche la photo d\'un lapin'))
    .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
      subcommand
        .setName('cat')
        .setDescription('Affiche la photo d\'un chat'))
    .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
      subcommand
        .setName('dog')
        .setDescription('Affiche la photo d\'un chien'))
    .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
      subcommand
        .setName('duck')
        .setDescription('Affiche la photo d\'un canard'))
    .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
      subcommand
        .setName('fox')
        .setDescription('Affiche la photo d\'un renard'))
    .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
      subcommand
        .setName('lizard')
        .setDescription('Affiche la photo d\'un reptile')),
  async execute(interaction: ChatInputCommandInteraction) {
    require(`./animal/${interaction.options.getSubcommand()}`).execute(interaction);
  }
}