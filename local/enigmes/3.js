module.exports = {
    execute(...params) {
        let interaction = params[0];
        let date = params[1];
        const enigme2 = interaction.member.guild.roles.cache.find(role => role.id === "882669083064168518");
        const enigme3 = interaction.member.guild.roles.cache.find(role => role.id === "882669455237324880");
        let phrase = interaction.options.getString('réponse');
        if (phrase === "4197" && interaction.channel.id === '882663927375343686') {
            interaction.member.roles.add(enigme3).catch((error) => console.log(error)).then((member) => {
                member.send(`Bien joué ! Tu as trouvé la réponse au niveau 3.\n \n Niveau suivant : \n - Regarde la description de l Inconnu Qui Ne Sait Pas. \n \ Lorsque tu auras trouvé, utilise la commande *e4 (reponse) dans <#882668894110744606> ! Bon courage à toi :) \n Ps : Votre réponse était **4197**, elle etait correcte.`);
            });
            interaction.reply({content:"Bravo ! Direction mes DM pour la prochaine enigme !", ephemeral:true})
            interaction.member.roles.remove(enigme2).catch(error => console.log(error));
        } else if (interaction.channel.id === '882663927375343686') {
            interaction.channel.send({content:"Mauvaise réponse !",ephemeral:true});
        };
    }
}