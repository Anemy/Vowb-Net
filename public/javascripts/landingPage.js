/* This is the scripting for the landing page of the site  */
/* Only used for redirect right now */

var redirectToSignupClicked = function() {
    window.location.href = "/signup";
}

var createLobbyClicked = function() {

	if(loggedIn == false) {
		sweetAlert("Oops...", "You need to be signed in to create a lobby.", "error");
	}
    else {
    	window.location.href = "/create";
    }
}

$(document).ready(function() {
    //just making the footer not position absolute so the pic looks better
    // $('.copyright').css('position','absolute');
    // $('.copyright').css('bottom','-4em');
});
