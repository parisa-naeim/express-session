require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');

const server = express();

// Retrieve a port number if one is provided by our ho$t

// ternary form:
// const port = process.env.PORT ? process.env.PORT : 3000;

// logical OR short circuit operator
const port = process.env.PORT || 3000;

const authenticationController = require('./controllers/authentication');

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB ' + mongoose.connection.name);
})

server.use(express.urlencoded({extended: false}));
server.use(methodOverride('_method'));
server.use(morgan('dev'));
server.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

server.listen(port, () => {
    console.log('Server running at http://localhost:' + port);
});

server.get('/', (req, res) => {
    res.render('home.ejs', {
        user: req.session.user        
    });
});

server.get('/vip-lounge', (req, res) => {
    if (req.session.user) {
        res.send('Welcome to the party ' + req.session.user.username);
    } else {
        res.send('Sorry, no guests allowed. You massive weirdo');
    }
});

// attach the routes defined in the other controller
// /auth will be a prefix before each path
server.use('/auth', authenticationController);
