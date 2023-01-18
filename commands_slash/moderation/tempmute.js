const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed,  Permissions } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Mute un utilisateur pour une certaine durée')
        .addUserOption(option => option.setName('utilisateur').setDescription('L\'utilisateur a mute').setRequired(true))
        .addIntegerOption(option => 
            option
            .setName('temps')
            .setDescription('temps du slowmode')
            .setRequired(true)
            .addChoices({ name:'0 seconde', value: 0 })
            .addChoices({ name:'60 secondes', value: 60 * 1000 })
            .addChoices({ name:`5 minutes`, value: 5 * 60 * 1000 })
            .addChoices({ name:`1 heure`, value: 1000 * 60 * 60 })
            .addChoices({ name:`1 jour`, value: 1000 * 60 * 60 * 24 })
            .addChoices({ name:`1 semaine`, value: 1000 * 60 * 60 * 24 * 7 })),
    async execute(...params) {
        let interaction = params[0];
        let date = params[2];
        if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
            const fail = new MessageEmbed()
                .setColor('#2f3136')
                .setDescription('<a:LMT__arrow:831817537388937277> **Tu n\'as pas les permissions pour executer cette commande !** \n**Appelle une personne plus qualifiée qui pourra t\'aider**')
                .setThumbnail('https://cdn.discordapp.com/attachments/883117525842423898/899365869560430592/882249237486784522.gif')
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.reply({ embeds : [fail],ephemeral : true});
        }
        let time = interaction.options.getInteger('temps');
        let user = interaction.options.getUser('utilisateur');
        tab = ['0 seconde','60 secondes','5 minutes','1 heure','1 jour','1 semaine']
        tab2 = [0, 60 * 1000, 5 * 60 * 1000, 1000 * 60 * 60,1000 * 60 * 60 * 24,1000 * 60 * 60 * 24 * 7]
        let nb = tab2.indexOf(time)
        user = await interaction.guild.members.cache.find(x => x.id === user.id)
        if (time === 0) time = null;
        console.log(user)
        try {
            user.timeout(time)
            const win = new MessageEmbed()
                .setColor('#2f3136')
                .setDescription(`<a:LMT__arrow:831817537388937277> **${user} a bien été mute pour ${tab[nb]}**`)
            return interaction.reply({embeds:[win]})
        } catch(e) {
            console.log(e);
        }
    }
}