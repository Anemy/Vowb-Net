/* This is the routing for basic webpages (landing, sign up, about, etc.) */

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

/* GET home page. */
router.get('/', function (req, res, next) {
    var loginData = getLoginData(req);

    res.render('index', { title: 'Vowb.net', login: loginData});
});
//tmp page
// router.get('/profile', function(req, res, next) { //tmp
//     // tmp profile page
//     res.render('profile', { title: 'Profile Page - Vowb.net'});
// });
// //tmp page
// router.get('/edit-profile', function(req, res, next) { //tmp
//     // tmp profile page
//     res.render('editProfPage', { title: 'Edit Profile Page - Vowb.net'});
// });

//retrieves the creating lobby page - maybe add redirect if not logged in?
router.get('/create', function(req, res, next) { //tmp
    // tmp profile page
    var loginData = getLoginData(req);

    if(loginData == "none") {
        res.render('index', { title: 'Vowb.net', login: loginData});
    }
    else {
        res.render('createLobby', { title: 'Create a Lobby - Vowb.net', login: loginData});
    }
});

/* INSERT MORE WEB PAGE ROUTES HERE (FOR EXAMPLE SIGN UP PAGE) */
router.get('/signup', function(req, res, next) {
    // sign up page request

    res.render('signup', { title: 'Signup - Vowb.net'});
});

router.post('/signup', function(req, res) {
    // For this, first:
    //  - Run a "search" on the database for a user with "username" matching
    //  - the username stored in the body of the request

    // Make a searchParams object for this
    var searchParams = {
        username: req.body.username
    };

    // Call search function using these parameters
    db.search(db.userDB, searchParams, function(results) {
        if( results.length == 0 ) {
            // If there are no results when looking for a user of that name,
            // then we add a new one
            console.log("Signup: Ready to add new user \""+req.body.username+"\".");

            // Add new user to the "userDB" database
            db.add(db.userDB, {
                username: req.body.username,
                email_account: req.body.email,
                password_hash: db.hashPassword(req.body.password)
            });
            res.end(JSON.stringify({value: "Success"}));
        } else {
            // Otherwise, complain -- the user already exists!
            // (In the future, warning message should be added here!)
            console.log("Signup ERROR: User " + req.body.username + " already exists!");
            res.end(JSON.stringify({value: "Error"}));
        }
    });
});

//Pascal 03/02/15
router.post('/login', function(req, res) {
    // Make a searchParams object for this
    var searchParams = {
        username: req.body.username,
        password_hash: db.hashPassword(req.body.password)
    };

    // Call search function using these parameters
    db.search(db.userDB, searchParams, function(results) {
        if( results.length == 0 ) {
            // If there are no results when looking for a user of that name, then display error
            console.log("Incorrect username or password");
            res.end(JSON.stringify({value: "Error"}));

        } else {
            req.session.loggedIn = true;
            req.session.username = req.body.username;

            // Otherwise, redirect user to homepage
            console.log("Username and password verified.");
            res.end(JSON.stringify({value: "Success"}));
        }
    });
});

router.post('/logout', function(req, res) {
    // VV This ends the user's login session if there is one.
    if(req.session != undefined) {
        req.session.destroy();
    }
});

router.get('/about', function(req, res, next) {
    var loginData = getLoginData(req);

    res.render('about', { title: 'About Vowb.net', login: loginData});
});

router.get('/jobs', function(req, res, next) {
    var loginData = getLoginData(req);

    res.render('jobs', { title: 'Jobs Vowb.net', login: loginData});
});

module.exports = router;
