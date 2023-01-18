const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed,  Permissions } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Reduit au silence un utilisateur')
        .addUserOption(option => option.setName('utilisateur').setDescription('Le fautif !').setRequired(true))
        .addStringOption(option => option.setName('durée').setDescription('Durée du mute | Exemple : 2h | (s->secondes,m->minutes,h->heures,j->jours) | Si rien -> permanent').setRequired(false))
        .addStringOption(option => option.setName('raison').setDescription('La raison du mute').setRequired(false)),
    async execute(...params) {
        let interaction = params[0];
        let db = params[4];
        let date = params[2];
        if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
            const fail = new MessageEmbed()
                .setColor('#2f3136')
                .setDescription('<a:LMT__arrow:831817537388937277> **Tu n\'as pas les permissions pour executer cette commande !** \n**Appelle une personne plus qualifiée qui pourra t\'aider**')
                .setThumbnail('https://cdn.discordapp.com/attachments/883117525842423898/899365869560430592/882249237486784522.gif')
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.reply({ embeds : [fail],ephemeral : true});
        }
        db.get("SELECT mute_id FROM servers WHERE guild_id = ?",interaction.member.guild.id, async(err, res) => {
            if (err || !res) {
                console.error(error);
                const echec = new MessageEmbed()
                    .setColor('#2f3136')
                    .setDescription(`<a:LMT__arrow:831817537388937277> **Il y a une erreur avec cette commande !**\n\n [Contactez le support !](https://discord.gg/p9gNk4u)`)
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                await interaction.reply({ embeds:[echec], ephemeral: true });
            }
            let mute;
            if (res.mute_id !== null) {
                mute = await interaction.member.guild.roles.cache.find(x => x.id === res.mute_id);
            }
            if (!mute) {
                mute = await interaction.member.guild.roles.create({
                    name: 'Muted',
                    color: '#666666',
                    reason: 'N\'y touche pas ! j\'en ai besoin pour les mutes',
                });
            }
            interaction.member.guild.channels.cache.forEach(x => {
                x.permissionOverwrites.edit(mute, { SEND_MESSAGES: false, ADD_REACTIONS:false});
            })
            let dateFin = new Date();
            let duree = interaction.options.getString('durée');
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
            let person = interaction.options.getUser('utilisateur');
            let raison = interaction.options.getString('raison');
            if (!raison) raison = "Aucune raison spécifiée";
            person = await interaction.member.guild.members.cache.find(x => x.id === person.id);
            person.roles.add(mute).then(member => {
                const win = new MessageEmbed()
                    .setColor('#2f3136')
                    .setDescription(`**${member} a été mute !\n\n${interaction.member} a décidé de vous faire taire, et sa sentence est __irrévocable__.**\n\n__Pour la raison suivante :__\n> ${raison}.\n\n__Durée :__\n> ${dureeString}`)
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                interaction.reply({embeds:[win]})
            }).catch(err => {
                console.log(err);
                const fail = new MessageEmbed()
                .setColor('#2f3136')
                .setDescription(`<a:LMT__arrow:831817537388937277> **Mon rôle doit être au dessus des autres pour que je puisse donner le rôle !**`)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                return interaction.reply({ embeds : [fail],ephemeral:true });
            });
            if (duree) {
                db.run("INSERT INTO mute (user_id, guild_id, end_date) VALUES (?,?,?)",person.user.id,interaction.member.guild.id,dateFin, (err) => {if (err) console.log(err)});
                new schedule.scheduleJob(dateFin, function() {
                    try {
                        db.run('DELETE FROM mute WHERE user_id = ? AND end_date = ?',person.user.id,dateFin, (err) => {if (err) throw err });
                        person.roles.remove(mute);
                    } catch (e) {
                        console.log(e);
                    }
                })
            }
        })
    }
}