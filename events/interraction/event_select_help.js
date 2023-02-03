const {EmbedBuilder} = require('discord.js')
let date = new Date()

module.exports = {
    name:'select_help',
    description:'Check les entrées du help',
    async execute(...params) {
        let interaction = params[0];
        let choix = interaction.values[0];
        switch (choix) {
            case 'accueil':
                const home = new EmbedBuilder()
                    .setColor('#2f3136')
                    .setAuthor({name:'🏘️ ・ Accueil'})
                    .setDescription(`<a:LMT_arrow:1065548690862899240> Choississez une catégorie pour avoir les commandes correspondantes\n\n> [Support](https://discord.gg/p9gNk4u)`)
                    .setFooter({text:`Choississez une catégorie dans le sélecteur ci-dessous`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                await interaction.message.edit({embeds:[home]})
                return interaction.deferUpdate();
            case 'setup':
                const setup = new EmbedBuilder()
                    .setColor('#2f3136')
                    .setAuthor({name:'⚙️ ・ Setup - Tous les systèmes à installer pour votre serveur'})
                    .setDescription(`>>> \`/setup anniversaire\` : Un système d'anniversaire complet
                    \`/setup bumps\` : Un classement des bumps (avec Disboard)
                    \`/setup logs\` : Un système de logs avec choix des parametres
                    \`/setup prison\` : Un système de prison pour aider à la modération
                    \`/setup privateroom\` : Un système de salons vocaux personalisé
                    \`/setup stats\` : Un système de comptage de membres
                    \`/setup suggestion\` : Un système de suggestions
                    \`/setup ticket\` : Un système de ticket
                    \`/setup infos\` : Un résumé des systèmes activés ou non 
                    `)
                    .setFooter({text:`Choississez une catégorie dans le sélecteur ci-dessous`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                await interaction.message.edit({embeds:[setup]})
                return interaction.deferUpdate();
            case 'disable' : 
                const disable = new EmbedBuilder()
                    .setColor('#2f3136')
                    .setAuthor({name:'🚫 ・ Disable - Un système pour désactiver les systèmes de setup'})
                    .setDescription(`>>> \`/disable anniversaire\` : Désactive le système d'anniversaire
                    \`/disable bumps\` : Désactive le comptage et le classement des bumps
                    \`/disable logs\` : Désactive le système de logs 
                    \`/disable prison\` : Désactive le système de prison 
                    \`/disable privateroom\` : Désactive le système de salons vocaux personalisé
                    \`/disable stats\` : Désactive le système de comptage de membres
                    \`/disable suggestion\` : Désactive le système de suggestions
                    \`/disable ticket\` : Désactive le système de ticket
                    `)
                    .setFooter({text:`Choississez une catégorie dans le sélecteur ci-dessous`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                await interaction.message.edit({embeds:[disable]})
                return interaction.deferUpdate();
            case 'interaction' :
                const social = new EmbedBuilder()
                    .setColor('#2f3136')
                    .setAuthor({name:'💞 ・ Social - Interragissez avec d\'autres utilisateur'})
                    .setDescription(`>>> \`/bite <user>\` : Pour mordre quelqu'un
                    \`/blush\` : Te fait rougir
                    \`/bully <user>\` : Intimide quelqu'un
                    \`/cry <user>\` : Pleure aupres de quelqu'un
                    \`/dance <user>\` : Danse avec quelqu'un
                    \`/glomp\` : Glousse
                    \`/handhold <user>\` : Serre la main de quelqu'un
                    \`/happy\` : Sois content
                    \`/hug <user>\` : Fais un calin a quelqu'un
                    \`/kill <user>\` : Tue quelqu'un
                    \`/pat <user>\` : Réconforte quelqu'un
                    \`/kiss <user>\` : Embrasse quelqu'un
                    \`/poke <user>\` : Donne un petit coup à quelqu'un
                    \`/slap <user>\` : Donne une gifle à quelqu'un
                    \`/smile\` : Sourit !
                    \`/wave <user>\` : Salue quelqu'un
                    \`/wink <user>\` : Fait un clin d'oeil à quelqu'un
                    \`/yeet <user>\` : Donne un coup de pied à quelqu'un
                    `)
                    .setFooter({text:`Choississez une catégorie dans le sélecteur ci-dessous`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                await interaction.message.edit({embeds:[social]})
                return interaction.deferUpdate();
            case 'animals' : 
                const animals = new EmbedBuilder()
                    .setColor('#2f3136')
                    .setAuthor({name:'🐶 ・ Animaux - Affichez vos animaux favoris'})
                    .setDescription(`>>> \`/animals axolot\` : Affiche un axolot
                    \`/animals bird\` : Affiche un oiseau
                    \`/animals bunny\` : Affiche un lapin
                    \`/animals cat\` : Affiche un chat
                    \`/animals dog\` : Affiche un chien
                    \`/animals duck\` : Affiche un canard
                    \`/animals elephant\` : Affiche un elephant
                    \`/animals fox\` : Affiche un renard
                    \`/animals kangourou\` : Affiche un kangourou
                    \`/animals koala\` : Affiche un koala
                    \`/animals lizard\` : Affiche un reptile
                    \`/animals panda\` : Affiche un panda
                    \`/animals raccoon\` : Affiche un raton laveur
                    \`/animals redpanda\` : Affiche un panda roux
                    `)
                    .setFooter({text:`Choississez une catégorie dans le sélecteur ci-dessous`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                await interaction.message.edit({embeds:[animals]})
                return interaction.deferUpdate();
            case 'activity' : 
                const activity = new EmbedBuilder()
                    .setColor('#2f3136')
                    .setAuthor({name:'📡 ・ Activitées - Lancez les activitées de Discord'})
                    .setDescription(`>>> \`/activity youtube\` : Lance l'activité Youtube Together
                    \`/activity awkword\` : Lance l'activité Awkword
                    \`/activity betrayal\` : Lance l'activité Betrayal
                    \`/activity checkers\` : Lance l'activité Checkers
                    \`/activity chess\` : Lance l'activité Chess
                    \`/activity doodlecrew\` : Lance l'activité Doodlecrew
                    \`/activity fishing\` : Lance l'activité Fishing
                    \`/activity lettertile\` : Lance l'activité Lettertile
                    \`/activity poker\` : Lance l'activité Poker
                    \`/activity puttparty\` : Lance l'activité Puttparty
                    \`/activity sketchyartists\` : Lance l'activité Sketchyartists
                    \`/activity spellcast\` : Lance l'activité Spellcast
                    \`/activity wordsnack\` : Lance l'activité Wordsnack
                    `)
                    .setFooter({text:`Choississez une catégorie dans le sélecteur ci-dessous`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                await interaction.message.edit({embeds:[activity]})
                return interaction.deferUpdate();
            case 'game' : 
                const game = new EmbedBuilder()
                    .setColor('#2f3136')
                    .setAuthor({name:'🎮 ・ Jeux - L\'ensemble des jeux à jouer avec vos amis'})
                    .setDescription(`>>> \`/duel <user>\` : Lance un duel avec quelqu'un
                    \`/fasttype\` : Lance une partie de fasttype en groupe ou en solo
                    \`/memory\` : Lance une partie de memory
                    \`/morpion <user>\` : Lance une partie de morpion avec quelqu'un
                    \`/pendu\` : Lance une partie de pendu en groupe ou en solo
                    \`/puissance4 <user>\` : Lance une partie de puissance4 avec quelqu'un
                    \`/rps <user>\` : Lance une partie de Pierre Feuille Ciseaux avec quelqu'un ou solo
                    \`/akinator\` : Lance une partie d'akinator
                    `)
                    .setFooter({text:`Choississez une catégorie dans le sélecteur ci-dessous`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                await interaction.message.edit({embeds:[game]})
                return interaction.deferUpdate();
            case 'image' : 
                const image = new EmbedBuilder()
                    .setColor('#2f3136')
                    .setAuthor({name:'📷 ・ Images - Modifiez vos photo de profil'})
                    .setDescription(`>>> \`/blurp <user>\` : Brouille l'image de soi ou de quelqu'un
                    \`/changemymind <texte>\` : Invoque un \`Change my mind !\` avec le texte de votre choix
                    \`/color <hex>\` : Affiche les informations d'une couleur avec un code hexadécimal
                    \`/gay <user>\` : Convertis sa photo de profile ou celle de quelqu'un
                    \`/jail <user>\` : Met en prison la photo de soi ou de quelqu'un
                    \`/mission <user>\` : Change la photo de profil de soi ou de quelqu'un
                    \`/nasa\` : Invoque la photo quotidienne de la nasa
                    \`/pixelate\` : Pixelise la photo de profil de soi ou de quelqu'un
                    \`/stickbug\` : Invoque un stickbug de soi ou de quelqu'un
                    \`/tweet\` : Cree un faux tweet twitter avec le texte de votre choix
                    \`/wasted\` : Cree une image "wasted" de la photo de profil de soi ou de quelqu'un
                    \`/ytbcomment\` : Cree un faux commentaire youtube avec sa photo de profil
                    `)
                    .setFooter({text:`Choississez une catégorie dans le sélecteur ci-dessous`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                await interaction.message.edit({embeds:[image]})
                return interaction.deferUpdate();
            case 'modo' : 
                const modo = new EmbedBuilder()
                    .setColor('#2f3136')
                    .setAuthor({name:'🔨 ・ Modérateur - Toutes les commandes de Modérations'})
                    .setDescription(`>>> \`/ban <user>\` : Bannit un utilisateur
                    \`/unban <userID>\` : Débannit un utilisateur
                    \`/banlist\` : Affiche la liste des bannis de votre serveur
                    \`/mute <user>\` : Mute un utilisateur
                    \`/unmute <user>\` : Démute un utilisateur
                    \`/clear <nb>\` : Supprime un nombre de message
                    \`/lock <channel>\` : Verrouille un salon
                    \`/unlock <channel>\` : Déverouille un salon
                    \`/prison <user>\` : Met un prison un utilisateur en clonant le channel
                    \`/addprison <user>\` : Ajoute un utilisateur en prison
                    \`/liberate <user>\` : Libere un utilisateur de la prison
                    \`/slowmode <temp> <channel>\` : Règle le slowmode d'un salon
                    \`/warn user add <user>\` : Ajoute un warn à un utilisateur
                    \`/warn user remove <user>\` : Retire un warn à un utilisateur
                    \`/warn clear all\` : Efface tous les avertissements du serveur
                    \`/warn clear user <user>\` : Efface les avertissement d'un utilisateur
                    \`/warn list all\` : Affiche tous les avertissements du serveur
                    \`/warn list user <user>\` : Affiche tous les avertissement d'un utilisateur
                    `)
                    .setFooter({text:`Choississez une catégorie dans le sélecteur ci-dessous`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                await interaction.message.edit({embeds:[modo]})
                return interaction.deferUpdate();
            case 'fun':
                const fun = new EmbedBuilder()
                    .setColor('#2f3136')
                    .setAuthor({name:'🎉 ・ Fun - Toutes les commandes amusantes'})
                    .setDescription(`>>> \`/8ball <question>\` : Posez votre question au bot !
                    \`/achievement <texte>\` : Invoque une achievement minecraft
                    \`/anime <titre>\` : Toutes les informations d'un animé
                    \`/ascii <texte>\` : Affiche votre texte en format ASCII
                    \`/commit\` : Invente un nom de commit {Developper}
                    \`/emogify <texte>\` : Traduit votre texte en format emoji
                    \`/hack <user>\` : Permet d'hacker un ami
                    \`/lovecalc <user1>\` : Calcule l'amour entre vous et quelqu'un d'autre
                    \`/mcskin <username>\` : Affiche les informations d'un compte minecraft
                    \`/pof\` : Pile ou face ?
                    \`/pokefusion\` : Invoque une fusion de deux pokémons
                    \`/quote\` : Invoque une citation issue d'un animé
                    \`/roulette\` : Lance une partie de roulette avec vos amis
                    \`/tierlist <liste>\` : Cree une tierlist aléatoire
                    \`/xkcd\` : Invoque un meme xkcd
                    \`/rate something <texte>\` : Note n'importe quoi
                    \`/rate user <user>\` : Note quelqu'un
                    `)
                    .setFooter({text:`Choississez une catégorie dans le sélecteur ci-dessous`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                await interaction.message.edit({embeds:[fun]})
                return interaction.deferUpdate();
            case 'utile' : 
                const utile = new EmbedBuilder()
                    .setColor('#2f3136')
                    .setAuthor({name:'💡 ・ Utiles - Toutes les Commandes utiles'})
                    .setDescription(`>>> \`/userinfo <user>\` : Affiche toutes les informations de soi ou de quelqu'un
                    \`/serverinfo\` : Affiche toutes les informations du serveur
                    \`/translate <from> <to> <texte>\` : Traduit le texte
                    \`/sugg <text>\` : Crée une suggestion
                    \`/rappel <temps> <raison>\` : Crée un rappel
                    \`/pp <user>\` : Affiche la photo de profil de soi ou de quelqu'un
                    \`/meteo <ville>\` : Affiche la météo d'une ville
                    \`/poll\` : Crée un sondage avec les question réponses de votre choix
                    \`/id <user>\` : Affiche l'id de soi ou de quelqu'un
                    \`/help\` : Affiche cette page
                    \`/count <text>\` : Compte le nombre de caractere dans une phrase
                    \`/calc <expression>\` : Calcule l'expression
                    \`/bumps\` : Affiche le classement des bumps

                    \`/profile edit\` : Edite ta page de profile
                    \`/profile view\` : Affiche la page de profile

                    \`/steam random\` : Affiche un jeu aléatoire sur Steam
                    \`/steam search\` : Affiche tous les jeux correspondants a votre recherche

                    \`/emote add\` : Ajoute une emote au serveur
                    \`/emote delete\` : Supprime une emote du serveur
                    \`/emote rename\` : Renomme une emote du serveur
                    \`/emote image\` : Affiche un emoji
                    \`/emote list\` : Liste tous les emojis du serveurs
                    
                    \`/anniv set\` : Ajoute ta date d'anniversaire
                    \`/anniv delete\` : Supprime ta date d'anniversaire
                    \`/anniv show\` : Affiche ta date d'anniversaire
                    \`/anniv list\` : Affiche la liste des anniversaires

                    \`/giveaway create\` : Cree un giveaways
                    \`/giveaway end\` : Fini un giveaways
                    \`/giveaway cancel\` : Annule un giveaways
                    \`/giveaway reroll\` : Relance le choix des gagnants
                    \`/giveaway count\` : Liste les giveaways actif

                    \`/interserveur open\` : Lance un code pour un interserveur
                    \`/interserveur join <code>\` : Rejoint l'interserveur
                    \`/interserveur infos\` : Affiche les informations de l'interserveur

                    \`/vocal private\` : Met le vocal en privé
                    \`/vocal add\` : Ajoute un modérateur au vocal privé
                    \`/vocal limit\` : Ajoute une limite au vocal privé
                    \`/vocal rename\` : Renomme le nom du salon privé`)
                    .setFooter({text:`Choississez une catégorie dans le sélecteur ci-dessous`, iconURL:'https://cdn.discordapp.com/avatars/784943061616427018/2dd6a7254954046ce7aa31c42f1147e4.webp'})
                await interaction.message.edit({embeds:[utile]})
                return interaction.deferUpdate();
        }
    }
}