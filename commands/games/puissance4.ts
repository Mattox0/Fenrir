import {
  ActionRowBuilder, ButtonBuilder, ButtonStyle,
  EmbedBuilder,
  GuildMember, MessageActionRowComponentBuilder,
  SlashCommandBuilder,
  SlashCommandUserOption,
  time
} from "discord.js";
import {Emote} from "../../utils/emote";
import {numbers1to4, numbers5to7} from "../../navigation/navigation.button";

module.exports = {
  name: "puissance4",
  example: "/puissance4 <user>",
  data: new SlashCommandBuilder()
    .setName('puissance4')
    .setDescription('Lance une partie de puissance 4')
    .addUserOption((option: SlashCommandUserOption) => option.setName('utilisateur').setDescription('L\'utilisateur à défier').setRequired(true)),
  async execute(interaction: any) {
    let player: GuildMember = interaction.member;
    let opponent: GuildMember = interaction.options.getUser('utilisateur');
    opponent = await interaction.member.guild.members.cache.find((x: GuildMember) => x.id === opponent.id);
    if (!opponent) {
      throw new Error('L\'utilisateur n\'existe pas');
    }
    const puissance4: EmbedBuilder = new EmbedBuilder()
      .setColor('#2f3136')
      .setDescription(`<:F_arrows:1190482623542341762> **${opponent}, Acceptes-tu ce puissance 4 de la part de ${player}** ?`)
      .setTimestamp()
      .setFooter({text:`${process.env.BOT_NAME}`, iconURL:process.env.ICON_URL})
    const row: ActionRowBuilder = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('puissance_yes')
          .setLabel('Let’s go')
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId('puissance_no')
          .setLabel('Fuite !')
          .setStyle(ButtonStyle.Danger),
      )
    await interaction.reply({embeds:[puissance4], components: [row]});
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
          .setFooter({text: `${process.env.BOT_NAME}`, iconURL: process.env.ICON_URL})
        return interaction.editReply({embeds: [error], components: []});
      }
      if (collected.first().customId === 'puissance_no') {
        const error: EmbedBuilder = new EmbedBuilder()
          .setColor('#2f3136')
          .setDescription(`<:F_arrows:1190482623542341762> **${opponent} a refusé le puissance 4**`)
          .setTimestamp()
          .setFooter({text: `${process.env.BOT_NAME}`, iconURL: process.env.ICON_URL})
        return interaction.editReply({embeds: [error], components: []});
      }
      let currentPlayer: GuildMember = Math.floor(Math.random() * 2) % 2 === 0 ? player : opponent;
      let game: string[][] = Array.from(Array(6), () => new Array(7).fill(Emote.grey_circle));
      const timer: Date = new Date();
      timer.setSeconds(timer.getSeconds() + 60);
      const numbersOne: ActionRowBuilder<MessageActionRowComponentBuilder> = numbers1to4;
      const numbersTwo: ActionRowBuilder<MessageActionRowComponentBuilder> = numbers5to7;
      const start: EmbedBuilder = new EmbedBuilder()
        .setColor('#2f3136')
        .setDescription(`:one::two::three::four::five::six::seven:
        ${Emote.transparent.repeat(7)}
        ${game.map((x: string[]) => x.join('')).join('\n')}
        
        ${Emote.clock} Fin du tour ${time(timer, 'R')}
        
        **Joueurs**
        ${Emote.red_circle} ${player} ${currentPlayer.id === player.id ? '**Ton tour**' : ''}
        ${Emote.yellow_circle} ${opponent} ${currentPlayer.id === opponent.id ? '**Ton tour**' : ''}`)
        .setTimestamp()
        .setFooter({text: `${process.env.BOT_NAME}`, iconURL: process.env.ICON_URL})
      await interaction.editReply({embeds: [start], components: [numbersOne, numbersTwo]});
      await this.game(interaction, game, currentPlayer, player, opponent, numbersOne, numbersTwo);
    });
  },
  async game(interaction: any, game: any[], currentPlayer: GuildMember, player: GuildMember, opponent: GuildMember, numbersOne: ActionRowBuilder<MessageActionRowComponentBuilder>, numbersTwo: ActionRowBuilder<MessageActionRowComponentBuilder>) {
    const filter = (i: any) => i.message.interaction.id === interaction.id;
    const collector = interaction.channel.createMessageComponentCollector({
      filter, time: 60000
    })
    collector.on('collect', async (collected: any) => {
      if (collected.user.id != currentPlayer.id) {
        collected.deferUpdate();
        return;
      }
      collector.resetTimer();
      const newTimer: Date = new Date();
      newTimer.setSeconds(newTimer.getSeconds() + 60);
      const column: number = collected.customId.split('_')[1] - 1;
      if (await this.checkColumn(game, column)) {
        const error: EmbedBuilder = new EmbedBuilder()
          .setColor('#2f3136')
          .setDescription(`${Emote.double_arrow} **Cette colonne est pleine**`)
          .setTimestamp()
          .setFooter({text: `${process.env.BOT_NAME}`, iconURL: process.env.ICON_URL})
        return interaction.followUp({embeds: [error], ephemeral: true});
      }
      const row: number = game.findIndex((x: string[]) => x[column] !== Emote.grey_circle) === -1 ? 5 : game.findIndex((x: string[]) => x[column] !== Emote.grey_circle) - 1;
      game[row][column] = currentPlayer.id === player.id ? Emote.red_circle : Emote.yellow_circle;
      // verifier si colonne plein et disabled bouton
      if (await this.checkColumn(game, column)) {
        if (column < 4) {
          numbersOne.components[column].setDisabled(true);
        } else {
          numbersTwo.components[column - 4].setDisabled(true);
        }
      }
      collected.deferUpdate();
      const midArray: string[] = Array.from(Array(7), () => Emote.transparent);
      midArray[column] = currentPlayer.id === player.id ? Emote.arrow_red : Emote.arrow_yellow;
      const turn: EmbedBuilder = new EmbedBuilder()
        .setColor('#2f3136')
        .setDescription(`:one::two::three::four::five::six::seven:
        ${midArray.join('')}
        ${game.map((x: string[]) => x.join('')).join('\n')}
        
        ${Emote.clock} Fin du tour ${time(newTimer, 'R')}
        
        **Joueurs**
        ${Emote.red_circle} ${player} ${currentPlayer.id === opponent.id ? '**Ton tour**' : ''}
        ${Emote.yellow_circle} ${opponent} ${currentPlayer.id === player.id ? '**Ton tour**' : ''}`)
        .setTimestamp()
        .setFooter({text: `${process.env.BOT_NAME}`, iconURL: process.env.ICON_URL})
      await interaction.editReply({embeds: [turn], components: [numbersOne, numbersTwo]});
      // verifier si gagné
      if (await this.checkWin(game, currentPlayer.id === player.id ? Emote.red_circle : Emote.yellow_circle)) {
        return collector.stop();
      }
      if (await this.checkEquality(Object.values(game))) {
        return collector.stop();
      }
      currentPlayer = currentPlayer.id === player.id ? opponent : player;
    });
    collector.on('end', async (collected: any) => {
      if (collected.size === 0) {
        const timeUp: EmbedBuilder = new EmbedBuilder()
          .setColor('#2f3136')
          .setDescription(`${Emote.double_arrow} **Les 60 secondes sont écoulés**`)
          .setTimestamp()
          .setFooter({text: `${process.env.BOT_NAME}`, iconURL: process.env.ICON_URL})
        await interaction.followUp({embeds: [timeUp], components: []});
      } else if (await this.checkWin(game, currentPlayer.id === player.id ? Emote.red_circle : Emote.yellow_circle)) {
        const win: EmbedBuilder = new EmbedBuilder()
          .setColor('#2f3136')
          .setDescription(`${Emote.double_arrow} **${currentPlayer} a gagné**, toutes mes félicitations !`)
          .setTimestamp()
          .setFooter({text: `${process.env.BOT_NAME}`, iconURL: process.env.ICON_URL})
        await interaction.followUp({embeds: [win], components: []});
      } else if (await this.checkEquality(Object.values(game))) {
        const equality: EmbedBuilder = new EmbedBuilder()
          .setColor('#2f3136')
          .setDescription(`${Emote.double_arrow} **Egalité**, deux grands esprits se sont rencontrés !`)
          .setTimestamp()
          .setFooter({text: `${process.env.BOT_NAME}`, iconURL: process.env.ICON_URL})
        await interaction.followUp({embeds: [equality], components: []});
      } else {
        const timeUp: EmbedBuilder = new EmbedBuilder()
          .setColor('#2f3136')
          .setDescription(`${Emote.double_arrow} ${currentPlayer} **a déclaré forfait car il n'a pas joué à temps**`)
          .setTimestamp()
          .setFooter({text: `${process.env.BOT_NAME}`, iconURL: process.env.ICON_URL})
        await interaction.followUp({embeds: [timeUp], components: []});
      }
      const turn: EmbedBuilder = new EmbedBuilder()
        .setColor('#2f3136')
        .setDescription(`:one::two::three::four::five::six::seven:
        ${Emote.transparent.repeat(7)}
        ${game.map((x: string[]) => x.join('')).join('\n')}
        
        **Joueurs**
        ${Emote.red_circle} ${player}
        ${Emote.yellow_circle} ${opponent}`)
        .setTimestamp()
        .setFooter({text: `${process.env.BOT_NAME}`, iconURL: process.env.ICON_URL})
      await interaction.editReply({embeds: [turn], components: []});
    });
  },
  async checkColumn(game: any[], column: number) {
    return game.map((x: string[]) => x[column]).lastIndexOf(Emote.grey_circle) === -1;
  },
  async checkWin(array: string[][], player: string) {
    // Vérification des lignes
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 4; j++) {
        if (array[i][j] === player && array[i][j + 1] === player && array[i][j + 2] === player && array[i][j + 3] === player) {
          return true;
        }
      }
    }
    // Vérification des colonnes
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 7; j++) {
        if (array[i][j] === player && array[i + 1][j] === player && array[i + 2][j] === player && array[i + 3][j] === player) {
          return true;
        }
      }
    }
    // Vérification des diagonales (de gauche à droite)
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 4; j++) {
        if (array[i][j] === player && array[i + 1][j + 1] === player && array[i + 2][j + 2] === player && array[i + 3][j + 3] === player) {
          return true;
        }
      }
    }
    // Vérification des diagonales (de droite à gauche)
    for (let i = 0; i < 3; i++) {
      for (let j = 3; j < 7; j++) {
        if (array[i][j] === player && array[i + 1][j - 1] === player && array[i + 2][j - 2] === player && array[i + 3][j - 3] === player) {
          return true;
        }
      }
    }
    return false;
  },
  async checkEquality(game: string[][]) {
    return game.every((row: string[]) => row.every((cell: string) => cell !== null && cell !== Emote.grey_circle));
  }
}

// changer le gagné et le égalité