module.exports = {
    execute(...params) {
        let interaction = params[0];
        let date = params[1];
        const enigme3 = interaction.member.guild.roles.cache.find(role => role.id === "882669455237324880");
        const enigme4 = interaction.member.guild.roles.cache.find(role => role.id === "882669651815972914");
        let phrase = interaction.options.getString('réponse');
        if (phrase === "clelmt" && interaction.channel.id === '882668894110744606') {
            interaction.member.roles.add(enigme4).catch((error) => console.log(error)).then((member) => {
                member.send(`'Bien joué ! Tu as trouvé la réponse au niveau 4.\n \n Niveau suivant : \n - Invitation \n - **11** 19 **8 18 24 6** 20** 5** C **11** \n \n Lorsque tu auras trouvé, utilise la commande *e5 (reponse) dans <#882670761427476500> ! Bon courage à toi :) \n Ps : Votre réponse était **clelmt**, elle etait correcte.`);
            });
            interaction.reply({content:"Bravo ! Direction mes DM pour la prochaine enigme !", ephemeral:true})
            interaction.member.roles.remove(enigme3).catch(error => console.log(error));
        } else if (interaction.channel.id === '882668894110744606') {
            interaction.channel.send({content:"Mauvaise réponse !",ephemeral:true});
        };
    }
}