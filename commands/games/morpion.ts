import {
  ActionRowBuilder,
  ButtonBuilder, ButtonStyle,
  EmbedBuilder,
  GuildMember, Interaction,
  SlashCommandBuilder,
  SlashCommandUserOption
} from "discord.js";
import {numeros1, numeros2, numeros3} from "../../navigation/navigation.button";
import {EmoteMorpion} from "../../utils/emote";

module.exports = {
  name: "morpion",
  example: "/morpion <user>",
  data: new SlashCommandBuilder()
    .setName('morpion')
    .setDescription('Lance une partie de morpion')
    .addUserOption((option: SlashCommandUserOption) => option.setName('utilisateur').setDescription('L\'utilisateur à défier au morpion').setRequired(true)),
  async execute(interaction: any) {
    let player: GuildMember = interaction.member;
    let opponent: GuildMember = interaction.options.getUser('utilisateur');
    opponent = await interaction.member.guild.members.cache.find((x: GuildMember) => x.id === opponent.id);
    if (!opponent) {
      throw new Error('L\'utilisateur n\'existe pas');
    }
    const playerName: string = player.nickname ?? player.user.globalName ?? player.user.username;
    const opponentName: string = opponent.nickname ?? opponent.user.globalName ?? opponent.user.username;
    const game: string[][] = [
      [EmoteMorpion.one_num, EmoteMorpion.two_num, EmoteMorpion.three_num],
      [EmoteMorpion.four_num, EmoteMorpion.five_num, EmoteMorpion.six_num],
      [EmoteMorpion.seven_num, EmoteMorpion.height_num, EmoteMorpion.nine_num]

    ];
    const duel: EmbedBuilder = new EmbedBuilder()
      .setColor('#2f3136')
      .setDescription(`<:F_arrows:1190482623542341762> **${opponent}, Acceptes-tu ce morpion de la part de ${player}** ?`)
      .setTimestamp()
      .setFooter({text:`${process.env.BOT_NAME}`, iconURL:process.env.ICON_URL})
    const row: ActionRowBuilder = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('morpion_yes')
          .setLabel('Let’s go')
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId('morpion_no')
          .setLabel('Fuite !')
          .setStyle(ButtonStyle.Danger),
      )
    await interaction.reply({embeds:[duel], components: [row]});
    const filter = (i: any) => i.user.id == opponent.id && i.message.interaction.id === interaction.id;
    const collector = interaction.channel.createMessageComponentCollector({
      filter, max: 1, time: 60000
    })
    collector.on('end', async (collected: any) => {
      if (!collected.first()) {
        const error: EmbedBuilder = new EmbedBuilder()
          .setColor('#2f3136')
          .setDescription(`<:F_arrows:1190482623542341762> **${opponent} n'a pas répondu**`)
          .setTimestamp()
          .setFooter({text:`${process.env.BOT_NAME}`, iconURL:process.env.ICON_URL})
        return interaction.editReply({embeds:[error], components: []});
      }
      if (collected.first().customId === 'morpion_no') {
        const error: EmbedBuilder = new EmbedBuilder()
          .setColor('#2f3136')
          .setDescription(`<:F_arrows:1190482623542341762> **${opponent} a refusé le morpion**`)
          .setTimestamp()
          .setFooter({text:`${process.env.BOT_NAME}`, iconURL:process.env.ICON_URL})
        return interaction.editReply({embeds:[error], components: []});
      }
      collected.first().deferUpdate();
      let currentPlayer: GuildMember = Math.floor(Math.random() * 2) % 2 === 0 ? player : opponent;
      const contentMessage: string = game.map((x: string[]) => x.join('')).join('\n');
      const gameEmbed: EmbedBuilder = new EmbedBuilder()
        .setColor('#2f3136')
        .setDescription(`C'est au tour de ${currentPlayer}
        
        ❌ ${player}
        ⭕ ${opponent}`)
        .setTimestamp()
        .setFooter({text:`${process.env.BOT_NAME}`, iconURL:process.env.ICON_URL})
      await interaction.editReply({content: contentMessage, embeds:[gameEmbed], components: [numeros1, numeros2, numeros3]});
      await this.game(interaction, game, currentPlayer, player, opponent, numeros1, numeros2, numeros3);
    })
  },
  async game(interaction: any, game: any[], currentPlayer: GuildMember, player: GuildMember, opponent: GuildMember, numbers1: ActionRowBuilder, numbers2: ActionRowBuilder, numbers3: ActionRowBuilder) {
    const gameFilter = (i: any) => (i.user.id == player.id || i.user.id == opponent.id) && i.message.interaction.id === interaction.id;
    const gameCollector = interaction.channel.createMessageComponentCollector({
      gameFilter, time: 60000
    })
    gameCollector.on('collect', async (collected: any) => {
      gameCollector.resetTimer();
      if (collected.user.id === currentPlayer.id) {
        console.log(collected)
      } else {
        const error: EmbedBuilder = new EmbedBuilder()
          .setColor('#2f3136')
          .setDescription(`<:F_arrows:1190482623542341762> **Ce n'est pas ton tour**`)
          .setTimestamp()
          .setFooter({text:`${process.env.BOT_NAME}`, iconURL:process.env.ICON_URL})
        await interaction.followUp({embeds:[error], ephemeral: true});
      }
    })
  }
}


