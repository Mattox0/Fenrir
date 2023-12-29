const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js")
export const client = new Client({ partials: [Partials.Channel, Partials.Message], intents: [ GatewayIntentBits.MessageContent ,GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildBans, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildMembers, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildPresences] })
const fs = require("fs");
require('dotenv').config();
require('./deploy_commands').build();

// EVENT //
const eventDiscord = fs.readdirSync('./events/discord').filter((file: string) => file.endsWith('.ts'));
console.log("------- EVENTS DISCORD ---------")
for (const file of eventDiscord) {
  const event = require(`./events/discord/${file}`);
  if (event.once) {
    client.once(event.name, (...args: any[]) => event.execute(...args));
  } else {
    client.on(event.name, (...args: any[]) => event.execute(...args));
  }
  console.log(`| ${file} ✅`)
}
console.log("--------------------------------\n")

// SLASH COMMANDS //
client.commands = new Collection()
const slashFiles = fs.readdirSync("./commands").filter((file: string) => !file.endsWith('.ts'));
console.log("-------- SLASH COMMANDS --------")
for (const dossier of slashFiles) {
  const allFiles = fs.readdirSync(`./commands/${dossier}`).filter((file: string) => file.endsWith('.ts'));
  for (const file of allFiles) {
    const command = require(`./commands/${dossier}/${file}`);
    client.commands.set(command.data.name,command)
    console.log(`| ${file} ✅`)
  }
}
console.log("--------------------------------")

client.login(process.env.DISCORD_TOKEN);