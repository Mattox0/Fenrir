import {ChatInputCommandInteraction, SlashCommandSubcommandBuilder} from "discord.js";

const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  subcommand: true,
  data: new SlashCommandBuilder()
    .setName('rate')
    .setDescription('Attribue une note sur 20')
    .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
      subcommand
        .setName('user')
        .setDescription('Donne une note à un utilisateur sur 20')
        .addUserOption(option => option.setName('utilisateur').setDescription('La personne que je dois noter').setRequired(true)))
    .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
      subcommand
        .setName('something')
        .setDescription('Donne une note à quelque chose sur 20')
        .addStringOption(option => option.setName('note').setDescription('La chose à noter').setRequired(true))),
  async execute(interaction: ChatInputCommandInteraction) {
    const tab: string[] = ['un pitoyable 1/20','un lamentable 2/20','un décevant 3/20',
      'un médiocre 4/20','un misérable 5/20','un misérable 6/20',
      'un piètre 7/20','un navrant 8/20','un pauvre 9/20',
      'un 10/20','un simple 11/20','un simple 12/20',
      'un petit 13/20','un bon 14/20','un beau 15/20',
      'un joli 16/20','un remarquable 17/20','un super 18/20',
      'un admirable 19/20','un excellent 20/20']
    require(`./rate/${interaction.options.getSubcommand()}`).execute(interaction, tab);
  }
}