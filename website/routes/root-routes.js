const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('index.twig', {
        name : "Hello World !"
    });
});

router.get('/commands', (req, res) => {
    res.render('commands/commands.twig');
});

module.exports = router;