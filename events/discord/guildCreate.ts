import {post} from "../../requests/requests";
import {Channel, EmbedBuilder, Guild, GuildBasedChannel, GuildMember, TextChannel} from "discord.js";

module.exports = {
  name:'guildCreate',
  async execute(guild: Guild) {
    let date: Date = new Date();
    const response: Response = await post(`${process.env.API_URL}/server`, {
      guild_id: guild.id,
      name: guild.name,
      deleted: false
    });
    if (response.status !== 201) {
      console.log(`[${date.toLocaleString()}] - guildCreate - [${response.status}] ${response.statusText}`);
      return;
    }
    let channel: GuildBasedChannel | undefined = guild.channels.cache.find((x: Channel) => x.id === guild.systemChannelId);
    const bvn = new EmbedBuilder()
      .setColor('#2f3136')
      .setTitle('Hey ! :raised_hands::skin-tone-1:')
      .setDescription(`Je suis un bot multifonctions français et je peux améliorer ton serveur !
      \nJe possède de multiples commandes, tu peux aller regarder avec la commande /help
      \n**Pour répondre au mieux à vos besoins, vous pouvez me configurer facilement avec la commande /setup**`)
      .setFooter({text:`${process.env.BOT_NAME} ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:process.env.ICON_URL})
    if (!channel) {
      const person: GuildMember | undefined = guild.members.cache.find(x => x.user.id === guild.ownerId);
      if (!person) return;
      await person.send({embeds:[bvn]});
    } else if (channel instanceof TextChannel){
      await channel.send({embeds:[bvn]});
    }
  }
}