const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const fetch = require("node-fetch");
const Config = require('./../../../config.json')

module.exports = {
    async execute(interaction, date) {
        let channel = await interaction.member.voice.channel
        if (!channel) {
            const JoinEmbed = new MessageEmbed()
                .setColor('#2f3136')
                .setDescription("<a:LMT__arrow:831817537388937277> **Vous devez être dans un salon vocal !**")
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.reply({ embeds: [JoinEmbed], ephemeral:true });
        }
        if (
            interaction.member.guild.me.voice.channel &&
            !interaction.member.guild.me.voice.channel.equals(
                interaction.member.voice.channel
            )
        ) {
            const SameEmbed = new MessageEmbed()
                .setColor("#2f3136")
                .setDescription("<a:LMT__arrow:831817537388937277> **Tu dois être dans le même salon vocal que moi !**")
                .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.reply({ embeds: [SameEmbed], ephemeral: true });
        }
        fetch(`https://discord.com/api/v8/channels/${channel.id}/invites`, {
            method: "POST",
            body: JSON.stringify({
                max_age: 86400,
                max_uses: 0,
                target_application_id: "879864070101172255",
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
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setEmoji('👑')
                        .setURL(`https://discord.com/invite/${invite.code}`)
                        .setStyle('LINK')
                )
            const Embed = new MessageEmbed()
            .setColor(`#2f3136`)
            .setDescription(`Avec **Sketchyartists**, vous pouvez lancer une partie de sketchyartists avec des amis dans un salon vocal !
            Cliquez sur le lien pour rejoindre l'activité !
          
            __**[Rejoidre l'activité](https://discord.com/invite/${invite.code})**__

            ⚠ **Cela ne marche que sur PC** ⚠`)
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
            return interaction.reply({ embeds: [Embed], components:[row] })
        });
    }
}