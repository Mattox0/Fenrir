import {SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandUserOption} from "discord.js";

module.exports = {
  subcommand: true,
  data: new SlashCommandBuilder()
    .setName('interaction')
    .setDescription('Affiche vos interactions préférées')
    .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
      subcommand
        .setName('bite')
        .setDescription('Mord quelqu\'un !')
        .addUserOption((option: SlashCommandUserOption) => option.setName('utilisateur').setDescription('La personne que tu veux mordre | Si rien -> personne aléatoire').setRequired(false)))
    .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
      subcommand
        .setName('blush')
        .setDescription('Te fait rougir !'))
    .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
      subcommand
        .setName('bully')
        .setDescription('Intimide quelqu\'un !')
        .addUserOption((option: SlashCommandUserOption) => option.setName('utilisateur').setDescription('La personne que tu veux intimider | Si rien -> personne aléatoire').setRequired(false)))
    .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
      subcommand
        .setName('cry')
        .setDescription('Pleure auprès de quelqu\'un')
        .addUserOption((option: SlashCommandUserOption) => option.setName('utilisateur').setDescription('La personne aupres de laquelle tu veux pleurer | Si rien -> personne aléatoire').setRequired(false)))
    .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
      subcommand
        .setName('dance')
        .setDescription('Danse avec quelqu\'un')
        .addUserOption((option: SlashCommandUserOption) => option.setName('utilisateur').setDescription('La personne avec qui tu veux danser | Si rien -> personne aléatoire').setRequired(false)))
    .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
      subcommand
        .setName('glomp')
        .setDescription('Glousse !'))
    .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
      subcommand
        .setName('handhold')
        .setDescription('Serre la main de quelqu\'un')
        .addUserOption((option: SlashCommandUserOption) => option.setName('utilisateur').setDescription('La personne avec qui tu veux prendre la main | Si rien -> personne aléatoire').setRequired(false)))
    .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
      subcommand
        .setName('hug')
        .setDescription('Prend dans tes bras quelqu\'un')
        .addUserOption((option: SlashCommandUserOption) => option.setName('utilisateur').setDescription('La personne que tu veux prendre dans tes bras | Si rien -> personne aléatoire').setRequired(false)))
    .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
      subcommand
        .setName('happy')
        .setDescription('Sois content !'))
    .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
      subcommand
        .setName('kill')
        .setDescription('Tue quelqu\'un')
        .addUserOption((option: SlashCommandUserOption) => option.setName('utilisateur').setDescription('La personne que tu veux tuer | Si rien -> personne aléatoire').setRequired(false)))
    .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
      subcommand
        .setName('kiss')
        .setDescription('Embrasse quelqu\'un')
        .addUserOption((option: SlashCommandUserOption) => option.setName('utilisateur').setDescription('La personne que tu veux embrasser | Si rien -> personne aléatoire').setRequired(false)))
    .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
      subcommand
        .setName('pat')
        .setDescription('Réconforte quelqu\'un !')
        .addUserOption((option: SlashCommandUserOption) => option.setName('utilisateur').setDescription('La personne que tu veux reconforter | Si rien -> personne aléatoire').setRequired(false)))
    .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
      subcommand
        .setName('poke')
        .setDescription('Donne un petit coup à quelqu\'un !')
        .addUserOption((option: SlashCommandUserOption) => option.setName('utilisateur').setDescription('La personne que tu veux taper | Si rien -> personne aléatoire').setRequired(false)))
    .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
      subcommand
        .setName('slap')
        .setDescription('Donne une gifle à quelqu\'un !')
        .addUserOption((option: SlashCommandUserOption) => option.setName('utilisateur').setDescription('La personne que tu veux taper | Si rien -> personne aléatoire').setRequired(false)))
    .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
      subcommand
        .setName('smile')
        .setDescription('Souris !'))
    .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
      subcommand
        .setName('wave')
        .setDescription('Salue quelqu\'un !')
        .addUserOption((option: SlashCommandUserOption) => option.setName('utilisateur').setDescription('La personne que tu veux saluer | Si rien -> personne aléatoire').setRequired(false)))
    .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
      subcommand
        .setName('wink')
        .setDescription('Fais un clin d\'oeil à quelqu\'un !')
        .addUserOption((option: SlashCommandUserOption) => option.setName('utilisateur').setDescription('La personne que tu veux saluer | Si rien -> personne aléatoire').setRequired(false)))
    .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
      subcommand
        .setName('yeet')
        .setDescription('Donne un coup de pied à quelqu\'un !')
        .addUserOption((option: SlashCommandUserOption) => option.setName('utilisateur').setDescription('La personne à qui tu veux donner un coup de pied | Si rien -> personne aléatoire').setRequired(false))),
  async execute(interaction: any) {
    require(`./interaction/${interaction.options.getSubcommand()}`).execute(interaction);
  }
}
