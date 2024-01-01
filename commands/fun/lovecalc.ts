import {
  AttachmentBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  GuildMember,
  SlashCommandBuilder,
  User
} from "discord.js";
import Canvas from "@napi-rs/canvas";
import fs from "fs";
import path from "path";

module.exports = {
  name: "lovecalc",
  example: "/lovecalc <user1> <user2>",
  data: new SlashCommandBuilder()
    .setName('lovecalc')
    .setDescription('Calcule le pourcentage d\'amour entre deux personnes')
    .addUserOption(option => option.setName('utilisateur1').setDescription('Le premier utilisateur').setRequired(false))
    .addUserOption(option => option.setName('utilisateur2').setDescription('Le deuxième utilisateur').setRequired(false)),
  async execute(interaction: any) {
    let player1: GuildMember = interaction.options.getUser('utilisateur1') as GuildMember;
    let player2: GuildMember | null = interaction.options.getUser('utilisateur2');
    if (!player1 && !player2) {
      player1 = interaction.member;
      player2 = await interaction.member.guild.members.cache.random();
    } else if (player1 && !player2) {
      player2 = await interaction.member.guild.members.cache.find((x: User) => x.id === player1?.id);
      player1 = interaction.member;
    } else if (!player1 && player2) {
      player1 = await interaction.member.guild.members.cache.find((x: User) => x.id === player2?.id);
      player2 = interaction.member;
    } else {
      player1 = await interaction.member.guild.members.cache.find((x: User) => x.id === player1?.id);
      player2 = await interaction.member.guild.members.cache.find((x: User) => x.id === player2?.id);
    }
    if (!player1 || !player2) {
      const error: EmbedBuilder = new EmbedBuilder()
        .setColor('#2f3136')
        .setDescription('Merci de rentrer des utilisateurs valides')
        .setTimestamp()
        .setFooter({text:`${process.env.BOT_NAME}`, iconURL:process.env.ICON_URL})
      return interaction.reply({embeds:[error]})
    }
    let love: number = Math.round(Math.random() * 100);
    let phrase;
    if (love >= 100) {
      phrase = "Il va falloir commencer à penser au mariage. Préparez les invitations !";
    } else if (love > 90) {
      phrase = "Très bon score ! Continuez en MP !";
    } else if (love > 80) {
      phrase = "Il y a de l'amour dans l'air par ici ...";
    } else if (love > 70) {
      phrase = "Pas mal du tout, il faut approfondir cette relation...";
    } else if (love > 60) {
      phrase = "Il ne faut pas perdre espoir !";
    } else if (love > 50) {
      phrase = "Tout est possible, tente donc ta chance !";
    } else if (love > 40) {
      phrase = "Sans plus, à voir par la suite !";
    } else if (love > 30) {
      phrase = "Bienvenue dans la friendzone !";
    } else if (love > 20) {
      phrase = "Il vaut mieux que vous vous éloignez.";
    } else if (love > 10) {
      phrase = "Il vaut mieux que vous ne vous cotoyez pas.";
    } else if (love >= 0) {
      phrase = "Tu n'aurais pas envie de lui mettre ton poing dans son visage ?";
    }
    if (player1.id === player2.id) {
      love = 100;
      phrase = `Tu es bien narcissique ${player1}, voici un miroir pour toi : <:F_mirror:1191505634550632578>.`;
    }
    const imagesDirectory: string = path.join(__dirname, '..', '..', 'images', 'lovecalc');
    const slashFiles: string[] = fs.readdirSync(imagesDirectory);
    const canvas: Canvas.Canvas = Canvas.createCanvas(384, 128);
    const ctx:Canvas.SKRSContext2D = canvas.getContext('2d');
    const person1: Canvas.Image = await Canvas.loadImage(player1.user.displayAvatarURL({ extension:'png', size: 128 }));
    ctx.drawImage(person1, 0, 0, 128, 128);
    const coeur: Canvas.Image = await Canvas.loadImage(path.join(imagesDirectory, slashFiles[Math.floor(Math.random() * slashFiles.length)]));
    ctx.drawImage(coeur, 128, 0, 128, 128);
    const person2: Canvas.Image = await Canvas.loadImage(player2.user.displayAvatarURL({ extension:'png', size: 128 }));
    ctx.drawImage(person2, 256, 0, 128, 128);
    const attachment: AttachmentBuilder = new AttachmentBuilder(await canvas.encode('png'), { name: 'love-image.png' })
    const loved: EmbedBuilder = new EmbedBuilder()
      .setColor('#2f3136')
      .setDescription(`**${player1}** + **${player2}** = **${love}%** d'amour :heart:
      \n<:F_arrows:1190482623542341762> ${phrase}\n`)
      .setImage('attachment://love-image.png')
      .setTimestamp()
      .setFooter({text:`${process.env.BOT_NAME}`, iconURL:process.env.ICON_URL})
    return interaction.reply({embeds:[loved], files:[attachment]})
  }
}