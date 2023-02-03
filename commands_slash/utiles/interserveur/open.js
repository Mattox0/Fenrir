const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const schedule = require('node-schedule');

module.exports = {
    async execute(interaction, db, date, client) {
        let channel = interaction.options.getChannel('channel');
        if (!channel) channel = interaction.channel;
        if (channel.type !== "GUILD_TEXT") {
            const fail = new EmbedBuilder()
                .setColor('#2f3136')
                .setDescription('<a:LMT_arrow:1065548690862899240> **Le salon doit être __textuel__ !**')
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.reply({embeds:[fail],ephemeral:true});
        }
        db.all('SELECT code FROM interserveur', (err, res) => {
            if (err) return console.log(err);
            let tab = res.map(x => x = x.code);
            let code = "";
            while (tab.includes(code) || code === "") {
                let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                code = "";
                for (let i = 0; i < 6; ++i) {
                    code += charset.charAt(Math.floor(Math.random() * charset.length));
                }
            }
            db.run('INSERT INTO interserveur (guild_id_1, channel_id_1, code) VALUES (?,?,?)',interaction.member.guild.id, channel.id, code, (err) => {if (err) console.log(err);})
            let dateFin = new Date();
            dateFin.setMinutes(dateFin.getMinutes() + 5);
            const win = new EmbedBuilder()
                .setColor('#2F3136')
                .setDescription(`<a:LMT_arrow:1065548690862899240> **La connexion est mise en place !**\n\nFaites \`/interserveur join ${code}\` dans l'autre salon !\n\n> **Votre code :** \`${code}\``)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            interaction.reply({embeds:[win]});
            new schedule.scheduleJob(dateFin, async function() {
                db.get("SELECT * FROM interserveur WHERE code = ?", code, (err, res) => {
                    if (err) return
                    if (!res) return
                    db.run("DELETE FROM interserveur WHERE code = ?", code)
                })
            })
        })
    }
}