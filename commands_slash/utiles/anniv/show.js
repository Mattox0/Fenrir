const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
    async execute(interaction, date, db) {
        let person = interaction.options.getUser('utilisateur');
        let moi = false
        if (!person) {person = interaction.member.user;moi=true;};
        console.log(person.id);
        let listemois = ["janvier","février","mars","avril","mai","juin","juillet","aout","septembre","novembre","octobre","décembre"];
        db.get("SELECT date FROM anniversaires WHERE user_id = ?",person.id, (err, res) => {
            console.log(res)
            if (err || !res) {
                const fail = new MessageEmbed()
                    .setColor('#2f3136')
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                if (!moi) fail.setDescription('<a:LMT__arrow:831817537388937277> **L\'utilisateur demandé n\'a encore enregistré son anniversaire !**')
                else fail.setDescription('<a:LMT__arrow:831817537388937277> **Tu n\'as pas encore enregistré ton anniversaire !**')
                return interaction.reply({embeds:[fail],ephemeral:true});
            }
            let dates = res.date.split('/');
            const win = new MessageEmbed()
                .setColor('#2f3136')
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            if (!moi) win.setDescription(`<a:LMT__arrow:831817537388937277> L\'anniversaire de ${person} est le **${dates[0]} ${listemois[parseInt(dates[1]) -1]}**`)
            else win.setDescription(`<a:LMT__arrow:831817537388937277> Ton anniversaire est le **${dates[0]} ${listemois[parseInt(dates[1]) -1]}**`)
            return interaction.reply({embeds:[win]});
        })
    }
}