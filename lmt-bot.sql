CREATE TABLE `anniversaires` (
  `id` int(11) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `date` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Structure de la table `bans`
--

CREATE TABLE `bans` (
  `id` int(11) NOT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `guild_id` varchar(255) DEFAULT NULL,
  `dateBan` date DEFAULT NULL,
  `deban` date DEFAULT NULL,
  `moderator_id` varchar(255) DEFAULT NULL,
  `reason` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `giveaways`
--

CREATE TABLE `giveaways` (
  `id` int(11) NOT NULL,
  `message_id` text NOT NULL,
  `guild_id` varchar(255) DEFAULT NULL,
  `channel_id` text NOT NULL,
  `winners` int(11) DEFAULT NULL,
  `prize` text,
  `duration` text,
  `participants` text,
  `hostedBy` text,
  `past` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `interserveur`
--

CREATE TABLE `interserveur` (
  `id` int(11) NOT NULL,
  `guild_id_1` varchar(255) DEFAULT NULL,
  `guild_id_2` varchar(255) DEFAULT NULL,
  `channel_id_1` varchar(255) DEFAULT NULL,
  `channel_id_2` varchar(255) DEFAULT NULL,
  `code` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `logs`
--

CREATE TABLE `logs` (
  `guild_id` varchar(255) DEFAULT NULL,
  `logs_id` varchar(255) DEFAULT NULL,
  `channelCreate` tinyint(1) DEFAULT '1',
  `channelDelete` tinyint(1) DEFAULT '1',
  `channelUpdate` tinyint(1) DEFAULT '1',
  `messageDelete` tinyint(1) DEFAULT '1',
  `messageUpdate` tinyint(1) DEFAULT '1',
  `messageDeleteBulk` tinyint(1) DEFAULT '1',
  `roleCreate` tinyint(1) DEFAULT '1',
  `roleDelete` tinyint(1) DEFAULT '1',
  `roleUpdate` tinyint(1) DEFAULT '1',
  `emojiCreate` tinyint(1) DEFAULT '1',
  `emojiDelete` tinyint(1) DEFAULT '1',
  `emojiUpdate` tinyint(1) DEFAULT '1',
  `voiceStateUpdate` tinyint(1) DEFAULT '1',
  `guildMemberUpdate` tinyint(1) DEFAULT '1',
  `guildMemberRemove` tinyint(1) DEFAULT '1',
  `guildBanAdd` tinyint(1) DEFAULT '1',
  `guildBanRemove` tinyint(1) DEFAULT '1',
  `inviteCreate` tinyint(1) DEFAULT '1',
  `inviteDelete` tinyint(1) DEFAULT '1',
  `guildMemberAdd` tinyint(1) DEFAULT '1',
  `stickerCreate` tinyint(1) DEFAULT '1',
  `stickerDelete` tinyint(1) DEFAULT '1',
  `stickerUpdate` tinyint(1) DEFAULT '1',
  `threadCreate` tinyint(1) DEFAULT '1',
  `threadDelete` tinyint(1) DEFAULT '1',
  `threadUpdate` tinyint(1) DEFAULT '1',
  `threadMembersUpdate` tinyint(1) DEFAULT '1',
  `threadMemberUpdate` tinyint(1) DEFAULT '1',
  `pseudo` tinyint(1) DEFAULT '1',
  `boost` tinyint(1) DEFAULT '1',
  `channelPinsUpdate` tinyint(1) DEFAULT '1',
  `guildScheduledEventCreate` tinyint(1) DEFAULT '1',
  `guildScheduledEventDelete` tinyint(1) DEFAULT '1',
  `guildScheduledEventUpdate` tinyint(1) DEFAULT '1',
  `guildScheduledEventUserAdd` tinyint(1) DEFAULT '1',
  `guildScheduledEventUserRemove` tinyint(1) DEFAULT '1',
  `webhookUpdate` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Structure de la table `mute`
--

CREATE TABLE `mute` (
  `id` int(11) NOT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `guild_id` varchar(255) DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `dateMute` date DEFAULT NULL,
  `reason` text,
  `moderator_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `poll`
--

CREATE TABLE `poll` (
  `id` int(11) NOT NULL,
  `guild_id` varchar(255) DEFAULT NULL,
  `channel_id` varchar(255) DEFAULT NULL,
  `message_id` varchar(255) DEFAULT NULL,
  `numero_1` text,
  `numero_1_nb` text,
  `numero_2` text,
  `numero_2_nb` text,
  `numero_3` text,
  `numero_3_nb` text,
  `numero_4` text,
  `numero_4_nb` text,
  `numero_5` text,
  `numero_5_nb` text,
  `numero_6` text,
  `numero_6_nb` text,
  `numero_7` text,
  `numero_7_nb` text,
  `numero_8` text,
  `numero_8_nb` text,
  `numero_9` text,
  `numero_9_nb` text,
  `dateFin` datetime DEFAULT NULL,
  `question` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `privateroom`
--

CREATE TABLE `privateroom` (
  `id` int(11) NOT NULL,
  `guild_id` varchar(255) DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `channel_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `privateroom`
--

-- --------------------------------------------------------

--
-- Structure de la table `profile`
--

CREATE TABLE `profile` (
  `id` int(11) NOT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `description` text,
  `image` text,
  `footer` text,
  `couleur_hexa` varchar(10) DEFAULT NULL,
  `film` text,
  `musique` text,
  `repas` text,
  `adjectifs` text,
  `pseudo` text,
  `likes` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `reminderMember`
--

CREATE TABLE `reminderMember` (
  `id` int(11) NOT NULL,
  `guild_id` varchar(255) DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `startDate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `remindme`
--

CREATE TABLE `remindme` (
  `remindme_id` int(11) NOT NULL,
  `dateFin` date DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `raison` text,
  `message_id` varchar(255) DEFAULT NULL,
  `guild_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `servers`
--

CREATE TABLE `servers` (
  `server_id` int(11) NOT NULL,
  `guild_id` varchar(255) NOT NULL,
  `logs_id` varchar(255) DEFAULT NULL,
  `ticket_id` varchar(255) DEFAULT NULL,
  `stats_id` varchar(255) DEFAULT NULL,
  `anniv_id` varchar(255) DEFAULT NULL,
  `prison_id` varchar(255) DEFAULT NULL,
  `suggestion_id` varchar(255) DEFAULT NULL,
  `anniv_channel_id` varchar(255) DEFAULT NULL,
  `anniv_role_id` varchar(255) DEFAULT NULL,
  `anniv_description` text,
  `anniv_hour` varchar(50) DEFAULT NULL,
  `prison_role_id` varchar(255) DEFAULT NULL,
  `prison_admin_id` varchar(255) DEFAULT NULL,
  `mute_id` varchar(255) DEFAULT NULL,
  `stats_bot_id` varchar(255) DEFAULT NULL,
  `stats_online_id` varchar(255) DEFAULT NULL,
  `stats_bot_message` varchar(30) DEFAULT NULL,
  `stats_online_message` varchar(30) DEFAULT NULL,
  `stats_message` varchar(30) DEFAULT NULL,
  `privateroom_category_id` varchar(255) DEFAULT NULL,
  `privateroom_channel_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Structure de la table `tickets`
--

CREATE TABLE `tickets` (
  `id` int(11) NOT NULL,
  `guild_id` varchar(255) DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `channel_id` varchar(255) DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Structure de la table `warns`
--

CREATE TABLE `warns` (
  `id` int(11) NOT NULL,
  `warn_id` varchar(255) DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `guild_id` varchar(255) DEFAULT NULL,
  `modo_id` varchar(255) DEFAULT NULL,
  `warn_date` date DEFAULT NULL,
  `raison` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Index pour la table `anniversaires`
--
ALTER TABLE `anniversaires`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Index pour la table `bans`
--
ALTER TABLE `bans`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Index pour la table `giveaways`
--
ALTER TABLE `giveaways`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `interserveur`
--
ALTER TABLE `interserveur`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `logs`
--
ALTER TABLE `logs`
  ADD UNIQUE KEY `guild_id` (`guild_id`);

--
-- Index pour la table `mute`
--
ALTER TABLE `mute`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `poll`
--
ALTER TABLE `poll`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `privateroom`
--
ALTER TABLE `privateroom`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `profile`
--
ALTER TABLE `profile`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Index pour la table `reminderMember`
--
ALTER TABLE `reminderMember`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `remindme`
--
ALTER TABLE `remindme`
  ADD PRIMARY KEY (`remindme_id`);

--
-- Index pour la table `servers`
--
ALTER TABLE `servers`
  ADD PRIMARY KEY (`server_id`),
  ADD UNIQUE KEY `guild_id` (`guild_id`);

--
-- Index pour la table `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `warns`
--
ALTER TABLE `warns`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `anniversaires`
--
ALTER TABLE `anniversaires`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT pour la table `bans`
--
ALTER TABLE `bans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `giveaways`
--
ALTER TABLE `giveaways`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `interserveur`
--
ALTER TABLE `interserveur`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `mute`
--
ALTER TABLE `mute`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `poll`
--
ALTER TABLE `poll`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT pour la table `privateroom`
--
ALTER TABLE `privateroom`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT pour la table `profile`
--
ALTER TABLE `profile`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT pour la table `reminderMember`
--
ALTER TABLE `reminderMember`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `remindme`
--
ALTER TABLE `remindme`
  MODIFY `remindme_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `servers`
--
ALTER TABLE `servers`
  MODIFY `server_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `tickets`
--
ALTER TABLE `tickets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `warns`
--
ALTER TABLE `warns`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;
