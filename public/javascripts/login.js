/* This script will open the log in dialogue and handle client side log in things */

var loginButtonClicked = function() {
  $('.signupButton').addClass('dontShowGradient');
  $('.loginPopup').fadeIn(50);
  $('.overlay').fadeIn(50);
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
              $("#signup_id").text("log out");
              $("#login_id").text($("#un_id").val());
              $('.loginPage').fadeOut(50);
          }
          else {
            alert("Username or password is incorrect.");
          }
        },
        error: function(data){
            alert("Username or password is incorrect.");
        }
    });
}
