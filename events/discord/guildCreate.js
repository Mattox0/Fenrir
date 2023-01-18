const { MessageEmbed } = require("discord.js");

module.exports = {
	name: 'guildCreate',
	async execute(guild,client,Config,db) {
        let date = new Date();
        db.run('INSERT INTO servers (guild_id) VALUES (?)',guild.id, (err) => {if (err) return console.log(err)})
        let chann = guild.channels.cache.find(x => x.id === guild.systemChannelId);
        const bvn = new MessageEmbed()
            .setColor('#2f3136')
            .setDescription(`<a:LMT__arrow:831817537388937277> **Merci de m'avoir invité !**\n\n> **Pour avoir un aperçu de toutes les commandes :** \`/help\`\n> **Je ne fonctionne qu'avec des slashs commands !**\n> **Veillez à ce que le rôle everyone aie la permissions \`Utiliser des emojis externes\`, sinon les emojis du bot ne s'afficheront pas.**\n> **Pour toutes questions, le [support](https://discord.gg/p9gNk4u) est accessible, ou les MP du bot pour nous contacter directement.**\n> **Nous sommes friant de nouvelles idées d'améliorations** <:LMT_Agg:882250214050775090>`)
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        chann.send({embeds:[bvn]});
        let person = guild.members.cache.find(x => x.user.id === guild.ownerId);
        person.send({embeds:[bvn]});
    }
}