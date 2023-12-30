import {ChatInputCommandInteraction, EmbedBuilder} from "discord.js";

module.exports = {
  name: "rate user",
  exemple: "/rate user <user>",
  async execute(interaction: ChatInputCommandInteraction, tab: string[]) {
    const user = interaction.options.getUser('utilisateur');
    console.log(user)
    const rateUser: EmbedBuilder = new EmbedBuilder()
      .setColor('#2f3136')
      .setDescription(`<:F_arrows:1190482623542341762> **${user} mérite ${tab[Math.floor(Math.random() * tab.length)]} !**`)
      .setTimestamp()
      .setFooter({text:`${process.env.BOT_NAME}`, iconURL:process.env.ICON_URL})
    await interaction.reply({embeds:[rateUser]})
  }
}