import {GuildMember, EmbedBuilder} from "discord.js";

module.exports = {
  name: "cry",
  example: "/cry <user>",
  async execute(interaction: any) {
    let person = interaction.options.getUser('utilisateur');
    if (!person) person = await interaction.member.guild.members.cache.random();
    else person = await interaction.member.guild.members.cache.find((x: GuildMember) => x.id === person.id);
    fetch('https://api.waifu.pics/sfw/cry')
      .then(r => r.json())
      .then(data => {
        const bite = new EmbedBuilder()
          .setColor('#2f3136')
          .setDescription(`<:F_arrows:1190482623542341762> ${interaction.member} **pleure** auprès de ${person}`)
          .setImage(data["url"])
          .setTimestamp()
          .setFooter({text:`${process.env.BOT_NAME}`, iconURL:process.env.ICON_URL})
        return interaction.reply({ embeds : [bite]});
      })
      .catch(async (e: any) => {
        console.log('error', e);
        const errorEmbed: EmbedBuilder = new EmbedBuilder()
          .setColor('#ff0000')
          .setTitle('Oops !')
          .setURL(process.env.SUPPORT_URL as string)
          .setDescription(`Une erreur est survenue ! Contactez un administrateur si le problème persiste.`)
          .setTimestamp()
          .setFooter({text:`${process.env.BOT_NAME}`, iconURL:process.env.ICON_URL})
        await interaction.reply({embeds:[errorEmbed], ephemeral: true});
      })
  }
}