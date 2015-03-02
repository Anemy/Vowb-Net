/* This script will open the log in dialogue and handle client side log in things */


var loginButtonClicked = function() {
    /* Do something */
    $('.loginPage').fadeIn(600);
    console.log("derp");
}
var exitButtonClicked = function() {
	$('.loginPage').fadeOut(600);
  // Calling Login Form
}

var loginSubClicked = function() {
	console.log("loginsub clicked");
	// Pascal adding post request for login button 03/02/15
	$.ajax({
            url: "/login",
            type: "POST",
            data: {
                username : $("#un_id").val(),
                password : $("#pw_id").val(),
            },
            success: function(data){
                console.log("Success from server");
                var delay = 3000; //Your delay in milliseconds
                setTimeout(function(){ window.location = "/"; }, delay);
                //display "redirecting in 3 seconds"
            },
            error: function(data){
                console.log("Failure from server");
                 
            }
    });
}
//$(function(){//  $(".user_login").show();
//    console.log("Login button clicked.");
//    console.log("derp");
//});

//$(document).ready( function() {
//  $("#trigger").leanModal({top : 200, overlay : .6, closeButton: ".modal_close" });

//  $("#trigger").click( function() {
//    $(".user_login").show();
//  });
//});
