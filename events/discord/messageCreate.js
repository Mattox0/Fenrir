const { DMChannel } = require('discord.js')
let date = new Date()

module.exports = {
	name: 'messageCreate',
	execute(message,client,Config,db) {
        client.events.get('interserveur').execute(message, message.content.split(" "), date, db, client);    
		let chann = client.channels.cache.get('906228965604229190');
        if (message.channel instanceof DMChannel && !message.author.bot) client.commands.get('dm2').execute(message, message.content.split(" "), date, db , client, chann);
        if (message.channel == chann && !message.author.bot) client.commands.get('dm').execute(message, message.content.split(" "), date, db , client);
        return;
	}
};