import {
  ActionRowBuilder,
  ButtonBuilder, ButtonStyle, Embed,
  EmbedBuilder,
  GuildMember,
  SlashCommandBuilder,
  SlashCommandUserOption
} from "discord.js";
const wait = require('util').promisify(setTimeout);

module.exports = {
  name: "duel",
  example: "/duel <user>",
  data: new SlashCommandBuilder()
    .setName('duel')
    .setDescription('Défie un utilisateur')
    .addUserOption((option: SlashCommandUserOption) => option.setName('utilisateur').setDescription('L\'utilisateur à défier').setRequired(true)),
  async execute(interaction: any) {
    const user = interaction.options.getUser('utilisateur');
    if (user.id === interaction.member.id) {
      return interaction.reply({content: 'Vous ne pouvez pas vous défier vous même !', ephemeral: true});
    }
    const opponent: GuildMember = await interaction.member.guild.members.cache.find((x: GuildMember) => x.id === user.id);
    const opponentName: string = opponent.nickname ?? opponent.user.globalName ?? opponent.user.username;
    if (!opponent) {
      return interaction.reply({content: 'Cet utilisateur n\'existe pas !', ephemeral: true});
    }
    const player: GuildMember = interaction.member;
    const playerName: string = player.nickname ?? player.user.globalName ?? player.user.username;
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('duel_yes')
          .setLabel('Let’s go')
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId('duel_no')
          .setLabel('Fuite !')
          .setStyle(ButtonStyle.Danger),
      )
    const duel: EmbedBuilder = new EmbedBuilder()
      .setColor('#000000')
      .setTitle('⚔️ Duel ⚔️')
      .setDescription(`**${opponent}**, Acceptes-tu ce duel de la part de **${player}** ?`)
      .setTimestamp()
      .setFooter({text:`${process.env.BOT_NAME}`, iconURL:process.env.ICON_URL})
    const responseMessage = await interaction.reply({embeds:[duel], components: [row]});
    const list: number[] = [0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 19, 20, 30];
    let hpPlayer: number = 100;
    let hpOpponent: number = 100;
    const filter = (i: any) => i.customId.startsWith('duel') && i.message.interaction.id === interaction.id;
    const collector = interaction.channel.createMessageComponentCollector({filter, time: 60000});
    collector.on('collect', async (collected: any) => {
      if (collected.user.id !== opponent.id) {
        const error: EmbedBuilder = new EmbedBuilder()
          .setColor('#2f3136')
          .setDescription(`<:F_arrows:1190482623542341762> **Seul ${opponent} peut répondre**`)
          .setTimestamp()
          .setFooter({text:`${process.env.BOT_NAME}`, iconURL:process.env.ICON_URL})
        return collected.reply({ embeds: [error], components: [], ephemeral: true });
      } else {
        collector.stop();
      }
    });
    collector.on('end', async (collected: any) => {
      if (!collected.first()) {
        const delay: EmbedBuilder = new EmbedBuilder()
          .setColor('#2f3136')
          .setDescription(`<:F_arrows:1190482623542341762> **${opponent} n'a pas répondu**`)
          .setTimestamp()
          .setFooter({text:`${process.env.BOT_NAME}`, iconURL:process.env.ICON_URL})
        return responseMessage.edit({ embeds: [delay], components: [] });
      }
      collected.first().deferUpdate();
      switch (collected.first().customId) {
        case 'duel_yes':
          const start: EmbedBuilder = new EmbedBuilder()
            .setTitle(`${playerName} ⚔️ ${opponentName}`)
            .addFields(
              { name: `**${playerName}**`, value: `**${hpPlayer}** HP`, inline: true },
              { name: '|  ⁣    ⁣ VS    ⁣   |', value: '**|**  ⁣    ⁣ ⚡    ⁣   **|**', inline: true },
              { name: `**${opponentName}**`, value: `**${hpOpponent}** HP`, inline: true },
            )
            .setTimestamp()
            .setFooter({text:`${process.env.BOT_NAME}`, iconURL:process.env.ICON_URL})
          await interaction.editReply({ embeds: [start], components: [] });
          let turn: number = Math.floor(Math.random() * 2);
          while (hpPlayer > 0 && hpOpponent > 0) {
            turn++;
            await wait(1000);
            const damage: number = list[Math.floor(Math.random() * list.length)];
            if (turn % 2 === 0) {
              hpOpponent -= damage;
              const attack1: EmbedBuilder = new EmbedBuilder()
                .setTitle(`${playerName} ⚔️ ${opponentName}`)
                .setColor('#2C75FF')
                .setTimestamp()
                .setFooter({text:`${process.env.BOT_NAME}`, iconURL:process.env.ICON_URL})
              if (damage === 30) {
                attack1.addFields(
                  { name: `**${playerName}**`, value: `**${hpPlayer}** HP`, inline: true },
                  { name: '|    ⁣     ⁣     VS ⁣     ⁣     ⁣   |', value: `  ⁣   💥  DMG CRITIQUES -**${damage}** HP 💥 !`, inline: true },
                  { name: `**${opponentName}**`, value: `**${hpOpponent}** HP`, inline: true },
                );
              } else if (damage === 0) {
                hpOpponent = hpOpponent + 5;
                attack1.addFields(
                  { name: `**${playerName}**`, value: `**${hpPlayer}** HP`, inline: true },
                  { name: '|    ⁣    ⁣ VS    ⁣    ⁣ |', value: `      🛡️ PARER 🛡️ +5 HP !`, inline: true },
                  { name: `**${opponentName}**`, value: `**${hpOpponent}** HP`, inline: true },
                );
              } else {
                attack1.addFields(
                  { name: `**${playerName}**`, value: `**${hpPlayer}** HP`, inline: true },
                  { name: '|    ⁣    ⁣ VS    ⁣    ⁣ |', value: `    ⁣      ⁣  🤜 -${damage} HP 💥`, inline: true },
                  { name: `**${opponentName}**`, value: `**${hpOpponent}** HP`, inline: true },
                );
              }
              await interaction.editReply({ embeds: [attack1], components: [] });
            } else {
              hpPlayer -= damage;
              const attack2: EmbedBuilder = new EmbedBuilder()
                .setTitle(`${playerName} ⚔️ ${opponentName}`)
                .setColor('#FF0000')
                .setTimestamp()
                .setFooter({text:`${process.env.BOT_NAME}`, iconURL:process.env.ICON_URL})
              if (damage === 30) {
                attack2.addFields(
                  { name: `**${playerName}**`, value: `**${hpPlayer}** HP`, inline: true },
                  { name: '|    ⁣     ⁣   VS ⁣        ⁣   |', value: ` 💥 -${damage}HP DMG CRITIQUES  💥 !`, inline: true },
                  { name: `**${opponentName}**`, value: `**${hpOpponent}** HP`, inline: true },
                );
              } else if (damage === 0) {
                hpPlayer = hpPlayer + 5;
                attack2.addFields(
                  { name: `**${playerName}**`, value: `**${hpPlayer}** HP`, inline: true },
                  { name: '|    ⁣    ⁣ VS    ⁣    ⁣ |', value: ` +5 HP 🛡️ PARER 🛡️  !`, inline: true },
                  { name: `**${opponentName}**`, value: `**${hpOpponent}** HP`, inline: true },
                );
              } else {
                attack2.addFields(
                  { name: `**${playerName}**`, value: `**${hpPlayer}** HP`, inline: true },
                  { name: '|    ⁣    ⁣ VS    ⁣    ⁣ |', value: ` 💥 -${damage} HP 🤛`, inline: true },
                  { name: `**${opponentName}**`, value: `**${hpOpponent}** HP`, inline: true },
                );
              }
              await interaction.editReply({ embeds: [attack2], components: [] });
            }
          }
          if (hpOpponent <= 0) {
            const final = new EmbedBuilder()
              .setColor('#2f3136')
              .setImage('https://media.giphy.com/media/DffShiJ47fPqM/giphy.gif')
              .setDescription(`${player} **est le grand vaincqueur !**\n\nAvec **${hpPlayer}** HP restants`)
              .setTimestamp()
              .setFooter({text:`${process.env.BOT_NAME}`, iconURL:process.env.ICON_URL})
            await interaction.followUp({ embeds: [final] });
          } else {
            const final = new EmbedBuilder()
              .setColor('#2f3136')
              .setImage('https://media.giphy.com/media/DffShiJ47fPqM/giphy.gif')
              .setDescription(`${opponent} **est le grand vaincqueur !**\n\nAvec **${hpOpponent}** HP restants`)
              .setTimestamp()
              .setFooter({text:`${process.env.BOT_NAME}`, iconURL:process.env.ICON_URL})
            return interaction.followUp({ embeds: [final] });
          }
          break;
        case 'duel_no':
          const duelResponse: EmbedBuilder = new EmbedBuilder()
            .setColor('#2f3136')
            .setDescription(`<:F_arrows:1190482623542341762> **${opponent} a décliné ton offre**`)
            .setTimestamp()
            .setFooter({text:`${process.env.BOT_NAME}`, iconURL:process.env.ICON_URL})
          return responseMessage.edit({ embeds: [duelResponse], components: [] });
      }
    })
  }
}