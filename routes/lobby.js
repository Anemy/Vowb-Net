/* This is the routing for individual lobbies. It will send a template to users with the data needed depending on the url requested */


var express = require('express');
var router = express.Router();

/* GET lobby listing. */
router.get('/*', function(req, res, next) {
    //res.send('respond with a resource');

    // Example:
    res.render('lobby', { title: 'A lobby' , name: 'Mystxc'});
});

module.exports = router;
