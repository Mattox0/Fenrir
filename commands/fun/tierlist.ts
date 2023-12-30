import {SlashCommandBuilder} from "@discordjs/builders";
import {ChatInputCommandInteraction, EmbedBuilder} from "discord.js";

module.exports = {
  name: "tierlist",
  example: "/tierlist <element1> <element2> <element3> etc.",
  data: new SlashCommandBuilder()
    .setName('tierlist')
    .setDescription('Classe les differents elements donnés')
    .addStringOption(option => option.setName('element1').setDescription('Le premier élément').setRequired(true))
    .addStringOption(option => option.setName('element2').setDescription('Le deuxième élément').setRequired(true))
    .addStringOption(option => option.setName('element3').setDescription('Le troisième élément').setRequired(false))
    .addStringOption(option => option.setName('element4').setDescription('Le quatrième élément').setRequired(false))
    .addStringOption(option => option.setName('element5').setDescription('Le cinqième élément').setRequired(false))
    .addStringOption(option => option.setName('element6').setDescription('Le sixième élément').setRequired(false))
    .addStringOption(option => option.setName('element7').setDescription('Le septième élément').setRequired(false))
    .addStringOption(option => option.setName('element8').setDescription('Le huitième élément').setRequired(false))
    .addStringOption(option => option.setName('element9').setDescription('Le neuvième élément').setRequired(false))
    .addStringOption(option => option.setName('element10').setDescription('Le dixième élément').setRequired(false))
    .addStringOption(option => option.setName('element11').setDescription('Le onzième élément').setRequired(false))
    .addStringOption(option => option.setName('element12').setDescription('Le douzième élément').setRequired(false))
    .addStringOption(option => option.setName('element13').setDescription('Le treizième élément').setRequired(false))
    .addStringOption(option => option.setName('element14').setDescription('Le quatorzième élément').setRequired(false))
    .addStringOption(option => option.setName('element15').setDescription('Le quinzième élément').setRequired(false))
    .addStringOption(option => option.setName('element16').setDescription('Le seizième élément').setRequired(false))
    .addStringOption(option => option.setName('element17').setDescription('Le dixseptième élément').setRequired(false))
    .addStringOption(option => option.setName('element18').setDescription('Le dixhuitième élément').setRequired(false))
    .addStringOption(option => option.setName('element19').setDescription('Le dixneuvième élément').setRequired(false))
    .addStringOption(option => option.setName('element20').setDescription('Le vingtième élément').setRequired(false))
    .addStringOption(option => option.setName('element21').setDescription('Le vingt-unième élément').setRequired(false))
    .addStringOption(option => option.setName('element22').setDescription('Le vingt-deuxième élément').setRequired(false))
    .addStringOption(option => option.setName('element23').setDescription('Le vingt-troisième élément').setRequired(false))
    .addStringOption(option => option.setName('element24').setDescription('Le vingt-quatrième élément').setRequired(false))
    .addStringOption(option => option.setName('element25').setDescription('Le vint-cinquième élément').setRequired(false)),
  async execute(interaction: ChatInputCommandInteraction) {
    let count: number = 0;
    let tab: string[] = [];
    for (let x = 0; x < 25; x++) {
      count++;
      let elem: string = interaction.options.getString(`element${count}`) as string;
      if (elem) tab.push(elem);
      else break;
    }
    tab = tab.sort(function(a, b) {return 0.5 - Math.random()});
    let description = "";
    count = 0;
    tab.forEach(item => {
      count++;
      description += `**#${count}** - ${item}\n`;
    })
    const tierlist: EmbedBuilder = new EmbedBuilder()
      .setColor('#2f3136')
      .setTitle('Voici votre tierlist !')
      .setDescription(description)
      .setTimestamp()
      .setFooter({text:`${process.env.BOT_NAME}`, iconURL:process.env.ICON_URL})
    return interaction.reply({ embeds : [tierlist]})
  }
}