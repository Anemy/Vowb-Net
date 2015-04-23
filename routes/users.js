/* This is the routing for individual users. It will send a template to users with the data needed */


var express = require('express');
var router = express.Router();
var db = require('../database-manager/database.js');

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

var convertLastOnline= function(lastOnline) {
    if( !lastOnline )
        return "never";
    var time = Date.now() - parseInt(lastOnline);
    if( time < 1000 ) {
        return Math.floor(time) + " millisecond" +(time==1?"":"s")+ " ago";
    }
    time /= 1000;
    if( time < 60 ) {
        return Math.floor(time) + " second" +(time==1?"":"s")+ " ago";
    }
    time /= 60;
    if( time < 60 ) {
        return Math.floor(time) + " minute" +(time==1?"":"s")+ " ago";
    }
    time /= 60;
    if( time < 24 ) {
        return Math.floor(time) + " hour" +(time==1?"":"s")+ " ago";
    }
    time /= 24;
    if( time < 365 ) {
        return Math.floor(time) + " day" +(time==1?"":"s")+ " ago";
    }
    time /= 365;
    if( time < 10 ) {
        return Math.floor(time) + " decade" +(time==1?"":"s")+ " ago";
    }
    time /= 10;
    if( time < 10 ) {
        return Math.floor(time) + " centur" +(time==1?"y":"ies")+ " ago";
    }
    time /= 10;
    if( time < 20 ) {
        return Math.floor(time) + " millenni" +(time==1?"um":"a")+ " ago";
    }
    time /= 20;
    if( time < 1000 ) {
        return Math.floor(time) + " ice age" +(time==1?"":"s")+ " ago";
    }
    return "forever ago";
}

/* GET EDIT users listing. */
router.get('/edit/*', function(req, res, next) {

    //DO VERIFICATION LATER LOL - OR MAYBE JUST WHEN THEY HIT SAVE?
    var loginData = getLoginData(req);
    // ^ would be none if they aren't logged in
    // could just check if requested page and your page are the same

    // Example:
    //res.render('userPage', { name: 'Mystxc'});
    db.search(db.userDB, { username: loginData }, function(result) {
        if( result.length > 0 ) {
            user = result[0];
            db.search(db.profileDB, { profile_id: user.profile_pointer }, function(presult) {
                dataObject = presult[0];
                if( !dataObject ) {
                    db.addProfile({
                        description: "Welcome to Vowb.net, "+user.username+"! Your profile got generated late.",
                        full_name: user.username
                    }, function(pcresult) {
                        console.log("!! created profile with ID: " + JSON.stringify(pcresult));
                        db.update(db.userDB, { username: user.username }, { profile_pointer: pcresult[0].profile_id });
                        db.search(db.profileDB, { profile_id: pcresult[0].profile_id }, function(presult) {
                            dataObject = presult[0];
                            dataObject.login = loginData;
                            dataObject.title = "Vowb.net - Edit Profile";
                            dataObject.username = loginData;
                            dataObject.security_level_all       = (dataObject.security_level === 0 || (!dataObject.security_level));
                            dataObject.security_level_friends   = (dataObject.security_level === 1);
                            dataObject.security_level_self      = (dataObject.security_level === 2);
                            
                            //var split = dataObject.description.split("------xAGE_SPLITx------");
                            //dataObject.description = split.length > 1 ? split[1] : split[0];//"No profile? That's OK. This guy has yet to make one.";
                            //dataObject.user_age = split[0];//dataObject.birth_date;
                            //dataObject.user_age = dataObject.birth_date;
                            dataObject.profileURL = user.avatar_URL;
                            dataObject.time = Math.floor((user.time/60000));
                            dataObject.online = user.online;
                            dataObject.current_lobby = user.current_lobby;
                            dataObject.last_online = convertLastOnline(user.last_online);
                            if( !dataObject.current_lobby )
                                dataObject.current_lobby = "OFFLINE";
                            if( !dataObject.time )
                                dataObject.time = 0;
                            if( !dataObject.online )
                                dataObject.online = false;
                            res.render('editProfPage', dataObject);

                        });
                    });
                } else {
                    dataObject.login = loginData;
                    dataObject.title = "Vowb.net - Edit Profile";
                    dataObject.username = loginData;
                    dataObject.security_level_all       = (dataObject.security_level === 0 || (!dataObject.security_level));
                    dataObject.security_level_friends   = (dataObject.security_level === 1);
                    dataObject.security_level_self      = (dataObject.security_level === 2);
                    //var split = dataObject.description.split("------xAGE_SPLITx------");
                    //dataObject.description = split.length > 1 ? split[1] : split[0];//"No profile? That's OK. This guy has yet to make one.";
                    //dataObject.user_age = split[0];//dataObject.birth_date;
                    //dataObject.user_age = dataObject.birth_date;
                    dataObject.profileURL = user.avatar_URL;
                    dataObject.time = Math.floor((user.time/60000));
                    dataObject.online = user.online;
                    dataObject.current_lobby = user.current_lobby;
                    dataObject.last_online = convertLastOnline(user.last_online);
                    if( !dataObject.current_lobby )
                        dataObject.current_lobby = "OFFLINE";
                    if( !dataObject.time )
                        dataObject.time = 0;
                    if( !dataObject.online )
                        dataObject.online = false;
                    res.render('editProfPage', dataObject);
                }
            });
        }
        else {
            res.render('404', { title: "404: Vowb.net page not found", url: "/users" + req.url });
        }
    });
});

