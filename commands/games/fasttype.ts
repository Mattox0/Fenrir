import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  GuildMember,
  Message,
  SlashCommandBuilder
} from "discord.js";
import fs from "fs";
import path from "path";
const wait = require('util').promisify(setTimeout);

module.exports = {
  name: "fasttype",
  example: "/fasttype",
  data: new SlashCommandBuilder()
    .setName('fasttype')
    .setDescription('Lance une partie de fasttype en groupe ou en solo'),
  async execute(interaction: any) {
    const row: ActionRowBuilder = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('fasttype_ready')
          .setLabel('Je suis prêt')
          .setStyle(ButtonStyle.Success)
      )
    const start: EmbedBuilder = new EmbedBuilder()
      .setColor('#2f3136')
      .setDescription('<:F_arrows:1190482623542341762> **Appuyez sur le bouton quand vous êtes prêt !**')
      .setTimestamp()
      .setFooter({text:`${process.env.BOT_NAME}`, iconURL:process.env.ICON_URL})
    await interaction.reply({embeds:[start], components: [row]})
    const filter = (x: any) => x.channel.id === interaction.channel.id;
    const collector = interaction.channel.createMessageComponentCollector({filter, max:1, time:60000})
    collector.on('end', async (collected: any) => {
      if (!collected.first()) {
        const delay: EmbedBuilder = new EmbedBuilder()
          .setColor('#2f3136')
          .setDescription(`<:F_arrows:1190482623542341762> **Personne n'a pas répondu**`)
          .setTimestamp()
          .setFooter({text:`${process.env.BOT_NAME}`, iconURL:process.env.ICON_URL})
        return interaction.editReply({ embeds: [delay], components: [] });
      }
      collected.first().deferUpdate();
      const fileDirectory: string = path.join(__dirname, '..', '..', 'utils', 'fasttype_words.txt');
      const allWords: string = fs.readFileSync(fileDirectory,'utf8')
      const sentence: string = allWords.split('\n').map(x => x.replace('\r',''))[Math.floor(Math.random() * allWords.split('\n').length)];
      const game: EmbedBuilder = new EmbedBuilder()
        .setColor('#2f3136')
        .setDescription('Tu es prêt ? Début dans : `5`')
        .setTimestamp()
        .setFooter({text:`${process.env.BOT_NAME}`, iconURL:process.env.ICON_URL})
      await interaction.editReply({embeds:[game],components:[]});
      await wait(1000);
      for (let i = 4; i > 0; i--) {
        const game: EmbedBuilder = new EmbedBuilder()
          .setColor('#2f3136')
          .setDescription(`Tu es prêt ? Début dans : \`${i}\``)
          .setTimestamp()
          .setFooter({text:`${process.env.BOT_NAME}`, iconURL:process.env.ICON_URL})
        await interaction.editReply({embeds:[game],components:[]});
        await wait(1000);
      }
      const realGame: EmbedBuilder = new EmbedBuilder()
        .setColor('#2f3136')
        .setDescription(`<:F_arrows:1190482623542341762> **Recopies cette phrase le plus vite possible :**
        \n> \`${sentence}\``)
        .setTimestamp()
        .setFooter({text:`${process.env.BOT_NAME}`, iconURL:process.env.ICON_URL})
      await interaction.editReply({embeds:[realGame],components:[]});
      let win: GuildMember | null = null;
      const filter1 = (x: any) => x.channel.id === interaction.channel.id
      const collector1 = interaction.channel.createMessageCollector({filter1, time:120000})
      let dateStart: Date = new Date();
      collector1.on('collect', (collected: Message) => {
        if (collected.content.toLowerCase() === sentence.toLowerCase()) {
          win = collected.member;
          collected.react('👑')
          collector1.stop();
        } else {
          collected.react('❌');
        }
      })
      collector1.on('end', async (collected: any) => {
        if (!collected.first() || !win) {
          const embed: EmbedBuilder = new EmbedBuilder()
            .setColor('#2f3136')
            .setDescription('<:F_arrows:1190482623542341762> **Le jeu est annulé**')
            .setTimestamp()
            .setFooter({text:`${process.env.BOT_NAME}`, iconURL:process.env.ICON_URL})
          return interaction.editReply({embeds:[embed],components:[]})
        }
        let dateEnd: Date = new Date()
        let seconds: number = (Number(dateEnd) - Number(dateStart)) / 1000
        const vic: EmbedBuilder = new EmbedBuilder()
          .setColor('#2f3136')
          .setDescription(`<:F_arrows:1190482623542341762> **${win} est trop rapide !**\n\nTa vitesse de frappe est de **${Math.round(sentence.length / 5 / seconds * 60 * 100) / 100}**\n\n> \`La vitesse de frappe depend du temps et de la taille de la phrase.\``)
          .setTimestamp()
          .setFooter({text:`${process.env.BOT_NAME}`, iconURL:process.env.ICON_URL})
        return interaction.editReply({embeds:[vic],components:[]})
      })
    })
  }
}