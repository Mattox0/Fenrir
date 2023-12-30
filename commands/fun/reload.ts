import {SlashCommandBuilder} from "discord.js";

module.exports = {
  name: "reload",
  example: "/reload",
  data: new SlashCommandBuilder()
    .setName('reload')
    .setDescription('Recharge les commandes'),
  async execute(interaction: any) {
    if (interaction.user.id !== process.env.OWNER_ID) return interaction.reply({content: "Vous n'avez pas la permission d'utiliser cette commande !", ephemeral: true});
    await interaction.deferReply();
    const rest = new (require("discord.js")).REST({version: "9"}).setToken(process.env.DISCORD_TOKEN);
    const commands = [];
    const slashFiles = require("fs").readdirSync("./commands").filter((file: any) => !file.endsWith(".js"));
    for (const dossier of slashFiles) {
      const allFiles = require("fs").readdirSync(`./commands/${dossier}`).filter((file: any) => file.endsWith(".ts"));
      for (const file of allFiles) {
        const command = require(`../${dossier}/${file}`);
        commands.push(command.data.toJSON());
      }
    }
    await (async () => {
      try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);
        await rest.put(require("discord.js").Routes.applicationCommands("784943061616427018"), {body: commands}).then(() => console.log("--- Les commandes ont été chargés ✅ ---")).catch(console.error);
      } catch (error) {
        console.error(error);
      }
    })();
    return interaction.editReply({content: "Les commandes ont été rechargés ✅"});
  }
}