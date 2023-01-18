const schedule = require('node-schedule');
const { MessageEmbed } = require('discord.js')

module.exports = {
    name:'readyremindmembers',
    description:'Refresh les remind members',
    async execute(...params) {
        let db = params[0];
        let client = params[1];
        db.each('SELECT * FROM reminderMember', async (err, result) => {
            try {
                let guild = await client.guilds.cache.get("707953787477688360");
                let person = await guild.members.cache.find(member => member.id === result.user_id);
                if (person) {
                    if (result.dateFin < new Date()) {
                        const remind = new MessageEmbed()
                            .setColor('#2f3136')
                            .setThumbnail('https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp')
                            .setFooter({text:`LMT-Bot ・ Merci de faire partie de cette magnifique communauté`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                            .setDescription('<a:LMT__arrow:831817537388937277> **Bonjour à toi !**\n\nCa fait une semaine que tu as rejoint le serveur de **La meute**\n\nNotre objectif est de fournir pour ses membres la meilleur expérience possible ainsi que des services de qualité.\n\n> N\'hésites pas à venir nous passer un petit coucou dans <#708012118619717783> !\n\n> Nous te remercions de faire partie de notre communauté !')
                        person.send({embeds:[remind]})
                        db.run('DELETE FROM reminderMember WHERE user_id = ?',result.user_id, (err) => {if (err) console.log(err) });
                    } else {
                        new schedule.scheduleJob(result.dateFin, async function() {
                            let person = await guild.members.cache.find(member => member.id === result.user_id);
                            if (person) {
                                const remind = new MessageEmbed()
                                    .setColor('#2f3136')
                                    .setThumbnail('https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp')
                                    .setFooter({text:`LMT-Bot ・ Merci de faire partie de cette magnifique communauté`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                                    .setDescription('<a:LMT__arrow:831817537388937277> **Bonjour à toi !**\n\nCa fait une semaine que tu as rejoint le serveur de **La meute**\n\nNotre objectif est de fournir pour ses membres la meilleur expérience possible ainsi que des services de qualité.\n\n> N\'hésites pas à venir nous passer un petit coucou dans <#708012118619717783> !\n\n> Nous te remercions de faire partie de notre communauté !')
                                person.send({embeds:[remind]})
                            }
                            db.run('DELETE FROM reminderMember WHERE user_id = ?',result.user_id, (err) => {if (err) console.log(err) })
                        })
                    }
                } else {
                    db.run('DELETE FROM reminderMember WHERE user_id = ?',result.user_id, (err) => {if (err) console.log(err) });
                }
            } catch(e) {
                console.log(e)
                db.run('DELETE FROM reminderMember WHERE user_id = ?',result.user_id, (err) => {if (err) console.log(err) })
            }
        })
    }
}