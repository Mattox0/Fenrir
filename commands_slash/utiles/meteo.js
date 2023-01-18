const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('meteo')
        .setDescription('Affiche la météo de votre ville')
        .addStringOption(option => option.setName('ville').setDescription('Exemple : Bordeaux').setRequired(true)),
    async execute(...params) {
        let interaction = params[0];
        let date = params[2];
        let expression = interaction.options.getString('ville');
        const fail = new MessageEmbed()
            .setColor('#2f3136')
            .setDescription(`<a:LMT__arrow:831817537388937277> **Je n'ai pas trouvé votre ville**\n\n> \`/meteo Bordeaux\``)
            .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
        try {
            fetch(`http://api.openweathermap.org/data/2.5/weather?appid=80960e984146a0de56567ac4c69074f4&q=${expression}&lang=fr`)
            .then(r => r.json())
            .then(data => {
                if (data["cod"] === '404') {
                    return interaction.reply({embeds:[fail], ephemeral:true});
                }
                const meteo = new MessageEmbed()
                    .setColor('#2f3136')
                    .setTitle(`Météo à ${data["name"]} :white_sun_cloud:`)
                    .setFooter({text:`LMT-Bot ・ Aujourd'hui à ${date.toLocaleTimeString().slice(0,-3)}`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                    .setThumbnail('https://i.ibb.co/CMrsxdX/weather.png')
                    .setFields(
                        { name: 'Temps', value: data["weather"][0]["description"], inline: false },
                        { name: `Temperature min`, value: `${Math.round((data["main"]["temp_min"] - 273.15)*10) / 10} °C`, inline: true },
                        { name: `Temperature max`, value: `${Math.round((data["main"]["temp_max"] - 273.15)*10) / 10} °C`, inline: true },
                        { name: `Ressenti`, value: `${Math.round((data["main"]["feels_like"] - 273.15)*10) / 10} °C`, inline: true },
                        { name: `Humidité`, value: `${data["main"]["humidity"]} %`, inline: true },
                        { name: `Pression athmospherique`, value: `${data["main"]["pressure"]} hPa`, inline: true },
                    )
                return interaction.reply({ embeds:[ meteo ]});
            })
        } catch (e) {
            console.log(e);
            return interaction.reply({ embeds : [ fail ], ephemeral : true});
        };
    }
}