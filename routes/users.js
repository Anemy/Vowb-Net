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
        if( result.length > 0 )
            res.render('profile', result[0]);
        else
            res.render('404');
    });
});

/* GET EDIT users listing. */
router.get('/edit/*', function(req, res, next) {

    //DO VERIFICATION LATER LOL - OR MAYBE JUST WHEN THEY HIT SAVE?

    // Example:
    //res.render('userPage', { name: 'Mystxc'});
    db.search(db.userDB, { username: req.params[0] }, function(result) {
        if( result.length > 0 )
            res.render('editProfPage', result[0]);
        else
            res.render('404');
    });
});

module.exports = router;
