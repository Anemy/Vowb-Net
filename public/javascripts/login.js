/* This script will open the log in dialogue and handle client side log in things */

var loginButtonClicked = function() {
  $('.signupButton').addClass('dontShowGradient');
  $('.loginPage').fadeIn(50);
}
var exitButtonClicked = function() {
	$('.loginPage').fadeOut(50);
  $('.signupButton').removeClass('dontShowGradient');
}

var loginSubClicked = function() {
	console.log("loginsub clicked");
}
