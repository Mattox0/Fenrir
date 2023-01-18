class Player {
    name;
    idPlayer;
    camps;

    constructor(name, camps) {
        this.name = name;
        this.camps = camps;
    }

    GetName() {
        return this.name;
    }

    GetIdPlayer() {
        return this.idPlayer;
    }

    GetCamps() {
        return this.camps;
    }

    SetIdPlayer(idPlayer) {
        this.idPlayer = idPlayer;
    }
}
module.exports = Player;

// ! CAMPS : 
// ! Gentil -> 1
// ! Mechant -> 2
// ! Solo -> 3

// Cupidon
// Voyante
// Détective
// Garde du corps
// Pyromane
// LG
// LG Blanc
// Sorciere 
// Bouffon
// Chasseur
// Villageois

// Medium
// LG Voyant
// LG Noir
// Villagois infecté 
// Ptite fille
// Ancien - survie a 1 mort de loups garoux
// Enfant sauvage - désigne un mentor en debut de partie, villageois tant que le mentor est en vie et si meurt = loup garou
// Dictateur
// Corbeau
// Assassin
// Geolier


// Maire 