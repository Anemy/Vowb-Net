var express = require('express');
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

router.post('/signup', function(req, res) {
    console.log("Sign up request from client! There's data!!!");
    // do something with the req data
    // is it a valid username?!
    

});

router.get('/lobby', function(req, res, next) {
  res.render('lobby', {title: 'Basic Lobby'});
});
/* */


module.exports = router;
