// index.js

const db = require("./db.js");
const express = require("express");
const app = express();
const sessions = require("express-session");
const cookieParser = require("cookie-parser");
var bodyParser = require('body-parser');
console.log(`Iniciando programa...`);

(async() => {

    console.log(`MySQL -> Conectando ao Banco de Dados...`);
    console.log(`MySQL ->`, await db._select(`* FROM users`));

    app.use(express.json());
    app.use(express.urlencoded());
    app.use(cookieParser());

    app.use(sessions({
        secret: process.env.SESSION_SECRETKEY,
        saveUninitialized: true,
        cookie: { maxAge: 86400000 }, // Um dia
        resave: false
    }));

    app.get('/', function(req, res) {
        res.redirect(`/login`);
    });

    app.get(`/login`, (req, res) => {

        if (req.session.userid !== undefined) return res.redirect(`/main`);;
        return res.sendFile(`${__dirname}/public/login.html`);

    });

    app.post(`/login`, async(req, res) => {

        const conditional = await db._exists(`FROM users WHERE username="${req.body.username}" AND password="${req.body.password}"`);
        if (conditional == false) {

            res.sendFile(`${__dirname}/public/loginerror.html`);

        } else {

            req.session.userid = req.body.username;
            res.redirect(`/main`);

        };

    });

    app.get(`/register`, (req, res) => {

        if (req.session.userid !== undefined) return res.redirect(`/main`);
        return res.sendFile(`${__dirname}/public/register.html`);

    });

    app.post(`/register`, async(req, res) => {

        const conditional = await db._exists(`FROM users WHERE username="${req.body.username}"`);
        if (conditional == false) {

            db._create(`INTO users(username,displayname,password) VALUES('${req.body.username}','${req.body.displayname}','${req.body.password}')`);

            req.session.userid = req.body.username;
            res.redirect(`/main`);

        } else {

            res.sendFile(`${__dirname}/public/registererror.html`);

        };

    });

    app.get(`/main`, (req, res) => {
        if (req.session.userid !== undefined) return res.sendFile(`${__dirname}/public/main.html`);
        return res.redirect(req.originalUrl);
    });
    
    app.get(`/logout`, (req, res) => {
        req.session.destroy();
        res.redirect('/register');
    });

    app.get('*', function(req, res) {
        res.status(404).sendFile(`${__dirname}/public/error.html`);
    });

    app.listen(3000, () => {

        console.log(`Express -> Servidor iniciado com sucesso!`);

    });

})();
