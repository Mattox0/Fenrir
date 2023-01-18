module.exports = {
    execute(...params) {
        let interaction = params[0];
        let date = params[1];
        const enigme4 = interaction.member.guild.roles.cache.find(role => role.id === "882669651815972914");
        const enigme5 = interaction.member.guild.roles.cache.find(role => role.id === "882231882782228520");
        let phrase = interaction.options.getString('réponse');
        if (phrase === "0705" && interaction.channel.id === '882670761427476500') {
            interaction.member.roles.add(enigme5).catch((error) => console.log(error)).then((member) => {
                member.send(`Bien joué ! Tu as trouvé la réponse au niveau 5.\n \n Niveau suivant : \n \n - · −··− −−− ·−−· ·−·· ·− −· · − ·  ·− ···− · −·−·  ··− −·  ·· ··· −  −·· ·  −−−−− ·−·−·− −−−−· −−−−− − ··−  −·−· −−− ·−−· ·· · ·−· ·− ···  ·−·· ·  −· −−− −−  −·· ·  −·−· · − − ·  ·−−· ·−·· ·− −· ·−··− − ·  ·−−·−  ·−·· ·−  −− ·− ·−−− ··− ··· −·−· ··− ·−·· ·  ·−−· ·−· ·−··− ··· −−··−−  ·−−·−  ·−·· ·−−−−· · ··· ·−−· ·− −·−· ·  ·−−· ·−· ·−··− ··· ·−·−·−  \n \n Lorsque tu auras trouvé, utilise la commande *e6 (reponse) dans <#882709221454516364> ! Bon courage à toi :) \n Ps : Votre réponse était **0705**, elle etait correcte.`);
            });
            interaction.reply({content:"Bravo ! Direction mes DM pour la prochaine enigme !", ephemeral:true})
            interaction.member.roles.remove(enigme4).catch(error => console.log(error));
        } else if (interaction.channel.id === '882670761427476500') {
            interaction.channel.send({content:"Mauvaise réponse !",ephemeral:true});
        };
    }
}