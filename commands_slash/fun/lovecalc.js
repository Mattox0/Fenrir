const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageAttachment } = require("discord.js");
const Canvas = require('canvas');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lovecalc')
        .setDescription('Calcule la comptabilité entre vous et un autre utilisateur')
        .addUserOption(option => option.setName('utilisateur').setDescription('Personne avec qui vous voulez tester votre comptabilité | Si rien -> Vous et une personne aléatoire').setRequired(false))
        .addUserOption(option => option.setName('utilisateur2').setDescription('Personne avec qui vous voulez tester la comptabilité avec la première personne').setRequired(false)),
    async execute(...params) {
        let interaction = params[0];
        let date = params[2];
        let player1 = interaction.options.getUser('utilisateur');
        let player2 = interaction.options.getUser('utilisateur2');
        if (!player1 && !player2) {
            player1 = interaction.member;
            player2 = await interaction.member.guild.members.cache.random();
        } else if (player1 && !player2) {
            player2 = await interaction.member.guild.members.cache.find(x => x.id === player1.id);
            player1 = interaction.member;
        } else if (!player1 && player2) {
            player2 = interaction.member;
            player1 = await interaction.member.guild.members.cache.find(x => x.id === player2.id);
        } else {
            player1 = await interaction.member.guild.members.cache.find(x => x.id === player1.id);
            player2 = await interaction.member.guild.members.cache.find(x => x.id === player2.id);
        }
        let love = Math.round(Math.random() * 100);
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
            phrase = "Tu n'aurais pas envie de lui mettre ton poingt dans son visage ?";
        };
        if (player1.nickname) nick1 = player1.nickname;
        else nick1 = player1.user.username;
        if (player2.nickname) nick2 = player2.nickname;
        else nick2 = player2.user.username;
        tab = ['montagne','Jesus','lignes','hand_love','couple','emoji_love','wedding','pouce','cat','angel','heart_2']
        const canvas = Canvas.createCanvas(384, 128);
        const ctx = canvas.getContext('2d');
        const person1 = await Canvas.loadImage(player1.user.displayAvatarURL({ format:'png',size: 128, dynamic: false }));
        ctx.drawImage(person1, 0, 0, 128, 128);
        const coeur = await Canvas.loadImage(`./Images/${tab[Math.floor(Math.random() * tab.length)]}.png`);
        ctx.drawImage(coeur, 128, 0, 128, 128);
        const person2 = await Canvas.loadImage(player2.user.displayAvatarURL({ format:'png',size: 128, dynamic : false}));
        ctx.drawImage(person2, 256, 0, 128, 128);
        const attachment = new MessageAttachment(canvas.toBuffer(), 'love-image.png')
        const loved = new MessageEmbed()
            .setColor('#2f3136')
            .setDescription(`**${nick1}** + **${nick2}** = **${love}%** d'amour :heart:\n\n> ${phrase}\n`)
            .setImage('attachment://love-image.png')
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        return interaction.reply({embeds:[loved], files:[attachment]})
    }
}