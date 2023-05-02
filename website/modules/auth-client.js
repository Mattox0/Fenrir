const { clientId, clientSecret, dashboardURL } = require('../../config.json');

const OAuthClient = require('disco-oauth');
const client = new OAuthClient(clientId, clientSecret);
client.setRedirect(`${dashboardURL}/auth`);
client.setScopes('identify', 'guilds');

module.exports = client;