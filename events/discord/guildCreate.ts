import {post} from "../../requests/requests";
import {Channel, EmbedBuilder, Guild, GuildBasedChannel, GuildMember, TextBasedChannel, TextChannel} from "discord.js";

module.exports = {
  name:'guildCreate',
  async execute(guild: Guild) {
    let date: Date = new Date();
    const response: Response = await post(`${process.env.API_URL}/server`, {
      guild_id: guild.id,
      name: guild.name,
    });
    if (response.status !== 201) {
      console.log(`[${date.toLocaleString()}] - guildCreate - [${response.status}] ${response.statusText}`);
      return;
    }
    let channel: GuildBasedChannel | undefined = guild.channels.cache.find((x: Channel) => x.id === guild.systemChannelId);
    const bvn = new EmbedBuilder()
      .setColor('#2f3136')
      .setDescription(`<a:LMT_arrow:1065548690862899240> **Merci de m'avoir invité !**\n\n> **Pour avoir un aperçu de toutes les commandes :** \`/help\`\n> **Veillez à ce que le rôle everyone aie la permissions \`Utiliser des emojis externes\`, sinon les emojis du bot ne s'afficheront pas.**\n> **Pour toutes questions, le [support](https://discord.gg/p9gNk4u) est accessible, ou les MP du bot pour nous contacter directement.**\n> **Nous sommes friant de nouvelles idées d'améliorations** <:LMT_Agg:882250214050775090>`)
      .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
    if (!channel) {
      const person: GuildMember | undefined = guild.members.cache.find(x => x.user.id === guild.ownerId);
      if (!person) return;
      await person.send({embeds:[bvn]});
    } else if (channel instanceof TextChannel){
      await channel.send({embeds:[bvn]});
    }
  }
}