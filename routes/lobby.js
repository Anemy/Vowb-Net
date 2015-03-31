/* This is the routing for individual lobbies. It will send a template to users with the data needed depending on the url requested */


var express = require('express');
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

/* GET lobby listing. */
router.get('/*', function(req, res, next) {
    // res.send('respond with a resource');

    // TODO: 
    // Check if the lobby is real. Respond with lobby data or 404 depending. 

    var loginData = getLoginData(req);

    // Example:
    res.render('lobby', { title: 'A lobby' , name: 'Mystxc', login: loginData});
});

module.exports = router;
