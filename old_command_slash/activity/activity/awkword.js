const { EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const fetch = require("node-fetch");
const Config = require('./../../../config.json')

module.exports = {
    async execute(interaction, date) {
        let channel = await interaction.member.voice.channel;
        if (!channel) {
            const JoinEmbed = new EmbedBuilder()
                .setColor(0x2f3136)
                .setDescription("<a:LMT_arrow:1065548690862899240> **Vous devez être dans un salon vocal !**")
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.reply({ embeds: [JoinEmbed], ephemeral:true});
        }
        // if (
        //     interaction.member.guild.me.voice.channel &&
        //     !interaction.member.guild.me.voice.channel.equals(
        //         interaction.member.voice.channel
        //     )
        // ) {
        //     const SameEmbed = new EmbedBuilder()
        //         .setColor("#2f3136")
        //         .setDescription("<a:LMT_arrow:1065548690862899240> **Tu dois être dans le même salon vocal que moi !**")
        //         .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        //     return interaction.reply({ embeds: [SameEmbed], ephemeral: true });
        // }
        fetch(`https://discord.com/api/v8/channels/${channel.id}/invites`, {
            method: "POST",
            body: JSON.stringify({
                max_age: 86400,
                max_uses: 0,
                target_application_id: "879863881349087252",
                target_type: 2,
                temporary: false,
                validate: null,
        }), 
            headers: {
                "Authorization": `Bot ${Config.token}`,
                "Content-Type": "application/json",
            }
        }).then(async (res) => {
            if (res.status !== 200) {
                console.log(res.status);
                return interaction.reply({content:"Il y a une erreur lors de la création de l'invitation, désolé ! <:LMT_Bplease:882249814669156412>", ephemeral:true});
            }
            const invite = await res.json();
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setEmoji('904872477585457313')
                        .setURL(`https://discord.com/invite/${invite.code}`)
                        .setStyle(ButtonStyle.Link)
                )
            const Embed = new EmbedBuilder()
            .setColor(`#2f3136`)
            .setDescription(`Avec **Awkword**, vous pouvez lancer une partie de awkword avec des amis dans un salon vocal !
            Cliquez sur le lien pour rejoindre l'activité !
          
            __**[Rejoidre l'activité](https://discord.com/invite/${invite.code})**__
            
            *Pas accessible sur certains serveurs*

            ⚠ **Cela ne marche que sur PC** ⚠`)
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.reply({ embeds: [Embed], components:[row] })
        });
    }
}