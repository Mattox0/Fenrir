import {EmbedBuilder, Guild, GuildBasedChannel} from "discord.js";
import {del} from "../../requests/requests";

module.exports = {
name:'guildDelete',
  async execute(guild: Guild) {
    let date: Date = new Date();
    const response: Response = await del(`${process.env.API_URL}/server/${guild.id}`);
    if (response.status !== 200) {
      console.log(`[${date.toLocaleString()}] - guildDelete - [${response.status}] ${response.statusText}`);
      return;
    }
  }
}