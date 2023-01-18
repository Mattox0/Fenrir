module.exports = {
    execute(...params) {
        let interaction = params[0];
        let date = params[1];
        const enigme6 = interaction.member.guild.roles.cache.find(role => role.id === "885545409706086481");
        const enigme7 = interaction.member.guild.roles.cache.find(role => role.id === "885545422817460255");
        let phrase = interaction.options.getString('réponse');
        if ((phrase.toLowerCase() === "la lune" || phrase.toLowerCase() === "lune") && interaction.channel.id === '885547588684771348') {
            interaction.member.roles.add(enigme7).catch((error) => console.log(error)).then((member) => {
                member.send(`Bien joué ! Tu as trouvé la réponse au niveau 7. \n \n Niveau suivant : \n \n https://i.pinimg.com/originals/26/59/d0/2659d02bb9141ae322218577217bb24e.jpg \n https://i.pinimg.com/550x/61/f1/df/61f1df65f8b46077e82c2641c8220fa9.jpg \n https://p4.wallpaperbetter.com/wallpaper/922/861/243/city-urban-sunset-los-angeles-photoshopped-usa-cityscape-sunlight-wallpaper-preview.jpg \n https://www.jeparsauxusa.com/wp-content/uploads/2017/11/los-angeles.jpg \n - Point Commun. \n \n Lorsque tu auras trouvé, utilise la commande *e8 (reponse) dans <#885548208791650364> ! Bon courage à toi :) \n Ps : Votre réponse était **lune**, elle etait correcte.`);
            });
            interaction.reply({content:"Bravo ! Direction mes DM pour la prochaine enigme !", ephemeral:true})
            interaction.member.roles.remove(enigme6).catch(error => console.log(error));
        } else if (interaction.channel.id === '885547588684771348') {
            interaction.channel.send({content:"Mauvaise réponse !",ephemeral:true});
        };
    }
}