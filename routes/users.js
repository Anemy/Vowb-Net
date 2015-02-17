/* This is the routing for individual users. It will send a template to users with the data needed */


var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
    
    // Example:
    //res.render('userPage', { name: 'Mystxc'});
});

module.exports = router;
