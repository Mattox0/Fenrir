const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require("discord.js");
const schedule = require('node-schedule')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remindme')
        .setDescription('Active un rappel !')
        .addStringOption(option => option.setName('temps').setDescription('Combien de temps | Exemple : 30m | (s->secondes,m->minutes,h->heures,j->jours)').setRequired(true))
        .addStringOption(option => option.setName('raison').setDescription('Quelle est la raison | Exemple : faire des pâtes').setRequired(false)),
    async execute(...params) {
        let interaction = params[0];
        let date = params[2];
        let db = params[4];
        let raison = interaction.options.getString('raison');
        let temps = interaction.options.getString('temps');
        if (!raison) raison = "Rappel";
        const fail = new EmbedBuilder()
            .setColor('#2f3136')
            .setDescription(`<a:LMT_arrow:1065548690862899240> **Il faut mettre une tranche horaire correcte**\n\n> /remindme 1h30m\n> /remindme 1h30m10s Faire des pâtes`)
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        if (!(temps.endsWith('d') || temps.endsWith('h') || temps.endsWith('m') || temps.endsWith('s'))) {
            return interaction.reply({embeds:[fail],ephemeral:true});
        }
        let time = "";let day=0;let heure = 0; let minute = 0; let seconde = 0;
        for (x of temps) {
            if (x === 'j') {day = time.replace(/[^0-9]/g, '');time ="";if (day=="") return interaction.reply({embeds:[fail],ephemeral:true});continue};
            if (x === "h") {heure = time.replace(/[^0-9]/g, '');time="";if (heure=="") return interaction.reply({embeds:[fail],ephemeral:true});continue};
            if (x === "m") {minute = time.replace(/[^0-9]/g, '');time="";if (minute=="") return interaction.reply({embeds:[fail],ephemeral:true});continue};
            if (x === "s") {seconde = time.replace(/[^0-9]/g, '');time="";if (seconde=="") return interaction.reply({embeds:[fail],ephemeral:true});continue};
            time += x;
        }
        if (time != "") return interaction.reply({embeds:[fail], ephemeral:true});
        let dateFin = new Date();
        if (day>0) dateFin.setDate(dateFin.getDate() + parseInt(day));
        if (heure>0) dateFin.setHours(dateFin.getHours() + parseInt(heure)); 
        if (minute>0) dateFin.setMinutes(dateFin.getMinutes() + parseInt(minute));
        if (seconde>0) dateFin.setSeconds(dateFin.getSeconds() + parseInt(seconde));
        db.run('INSERT INTO remindme(dateFin,user_id,raison,message_id,guild_id) VALUES (?,?,?,?,?)',dateFin,interaction.user.id,raison,interaction.id,interaction.member.guild.id, (err) => {if (err) console.log(err)})
        const rappel = new EmbedBuilder()
            .setColor('#2f3136')
            .setDescription(`<a:LMT_arrow:1065548690862899240> **Votre rappel a été enregistré pour** <t:${Math.floor((+ dateFin) / 1000)}:F>`)
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        await interaction.reply({ embeds:[rappel]});
        new schedule.scheduleJob(dateFin, function() {
            interaction.member.send(`**Tu avais demandé un rappel** : ${raison}`);
            db.run('DELETE FROM remindme WHERE message_id = ?',interaction.id, (err) => {if (err) console.log(err) });
        })
    }
}