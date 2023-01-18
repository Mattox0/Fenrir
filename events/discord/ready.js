module.exports = {
	name: 'ready',
	once: true,
	execute(client,db) {
		client.user.setPresence({
            activities: [{
                name: "la vie du serveur.",
                type: 'WATCHING'
            }],
            status: 'online'
        })
        console.log('Bonjour! :D')

        client.events.get('readygiveaways').execute(db,client)
        client.events.get('readyremindme').execute(db,client)
        client.events.get('readyremindmembers').execute(db,client)
        client.events.get('readybans').execute(db,client)
        client.events.get('readymutes').execute(db,client)
        client.events.get('readyguilds').execute(db,client)
        client.events.get('readypoll').execute(db,client)
	}
};