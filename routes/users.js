/* This is the routing for individual users. It will send a template to users with the data needed */


var express = require('express');
var router = express.Router();
var db = require('../database-manager/database.js');

/* GET users listing. */
router.get('/*', function(req, res, next) {
    //res.send('respond with a resource');
    
    // Example:
    //res.render('userPage', { name: 'Mystxc'});
    db.search(db.userDB, { username: req.params[0] }, function(result) {
        res.render('userPage', result[0]);
        // for printing
        // console.log("<pre>" + JSON.stringify(result[0], null, '\t') + "</pre>");
    });
});

module.exports = router;
