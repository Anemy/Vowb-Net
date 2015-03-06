/* This is the scripting for the landing page of the site  */
/* Only used for redirect right now */

var redirectToSignupClicked = function() {
    window.location.href = "/signup";
}

var joinLobbyClicked = function() {
    window.location.href = "/lobby";
}

$(document).ready(function() {
    //just making the footer not position absolute so the pic looks better
    // $('.copyright').css('position','absolute');
    // $('.copyright').css('bottom','-4em');
});
