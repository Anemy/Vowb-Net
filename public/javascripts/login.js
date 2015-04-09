/* This script will open the log in dialogue and handle client side log in things */

var loggedIn = false;
var user_name = "";
var loginpop = false;

var loginRecentlyClicked = false;


var loginButtonClicked = function() {
  if (!loggedIn) {
    $('.signupButton').addClass('dontShowGradient');
    $('.loginPopup').fadeIn(50);
    $('.overlay').fadeIn(50);
    $('#un_id').focus();
    loginpop = true;
  } else {
    var url = "/users/";
    url = url.concat(user_name);
    window.location.href = url;
  }
}
var exitButtonClicked = function() {
  loginpop = false;
	$('.loginPopup').fadeOut(50);
  $('.overlay').fadeOut(50);
  $('.signupButton').removeClass('dontShowGradient');
}

//method calls when user hits the sign up or logout button depending
var signupLogOutClicked = function () {
    if(loggedIn) {
        showLoggedOut();

        $.ajax({
          url: "/logout",
          type: "POST",
      });
       //$("body").fadeOut(100,function(){
        window.location.reload();
         //window.location.href = "/";
      //})

    }
    else {
        window.location = "/signup";
    }
}

var loginSubClicked = function() {
  if(loginRecentlyClicked) {
      return;
  }

  loginRecentlyClicked = true;
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
              //console.log("Login success!!");
              $('.loginPage').fadeOut(50);
              showLoggedIn( $("#un_id").val() );
              loginRecentlyClicked = false;

              // swal("Logged in!", null, "success")
              // var checkurl = "/users/";
              // checkurl = checkurl.concat(user_name)
              // console.log(window.location.pathname);
              // console.log(checkurl);
              // if(window.location.pathname == checkurl) {
                //$('.profilePage').show();
                window.location.reload();

              //}              
              // if(intialName != loggedIn){
              //   socket.emit('username message', user_name);
              // }
          }
          else {
            loginRecentlyClicked = false;
            sweetAlert("Oops...", "Username or password is incorrect.", "error");
          }
        },
        error: function(data){
            sweetAlert("Oops...", "Username or password is incorrect.", "error");
            loginRecentlyClicked = false;
        }
    });
}

var showLoggedIn = function (username) {
  loggedIn = true;
  $("#signup_id").text("log out");
  $("#login_id").text(username);
  $("#login_id").css("text-decoration", "underline");
  user_name = username;

  // socket.emit('username message', user_name);
}

var showLoggedOut = function () {
    loggedIn = false;
    $("#signup_id").text("sign up");
    $("#login_id").text("log in");
    $("#login_id").css("text-decoration", "none");
    user_name = "";
}

// parsing login data from server for session storing
// THE ACTUAL PARSING OF THE OBJECT FROM THE SERVER IS INLINED IN banner.jade
$(document).ready(function() {

      if(loginData != "none") {
          // console.log("Has a session! " + loginData);
          showLoggedIn( loginData );
      }
      else {
        // console.log("No session :'(");
      }
    $(document).keypress(function(e) {
        if(e.which == 13) {
         // console.log("enter hit");
          if(loginpop == true){
            loginSubClicked();
          }
        }
    });
});
