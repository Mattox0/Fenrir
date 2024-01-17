import {
  ActionRowBuilder, ButtonBuilder, ButtonStyle,
  EmbedBuilder,
  GuildMember,
  SlashCommandBuilder,
  SlashCommandUserOption,
  time
} from "discord.js";

module.exports = {
  name: "puissance4",
  example: "/puissance4 <user>",
  data: new SlashCommandBuilder()
    .setName('puissance4')
    .setDescription('Lance une partie de puissance 4')
    .addUserOption((option: SlashCommandUserOption) => option.setName('user').setDescription('L\'utilisateur à défier').setRequired(true)),
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


    });
  }
}

// const date = new Date();
// date.setSeconds(date.getSeconds() + 5);
// interaction.reply(time(date, 'R')) // cooldown