const {MessageEmbed, Permissions, MessageActionRow, MessageButton} = require('discord.js');
let date = new Date()
const fs = require('fs');

module.exports = {
    name:'ticket_save',
    description:'Sauvegarde la discussion en tt',
    async execute(...params) {
        let interaction = params[0];
        let db = params[3];
        try {
            chann = await interaction.member.guild.channels.cache.find(channel => channel.id === interaction.channelId);
            let last_id;
            let allMessages = [];
            while (true) {
                let options = { limit : 100};
                if (last_id) {
                    options.before = last_id;
                }
                const messages = await chann.messages.fetch(options);
                messages.forEach(message => {
                    if (message.content !== '') {
                        allMessages.push(`${message.author.username} : ${message.content}`)
                    }
                });
                last_id = messages.last().id;
                if (messages.size !== 100) {
                    break;
                }
            }
            allMessages.push("==== MESSAGES ====")
            allMessages.reverse();
            fs.writeFileSync("./messages.txt",allMessages.join("\n\n"))
        
            await interaction.reply({content:'Une sauvegarde des messages :',files:["./messages.txt"]});
            fs.unlinkSync("./messages.txt");
        } catch (e) {
            console.log(e);
            return interaction.reply({content:'Désolé il y a eu une erreur'});
        }
    }
}