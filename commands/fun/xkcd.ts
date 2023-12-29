import {ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder} from "discord.js";
import fetch from "node-fetch";

module.exports = {
  name: "xkcd",
  example: "/xkcd",
  data: new SlashCommandBuilder()
    .setName('xkcd')
    .setDescription('Affiche une BD aléatoire de xkcd'),
  async execute(interaction: ChatInputCommandInteraction) {
    fetch(`https://xkcd.com/${Math.floor(Math.random() * 2873)}/info.0.json`)
      .then(response => response.json())
      .then((body: any) => {
        const xkcdEmbed = new EmbedBuilder()
          .setColor('#FFFFFF')
          .setDescription(body.alt)
          .setTitle(body.safe_title)
          .setImage(body.img)
          .setTimestamp()
          .setFooter({text:`${process.env.BOT_NAME}`, iconURL:process.env.ICON_URL})
        return interaction.reply({embeds:[xkcdEmbed]});
      })
  }
}