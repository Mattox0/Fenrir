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
	if (body.check_member && (body.member !== '' && !body.member.includes('{nb}'))) return false;
	if (body.check_bot && (body.bot !== '' && !body.bot.includes('{nb}'))) return false;
	if (body.check_online && (body.online !== '' && !body.online.includes('{nb}'))) return false;
	return true;
}

async function updateStats(body, guild) {
	const con = index.getDB();
	const stats = await getStat(guild.id);
	if (body.check_member) {
		let member = await guild.channels.cache.find(c => c.id === stats.stats_id);
		let member_message = body.member === '' ? stats.stats_message : body.member;
		if (!member) {
			member = await guild.channels.create({
				name: member_message.replace('{nb}', await sessions.allMembers(guild)),
				position: 1,
				type: ChannelType.GuildVoice,
				reason: 'Members stats'
			});
		} else {
			member.setName(member_message.replace('{nb}', await sessions.allMembers(guild)))
				.then(() => console.log('Updated members stats'))
				.catch(err => console.log(err));
		}
		await con.promise().query(`UPDATE servers SET stats_message = ?, stats_id = ? WHERE guild_id = ?`, [member_message, member.id, guild.id]);
	} else {
		let member = await guild.channels.cache.find(c => c.id === stats.stats_id);
		if (member) member.delete();
		await con.promise().query(`UPDATE servers SET stats_message = ?, stats_id = ? WHERE guild_id = ?`, [null, null, guild.id]);
	}
	if (body.check_online) {
		let online = await guild.channels.cache.find(c => c.id === stats.stats_online_id);
		let online_message = body.online === '' ? stats.stats_online_message : body.online;
		if (!online) {
			online = await guild.channels.create({
				name: online_message.replace('{nb}', await sessions.onlineMembers(guild)),
				position: 2,
				type: ChannelType.GuildVoice,
				reason: 'Online stats'
			});
		} else {
			online.setName(online_message.replace('{nb}', await sessions.onlineMembers(guild)));
		}
		await con.promise().query(`UPDATE servers SET stats_online_message = ?, stats_online_id = ? WHERE guild_id = ?`, [online_message, online.id, guild.id]);
	} else {
		let member = await guild.channels.cache.find(c => c.id === stats.stats_online_id);
		if (member) member.delete();
		await con.promise().query(`UPDATE servers SET stats_online_message = ?, stats_online_id = ? WHERE guild_id = ?`, [null, null, guild.id]);
	}
	if (body.check_bot) {
		let bot = await guild.channels.cache.find(c => c.id === stats.stats_bot_id);
		let bot_message = body.bot === '' ? stats.stats_bot_message : body.bot;
		if (!bot) {
			bot = await guild.channels.create({
				name: bot_message.replace('{nb}', await sessions.onlineMembers(guild)),
				position: 3,
				type: ChannelType.GuildVoice,
				reason: 'Bot stats'
			});
		} else {
			bot.setName(bot_message.replace('{nb}', await sessions.onlineMembers(guild)));
		}
		await con.promise().query(`UPDATE servers SET stats_bot_message = ?, stats_bot_id = ? WHERE guild_id = ?`, [bot_message, bot.id, guild.id]);
	} else {
		let member = await guild.channels.cache.find(c => c.id === stats.stats_bot_id);
		if (member) member.delete();
		await con.promise().query(`UPDATE servers SET stats_bot_message = ?, stats_bot_id = ? WHERE guild_id = ?`, [null, null, guild.id]);

	}
}

module.exports.getStat = getStat;
module.exports.validStats = validStats;
module.exports.updateStats = updateStats;