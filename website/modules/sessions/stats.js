const { ChannelType } = require('discord.js');
const index = require('../../../index');
const sessions = require('../sessions');

async function getStat(id) {
	const con = index.getDB();
	let [stats] = await con.promise().query(`SELECT stats_id, stats_bot_id, stats_online_id, stats_message, stats_bot_message, stats_online_message FROM servers WHERE guild_id = ?`, [id])
	if (stats.length > 0) return stats[0];
	return null;
}

async function validStats(body) {
	if (body.check_member && body.member === '') return false;
	if (body.check_bot && body.bot === '') return false;
	if (body.check_online && body.online === '') return false;
	return true;
}

async function updateStats(body, guild) {
	const con = index.getDB();
	const stats = await getStat(guild.id);
	if (body.check_member) {
		let member = await guild.channels.cache.find(c => c.id === stats.stats_id);
		if (!member) {
			member = await guild.channels.create({
				name: body.member.replace('{nb}', await sessions.allMembers(guild)),
				position: 1,
				type: ChannelType.GuildVoice,
				reason: 'Members stats'
			});
		} else {
			member.setName(body.member.replace('{nb}', await sessions.allMembers(guild)));
		}
		await con.promise().query(`UPDATE servers SET stats_message = ?, stats_id = ? WHERE guild_id = ?`, [body.member, member.id, guild.id]);
	}
	if (body.check_online) {
		let online = await guild.channels.cache.find(c => c.id === stats.stats_online_id);
		if (!online) {
			online = await guild.channels.create({
				name: body.online.replace('{nb}', await sessions.onlineMembers(guild)),
				position: 2,
				type: ChannelType.GuildVoice,
				reason: 'Online stats'
			});
		} else {
			online.setName(body.online.replace('{nb}', await sessions.onlineMembers(guild)));
		}
		await con.promise().query(`UPDATE servers SET stats_online_message = ?, stats_online_id = ? WHERE guild_id = ?`, [body.online, online.id, guild.id]);
	}
	if (body.check_bot) {
		let bot = await guild.channels.cache.find(c => c.id === stats.stats_bot_id);
		if (!bot) {
			bot = await guild.channels.create({
				name: body.bot.replace('{nb}', await sessions.botMembers(guild)),
				position: 3,
				type: ChannelType.GuildVoice,
				reason: 'Bot stats'
			});
		} else {
			bot.setName(body.bot.replace('{nb}', await sessions.botMembers(guild)));
		}
		await con.promise().query(`UPDATE servers SET stats_bot_message = ?, stats_bot_id = ? WHERE guild_id = ?`, [body.bot, bot.id, guild.id]);
	}
}

module.exports.getStat = getStat;
module.exports.validStats = validStats;
module.exports.updateStats = updateStats;