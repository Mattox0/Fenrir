const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
    async execute(interaction, date, db) {
        let person = interaction.options.getUser('utilisateur');
        let raison = interaction.options.getString('raison');
        if (!raison) raison = "Aucune raison spécifiée";
        db.all("SELECT * FROM warns", (err, res) => {
            let tab = res.map(x => x = x.warn_id)
            let warn_id = "";
            while (tab.includes(warn_id) || warn_id === "") {
                let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                warn_id = "";
                for (let i = 0; i < 10; ++i) {
                    warn_id += charset.charAt(Math.floor(Math.random() * charset.length));
                }
            }
            db.run("INSERT INTO warns (warn_id,user_id, guild_id, modo_id, warn_date,raison) VALUES (?,?,?,?,?,?)",warn_id,person.id,interaction.member.guild.id,interaction.member.id,new Date(),raison, (err) => {if (err) console.log(err)})
            const win = new MessageEmbed()
                .setColor('#2f3136')
                .setDescription(`<a:LMT__arrow:831817537388937277> **${person} a été averti !**`)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            interaction.reply({embeds:[win]});
            try {
                person.send({content:`Tu as été averti pour la raison suivante :\n\n> \`${raison}\``});
            } catch (e) {
                console.log(e);
            }
        })
    }
}