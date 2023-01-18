const wait = require('util').promisify(setTimeout);

module.exports = {
    execute(...params) {
        let interaction = params[0];
        let date = params[1];
        const enigme1 = interaction.member.guild.roles.cache.find(role => role.id === "882669098364985374");
        let phrase = interaction.options.getString('réponse');
        if (phrase === "42" && interaction.channel.id === '882655257941930014') {
            interaction.member.roles.add(enigme1).catch((error) => console.log(error)).then((member) => {
                member.send(`Bien joué ! Tu as trouvé la réponse au niveau 1.\n\n Niveau suivant : \n - Je sais pas \n - 1:48 \n \n Lorsque tu auras trouvé, utilise la commande /enigme (reponse) dans <#882663899185422417> ! Bon courage à toi :) \n Ps : Votre réponse était **42**, elle etait correcte.`);
            });
            interaction.reply({content:"Bravo ! Direction mes DM pour la prochaine enigme !", ephemeral:true})
        } else if (interaction.channel.id === '882655257941930014') {
            interaction.channel.send({content:"Mauvaise réponse !",ephemeral:true});
        };
    }
}