const { EmbedBuilder } = require("discord.js");

module.exports = {
	name: 'messageUpdate',
	async execute(...params) {
        let oldMessage = params[0];
        let newMessage = params[1];
        let db = params[2];
        let date = new Date()
        db.get("SELECT messageUpdate, logs_id FROM logs WHERE guild_id = ?",newMessage.guild.id, async (err, res) => {
            if (err) {return console.log(err) }
            if (!res) return
            if (res.messageUpdate) {
                let chann = await newMessage.guild.channels.cache.find(x => x.id === res.logs_id);
                if (!chann) return;
                if (oldMessage.content === newMessage.content) return;
                const event = new EmbedBuilder()
                    .setColor('#2f3136')
                    .setThumbnail(newMessage.author.displayAvatarURL({dynamic:true}))
                    .setAuthor({name:`${newMessage.author.username}#${newMessage.author.discriminator}`, iconURL:`${newMessage.author.displayAvatarURL()}`})
                    .setDescription(`<a:LMT_arrow:1065548690862899240> **Le [message](https://discord.com/channels/${newMessage.guild.id}/${newMessage.channel.id}/${newMessage.id}) de ${newMessage.author} a été modifié dans ${newMessage.channel}**\n\n**Message ID** : ${newMessage.id}\n\n**Date de suppression :** <t:${Math.ceil(date / 1000)}:F>`)
                    .addFields(
                        {name:'Ancien message', value : oldMessage.content ? oldMessage.content : "❌", inline: true},
                        {name:'Nouveau message', value : newMessage.content ? newMessage.content : "❌", inline: true}
                    )
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                return chann.send({embeds:[event]});
            }
        })
    }
}      