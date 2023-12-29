import fs from "fs";
import { REST, Routes } from 'discord.js';

module.exports = {
  async build() {
    const commands = [];
    const slashFiles = fs.readdirSync("./commands").filter(file => !file.endsWith('.js'));
    for (const dossier of slashFiles) {
      const allFiles = fs.readdirSync(`./commands/${dossier}`).filter(file => file.endsWith('.ts'));
      for (const file of allFiles) {
        const command = require(`./commands/${dossier}/${file}`);
        commands.push(command.data.toJSON());
      }
    }

    const rest: REST = new REST().setToken(process.env.DISCORD_TOKEN as string);

    await (async () => {
      try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        // The put method is used to fully refresh all commands in the guild with the current set
        await rest.put(Routes.applicationCommands("784943061616427018"), {body: commands})
          .then(() => console.log("--- Les commandes ont été chargés ✅ ---"))
          .catch(console.error);
      } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
      }
    })();
  }
}