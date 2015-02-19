/* This script will open the log in dialogue and handle client side log in things */

var loginButtonClicked = function() {
    /* Do something */
$("#modal_trigger").leanModal({top : 200, overlay : 0.6, closeButton: ".modal_close" });
$(function(){
  // Calling Login Form
  $("#login_form").click(function(){
    console.log("derp");
    $(".user_login").show();
    return false;
  });
})
    console.log("Login button clicked.");
}
