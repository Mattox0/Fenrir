import {EmbedBuilder, SlashCommandBuilder} from "discord.js";
import fetch from "node-fetch";

module.exports = {
  name: "animals duck",
  example: "/animals duck",
  data: new SlashCommandBuilder()
    .setName('duck')
    .setDescription("Affiche la photo d'un canard"),
  async execute(interaction: any) {
    const wait: EmbedBuilder = new EmbedBuilder()
      .setColor('#2f3136')
      .setDescription('<:F_arrows:1190482623542341762> **Génération de votre image** <a:F_loading:1065616439836414063>')
      .setTimestamp()
      .setFooter({text: `${process.env.BOT_NAME}`, iconURL: process.env.ICON_URL})
    await interaction.reply({embeds: [wait]});
    fetch(`https://random-d.uk/api/v2/random`)
      .then((response: any) => response.json())
      .then((data: any) => {
        const duck: EmbedBuilder = new EmbedBuilder()
          .setColor('#2f3136')
          .setImage(data.url)
          .setTimestamp()
          .setFooter({text: `${process.env.BOT_NAME}`, iconURL: process.env.ICON_URL})
        return interaction.editReply({ embeds : [duck]});
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