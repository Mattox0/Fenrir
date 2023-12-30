import {EmbedBuilder} from "discord.js";

module.exports = {
  name: "rate something",
  exemple: "/rate something <text>",
  async execute(interaction: any, tab: string[]) {
    const text = interaction.options.getString('note');
    const rateUser: EmbedBuilder = new EmbedBuilder()
      .setColor('#2f3136')
      .setDescription(`<:F_arrows:1190482623542341762> **${text} mérite ${tab[Math.floor(Math.random() * tab.length)]} !**`)
      .setTimestamp()
      .setFooter({text:`${process.env.BOT_NAME}`, iconURL:process.env.ICON_URL})
    await interaction.reply({embeds:[rateUser]})
  }
}