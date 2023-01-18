const { MessageEmbed } = require("discord.js");

module.exports = {
	name: 'guildDelete',
	async execute(guild,client,Config,db) {
        let date = new Date();
        db.run('DELETE FROM servers WHERE guild_id = ?',guild.id, (err) => {if (err) return console.log(err)})
        const bvn = new MessageEmbed()
            .setColor('#2f3136')
            .setDescription(`<a:LMT__arrow:831817537388937277> **Nous sommes déçu que vous ayez décidé de vous séparer de nous !\n\n> Quelque chose vous as dérangé ?\n> Pouvez nous arranger cela ?\n\n> Contacter le [support](https://discord.gg/p9gNk4u) ou les MP du bot et donnez nous votre ressenti !\n> En espérant que vous ayez été conquis !**`)
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        let person = guild.members.cache.find(x => x.user.id === guild.ownerId);
        person.send({embeds:[bvn]});
    }
}