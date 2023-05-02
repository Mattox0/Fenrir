const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js")
const client = new Client({ partials: [Partials.Channel, Partials.Message], intents: [ GatewayIntentBits.MessageContent ,GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildBans, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildMembers, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildPresences] })
const fs = require("fs");
const Config = require("./config.json");
const { createConnection } = require('mysql2');
const schedule = require('node-schedule');
require('./deploy_commands').build();

let con = createConnection(Config.mysql);

con.connect(err => {
    // Console log if there is an error
    if (err) return console.log(err);

    // No error found?
    console.log(`Database has been connected!`);
});

console.log("------- SCHEDULE ---------")
// !! BIRTHDAY
schedule.scheduleJob('0 0 0 * * *', function() {
    con.query("SELECT * FROM anniversaires INNER JOIN servers ON anniversaires.guild_id = servers.guild_id", async (err, rows) => {
        if (err) {
            return console.log(err);
        }
        if (rows.length === 0) return;
        for (let res of rows) {
            console.log(res);
            let date = new Date();
            if (res.anniv_id !== 1) {
                return;
            }
            let dates = res.date.split('/');
            let guild = client.guilds.cache.get(res.guild_id);
            const role = guild.roles.cache.find(role => role.id === res.anniv_role_id);
            const channel = guild.channels.cache.find(channel => channel.id === res.anniv_channel_id);
            if (dates[0] == date.getDate() && dates[1] == date.getMonth() + 1) {
                let user = await guild.members.fetch(res.user_id);
                user.roles.add(role).catch(err => console.log(err)).then(user => {
                    const anniv = new EmbedBuilder()
                        .setColor('#2f3136')
                        .setDescription(`<a:LMT_arrow:831817537388937277> **C\'est l\'anniversaire de ${user} !**\nSouhaitez lui un bon anniversaire !`)
                        .setThumbnail('https://cdn.discordapp.com/attachments/708012118619717783/901498201629143120/882249649736527892.gif')
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    return channel.send({embeds:[anniv]});
                })
            }
        }
    })
});
console.log(`| addAnniv ✅`)
schedule.scheduleJob('0 59 23 * * *', function() {
    con.query("SELECT * FROM anniversaires INNER JOIN servers ON anniversaires.guild_id = servers.guild_id", async (err, rows) => {
        if (err) {
            return console.log(err);
        }
        if (rows.length === 0) return;
        for (let res of rows) {
            if (res.anniv_id !== 1) {
                return
            }
            let date = new Date();
            let dates = res.date.split('/');
            let guild = client.guilds.cache.get(res.guild_id);
            const role = guild.roles.cache.find(role => role.id === res.anniv_role_id)
            if (dates[0] == date.getDate() && dates[1] == date.getMonth()+1) {
                let user = await guild.members.fetch(res.user_id)
                user.roles.remove(role).catch(err => console.log(err))
            }
        }
    });
});
console.log(`| removeAnniv ✅`)

// SERVER STATS
schedule.scheduleJob('*/5 * * * *', async function() {
    require(`./events/interraction/event_stats.js`).execute(client, con);
});
console.log(`| serverStats ✅\n`)

const eventDiscord = fs.readdirSync('./events/discord').filter(file => file.endsWith('.js'));
console.log("------- EVENTS DISCORD ---------")
for (const file of eventDiscord) {
    const event = require(`./events/discord/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args,con));
    } else {
        client.on(event.name, (...args) => event.execute(...args,client,Config,con));
    }
    console.log(`| ${file} ✅`)
}
console.log("--------------------------------\n")

// ! A CORRIGER 
const eventLogs = fs.readdirSync('./events/logs').filter(file => file.endsWith('.js'));
console.log("------- EVENTS LOGS ---------")
for (const file of eventLogs) {
    const event = require(`./events/logs/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args,con));
    } else {
        client.on(event.name, (...args) => event.execute(...args,con,client));
    }
    console.log(`| ${file} ✅`)
}
console.log("--------------------------------\n")



// COMMANDS //
// client.commands = new Collection()
// let commandArray = [];
// const commandFiless = fs.readdirSync("./commands").filter(file => !file.endsWith('.js'));
// for (const dossiers of commandFiless) {
//     const allFiless = fs.readdirSync(`./commands/${dossiers}`).filter(file => file.endsWith('.js'));
//     for (const files of allFiless) {
//         const command = require(`./commands/${dossiers}/${files}`)
// 		if (!(files === 'dm.js' || files === 'dm2.js')) commandArray.push({'name':command.name, 'description':command.description});
//         client.commands.set(command.name, command)
//     }
// }

client.events = new Collection()
const eventsFiles = fs.readdirSync("./events").filter(file => !file.endsWith('.js') && file !== 'discord');
console.log("----------- EVENTS ------------")
for (const dossier of eventsFiles) {
    const allFiles = fs.readdirSync(`./events/${dossier}`).filter(file => file.endsWith('.js'));
    for (const file of allFiles) {
        const command = require(`./events/${dossier}/${file}`)
        client.events.set(command.name, command)
        console.log(`| ${file} ✅`)
    }
}
console.log("--------------------------------\n")
// COMMANDS //



// SLASH COMMANDS //
client.slash_commands = new Collection()
const slashFiles = fs.readdirSync("./commands_slash").filter(file => !file.endsWith('.js'));
console.log("-------- SLASH COMMANDS --------")
for (const dossier of slashFiles) {
    const allFiles = fs.readdirSync(`./commands_slash/${dossier}`).filter(file => file.endsWith('.js'));
    for (const file of allFiles) {
        const command = require(`./commands_slash/${dossier}/${file}`);
        client.slash_commands.set(command.data.name,command)
        console.log(`| ${file} ✅`)
    }
}
console.log("--------------------------------")

console.log("----------- LG -----------")
const command = require(`./werewolf/werewolf`);
client.slash_commands.set(command.data.name,command)
console.log(`| werewolf.js ✅`)
console.log("--------------------------------\n")

client.login(Config.token);

require('./website/server');
 
const getClient = () => {
    return client;
}

const getDB = () => {
    return con;
}

exports.getClient = getClient
exports.getDB = getDB