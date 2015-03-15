/* This script will open the log in dialogue and handle client side log in things */

var loggedIn = false; 
var user_name = "";


var loginButtonClicked = function() {
  if (!loggedIn) {
    $('.signupButton').addClass('dontShowGradient');
    $('.loginPopup').fadeIn(50);
    $('.overlay').fadeIn(50);
  } else {
    var url = "/users/";
    url = url.concat(user_name);
    window.location.href = url;
  }
}
var exitButtonClicked = function() {
	$('.loginPopup').fadeOut(50);
  $('.overlay').fadeOut(50);
  $('.signupButton').removeClass('dontShowGradient');
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
          data = JSON.parse(data);
          //console.log("Value: " + data.value);
          if(data.value == "Success") {
              console.log("Login success!!");
              user_name = $("#un_id").val();
              $("#signup_id").text("log out");
              $("#login_id").text($("#un_id").val());
              $("#login_id").css("text-decoration", "underline");
              $('.loginPage').fadeOut(50);
              loggedIn = true;
          }
          else {
            sweetAlert("Oops...", "Username or password is incorrect.", "error");
          }
        },
        error: function(data){
            sweetAlert("Oops...", "Username or password is incorrect.", "error");
        }
    });
}

// parsing login data from server for session storing
// THE ACTUAL PARSING OF THE OBJECT FROM THE SERVER IS INLINED IN banner.jade
$(document).ready(function() {
    if(loginData) {
        if(loginData != "none") {
            console.log("Has a session! " + loginData);
        }
        else {
          console.log("No session :'(");
        }
    }
});
