import {EmbedBuilder, SlashCommandBuilder, SlashCommandStringOption} from "discord.js";
import {get} from "../../requests/requests";
import {HangmanStatus} from "../../utils/hangman";

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
    const response: Response = await get(process.env.API_URL + `/hangman/${interaction.options.getString('difficulty')}`)
    const data = await response.json();
    const word = data.word;
    const letters = word.split('');
    const hidden = letters.map(() => '_');
    const tries: string[] = [];
    const startEmbed: EmbedBuilder = new EmbedBuilder()
      .setColor('#2f3136')
      .setTitle('Jeu du Pendu')
      .setDescription(`\`${hidden.join(' ')}\`
      Lettres incorrectes : **${tries.join(' ')}**
      \`\`\`${HangmanStatus.status_0}\`\`\``)
      .setTimestamp()
      .setFooter({text:`${process.env.BOT_NAME}`, iconURL:process.env.ICON_URL})
  }
}