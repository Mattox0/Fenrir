module.exports = {
    execute(...params) {
        let interaction = params[0];
        let date = params[1];
        const enigme5 = interaction.member.guild.roles.cache.find(role => role.id === "882231882782228520");
        const enigme6 = interaction.member.guild.roles.cache.find(role => role.id === "885545409706086481");
        let phrase = interaction.options.getString('réponse');
        if (phrase.toLowerCase() === "trappist‑1 d" && interaction.channel.id === '882709221454516364') {
            interaction.member.roles.add(enigme6).catch((error) => console.log(error)).then((member) => {
                member.send(`Bien joué ! Tu as trouvé la réponse au niveau 6.\n \n Niveau suivant : \n \n - Bien que ma couleur varie entre le rouge et le bleu foncé, j'émets de la lumière. \n J'éclaire vos vies souvent meurtries par la sombreur du crépuscule, \nRefletant ma pierre se noyant dans la mer. \n**Qui suis-je ?**\n \n Lorsque tu auras trouvé, utilise la commande *e7 (reponse) dans <#885547588684771348> ! Bon courage à toi :) \n Ps : Votre réponse était **TRAPPIST‑1 d**, elle etait correcte.`);
            });
            interaction.reply({content:"Bravo ! Direction mes DM pour la prochaine enigme !", ephemeral:true})
            interaction.member.roles.remove(enigme5).catch(error => console.log(error));
        } else if (interaction.channel.id === '882709221454516364') {
            interaction.channel.send({content:"Mauvaise réponse !",ephemeral:true});
        };
    }
}