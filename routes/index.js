const express = require('express');
const router = express.Router();

router.get('/register', (req, res) => {
    res.render('register');});

    router.post('/register', (req, res) => {
        res.send('registeren gelukt!');
    });

    router.get('/login', (req, res) => {
        res.render('login');
    });
    
    router.post('/login', (req, res) => {
        
        res.send('Inloggen gelukt!');
    });

    router.get('/welcome', (req, res) => {
       
        if (req.isAuthenticated()) {
            res.render('welcome', { username: req.user.username });
        } else {
            res.redirect('/login');
        }
    });
    
    router.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/login');
    });

    module.exports = router;

