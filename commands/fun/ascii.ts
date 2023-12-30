import {ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder} from "discord.js";
const figlet = require('figlet');

module.exports = {
  name: "ascii",
  exemple: "/ascii <text> <?theme>",
  data: new SlashCommandBuilder()
    .setName('ascii')
    .setDescription('Convertit un texte en ASCII')
    .addStringOption(option => option.setName('text').setDescription('Le texte à convertir').setRequired(true))
    .addStringOption(option => option.setName('theme').setDescription('Le thème de la conversion').setRequired(false)),
  async execute(interaction: ChatInputCommandInteraction) {
    let text: string = interaction.options.getString('texte') as string;
    let font: string = interaction.options.getString('theme') ?? 'Standard';
    figlet.text(text, {
      font: font,
      horizontalLayout: 'default',
      verticalLayout: 'default',
      width: 80,
      whitespaceBreak: true
    }, async function(err: Error, data: any) {
      if (err) {
        const fail = new EmbedBuilder()
          .setColor('#2f3136')
          .setDescription(`<:F_arrows:1190482623542341762> **Je n'arrive pas à trouver ce thème !**`)
          .setTimestamp()
          .setFooter({text:`${process.env.BOT_NAME}`, iconURL:process.env.ICON_URL})
        return interaction.reply({embeds:[fail], ephemeral:true})
      }
      const ascii = new EmbedBuilder()
        .setColor('#2f3136')
        .setDescription(`> **Attention aux mots trop long ! | Retrouvez tous les [thèmes disponibles](https://github.com/patorjk/figlet.js/tree/master/fonts)**\n\`\`\`${data}\`\`\``)
        .setTimestamp()
        .setFooter({text:`${process.env.BOT_NAME}`, iconURL:process.env.ICON_URL})
      return interaction.reply({embeds:[ascii]})
    });
  }
}