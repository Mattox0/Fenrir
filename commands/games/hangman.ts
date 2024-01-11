import {EmbedBuilder, SlashCommandBuilder, SlashCommandStringOption} from "discord.js";
import {get} from "../../requests/requests";
import {getHangmanStatus, HangmanStatus, HangmanStatusKey} from "../../utils/hangman";
import {moveMessagePortToContext} from "node:worker_threads";
const wait = require('util').promisify(setTimeout);

module.exports = {
  name: "hangman",
  example: "/hangman <easy|medium|hard>",
  description: "Joue au jeu du pendu !",
  data: new SlashCommandBuilder()
    .setName("hangman")
    .setDescription("Joue au jeu du pendu !")
    .addStringOption((option: SlashCommandStringOption) =>
      option
        .setName("mode")
        .setDescription("En groupe ou solo")
        .setRequired(true)
        .addChoices({ name: `Solitaire`, value: 'solo' })
        .addChoices({ name: `En groupe`, value: 'group' }))
    .addStringOption((option: SlashCommandStringOption) =>
      option
        .setName("difficulty")
        .setDescription("Choisis la difficulté du jeu !")
        .setRequired(true)
        .addChoices({ name: `Facile`, value: 'easy' })
        .addChoices({ name: `Moyen`, value: 'medium' })
        .addChoices({ name: `Difficile`, value: 'hard' })),
  async execute(interaction: any) {
    await interaction.deferReply();
    const response: Response = await get(process.env.API_URL + `/hangman/random/${interaction.options.getString('difficulty')}`)
    const mode = interaction.options.getString('mode');
    const data = await response.json();
    const word = data.word;
    const letters = word.split('');
    const hidden = letters.map(() => '_');
    const tries: string[] = [];
    const startEmbed: EmbedBuilder = new EmbedBuilder()
      .setColor('#2f3136')
      .setTitle('Jeu du Pendu')
      .setDescription(`\`${hidden.join(' ')}\`
      Lettres incorrectes : ${tries.join(' ')}
      \`\`\`${HangmanStatus.status_0}\`\`\``)
      .setTimestamp()
      .setFooter({text:`${process.env.BOT_NAME}`, iconURL:process.env.ICON_URL})
    await interaction.editReply({embeds:[startEmbed],components:[]});
    const filter = (x: any) => x.channel.id === interaction.channel.id && mode === 'solo' ? x.member.user.id === interaction.member.user.id : true;
    const collector = interaction.channel.createMessageCollector({filter, time:60000})
    collector.on('collect', async (collected: any) => {
      collector.resetTimer();
      if (collected.content.trim().length > 1) {
        collected.reply('On a dit une seule lettre !');
        return;
      }
      if (collected.content.trim().slice(0,1) !== "") {
        const letter: string = collected.content.trim().toUpperCase().slice(0,1);
        if (tries.includes(letter)) {
          await collected.reply('Tu as déjà essayé cette lettre !');
          return;
        } else if (letters.includes(letter.toLowerCase())) {
          letters.forEach((l: string, i: number) => {
            if (l === letter.toLowerCase()) {
              hidden[i] = letter;
            }
          });
          const good: EmbedBuilder = new EmbedBuilder()
            .setColor('#2f3136')
            .setTitle('Jeu du Pendu')
            .setDescription(`\`${hidden.join(' ')}\`
            Lettres incorrectes : **${tries.join(' ')} **
            \`\`\`${getHangmanStatus(`status_${tries.length}` as HangmanStatusKey)}\`\`\`
            `)
            .setTimestamp()
            .setFooter({text:`${process.env.BOT_NAME}`, iconURL:process.env.ICON_URL})
          await interaction.editReply({embeds:[good],components:[]});
          if (!hidden.includes('_')) {
            const win: EmbedBuilder = new EmbedBuilder()
              .setColor('#2f3136')
              .setTitle('Jeu du Pendu')
              .setDescription(`\`${hidden.join(' ')}\`
              Lettres incorrectes : **${tries.join(' ')} **
              \`\`\`${getHangmanStatus(`status_${tries.length}` as HangmanStatusKey)}\`\`\`
              **Bravo ! Tu as gagné !**`)
              .setTimestamp()
              .setFooter({text:`${process.env.BOT_NAME}`, iconURL:process.env.ICON_URL})
            await interaction.editReply({embeds:[win],components:[]});
            collector.stop();
          }
        } else {
          tries.push(letter);
          const bad: EmbedBuilder = new EmbedBuilder()
            .setColor('#2f3136')
            .setTitle('Jeu du Pendu')
            .setDescription(`\`${hidden.join(' ')}\`
            Lettres incorrectes : **${tries.join(' ')} **
            \`\`\`${getHangmanStatus(`status_${tries.length}` as HangmanStatusKey)}\`\`\`
            `)
            .setTimestamp()
            .setFooter({text:`${process.env.BOT_NAME}`, iconURL:process.env.ICON_URL})
          await interaction.editReply({embeds:[bad],components:[]});
          if (tries.length === 7) {
            collector.stop();
            return;
          }
        }
        collected.delete();
      }
    })
    collector.on('end', async (collected: any) => {
      if (!hidden.includes('_')) {
        const win: EmbedBuilder = new EmbedBuilder()
          .setColor('#2f3136')
          .setDescription(`<:F_arrows:1190482623542341762> Félicitations ! Le mot était bien **${word.toUpperCase()}**`)
          .setTimestamp()
          .setFooter({text:`${process.env.BOT_NAME}`, iconURL:process.env.ICON_URL})
        await interaction.followUp({embeds:[win],components:[]});
      } else if (tries.length === 7) {
        const lose: EmbedBuilder = new EmbedBuilder()
          .setColor('#2f3136')
          .setDescription(`<:F_arrows:1190482623542341762> Tu as perdu ! Le mot à trouver était **${word.toUpperCase()}**`)
          .setTimestamp()
          .setFooter({text:`${process.env.BOT_NAME}`, iconURL:process.env.ICON_URL})
        await interaction.followUp({embeds:[lose],components:[]});
      } else {
        const lose: EmbedBuilder = new EmbedBuilder()
          .setColor('#2f3136')
          .setDescription(`<:F_arrows:1190482623542341762> Délai dépassé ! Le mot à trouver était **${word.toUpperCase()}**`)
          .setTimestamp()
          .setFooter({text:`${process.env.BOT_NAME}`, iconURL:process.env.ICON_URL})
        await interaction.followUp({embeds:[lose],components:[]});
      }
    });
  }
}