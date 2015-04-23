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
    
    db.getPublicLobbies(function(results) {
        if( results.length ) {
            var titles = [];
            for( var i = 0; i < results.length; i++ ) {
                titles.push(results[i].lobby_title);
            }
            res.render('index', { title: 'Vowb.net', login: loginData, lobbies: titles });
        } else
            res.render('index', { title: 'Vowb.net', login: loginData, lobbies: [] });
    });
    
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

// allows users to save edits to provile
router.post('/edit-profile', function(req, res, next) {
    
    // secretProfileIdValue : $("secretProfileIdValue").val(),
    // userFullName : $("#userFullName").val(),
    // userAge : $("#userAge").val(),
    // userSex : $("#userSex").val(),
    // userState : $("#userState").val(),
    // aboutMeDesc : $("#aboutMeDesc").val(),
    // userfavGames : $("#userfavGames").val(),
    // userfavShows : $("#userfavShows").val(),
    // userfavFoods : $("#userfavFoods").val(),
    // profileURL
    console.log(JSON.stringify(req.body));
    
    var loginData = getLoginData(req);
    
    var searchParams = {
        username: loginData,
        profile_pointer: req.body.secretProfileIdValue
    };
    
    //Other database fields not currently saved in profile:
    // friends
    // posts
    // threads
    // mods_for
    // profile_id
    // join_date
    // 
    
    db.search(db.userDB, searchParams, function(result) {
        if( result[0] ) {
            var security_level_integer = 0;
            if( (req.body.securityLevelAll || req.body.security_level_all) && !(req.body.security_level_all === "false") )
                security_level_integer = 0;
            else if( (req.body.securityLevelFriends || req.body.security_level_friends) && !(req.body.security_level_friends === "false") )
                security_level_integer = 1;
            else if( (req.body.securityLevelSelf || req.body.security_level_self) && !(req.body.security_level_self === "false") )
                security_level_integer = 2;
            db.update(db.profileDB, { profile_id: req.body.secretProfileIdValue }, {
                full_name: req.body.userFullName,
                //birth_date: req.body.userAge,
                gender: req.body.userSex,
                state: req.body.userState === "N/A" ? "--" : req.body.userState,
                description: /*req.body.userAge + "------xAGE_SPLITx------" + */req.body.aboutMeDesc,
                user_age: req.body.userAge,
                favorite_game: req.body.userfavGames,
                favorite_tv_show: req.body.userfavShows,
                favorite_food: req.body.userfavFoods,
                security_level: security_level_integer
            }, function() {
                // console.log("Profile update success!");
                res.end(JSON.stringify({value: "Success"}));
            });
            db.update(db.userDB, { profile_pointer: req.body.secretProfileIdValue }, {
                avatar_URL: req.body.profileURL
            });
        } else {
            // console.log("Error: credentials and profile edits did not match: "+JSON.stringify(searchParams)+".");
            res.end(JSON.stringify({ value: "Error" }));
        }
    });
});

router.post('/get-avatar',function(req, res, next) {
    db.search(db.userDB, {username: req.body.username}, function(result) {
        if( result[0] ) {
            if( !result[0].avatar_URL )
                res.status(400).end(JSON.stringify({ value: "No image" }));
            res.end(JSON.stringify({ value: result[0].avatar_URL }));
        } else {
            // console.log("Error: credentials and profile edits did not match: "+JSON.stringify(searchParams)+".");
            res.status(400).end(JSON.stringify({ value: "Error" }));
        }
    });
});

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
            // console.log("Signup: Ready to add new user \""+req.body.username+"\".");

            // Add new user to the "userDB" database
            db.add(db.userDB, {
                username: req.body.username,
                email_account: req.body.email,
                password_hash: db.hashPassword(req.body.password)
            },
            function(userCreated) {
                // This is the onCreate callback, called when it finishes
                // adding user to DB
                
                //console.log("USER CREATED: " + JSON.stringify(userCreated));
                
                db.search(db.userDB, { username: req.body.username }, function(results) {
                    if( results.length ) {
                        db.addProfile({
                            description: "Welcome to Vowb.net, "+req.body.username+"! This is where you can write a description of yourself and your personal interests. :)",
                            full_name: req.body.username
                        }, function(result) {
                            console.log("!! created profile with ID: " + JSON.stringify(result));
                            db.update(db.userDB, { username: req.body.username }, { profile_pointer: result[0].profile_id });
                        });
                    } else {
                        console.log("Database error - tell Eric: You signed up as an new user, then afterwards your user did not exist.");
                    }
                });
            });
            req.session.loggedIn = true; 
            req.session.username = req.body.username;
            
            res.end(JSON.stringify({value: "Success"}));
        } else {
            // Otherwise, complain -- the user already exists!
            // (In the future, warning message should be added here!)
            // console.log("Signup ERROR: User " + req.body.username + " already exists!");
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
            // console.log("Incorrect username or password");
            res.end(JSON.stringify({value: "Error"}));

        } else {
            req.session.loggedIn = true;
            req.session.username = req.body.username;

            // Otherwise, redirect user to homepage
            // console.log("Username and password verified.");
            res.end(JSON.stringify({value: "Success"}));
        }
    });
});


router.post('/lobbyLogin', function(req, res) {
    // Make a searchParams object for this
    var searchParams = {
        lobby_title: req.body.username,
        password: db.hashPassword(req.body.password)
    };

    // Call search function using these parameters
    db.search(db.lobbyDB, searchParams, function(results) {
        if( results.length == 0 ) {
            // If there are no results when looking for a lobby of that name, then display error
            // console.log("Incorrect username or password");
            res.end(JSON.stringify({value: "Error"}));
        } else {
            // Otherwise, redirect user to homepage
            // console.log("Username and password verified.");
            res.end(JSON.stringify({value: "Success"}));
        }
    });
});

//Pascal 03/31/2015 routing for createlobby
router.post('/createlobby', function(req, res) {

    // req.session.loggedIn = true;
   
    // req.session.username = req.body.username;


    var searchParams = {
        lobby_title: req.body.lobbyName
    };

    db.search(db.lobbyDB, searchParams, function(results) {
        if (results.length == 0) {
            // console.log("Ready to add new lobby");
            // console.log("username is " + req.session.username);

            if (req.body.password == null || req.body.password == "") {
                db.add(db.lobbyDB, {
                    lobby_title: req.body.lobbyName,
                    password: '.',
                    owner: req.session.username
                });
            } else {
                db.add(db.lobbyDB, {
                    lobby_title: req.body.lobbyName,
                    password: req.body.password,//db.hashPassword(req.body.password),
                    owner: req.session.username
                });
            }
            // console.log("Successful!")
            res.end(JSON.stringify({value: "Success"}));
        } else {
            // console.log("Lobby already exists");
            res.end(JSON.stringify({value: "Error"}));
        }
        
    });
    // if (req.session.username == null) {
    //     console.log("Not logged in");
    //     res.end(JSON.stringify({value: "Error"}));
    // } else {
    //     console.log("Successful!")
    //     res.end(JSON.stringify({value: "Success"}));
    // }

    
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
