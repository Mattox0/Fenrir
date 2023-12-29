import {ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder} from "discord.js";
const wait = require('util').promisify(setTimeout);

module.exports = {
  name: "8ball",
  example: "/8ball <question>",
  data: new SlashCommandBuilder()
    .setName('8ball')
    .setDescription('Pose une question à la boule magique, elle te répondra !')
    .addStringOption(option =>
      option.setName('question')
        .setDescription('La question à poser à la boule magique')
        .setRequired(true)),
  async execute(interaction: ChatInputCommandInteraction) {
    let responses: string[] = ['Sans aucun doute','Malheuresement, c\'est sans espoir','Oui, sans aucune hésitation','Mes sources disent que non','Ne compte pas dessus','Oui !','Non !','Ptdr t\'es qui ?','Roh laisse moi','Bien sûr que oui !','Bien sûr que non !','Pourquoi tu poses cette question, t\'es jaloux ?','Eh tu prends la confiance fréro','Ouaiiiiiiis évidemment !','Non mais ptdr t\'es fou','Nooooooooooon','Je sais pas moi jsuis pas dieu','Laisse moi dormir !','T\'es trop curieux','Ouais t\'inquiètes','Cherche pas','C\'est non','Ouiiiiiiiiiiiiiiii','Et pourquoi pas ?'];
    const question: string = interaction.options.getString('question') as string;
    const responseEmbed: EmbedBuilder = new EmbedBuilder()
      .setColor('#2f3136')
      .setDescription(`:crystal_ball: :sparkles: *La boule magique réfléchit...* :sparkles: `)
      .setTimestamp()
      .setFooter({text:`${process.env.BOT_NAME}`, iconURL:process.env.ICON_URL})
    const response = await interaction.reply({embeds:[responseEmbed], fetchReply:true});
    await wait(3000);
    const responseEmbed2: EmbedBuilder = new EmbedBuilder()
      .setColor('#2f3136')
      .setDescription(`:crystal_ball: ${question} \n\n> ${responses[Math.floor(Math.random() * responses.length)]}`)
      .setTimestamp()
      .setFooter({text:`${process.env.BOT_NAME}`, iconURL:process.env.ICON_URL})
    await response.edit({embeds:[responseEmbed2]});
  }
}