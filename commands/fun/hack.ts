import {EmbedBuilder, SlashCommandBuilder, User} from "discord.js";
const wait = require('util').promisify(setTimeout);

module.exports = {
  name: "hack",
  example: "/hack <user>",
  data: new SlashCommandBuilder()
    .setName('hack')
    .setDescription('Hack un utilisateur')
    .addUserOption(option => option.setName('utilisateur').setDescription('L\'utilisateur à hacker').setRequired(true)),
  async execute(interaction: any) {
    let person: User = interaction.options.getUser('utilisateur') as User;
    let hacked = await interaction.member.guild.members.cache.find((x: User) => x.id === person.id);
    const step: string[] = ['[▝]','[▗]','[▖]','[▘]']
    await interaction.reply(`Connexion à ${hacked.user.username} en cours...`)
    await wait(2000)
    await interaction.editReply({content:`**${step[0]}** Recherche du mot de passe ...`})
    await wait(2000)
    const mail: string[] = ['outlook.com','orange.fr','gmail.com','msn.com','psynet.net']
    const mdp: string[] = ['jaimeleslicornes55','hackeurman34','iloveyou43','jsuistropbg67','jesusishere666','azertyuiop34','motdepasse']
    await interaction.editReply({content:`**${step[1]} Trouvé !**\n**Email**: ${hacked.user.username}@${mail[Math.floor(Math.random() * mail.length)]}\n**Mot de passe**: ||${mdp[Math.floor(Math.random() * mdp.length)]}||`})
    await wait(2000)
    await interaction.editReply({content:`**${step[2]}** Recuperation des dms en cours...`})
    await wait(2000)
    const messages: string[] = ['Jsuis trop bg moi','J\'adore l\'eau',"J'ai toujours été de droite","je me lave 2 fois par semaine","quand j'étais petit, j'étais petit :)","Je suis amoureux de ...","Ils sont tous méchants avec moi","J'adore les disneys UwU",""]
    await interaction.editReply({content:`**${step[3]}** Dernier message : \`${messages[Math.floor(Math.random() * messages.length)]}\``})
    await wait(2000)
    await interaction.editReply({content:`**${step[0]}** Injection du virus dans son appareil...`})
    await wait(2000)
    await interaction.editReply({content:`**${step[1]}** Virus injectée !`})
    await wait(2000)
    await interaction.editReply({content:`**${step[2]}** Recherche de l'adresse IP...`})
    await wait(2000)
    await interaction.editReply({content:`**${step[0]}** Adresse IP trouvé : \`192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}/24\``})
    await wait(2000)
    await interaction.editReply({content:`**${step[1]}** Vente des données récupérés aux gouvernement...`})
    await wait(2000)
    await interaction.editReply({content:`**${step[2]}** Argent récupéré : \`${Math.floor(Math.random() * 10000)}€\``})
    await wait(2000)
    await interaction.editReply({content:`**${step[3]}** Finition des dégats...`})
    await wait(2000)
    const embed: EmbedBuilder = new EmbedBuilder()
      .setColor('#2f3136')
      .setDescription(`<:F_arrow:1190482623542341762> **${hacked.user} s'est fait hacker !**`)
    await interaction.editReply({content:'', embeds:[embed]})
  }
}