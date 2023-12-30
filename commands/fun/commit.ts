import {ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder} from "discord.js";
import got from "got";
import jsdom from "jsdom";

module.exports = {
  name: "commit",
  exemple: "/commit",
  data: new SlashCommandBuilder()
    .setName('commit')
    .setDescription('Génère un message de commit aléatoire'),
  async execute(interaction: ChatInputCommandInteraction) {
    const vgmUrl: string = `http://whatthecommit.com`;
    const response = await got(vgmUrl);
    const dom = new jsdom.JSDOM(response.body);
    const nodeList = [...dom.window.document.querySelectorAll('p')];
    const embed: EmbedBuilder = new EmbedBuilder()
      .setColor('#2f3136')
      .setDescription(`<:F_arrows:1190482623542341762> **${nodeList[0].textContent}**`)
      .setTimestamp()
      .setFooter({text:`${process.env.BOT_NAME}`, iconURL:process.env.ICON_URL})
    return interaction.reply({embeds:[embed]});
  }
}