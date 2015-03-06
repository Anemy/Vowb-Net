/* This script will open the log in dialogue and handle client side log in things */

var loggedin = false;
var user_name = "";


var loginButtonClicked = function() {
  if (!loggedin) {
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
                console.log("Login success!!");
                user_name = $("#un_id").val();
                $("#signup_id").text("log out");
                $("#login_id").text($("#un_id").val());
                $("#login_id").css("text-decoration", "underline");
                $('.loginPage').fadeOut(50);
                loggedin = true;
            },
            error: function(data){
                alert("Username or password is incorrect.");
            }
    });
}
