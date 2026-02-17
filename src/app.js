const express = require('express');
const path = require('path');
const session = require('express-session');
const routes = require('./routes');

const app = express();

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Session
app.use(session({
    secret: 'laudoia-secret-key',
    resave: false,
    saveUninitialized: true
}));

// Routes
app.use('/', routes);

module.exports = app;
