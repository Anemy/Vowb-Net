/* This is the routing for individual lobbies. It will send a template to users with the data needed depending on the url requested */


var express = require('express');
var db = require("../database-manager/database");
var router = express.Router();

// used for session storing. Returns JSON of log info or nothing if not signed in 
var getLoginData = function (req) {
    if(req.session.loggedIn) {
        // var loginData = {
        //     "login": "yes",
        //     "username": req.session.username
        // }
        return req.session.username;
    }
    else {
        return "none"; 
    }
}

/* GET basic public lobby listing. */
router.get('/', function(req, res, next) {
    // res.send('respond with a resource');
    // TODO: 
    // Check if the lobby is real. Respond with lobby data or 404 depending. 

    var loginData = getLoginData(req);

    var password = ".";
    
    db.getPublicLobbies(function(results) {
        if( results.length ) {
            var titles = [];
            for( var i = 0; i < results.length; i++ ) {
                titles.push(results[i].lobby_title);
            }
            res.render('lobby', { title: 'Vowb.net Voice Chat Lobby' , lobbyName: req.params[0],  name: 'Mystxc', login: loginData, lobbyPassword: password, lobbies: titles });
            //res.render('index', { title: 'Vowb.net', login: loginData, lobbies: titles });
        } else
            res.render('lobby', { title: 'Vowb.net Voice Chat Lobby' , lobbyName: req.params[0],  name: 'Mystxc', login: loginData, lobbyPassword: password, lobbies: [] });
            //res.render('index', { title: 'Vowb.net', login: loginData, lobbies: [] });
    });
    
});


/* GET lobby listing. */
router.get('/*', function(req, res, next) {
    // res.send('respond with a resource');
    // TODO: 
    // Check if the lobby is real. Respond with lobby data or 404 depending. 

    var loginData = getLoginData(req);

    var searchParams = {
        lobby_title: req.params[0]
    };

    db.search(db.lobbyDB, searchParams, function(results) {
        if (results.length == 0) {
            // lobby doesn't exist
            res.render('404', { title: "404: Vowb.net page not found", url: "/lobby" + req.url });
        } else {
            var password = results[0].password;

            if(password == null) {
                password = ".";
            }

            // console.log("Lobby password found: " + password);
            // if(password == ".") {

            // }
            res.render('lobby', { title: 'Vowb.net Voice Chat Lobby' , lobbyName: req.params[0],  name: 'Mystxc', login: loginData, lobbyPassword: password});
        }
    });
});


/* POST get lobby info by name. */
router.post('/getInfo', function(req, res, next) {
    db.search(db.lobbyDB, { lobby_title: req.body.lobbyName }, function(results) {
        if( results.length ) {
            res.send(JSON.stringify({value:results[0].owner}));
        } else {
            res.status(400).send(JSON.stringify({value:"Lobby not found."}));
        }
    });
});

module.exports = router;
