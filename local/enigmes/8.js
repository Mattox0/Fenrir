module.exports = {
    execute(...params) {
        let interaction = params[0];
        let date = params[1];
        const enigme7 = interaction.member.guild.roles.cache.find(role => role.id === "885545422817460255");
        const enigme8 = interaction.member.guild.roles.cache.find(role => role.id === "885545430111359016");
        let phrase = interaction.options.getString('réponse');
        if ((phrase.toLowerCase() === "los angeles") && interaction.channel.id === '885548208791650364') {
            interaction.member.roles.add(enigme8).catch((error) => console.log(error)).then((member) => {
                member.send(`Bien joué ! Tu as trouvé la réponse au niveau 8.\n \n Niveau suivant : \n \n - L Etoile Brillante du **matin** te mènera vers la **direction** de la prochaine étape. \n \nLorsque tu auras trouvé, utilise la commande *e9 (reponse) dans <#885548267180544041> ! Bon courage à toi :) \n Ps : Votre réponse était **Los Angeles**, elle etait correcte.`);
            });
            interaction.reply({content:"Bravo ! Direction mes DM pour la prochaine enigme !", ephemeral:true})
            interaction.member.roles.remove(enigme7).catch(error => console.log(error));
        } else if (interaction.channel.id === '885548208791650364') {
            interaction.channel.send({content:"Mauvaise réponse !",ephemeral:true});
        };
    }
}