/* GET users listing. */
router.get('/*', function(req, res, next) {
    //res.send('respond with a resource');
    var loginData = getLoginData(req);
    // Example:
    //res.render('userPage', { name: 'Mystxc'});
    db.search(db.userDB, { username: req.params[0] }, function(user_result) {
        if( user_result.length > 0 ) {
            db.search(db.profileDB, { profile_id: user_result[0].profile_pointer }, function(result) {
                dataObject = result[0];
                if( !dataObject )
                    dataObject = {};
                
                
                dataObject.security_level_all       = (dataObject.security_level === 0 || (!dataObject.security_level));
                dataObject.security_level_friends   = (dataObject.security_level === 1);
                dataObject.security_level_self      = (dataObject.security_level === 2);
                
                if( dataObject.security_level_self && req.params[0] != loginData ) {
                    dataObject = {
                        description: "User information not visible.",
                        full_name: "Not available",
                        security_level_all: false,
                        security_level_friends: false,
                        security_level_self: true
                    };
                } else if ( dataObject.security_level_friends ) {
                    if( (!dataObject.friends || dataObject.friends.indexOf(loginData) == -1) && req.params[0] != loginData ) {
                        dataObject = {
                            description: "User information not visible.",
                            full_name: "Not available",
                            security_level_all: false,
                            security_level_friends: true,
                            security_level_self: false
                        };
                    }
                }
                    
                dataObject.login = loginData;
                dataObject.title = "Vowb.net - Edit Profile";
                dataObject.username = req.params[0];
                if( !dataObject.friends ) {
                    dataObject.friends = [];
                    dataObject.friendsAvatars = [];
                    dataObject.isFriend = false;
                    db.search(db.userDB, { username: loginData }, function(login_result) {
                        if( login_result.length != 0 ) {
                            db.search(db.profileDB, { profile_id: login_result[0].profile_pointer }, function( isfriend_result ) {
                                if( isfriend_result.length != 0 ) {
                                    dataObject.isFriend = (isfriend_result[0].friends && isfriend_result[0].friends.indexOf(dataObject.username) != -1) || req.params[0] == loginData;
                                    if( !dataObject.isFriend )
                                        dataObject.isFriend = false;
                                }               
                                //dataObject.user_age = dataObject.birth_date;
                                if( !dataObject.description )
                                    dataObject.description = "No profile? That's OK. This guy has yet to make one.";
                                else {
                                    //var split = dataObject.description.split("------xAGE_SPLITx------");
                                    //dataObject.description = split.length > 1 ? split[1] : split[0];//"No profile? That's OK. This guy has yet to make one.";
                                    //dataObject.user_age = split[0];//dataObject.birth_date;
                                }
                                dataObject.profileURL = user_result[0].avatar_URL;
                                dataObject.time = Math.floor((user_result[0].time/60000));
                                dataObject.online = user_result[0].online;
                                dataObject.current_lobby = user_result[0].current_lobby;
                                dataObject.last_online = convertLastOnline(user_result[0].last_online);
                                if( !dataObject.current_lobby )
                                    dataObject.current_lobby = "OFFLINE";
                                if( !dataObject.time )
                                    dataObject.time = 0;
                                if( !dataObject.online )
                                    dataObject.online = false;
                                res.render('profile', dataObject);
                            });
                        } else {               
                            //dataObject.user_age = dataObject.birth_date;
                            if( !dataObject.description )
                                dataObject.description = "No profile? That's OK. This guy has yet to make one.";
                            else {
                                //var split = dataObject.description.split("------xAGE_SPLITx------");
                                //dataObject.description = split.length > 1 ? split[1] : split[0];//"No profile? That's OK. This guy has yet to make one.";
                                //dataObject.user_age = split[0];//dataObject.birth_date;
                            }
                            dataObject.profileURL = user_result[0].avatar_URL;
                            dataObject.time = Math.floor((user_result[0].time/60000));
                            dataObject.online = user_result[0].online;
                            dataObject.current_lobby = user_result[0].current_lobby;
                            dataObject.last_online = convertLastOnline(user_result[0].last_online);
                            if( !dataObject.current_lobby )
                                dataObject.current_lobby = "OFFLINE";
                            if( !dataObject.time )
                                dataObject.time = 0;
                            if( !dataObject.online )
                                dataObject.online = false;
                            res.render('profile', dataObject);
                        }
                    });
                } else {
                    db.getFriends(dataObject.username,function(friends_result){
                        var friendsAvatars = [];
                        dataObject.friends = [];
                        for( var i = 0; i < friends_result.length; i++ ) {
                            if( !friends_result[i].avatar_URL )
                                friends_result[i].avatar_URL = "/images/profile/chicken.png";
                            friendsAvatars.push(friends_result[i].avatar_URL);
                            dataObject.friends.push(friends_result[i].username);
                        }
                        console.log(JSON.stringify(friendsAvatars));
                        dataObject.friendsAvatars = friendsAvatars;
                        dataObject.isFriend = false;
                        db.search(db.userDB, { username: loginData }, function(login_result) {
                            if( login_result.length != 0 ) {
                                db.search(db.profileDB, { profile_id: login_result[0].profile_pointer }, function( isfriend_result ) {
                                    if( isfriend_result.length != 0 ) {
                                        dataObject.isFriend = (isfriend_result[0].friends && isfriend_result[0].friends.indexOf(dataObject.username) != -1) || req.params[0] == loginData;
                                        if( !dataObject.isFriend )
                                            dataObject.isFriend = false;
                                    }               
                                    //dataObject.user_age = dataObject.birth_date;
                                    if( !dataObject.description )
                                        dataObject.description = "No profile? That's OK. This guy has yet to make one.";
                                    else {
                                        //var split = dataObject.description.split("------xAGE_SPLITx------");
                                        //dataObject.description = split.length > 1 ? split[1] : split[0];//"No profile? That's OK. This guy has yet to make one.";
                                        //dataObject.user_age = split[0];//dataObject.birth_date;
                                    }
                                    dataObject.profileURL = user_result[0].avatar_URL;
                                    dataObject.time = Math.floor((user_result[0].time/60000));
                                    dataObject.online = user_result[0].online;
                                    dataObject.current_lobby = user_result[0].current_lobby;
                                    dataObject.last_online = convertLastOnline(user_result[0].last_online);
                                    if( !dataObject.current_lobby )
                                        dataObject.current_lobby = "OFFLINE";
                                    if( !dataObject.time )
                                        dataObject.time = 0;
                                    if( !dataObject.online )
                                        dataObject.online = false;
                                    res.render('profile', dataObject);
                                });
                            } else {               
                                //dataObject.user_age = dataObject.birth_date;
                                if( !dataObject.description )
                                    dataObject.description = "No profile? That's OK. This guy has yet to make one.";
                                else {
                                    //var split = dataObject.description.split("------xAGE_SPLITx------");
                                    //dataObject.description = split.length > 1 ? split[1] : split[0];//"No profile? That's OK. This guy has yet to make one.";
                                    //dataObject.user_age = split[0];//dataObject.birth_date;
                                }
                                dataObject.profileURL = user_result[0].avatar_URL;
                                dataObject.time = Math.floor((user_result[0].time/60000));
                                dataObject.online = user_result[0].online;
                                dataObject.current_lobby = user_result[0].current_lobby;
                                dataObject.last_online = convertLastOnline(user_result[0].last_online);
                                if( !dataObject.current_lobby )
                                    dataObject.current_lobby = "OFFLINE";
                                if( !dataObject.time )
                                    dataObject.time = 0;
                                if( !dataObject.online )
                                    dataObject.online = false;
                                res.render('profile', dataObject);
                            }
                        });
                    });
                }
            });
        } else {
            res.render('404', { title: "404: Vowb.net page not found", url: "/users" + req.url });
        }
    });
});

/* GET users listing. */
router.get('/*', function(req, res, next) {
    //res.send('respond with a resource');
    var loginData = getLoginData(req);
    // Example:
    //res.render('userPage', { name: 'Mystxc'});
    db.search(db.userDB, { username: req.params[0] }, function(result) {
        if( result.length > 0 )
            res.render('profile', {result: result[0], login: loginData });
        else {
            res.render('404', { title: "404: Vowb.net page not found", url: "/users" + req.url });
        }
    });
});

router.post('/addFriend', function(req, res, next) {
    var loginData = getLoginData(req);
    // console.log("Adding " + req.body.addFriend + " as a friend of " + loginData);
    db.addFriend(loginData,req.body.addFriend,function(success,text) {
        if( success )
            res.send(text);
        else
            res.status(400).send(text);
    }); 
});

router.post('/removeFriend', function(req, res, next) {
    var loginData = getLoginData(req);
    //console.log("Removing " + req.body.removeFriend + " as a friend of " + loginData);
    db.removeFriend(loginData,req.body.removeFriend,function(success,text) {
        if( success )
            res.send(text);
        else
            res.status(400).send(text);
    }); 
});


module.exports = router;
