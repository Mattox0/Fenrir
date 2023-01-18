const { MessageEmbed, Permissions, MessageActionRow, MessageButton } = require("discord.js");
const fetch = require('node-fetch')

module.exports = {
    async execute(interaction, db, date) {
        fetch('https://api.steampowered.com/ISteamApps/GetAppList/v0002/?format=json')
        .then(response => response.json())
        .then(data => {
            let random = data.applist.apps[Math.floor(Math.random() * data.applist.apps.length)];
            fetch(`https://store.steampowered.com/api/appdetails?appids=${random.appid}`)
            .then(response => response.json())
            .then(async (data) => {
                let num = `${random.appid}`
                if (!data[num].success) {
                    const fail = new MessageEmbed()
                        .setColor('#2f3136')
                        .setDescription('<a:LMT__arrow:831817537388937277> **Aucun jeu n\'a été trouvé, recommence !**')
                        .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    return interaction.reply({embeds:[fail]})
                }
                let name = data[num].data.name.replaceAll(' ', '_');
                let url = `https://store.steampowered.com/app/${num}/${name}/`
                const row = new MessageActionRow()
                if (data[num].data.website) {
                    row.addComponents(
                        new MessageButton()
                            .setEmoji('🌐')
                            .setURL(data[num].data.website)
                            .setStyle('LINK')
                    )
                }
                let cool = await fetch(url);
                if (cool.status === 200) {
                    row.addComponents(
                        new MessageButton()
                            .setEmoji('<:LMT_Steam:933284290618335275>')
                            .setURL(url)
                            .setStyle('LINK')
                    )
                }
                if (data[num].data.is_free) {
                    prix = "> \`Gratuit\` : Oui"
                } else {
                    if (data[num].data.price_overview) {
                        if (data[num].data.price_overview.final_formatted) {
                            prix = `> \`Prix\` : ${data[num].data.price_overview.final_formatted}`
                        } else {
                            prix = "> \`Gratuit\` : Non"
                        }
                    } else {
                        prix = "> \`Gratuit\` : Non"
                    }
                }
                if (data[num].data.platforms) {
                    platforms = "\n> \`Plateformes\` : "
                    if (data[num].data.platforms.windows) {
                        platforms += "Windows "
                    }
                    if (data[num].data.platforms.linux) {
                        platforms += "Linux "
                    }
                    if (data[num].data.platforms.mac) {
                        platforms += "Mac "
                    }
                } else {
                    platforms = ""
                }
                if (data[num].data.release_date) {
                    release = `\n> \`Date de sortie\` : ${data[num].data.release_date.date}`
                }
                const win = new MessageEmbed()
                    .setColor('#2f3136')
                    .setImage(data[num].data.header_image)
                    .setTitle(data[num].data.name)
                    .setDescription(`${data[num].data.short_description}\n\n${prix}${platforms}${release}`)
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                await interaction.reply({embeds:[win], components:[row]})
            })
        })
    }
}