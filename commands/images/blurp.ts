import {Attachment, EmbedBuilder, GuildMember, SlashCommandBuilder} from "discord.js";
import superagent from "superagent";

module.exports = {
  name: "blurp",
  example: "/images blurp",
  data: new SlashCommandBuilder()
    .setName('blurp')
    .setDescription("Affiche une image blurp")
    .addUserOption(option => option.setName('utilisateur').setDescription('La photo de profil de l\'utilisateur').setRequired(false))
    .addAttachmentOption(option => option.setName('image').setDescription('L\'image en question').setRequired(false))
    .addStringOption(option => option.setName('lien').setDescription('Le lien de votre image').setRequired(false)),
  async execute(interaction: any) {
    const wait: EmbedBuilder = new EmbedBuilder()
      .setColor('#2f3136')
      .setDescription('<:F_arrows:1190482623542341762> **Génération de votre image** <a:F_loading:1065616439836414063>')
      .setTimestamp()
      .setFooter({text: `${process.env.BOT_NAME}`, iconURL: process.env.ICON_URL})
    await interaction.reply({embeds: [wait]});
    const user: GuildMember = interaction.options.getUser('utilisateur');
    const attachment: Attachment = interaction.options.getAttachment('image');
    const link: string = interaction.options.getString('lien');
    let image: any;
    if (user) {
      image = user.displayAvatarURL({extension: 'png', size: 512, forceStatic: true});
    } else if (attachment) {
      image = attachment.url;
    } else if (link) {
      image = link;
    } else {
      image = interaction.user.displayAvatarURL({extension: 'png', size: 512, forceStatic: true});
    }
    superagent.get('https://nekobot.xyz/api/imagegen')
      .query({ type: 'blurpify', image: image})
      .end((err, response) => {
        if (err) {
          console.error(err);
          const errorEmbed: EmbedBuilder = new EmbedBuilder()
            .setColor('#ff0000')
            .setTitle('Oops !')
            .setURL(process.env.SUPPORT_URL as string)
            .setDescription(`Une erreur est survenue ! Contactez un administrateur si le problème persiste.`)
            .setTimestamp()
            .setFooter({text:`${process.env.BOT_NAME}`, iconURL:process.env.ICON_URL})
          return interaction.reply({embeds:[errorEmbed], ephemeral: true});
        }
        console.log(response);
        const blurp: EmbedBuilder = new EmbedBuilder()
          .setColor('#2f3136')
          .setImage(`${response.body.message}`)
          .setTimestamp()
          .setFooter({text:`${process.env.BOT_NAME}`, iconURL:process.env.ICON_URL})
        return interaction.editReply({content:'',embeds:[blurp]});
      })

  }
}