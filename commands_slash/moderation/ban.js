const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed,  Permissions, MessageAttachment } = require("discord.js");
const schedule = require('node-schedule')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bannit un utilisateur')
        .addUserOption(option => option.setName('utilisateur').setDescription('Le fautif :)').setRequired(true))
        .addStringOption(option => option.setName('durée').setDescription('Durée du bannissement | Exemple : 30j | (m->minutes,h->heures,j->jours,M->mois)').setRequired(false))
        .addStringOption(option => option.setName('raison').setDescription('La raison du bannissement').setRequired(false))
        .addBooleanOption(option => option.setName('purge').setDescription('Souhaitez vous purger les messages ?').setRequired(false)),
    async execute(...params) {
        let interaction = params[0];
        let date = params[2];
        let db = params[4];
        if (!interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
            const fail = new MessageEmbed()
                .setColor('#2f3136')
                .setDescription('<a:LMT__arrow:831817537388937277> **Tu ne peux pas faire justice toi-même !** \n**Appelle une personne plus qualifiée qui pourra t\'**\n**aider dans la démarche du bannissement**')
                .setThumbnail('https://cdn.discordapp.com/attachments/883117525842423898/899365869560430592/882249237486784522.gif')
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.reply({ embeds : [fail],ephemeral : true});
        }
        let person = interaction.options.getUser('utilisateur');
        let raison = interaction.options.getString('raison');
        let duree = interaction.options.getString('durée');
        if (!raison) raison = "Aucune raison n'a été donnée";
        let dateFin = new Date();
        const fail = new MessageEmbed()
            .setColor('#2f3136')
            .setDescription(`<a:LMT__arrow:831817537388937277> **Il faut mettre une tranche horaire correcte**\n\n> \`/ban <user> 1M30j\`\n> \`(m->minutes,h->heures,j->jours,M->mois)\`\n> \`si tu ne met rien, ce sera pour toujours\``)
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        if (duree) {
            let time = "";let day=0;let heure = 0; let minute = 0; let mois = 0;
            for (x of duree) {
                if (x === 'j') {day = time.replace(/[^0-9]/g, '');time ="";if (day=="") return interaction.reply({embeds:[fail],ephemeral:true});continue};
                if (x === "h") {heure = time.replace(/[^0-9]/g, '');time="";if (heure=="") return interaction.reply({embeds:[fail],ephemeral:true});continue};
                if (x === "m") {minute = time.replace(/[^0-9]/g, '');time="";if (minute=="") return interaction.reply({embeds:[fail],ephemeral:true});continue};
                if (x === "M") {mois = time.replace(/[^0-9]/g, '');time="";if (mois=="") return interaction.reply({embeds:[fail],ephemeral:true});continue};
                time += x;
            }
            if (time != "") return interaction.reply({embeds:[fail], ephemeral:true});
            if (day>0) dateFin.setDate(dateFin.getDate() + parseInt(day));
            if (heure>0) dateFin.setHours(dateFin.getHours() + parseInt(heure)); 
            if (minute>0) dateFin.setMinutes(dateFin.getMinutes() + parseInt(minute));
            if (mois>0) dateFin.setMonth(dateFin.getMonth() + parseInt(mois));
            dureeString = `Jusqu'au : <t:${Math.ceil(dateFin / 1000)}:F>.`
        } else {
            dureeString = "Permanent.";
        }
        person = await interaction.member.guild.members.cache.find(x => x.id === person.id);
        let purge = interaction.options.getBoolean('purge');
        if (purge) daysPurge = 7;
        else daysPurge = 0;
        person.ban({reason : raison, days : daysPurge}).then((member) => {
            const ban = new MessageEmbed()
                .setColor('#2f3136')
                .setDescription(`**${member} a été banni !\n\n${interaction.member} a décidé de vous éliminer, et sa sentence est __irrévocable__.**\n\n__Pour la raison suivante :__\n> ${raison}.\n\n__Durée :__\n> ${dureeString}`)
                .setThumbnail('https://cdn.discordapp.com/attachments/883117525842423898/920829502861492314/727224531021987880.png')
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.reply({ embeds : [ban]});
        }).catch((e) => {
            console.log(e)
            const fail = new MessageEmbed()
            .setColor('#2f3136')
            .setDescription(`<a:LMT__arrow:831817537388937277> **Mon rôle doit être au dessus des autres pour que je puisse ban**`)
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.reply({ embeds : [fail],ephemeral:true });
        });
        if (duree) {
            db.run("INSERT INTO bans (user_id, guild_id, deban) VALUES (?,?,?)",person.user.id,interaction.member.guild.id,dateFin, (err) => {if (err) console.log(err)});
            new schedule.scheduleJob(dateFin, function() {
                try {
                    db.run('DELETE FROM bans WHERE user_id = ?',person.user.id, (err) => {if (err) throw err });
                    interaction.member.guild.members.unban(person.user);
                } catch (e) {
                    console.log(e);
                }
            })
        }
    }
}