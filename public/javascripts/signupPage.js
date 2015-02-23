/* This javascript manages the sign up page's client side interactions */

$('#signupForm').ready (function() {

    /* Do signup actions here */
    $('#signupForm').submit( function (event) {
        console.log ("Signup form submitted");

        // get data from each thing and send to server

        // return false stops the page from reloading
        return false;
    });
});
