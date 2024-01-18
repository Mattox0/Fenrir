import {
  ActionRowBuilder,
  ButtonBuilder, ButtonStyle,
  EmbedBuilder,
  GuildMember, Interaction, MessageActionRowComponentBuilder, MessageActionRowComponentData,
  SlashCommandBuilder,
  SlashCommandUserOption
} from "discord.js";
import {numeros1, numeros2, numeros3} from "../../navigation/navigation.button";
import {Emote} from "../../utils/emote";

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
    } else if (opponent.id === player.id) {
      await interaction.reply({content: 'Tu ne peux pas jouer contre toi-même', ephemeral: true});
    }
    const playerName: string = player.nickname ?? player.user.globalName ?? player.user.username;
    const opponentName: string = opponent.nickname ?? opponent.user.globalName ?? opponent.user.username;
    const game: string[][] = [
      [Emote.one_num, Emote.two_num, Emote.three_num],
      [Emote.four_num, Emote.five_num, Emote.six_num],
      [Emote.seven_num, Emote.eight_num, Emote.nine_num]
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
    const filter = (i: any) => i.message.interaction.id === interaction.id;
    const collector = interaction.channel.createMessageComponentCollector({
      filter, time: 60000
    })
    collector.on('collect', async (collected: any) => {
      if (collected.user.id != opponent.id) {
        collected.deferUpdate();
        return;
      } else {
        collected.deferUpdate();
        collector.stop();
        return;
      }
    });
    collector.on('end', async (collected: any) => {
      if (!collected.first() || collected.first().user.id != opponent.id) {
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
      const numbersOne: ActionRowBuilder<MessageActionRowComponentBuilder> = numeros1
      const numbersTwo: ActionRowBuilder<MessageActionRowComponentBuilder> = numeros2
      const numbersThree: ActionRowBuilder<MessageActionRowComponentBuilder> = numeros3
      const contentMessage: string = game.map((x: string[]) => x.join('')).join('\n');
      const gameEmbed: EmbedBuilder = new EmbedBuilder()
        .setColor('#2f3136')
        .setDescription(`C'est au tour de ${currentPlayer}
        
        ❌ ${player}
        ⭕ ${opponent}`)
        .setTimestamp()
        .setFooter({text:`${process.env.BOT_NAME}`, iconURL:process.env.ICON_URL})
      await interaction.editReply({content: contentMessage, embeds:[gameEmbed], components: [numbersOne, numbersTwo, numbersThree]});
      await this.game(interaction, game, currentPlayer, player, opponent, numbersOne, numbersTwo, numbersThree);
    })
  },
  async game(interaction: any, game: any[], currentPlayer: GuildMember, player: GuildMember, opponent: GuildMember, numbersOne: ActionRowBuilder<MessageActionRowComponentBuilder>, numbersTwo: ActionRowBuilder<MessageActionRowComponentBuilder>, numbersThree: ActionRowBuilder<MessageActionRowComponentBuilder>) {
    const gameFilter = (i: any) => (i.user.id == player.id || i.user.id == opponent.id) && i.message.interaction.id === interaction.id;
    const gameCollector = interaction.channel.createMessageComponentCollector({
      gameFilter, time: 60000
    })
    gameCollector.on('collect', async (collected: any) => {
      gameCollector.resetTimer();
      if (collected.user.id !== currentPlayer.id) {
        collected.deferUpdate();
        return;
      }
      if (collected.customId === 'one') {
        game[0][0] = currentPlayer.id === player.id ? Emote.one_x : Emote.one_o;
        numbersOne.components[0].setDisabled(true);
      } else if (collected.customId === 'two') {
        game[0][1] = currentPlayer.id === player.id ? Emote.two_x : Emote.two_o;
        numbersOne.components[1].setDisabled(true);
      } else if (collected.customId === 'three') {
        game[0][2] = currentPlayer.id === player.id ? Emote.three_x : Emote.three_o;
        numbersOne.components[2].setDisabled(true);
      } else if (collected.customId === 'four') {
        game[1][0] = currentPlayer.id === player.id ? Emote.four_x : Emote.four_o;
        numbersTwo.components[0].setDisabled(true);
      } else if (collected.customId === 'five') {
        game[1][1] = currentPlayer.id === player.id ? Emote.five_x : Emote.five_o;
        numbersTwo.components[1].setDisabled(true);
      } else if (collected.customId === 'six') {
        game[1][2] = currentPlayer.id === player.id ? Emote.six_x : Emote.six_o;
        numbersTwo.components[2].setDisabled(true);
      } else if (collected.customId === 'seven') {
        game[2][0] = currentPlayer.id === player.id ? Emote.seven_x : Emote.seven_o;
        numbersThree.components[0].setDisabled(true);
      } else if (collected.customId === 'eight') {
        game[2][1] = currentPlayer.id === player.id ? Emote.eight_x : Emote.eight_o;
        numbersThree.components[1].setDisabled(true);
      } else if (collected.customId === 'nine') {
        game[2][2] = currentPlayer.id === player.id ? Emote.nine_x : Emote.nine_o;
        numbersThree.components[2].setDisabled(true);
      }
      if (this.checkWin(game)) {
        const winEmbed: EmbedBuilder = new EmbedBuilder()
          .setColor('#2f3136')
          .setTitle(':crown: **Victoire** :crown:')
          .setDescription(`<:F_arrows:1190482623542341762> **${currentPlayer} a gagné !**`)
          .setTimestamp()
          .setFooter({text:`${process.env.BOT_NAME}`, iconURL:process.env.ICON_URL})
        const contentMessage: string = game.map((x: string[]) => x.join('')).join('\n');
        await interaction.editReply({content:contentMessage, embeds:[winEmbed], components: []});
        gameCollector.stop();
        return;
      } else if (game.every((row: string[]) => row.every((cell: string) => cell.slice(4, 7) !== 'num'))) {
        const nobodyWinEmbed: EmbedBuilder = new EmbedBuilder()
          .setColor('#2f3136')
          .setDescription(`<:F_arrows:1190482623542341762> **Personne n'a gagné ! Deux grands esprits se sont rencontrés**`)
          .setTimestamp()
          .setFooter({text:`${process.env.BOT_NAME}`, iconURL:process.env.ICON_URL})
        const contentMessage: string = game.map((x: string[]) => x.join('')).join('\n');
        await interaction.editReply({content:contentMessage, embeds:[nobodyWinEmbed], components: []});
        gameCollector.stop();
        return;
      }
      currentPlayer = currentPlayer.id === player.id ? opponent : player;
      const contentMessage: string = game.map((x: string[]) => x.join('')).join('\n');
      const gameEmbed: EmbedBuilder = new EmbedBuilder()
        .setColor('#2f3136')
        .setDescription(`C'est au tour de ${currentPlayer}
        
        ❌ ${player}
        ⭕ ${opponent}`)
        .setTimestamp()
        .setFooter({text:`${process.env.BOT_NAME}`, iconURL:process.env.ICON_URL})
      await interaction.editReply({content: contentMessage, embeds:[gameEmbed], components: [numbersOne, numbersTwo, numbersThree]});
      await collected.deferUpdate();
    })
  },
  checkWin(game: string[][]): boolean {
    for (let i = 0; i < 3; i++) {
      if (game[i].every((cell: string) => cell.charAt(4) === 'x') || game.every((row: string[]) => row[i] === 'x')) {
        return true;
      } else if (game[i].every((cell: string) => cell.charAt(4) === 'o') || game.every((row: string[]) => row[i] === 'o')) {
        return true;
      }
    }
    if ((game[0][0].charAt(4) === 'x' && game[1][1].charAt(4) === 'x' && game[2][2].charAt(4) === 'x') ||
      (game[0][2].charAt(4) === 'x' && game[1][1].charAt(4) === 'x' && game[2][0].charAt(4) === 'x')) {
      return true;
    } else if ((game[0][0].charAt(4) === 'o' && game[1][1].charAt(4) === 'o' && game[2][2].charAt(4) === 'o') ||
      (game[0][2].charAt(4) === 'o' && game[1][1].charAt(4) === 'o' && game[2][0].charAt(4) === 'o')) {
      return true;
    }
    return false
  }
}


