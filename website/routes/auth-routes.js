const express = require('express');
const authClient = require('../modules/auth-client');

const router = express.Router();

router.get('/invite', (req, res) => {
    res.redirect(`https://discord.com/api/oauth2/authorize?client_id=${process.env.clientId}&redirect_uri=${process.env.dashboardURL}/dashboard&response_type=code&scope=bot`);
});

router.get('/login', (req, res) => {
    res.redirect(`https://discord.com/api/oauth2/authorize?client_id=${process.env.clientId}&redirect_uri=${process.env.dashboardURL}/auth&response_type=code&scope=identify%20guilds`);
});

router.get('/auth', async (req, res) => {
    try {
        const code = req.query.code;
        const key = await authClient.getAccess(code);
        let user = await authClient.getUser(key);
        res.locals.avatar_url = user.avatarUrl(64);
        res.cookies.set('key', key);
        res.redirect('/dashboard');
    } catch {
        res.redirect('/');
    }
});

router.get('/logout', async (req, res) => {
    res.cookies.set('key', '');
    res.redirect('/');
});

module.exports = router;