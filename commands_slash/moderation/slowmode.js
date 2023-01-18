const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed,  Permissions } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slowmode')
        .setDescription('Slowmode un salon')
        .addIntegerOption(option => 
            option
            .setName('temps')
            .setDescription('temps du slowmode')
            .setRequired(true)
            .addChoices({ name: '0 secondes', value: 0 })
            .addChoices({ name: `5 secondes`, value: 5 })
            .addChoices({ name: `10 secondes`, value: 10 })
            .addChoices({ name: `15 secondes`, value: 15 })
            .addChoices({ name: `30 secondes`, value: 30 })
            .addChoices({ name: `1 minute`, value: 60 })
            .addChoices({ name: `2 minutes`, value: 120 })
            .addChoices({ name: `5 minutes`, value: 5*60 })
            .addChoices({ name: `10 minutes`, value: 10*60 })
            .addChoices({ name: `15 minutes`, value: 15*60 })
            .addChoices({ name: `30 minutes`, value: 30*60 })
            .addChoices({ name: `1 heure`, value: 3600 })
            .addChoices({ name: `2 heures`, value: 2*3600 })
            .addChoices({ name: `6 heures`, value: 6*3600 }))
        .addChannelOption(option => option.setName('channel').setDescription('le salon a vérrouiller | Si vous ne mettez rien, ce sera le salon actuel').setRequired(false)),
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
        let channel = interaction.options.getChannel('channel');
        tab = ['0 secondes','5 secondes','10 secondes','15 secondes','30 secondes','1 minute','2 minutes','5 minutes','10 minutes','15 minutes','30 minutes','1 heure','2 heures','6 heures']
        tab2 = [0,5,10,15,30,60,2*60,5*60,10*60,15*60,30*60,1*3600,2*3600,6*3600]
        let nb = tab2.indexOf(time)
        if (!channel) channel = await interaction.member.guild.channels.cache.find(x => x.id === interaction.channelId);
        try {
            channel.setRateLimitPerUser(time);
            const win = new MessageEmbed()
                .setColor('#2f3136')
                .setDescription(`<a:LMT__arrow:831817537388937277> **${channel} a bien été slowmode en ${tab[nb]}**`)
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.reply({embeds:[win]})
        } catch(e) {
            console.log(e);
        }
    }
}