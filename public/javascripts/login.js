/* This script will open the log in dialogue and handle client side log in things */


var loginButtonClicked = function() {
    $('.signupButton').addClass('dontShowGradient');
    $('.loginPage').fadeIn(250);
}
var exitButtonClicked = function() {
	$('.loginPage').fadeOut(250);
  $('.signupButton').removeClass('dontShowGradient');
}

var loginSubClicked = function() {
	console.log("loginsub clicked");
}
