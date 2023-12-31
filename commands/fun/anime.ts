import {EmbedBuilder, SlashCommandBuilder} from "discord.js";
import fetch from "node-fetch";
import {allButtons} from "../../navigation/navigation.button";
import {pagination} from "../../navigation/navigation";

module.exports = {
  name: "anime",
  exemple: "/anime <text>",
  data: new SlashCommandBuilder()
    .setName('anime')
    .setDescription('Note un anime')
    .addStringOption(option => option.setName('text').setDescription('Le texte à noter').setRequired(true)),
  async execute(interaction: any) {
    const text = interaction.options.getString('text');
    let query: string = `
        query ($id: Int, $page: Int, $perPage: Int, $search: String, $type: MediaType) {  
            Page (page: $page, perPage: $perPage) {    
                pageInfo {      
                    total      
                    currentPage      
                    lastPage      
                    hasNextPage      
                    perPage    
                }    
                media (id: $id, search: $search, type: $type) {      
                    episodes
                    description
                    coverImage {
                        large
                        color
                    }
                    bannerImage    
                    title {        
                        english
                        romaji      
                    }
                }  
            }
        }
        `;
    var variables = {
      search: text,
      type: "ANIME"
    };

    let url: string = 'https://graphql.anilist.co',
      options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: query,
          variables: variables
        })
      };
    fetch(url, options)
      .then(handleResponse)
      .then(handleData)
      .catch(handleError)
    async function handleResponse(response: any) {
      const json = await response.json();
      return response.ok ? json : Promise.reject(json);
    }
    function handleError(error: Error) {
      console.log(error);
      throw new Error(`Error: ${error.message}`);
    }

    async function handleData(data: any) {
      let pages: EmbedBuilder[] = [];
      if (data.data.Page.media.length === 0) {
        const fail: EmbedBuilder = new EmbedBuilder()
          .setColor('#2f3136')
          .setDescription(`<:F_arrows:1190482623542341762> **L'animé demandé n'a pas été trouvé**\n\n> \`priviligiez les noms en anglais ou japonais\``)
          .setTimestamp()
          .setFooter({text:`${process.env.BOT_NAME}`, iconURL:process.env.ICON_URL})
        return interaction.reply({ embeds : [ fail ]});
      }
      for (let x of data.data.Page.media) {
        let color;
        let title;
        let episode;
        let description;
          x.coverImage.color ? color = x.coverImage.color : color = '#2f3136';
        x.title.english ? title = `*${x.title.english}*\n` : title = "";
        x.title.romaji ? title += `*${x.title.romaji}*\n` : title += "";
        x.episodes ? episode = `\n\nNombres d'épisodes : **${x.episodes}**` : episode = "";
        x.description ? description = x.description.replaceAll(/<\/?[a-zA-Z][^>]*>/g, "") : description = "";
        const page: EmbedBuilder = new EmbedBuilder()
          .setColor(color)
          .setTitle(`Résultat pour ${text.slice(0, 200)} `)
          .setImage(x.coverImage.large)
          .setDescription(`${title}\n**Synopsis**:\n${description}${episode}`)
          .setTimestamp()
          .setFooter({text:`${process.env.BOT_NAME}`, iconURL:process.env.ICON_URL})
        pages.push(page);
      }
      await pagination(
        interaction,
        pages,
        allButtons,
        60000,
      );
    }
  }
}