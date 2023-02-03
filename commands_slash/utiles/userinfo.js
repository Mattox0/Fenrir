const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Affiche toutes les informations de soi ou d\'un utilisateur')
        .addUserOption(option => option.setName('utilisateur').setDescription('Si vous ne mettez rien, cela affiche vos informations').setRequired(false)),
    async execute(...params) {
        let interaction = params[0];
        let date = params[2];
        let db = params[4];
        let person = interaction.options.getUser('utilisateur')
        if (!person) person = interaction.member;
        else person = interaction.member.guild.members.cache.find(member => member.id === person.id);
        let mention = person;
        let identifiant = person.id;
        let username = `${person.user.username}#${person.user.discriminator}`;
        let joined = `<t:${Math.floor(person.joinedTimestamp / 1000)}:f> (<t:${Math.floor(person.joinedTimestamp / 1000)}:R>)`;
        let created = `<t:${Math.floor(person.user.createdAt / 1000)}:f> (<t:${Math.floor(person.user.createdAt / 1000)}:R>)`;
        let boost = "Non";
        if (person.premiumSinceTimestamp) {
            boost = `<t:${Math.floor(person.premiumSinceTimestamp / 1000)}:R>`
        };
        let pos = 0;
        await interaction.member.guild.members.fetch().then(members => {
            members.forEach(member => {
                if (person.joinedTimestamp > member.joinedTimestamp) {
                    pos += 1;
                };
            });
        });
        let position;
        if (pos == 0) {
            position = "Tu es le Créateur, forcément t'es le 1er !";
        } else if (pos == 1) {
            position = "Tu es le 2ème";
        } else {
            position = `Tu es le **${pos+1}** ème`;
        };
        let tabroles = [];
        person._roles.forEach(role => {
            const x = interaction.member.guild.roles.cache.find(rol => rol.id === role);
            tabroles.push([parseInt(x.rawPosition),x]);
        });
        tabroles.sort(function([k,v],[a,b]) {
            return a-k;
        })
        let roles = ""
        tabroles.forEach(([k,role]) => {
            roles += `<@&${role.id}>\n`;
        })
        let firstrole = `${tabroles[0][1]}`
        db.get("SELECT date FROM anniversaires WHERE guild_id = ? AND user_id = ?", interaction.member.guild.id, interaction.member.id, (err, res) => {
            if (err) return console.log(err);
            const userinfo = new EmbedBuilder()
                .setColor('#2f3136')
                .setAuthor({name:`${person.user.username}#${person.user.discriminator}`, iconURL:person.user.displayAvatarURL()})
                .addFields(
                    {name:`**Mention**`, value:`${mention}`,inline:true},
                    {name:`**Tag**`, value:`${username}`,inline:true},
                    {name:`**Identifiant**`, value:`${identifiant}`,inline:true},
                    {name:`**Date d'arrivée**`, value:`${joined}`,inline:true},
                    {name:`**Date de création du compte**`, value:`${created}`,inline:true},
                    {name:`**Position d'arrivée**`, value:`${position}`,inline:true},
                    {name:`**Boost**`, value:`${boost}`,inline:false},
                    {name:`**Rôle le plus haut**`, value:`${firstrole}`,inline:true},
                    {name:`**Rôles [${tabroles.length}]**`, value:`${roles}`,inline:true}
                )
                .setThumbnail(person.user.displayAvatarURL({dynamic : true}))
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.reply({ embeds : [ userinfo ]});
        })
    }
}