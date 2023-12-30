import {ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder} from "discord.js";
import fetch from "node-fetch";
import got from 'got';
import { JSDOM } from 'jsdom';
const wait = require('util').promisify(setTimeout);

module.exports = {
  name: "pokefusion",
  example: "/pokefusion",
  data: new SlashCommandBuilder()
    .setName('pokefusion')
    .setDescription('Affiche une fusion aléatoire de pokémon'),
  async execute(interaction: ChatInputCommandInteraction) {
    const embedWait: EmbedBuilder = new EmbedBuilder()
      .setColor('#2f3136')
      .setDescription(`<a:F_loading:1065616439836414063> *Chargement de votre fusion...* <a:F_loading:1065616439836414063>`)
      .setTimestamp()
      .setFooter({text:`${process.env.BOT_NAME}`, iconURL:process.env.ICON_URL})
    await interaction.reply({embeds:[embedWait], fetchReply:true});
    const pokemon1: number = Math.ceil(Math.random() * 152);
    const pokemon2: number = Math.ceil(Math.random() * 152);
    const vgmUrl= `https://pokemon.alexonsager.net/${pokemon1}/${pokemon2}`;
    const response = await got(vgmUrl);
    const dom = new JSDOM(response.body);
    await wait(1000);
    const nodeList: any = [...dom.window.document.querySelectorAll('#select1')];
    let textNum1 = nodeList[0].options[pokemon1-1].text.toLowerCase();
    let textNum2 = nodeList[0].options[pokemon2-1].text.toLowerCase();
    await fetch(`https://pokeapi.co/api/v2/pokemon/${textNum1}`)
      .then(response => response.json())
      .then(async (data: any) => {
        await fetch(data["species"]["url"])
          .then(response => response.json())
          .then((data: any) => {
            textNum1 = data["names"]["4"]["name"]
          })
      })
    await fetch(`https://pokeapi.co/api/v2/pokemon/${textNum2}`)
      .then(response => response.json())
      .then(async (data: any) => {
        await fetch(data["species"]["url"])
          .then(response => response.json())
          .then((data: any) => {
            textNum2 = data["names"]["4"]["name"]
          })
      })
    const pokefusion: EmbedBuilder = new EmbedBuilder()
      .setColor('#2f3136')
      .setTitle(`${textNum1} <a:F__etoiles:910840707865014322> ${textNum2}`)
      .setImage(`https://images.alexonsager.net/pokemon/fused/${pokemon1}/${pokemon1}.${pokemon2}.png`)
      .setTimestamp()
      .setFooter({text:`${process.env.BOT_NAME}`, iconURL:process.env.ICON_URL})
    return interaction.editReply({embeds:[pokefusion]})
  }
}