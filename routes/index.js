/* This is the routing for basic webpages (landing, sign up, about, etc.) */

var express = require('express');
var db = require("../database-manager/database");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    //console.log("HOME PAGE REQUESTED");

    res.render('index', { title: 'Vowb.net'});
});

/* INSERT MORE WEB PAGE ROUTES HERE (FOR EXAMPLE SIGN UP PAGE) */
router.get('/signup', function(req, res, next) {
    // sign up page request

    res.render('signup', { title: 'Signup - Vowb.net'});
});
//tmp page
router.get('/profile', function(req, res, next) { //tmp
    // tmp profile page
    res.render('profile', { title: 'ProfilePage - Vowb.net'});
});

router.post('/signup', function(req, res) {
    console.log("Sign up request from client! There's data!!!");
    // do something with the req data
    // is it a valid username?!
    
    
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
        } else {
            // Otherwise, complain -- the user already exists!
            // (In the future, warning message should be added here!)
            console.log("Signup ERROR: User " + req.body.username + " already exists!");
        }
    });
});

//Pascal 03/02/15
router.post('/login', function(req, res) {
    console.log("Log in request from client! There's data!!!");
    // do something with the req data
    // is it a valid username?!
});

router.get('/about', function(req, res, next) {
    //console.log("HOME PAGE REQUESTED");

    res.render('about', { title: 'About Vowb.net'});
});

router.get('/jobs', function(req, res, next) {
    //console.log("HOME PAGE REQUESTED");

    res.render('jobs', { title: 'Jobs Vowb.net'});
});

module.exports = router;
