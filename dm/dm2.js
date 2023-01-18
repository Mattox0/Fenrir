const moment = require('moment');

module.exports = {
    name:'dm2',
    description:'',
    async execute(...params) {
        let message = params[0];
        let chann = params[5];
        let a = await message.channel.messages.fetch();
        msgs = Array.from(a);
        let date = new Date();
        date.setDate(date.getDate() - 2);
        if (!msgs[1]) {
            message.author.send(`**Un modérateur va te répondre sous peu de temps, merci d'attendre...**`);
        } else if (!msgs[1][1] || new Date(msgs[1][1].createdTimestamp) < date) {
            message.author.send(`**Un modérateur va te répondre sous peu de temps, merci d'attendre...**`);
        }
        chann.send(`\`${message.author.id}\` \n**${message.author.username}** :\n > ${message.content}`)
    }
}