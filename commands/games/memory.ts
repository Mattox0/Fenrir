import {EmbedBuilder, Message, SlashCommandBuilder, SlashCommandIntegerOption} from "discord.js";
const wait = require('util').promisify(setTimeout);

module.exports = {
  name: "memory",
  example: "/memory",
  data: new SlashCommandBuilder()
    .setName('memory')
    .setDescription('Lance une partie de memory')
    .addIntegerOption((option: SlashCommandIntegerOption) =>
      option
        .setName('temps')
        .setDescription('temps de mémorisation')
        .setRequired(true)
        .addChoices({ name: `2 secondes`, value: 2 })
        .addChoices({ name: `5 secondes`, value: 5 })
        .addChoices({ name: `10 secondes`, value: 10 })
        .addChoices({ name: `15 secondes`, value: 15 })
        .addChoices({ name: `20 secondes`, value: 20 })
        .addChoices({ name: `30 secondes`, value: 30 }))
    .addIntegerOption((option: SlashCommandIntegerOption) => option.setName('cartes').setDescription('Le nombre de cartes | 10 par défaut').setRequired(false).setMinValue(1).setMaxValue(100)),
  async execute(interaction: any) {
    let time: number = interaction.options.getInteger('temps');
    let cards: number = interaction.options.getInteger('cartes') ?? 10;
    let words: string[] = ['VERT','ROUGE','JAUNE','BLEU','VIOLET','ROSE','ORANGE']
    const suite: string[] = [];
    for (let i = 0; i < cards; i++) {
      suite.push(words[Math.floor(Math.random() * words.length)])
    }
    const game: EmbedBuilder = new EmbedBuilder()
      .setColor('#2f3136')
      .setDescription('Tu es prêt ? Début dans : `5`')
      .setTimestamp()
      .setFooter({text:`${process.env.BOT_NAME}`, iconURL:process.env.ICON_URL})
    await interaction.reply({embeds:[game],components:[]});
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
    const ask: EmbedBuilder = new EmbedBuilder()
      .setColor('#2f3136')
      .setDescription(`Tu as ${time} secondes pour retenir la suite de mots !
      \n\`${suite.join('` `')}\``)
      .setTimestamp()
      .setFooter({text:`${process.env.BOT_NAME}`, iconURL:process.env.ICON_URL})
    await interaction.editReply({embeds:[ask],components:[]});
    await wait(1000*time);
    const response: EmbedBuilder = new EmbedBuilder()
      .setColor('#2f3136')
      .setDescription('<:F_arrows:1190482623542341762> **Tu as bien retenu ? Je t\'écoute !**')
      .setTimestamp()
      .setFooter({ text: `Tu as 60 secondes`, iconURL: process.env.ICON_URL })
    await interaction.editReply({embeds:[response],components:[]});
    const filter = (m: Message) => m.channel.id === interaction.channel.id && interaction.member.user.id === m.author.id
    const collector = interaction.channel.createMessageCollector({ filter, max:1, time: 60000 });
    collector.on('end', async (collected: any) => {
      if (!collected.first()) {
        const delay: EmbedBuilder = new EmbedBuilder()
          .setDescription(`<:F_arrows:1190482623542341762> **Les 60 secondes sont écoulés**`)
        return interaction.editReply({ embeds: [delay], components: [] })
      }
      if (collected.first().content === suite.join(' ')) {
        const win = new EmbedBuilder()
          .setDescription('<:F_arrows:1190482623542341762> **Bien joué, tu as réussi a retrouver la suite !**')
          .setTimestamp()
          .setFooter({text:`${process.env.BOT_NAME}`, iconURL:process.env.ICON_URL})
        return collected.first().reply({embeds:[win]})
      } else {
        let response = collected.first().content.split(' ')
        let phrase: string = ""
        let phraseV: string = ""
        for (let i = 0; i < suite.length; i++) {
          if (response[i]) {
            if (response[i].toLowerCase() === suite[i].toLowerCase()) {
              phrase += `~~${suite[i]}~~ `;
              phraseV += `~~${response[i].toUpperCase()}~~ `
            } else {
              phrase += `**${suite[i]}** `;
              phraseV += `**${response[i].toUpperCase()}** `
            }
          } else {
            phraseV += `**${suite[i]}** `
          }
        }
        const fail: EmbedBuilder = new EmbedBuilder()
          .setDescription(`<:F_arrows:1190482623542341762> **Eh non, tu n\'as pas retrouvé la phrase !**\n\n:white_check_mark: ${phrase}\n\n:x: ${phraseV}`)
          .setTimestamp()
          .setFooter({text:`${process.env.BOT_NAME}`, iconURL:process.env.ICON_URL})
        return collected.first().reply({embeds:[fail]})
      }
    })
  }
}