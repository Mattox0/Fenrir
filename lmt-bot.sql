CREATE TABLE anniversaires (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	user_id VARCHAR(255),
	date VARCHAR(255),
	guild_id VARCHAR(255),
	FOREIGN KEY (guild_id) REFERENCES servers(anniv_id)
);

CREATE TABLE bans (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	user_id VARCHAR(255),
	guild_id VARCHAR(255),
	deban DATE,
	FOREIGN KEY (guild_id) REFERENCES servers(guild_id)
);

CREATE TABLE bumps (
	bump_id INTEGER PRIMARY KEY AUTOINCREMENT,
	user_id VARCHAR(20) NOT NULL,
	count_bumps INTEGER DEFAULT 0, 
	last_bump DATE, guild_id VARCHAR(255)
);

CREATE TABLE giveaways (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	message_id TEXT NOT NULL,
	channel_id TEXT NOT NULL,
	winners INTEGER,
	prize TEXT,
	duration TEXT, 
	participants TEXT, 
	hostedBy TEXT, 
	past BOOLEAN, 
	guild_id VARCHAR(255)
);

CREATE TABLE interserveur (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	guild_id_1 VARCHAR(255),
	guild_id_2 VARCHAR(255),
	channel_id_1 VARCHAR(255),
	channel_id_2 VARCHAR(255), code VARCHAR(10),
	FOREIGN KEY (guild_id_1) REFERENCES servers(guild_id),
	FOREIGN KEY (guild_id_2) REFERENCES servers(guild_id)
);

CREATE TABLE logs (
	guild_id VARCHAR(255),
	logs_id VARCHAR(255),
	channelCreate BOOLEAN DEFAULT TRUE, 
	channelDelete BOOLEAN DEFAULT TRUE, 
	channelUpdate BOOLEAN DEFAULT TRUE, 
	messageDelete BOOLEAN DEFAULT TRUE, 
	messageUpdate BOOLEAN DEFAULT TRUE, 
	roleCreate BOOLEAN DEFAULT TRUE, 
	roleDelete BOOLEAN DEFAULT TRUE, 
	emojiCreate BOOLEAN DEFAULT TRUE, 
	emojiDelete BOOLEAN DEFAULT TRUE, 
	emojiUpdate BOOLEAN DEFAULT TRUE, 
	voiceStateUpdate BOOLEAN DEFAULT TRUE, 
	guildMemberUpdate BOOLEAN DEFAULT TRUE, 
	guildMemberRemove BOOLEAN DEFAULT TRUE, 
	guildBanAdd BOOLEAN DEFAULT TRUE, 
	guildBanRemove BOOLEAN DEFAULT TRUE, 
	inviteCreate BOOLEAN DEFAULT TRUE, 
	inviteDelete BOOLEAN DEFAULT TRUE, 
	guildMemberAdd BOOLEAN DEFAULT TRUE, 
	stickerCreate BOOLEAN DEFAULT TRUE, 
	stickerDelete BOOLEAN DEFAULT TRUE, 
	threadCreate BOOLEAN DEFAULT TRUE, 
	threadDelete BOOLEAN DEFAULT TRUE, 
	guildScheduledEventCreate BOOLEAN DEFAULT TRUE, 
	roleUpdate BOOLEAN DEFAULT TRUE,
	FOREIGN KEY (guild_id) REFERENCES servers(guild_id),
	FOREIGN KEY (logs_id) REFERENCES servers(logs_id)
);

CREATE TABLE mute (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	user_id VARCHAR(255),
	guild_id VARCHAR(255),
	end_date DATE,
	FOREIGN KEY (guild_id) REFERENCES servers(guild_id)
);

