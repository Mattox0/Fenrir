const { EmbedBuilder } = require("discord.js");

module.exports = {
    async execute(interaction, db, date) {
        db.query("SELECT * FROM servers WHERE guild_id = ?", interaction.member.guild.id, (err, res) => {
            if (err) return console.log(err);
            if (res.length === 0) return;
            res = res[0];
            description = `<a:LMT_arrow:1065548690862899240> **Voici tous les systèmes de votre serveur :**\n\n\`/setup\`\n\n`
            description += `> ${res.logs_id != null ? '✅' : '❌'} | Logs \n`;
            description += `> ${res.ticket_id != null ? '✅' : '❌'} | Tickets \n`;
            description += `> ${res.stats_id != null ? '✅' : '❌'} | Stats \n`;
            description += `> ${res.prison_id != null ? '✅' : '❌'} | Prison \n`;
            description += `> ${res.anniv_id != 0 ? '✅' : '❌'} | Anniversaires \n`;
            description += `> ${res.suggestion_id != null ? '✅' : '❌'} | Suggestions \n`;
            const infos = new EmbedBuilder()
                .setColor('#2f3136')
                .setDescription(description)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.reply({embeds:[infos]});
        })
    }
}