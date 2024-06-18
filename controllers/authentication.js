const express = require('express');
const bcrypt = require('bcrypt');

const User = require('../models/user');

const router = express.Router();

router.get('/sign-up', (req, res) => {
    res.render('authentication/sign-up.ejs');
});

router.post('/sign-up', async (req, res) => {
    // TODO: do this better
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
        // TODO: show the sign up page again with the following error
        res.send('Username is already taken');
        return;
    }

    if (req.body.password !== req.body.confirmPassword) {
        // TODO: show the sign up page again with the following error
        res.send('Password and password again did not match');
        return;
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hashedPassword; // this is what the database

    const user = await User.create(req.body);

    res.redirect('/');
});

router.get('/sign-in', (req, res) => {
    res.render('authentication/sign-in.ejs', { error: '' });
});

router.post('/sign-in', async (req, res) => {
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
        res.render('authentication/sign-in.ejs', {
            error: 'Username not found' 
        });
        return;
    }

    const validPassword = bcrypt.compareSync(
        req.body.password,
        user.password
    );

    if (!validPassword) {
        res.render('authentication/sign-in.ejs', {
            error: 'Invalid password. Please try again'
        });
        return;
    }

    req.session.user = {
        username: user.username
    };

    res.redirect('/');
});

// This should be a DELETE request
router.get('/sign-out', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;