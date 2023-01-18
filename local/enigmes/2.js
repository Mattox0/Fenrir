module.exports = {
    execute(...params) {
        let interaction = params[0];
        let date = params[1];
        const enigme1 = interaction.member.guild.roles.cache.find(role => role.id === "882669098364985374");
        const enigme2 = interaction.member.guild.roles.cache.find(role => role.id === "882669083064168518");
        let phrase = interaction.options.getString('réponse');
        if (phrase.toLowerCase() === "longtemps" && interaction.channel.id === '882663899185422417') {
            interaction.member.roles.add(enigme2).catch((error) => console.log(error)).then((member) => {
                member.send(`Bien joué ! Tu as trouvé la réponse au niveau 2.\n \n Niveau suivant : \n - La 7ème clé est la bonne \n - Ab kvpz wylukyl slz jopmmylz kb ohzoahn kl Atvyf \n \n Lorsque tu auras trouvé, utilise la commande *e3 (reponse) dans <#882663927375343686> ! Bon courage à toi :) \n Ps : Votre réponse était **longtemps**, elle etait correcte.`);
            });
            interaction.reply({content:"Bravo ! Direction mes DM pour la prochaine enigme !", ephemeral:true})
            interaction.member.roles.remove(enigme1).catch(error => console.log(error));
        } else if (interaction.channel.id === '882663899185422417') {
            interaction.channel.send({content:"Mauvaise réponse !",ephemeral:true});
        };
    }
}