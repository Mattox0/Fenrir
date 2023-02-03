const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const Werewolf = require("../roles/Werewolf.js");
const Seer = require("../roles/Seer.js");
const Villager = require("../roles/Villager.js");
const Witch = require("../roles/Witch.js");
const Cupidon = require("../roles/Cupidon.js");
const Detective = require("../roles/Detective.js");
const wait = require('util').promisify(setTimeout);
const getAllPlayers = require("./getAllPlayers.js");
const getRolesPerso = require("./getRolesPerso.js");
const getPersoOrAuto = require("./getPersoOrAuto.js");
const getRolesAuto = require("./getRolesAuto.js");
const setUserRoles = require("./setUserRoles.js");
const setDiscordRoles = require("./setDiscordRoles.js");
const redirectPlayers = require("./redirectPlayers.js");
const annonceRoles = require("./annonceRoles.js");
const askCupidon = require("./askCupidon.js");
const { lock, unlock } = require("./lock.js");
const Pyromaniac = require("../roles/Pyromaniac.js");

class Game {
    constructor() {
        this.allPlayersRoles = [];
        this.allPlayersAlive = [];
        this.allPlayersId = [];
        this.config = {};
        this.winner = null;
        this.end = false;
    }

    async configGame(interaction, date, resolve) {
        //? Recolte de tous les players
        // await (new Promise(async (resolve, reject) => {
        //     await getAllPlayers(interaction, date, this, resolve) // Récupère tous les joueurs
        // }))
        if (this.end) return resolve();

        //? Choix roles perso or auto
        // await (new Promise(async (resolve, reject) => {
        //     await getPersoOrAuto(interaction, date, this, resolve) // Récupère tous les joueurs
        // }))

        if (this.end) return resolve();
        
        if (this.config.roleChoice === "perso") {
            //? choix des roles
            //! à compléter [que 4 pour l'instant]
            // await (new Promise(async (resolve, reject) => {
            //     await getRolesPerso(interaction, date, this, resolve) // Choix des rôles perso
            // }));
        } else {
            //? choix des roles 
            //! à compléter [que 4 pour l'instant]
            // await (new Promise(async (resolve, reject) => {
            //     await getRolesAuto(interaction, date, this, resolve) // Choix des rôles auto
            // }));
        }

        await this.test(); //! A SUPPRIMER

        if (this.end) return resolve();

        //? config des roles players
        await (new Promise(async (resolve, reject) => {
            await setUserRoles(interaction, date, this, resolve) // Choix des rôles perso
        }));
        
        //? config des roles discord + salons
        await (new Promise(async (resolve, reject) => {
            await setDiscordRoles(interaction, date, this, resolve) // Choix des rôles perso
        }));

        resolve();
    }

    async preGame(interaction, date, resolve) {
        // rediriger les joueurs dans LE village
        await (new Promise(async (resolve, reject) => {
            await redirectPlayers(interaction, date, this, resolve)
        }));

        // annoncer roles
        await (new Promise(async (resolve, reject) => {
            await annonceRoles(interaction, date, this, resolve) //! 30000 time a remettre
        }));

        if (this.end) return resolve();

        // cupidon ?
        //! à tester
        if (this.allPlayersRoles.find(role => role.name === "Cupidon")) {
            await (new Promise(async (resolve, reject) => {
                await askCupidon(interaction, date, this, resolve)
            }));
        }
        resolve();
    }

    async game(interaction, date, resolve) {
        while (!this.end) {
            // Voyante
            if (this.allPlayersAlive.includes(this.allPlayersRoles.find(role => role.name === "Voyante"))) {
                // Voir le role d'un user si y'a une voyante
                await (new Promise(async (resolve, reject) => {
                    await this.allPlayersRoles.find(role => role.name === "Voyante").seeRolePlayer(interaction, date, this, resolve);
                }));
            }
            // Détective
            if (this.allPlayersAlive.includes(this.allPlayersRoles.find(role => role.name === "Detective"))) {
                await (new Promise(async (resolve, reject) => {
                    await this.allPlayersRoles.find(role => role.name === "Detective").seeCampsPlayer(interaction, date, this, resolve);
                }));
            }
            // Garde du corps
            if (this.allPlayersAlive.includes(this.allPlayersRoles.find(role => role.name === "Garde du corps"))) {
                await (new Promise(async (resolve, reject) => {
                    await this.allPlayersRoles.find(role => role.name === "Garde du corps").protectPlayer(interaction, date, this, resolve);
                }));
            }
            // Pyromane
            if (this.allPlayersAlive.includes(this.allPlayersRoles.find(role => role.name === "Pyromane"))) {
                await (new Promise(async (resolve, reject) => {
                    await this.allPlayersRoles.find(role => role.name === "Pyromane").chooseBurn(interaction, date, this, resolve);
                }));
            }
            // LG
            if (this.allPlayersAlive.includes(this.allPlayersRoles.find(role => role.name === "Loup Garou"))) {
                await (new Promise(async (resolve, reject) => {
                    await this.allPlayersRoles.find(role => role.name === "Loup Garou").vote(interaction, date, this, resolve);
                }));
            }
            // Sorciere
            // Reveil => tout à gérer
            // Journée
            // Vote
            // re-nuit
            this.end = true
        }
        resolve();
    }


    async test() {
        this.allPlayersId = ["695557607280083025", "320936471546691595", "184914103997956096", "833443168104087592"]
        this.allPlayersRoles = [new Villager(), new Villager(), new Werewolf(), new Werewolf()]
        this.allPlayersAlive = this.allPlayersRoles;
    }
}
module.exports = Game;

//! Affichage du chargement : ajouter comme une liste de taches

//?  config
//?  |-> roleId = role.id
//?  |-> categoryId = category.id
//?  |-> villageId = village.id
//?  |-> messageId = msg.id (message actif)
//?  |-> cupidonChannelId = cupidon.id
//?  |-> lovedChannelId = lovedChannel.id (amoureux)
//?  |-> seerChannelId = seerChannel.id (voyante)
//?  |-> detectiveChannelId = detectiveChannel.id (detective)
//?  |-> bodyguardChannelId = bodyguardChannel.id (garde du corps)
//?  |-> pyromaniacChannelId = pyromaniacChannel.id (pyromane)
//?  |-> werewolfChannelId = werewolfChannel.id (loup garou)