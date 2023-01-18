module.exports = {
    execute(...params) {
        let interaction = params[0];
        let date = params[1];
        const enigme8 = interaction.member.guild.roles.cache.find(role => role.id === "885545430111359016");
        const enigme9 = interaction.member.guild.roles.cache.find(role => role.id === "885545433739444354");
        let phrase = interaction.options.getString('réponse');
        if ((phrase.toLowerCase() === "est") && interaction.channel.id === '885548267180544041') {
            interaction.member.roles.add(enigme9).catch((error) => console.log(error)).then((member) => {
                member.send(`Bien joué ! Tu as trouvé la réponse au niveau 9.\n \n Niveau suivant : \n \n - Appuie sur l Etoile Brillante.\n \nLorsque tu auras trouvé, utilise la commande *e10 (reponse) dans <#885550172124360774> ! Bon courage à toi :) \n Ps : Votre réponse était **est**, elle etait correcte.`);
            });
            interaction.reply({content:"Bravo ! Direction mes DM pour la prochaine enigme !", ephemeral:true})
            interaction.member.roles.remove(enigme8).catch(error => console.log(error));
        } else if (interaction.channel.id === '885548267180544041') {
            interaction.channel.send({content:"Mauvaise réponse !",ephemeral:true});
        };
    }
}