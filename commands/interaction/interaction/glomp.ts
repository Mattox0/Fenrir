import {GuildMember, EmbedBuilder} from "discord.js";

module.exports = {
  name: "glomp",
  example: "/glomp",
  async execute(interaction: any) {
    fetch('https://api.waifu.pics/sfw/glomp')
      .then(r => r.json())
      .then(data => {
        const blush = new EmbedBuilder()
          .setColor('#2f3136')
          .setDescription(`<:F_arrows:1190482623542341762> ${interaction.member} **glousse** !`)
          .setImage(data["url"])
          .setTimestamp()
          .setFooter({text:`${process.env.BOT_NAME}`, iconURL:process.env.ICON_URL})
        return interaction.reply({ embeds : [blush]});
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