CREATE TABLE poll (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	guild_id VARCHAR(255),
	channel_id VARCHAR(255),
	message_id VARCHAR(255),
	numero_1 TEXT,
	numero_1_nb TEXT,
	numero_2 TEXT,
	numero_2_nb TEXT,
	numero_3 TEXT,
	numero_3_nb TEXT,
	numero_4 TEXT,
	numero_4_nb TEXT,
	numero_5 TEXT,
	numero_5_nb TEXT,
	numero_6 TEXT,
	numero_6_nb TEXT,
	numero_7 TEXT,
	numero_7_nb TEXT,
	numero_8 TEXT,
	numero_8_nb TEXT,
	numero_9 TEXT,
	numero_9_nb TEXT,
	dateFin DATE, question TEXT,
	FOREIGN KEY (guild_id) REFERENCES servers(guild_id)
);

CREATE TABLE privateroom (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	guild_id VARCHAR(255),
	user_id VARCHAR(255),
	channel_id VARCHAR(255),
	FOREIGN KEY (guild_id) REFERENCES servers(guild_id)
);

CREATE TABLE profile (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	user_id VARCHAR(255),
	description TEXT,
	image TEXT,
	footer TEXT,
	couleur_hexa VARCHAR(10),
	film TEXT,
	musique TEXT,
	couleur TEXT,
	repas TEXT,
	adjectifs TEXT, 
	pseudo TEXT, 
	likes TEXT
);

CREATE TABLE reminderMember (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	guild_id VARCHAR(255),
	user_id VARCHAR(255),
	startDate DATE,
	FOREIGN KEY (guild_id) REFERENCES servers(guild_id)
);

CREATE TABLE remindme (
	remindme_id INTEGER PRIMARY KEY AUTOINCREMENT,
	dateFin DATE,
	user_id VARCHAR(255),
	raison TEXT
, message_id VARCHAR(255), guild_id VARCHAR(255));

CREATE TABLE servers (
	server_id INTEGER PRIMARY KEY AUTOINCREMENT,
	guild_id VARCHAR(255) NOT NULL,
	logs_id VARCHAR(255),
	ticket_id VARCHAR(255),
	stats_id VARCHAR(255),
	bumps_id VARCHAR(255),
	anniv_id VARCHAR(255),
	prison_id VARCHAR(255), 
	suggestion_id VARCHAR(255), 
	anniv_channel_id VARCHAR(255), 
	anniv_role_id VARCHAR(255), 
	prison_role_id VARCHAR(255), 
	prison_admin_id VARCHAR(255), 
	mute_id VARCHAR(255), 
	stats_bot_id VARCHAR(255), 
	stats_online_id VARCHAR(255), 
	stats_bot_message VARCHAR(30), 
	stats_online_message VARCHAR(30), 
	stats_message VARCHAR(30), 
	privateroom_category_id VARCHAR(255), 
	privateroom_channel_id VARCHAR(255)
);

CREATE TABLE sqlite_sequence(name,seq);

CREATE TABLE tickets (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	guild_id VARCHAR(255),
	user_id VARCHAR(255),
	channel_id VARCHAR(255),
	deleted BOOLEAN DEFAULT 0
);

CREATE TABLE warns (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	warn_id VARCHAR(255),
	user_id VARCHAR(255),
	guild_id VARCHAR(255),
	modo_id VARCHAR(255),
	warn_date DATE, raison TEXT,
	FOREIGN KEY (guild_id) REFERENCES servers(guild_id)
);













INSERT INTO "servers" ("server_id", "guild_id", "logs_id", "ticket_id", "stats_id", "bumps_id", "anniv_id", "prison_id", "suggestion_id", "anniv_channel_id", "anniv_role_id", "prison_role_id", "prison_admin_id", "mute_id", "stats_bot_id", "stats_online_id", "stats_bot_message", "stats_online_message", "stats_message", "privateroom_category_id", "privateroom_channel_id") VALUES
('8', '901980905579643001', NULL, NULL, NULL, NULL, NULL, NULL, '913227134338736158', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

INSERT INTO "sqlite_sequence" ("name", "seq") VALUES
('giveaways', '44'),
('bumps', '11'),
('servers', '8'),
('tickets', '39'),
('remindme', '14'),
('anniversaires', '2'),
('warns', '17'),
('bans', '1'),
('interserveur', '3'),
('reminderMember', '6'),
('privateroom', '14'),
('profile', '7'),
('poll', '9');


