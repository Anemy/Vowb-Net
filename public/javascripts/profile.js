/*global window */


var editProfButtonClicked = function () {
    var url = "/users/edit/";
    url = url.concat(user_name);
    window.location.href = url;
}

/* This javascript manages the sign up page's client side interactions */
$(document).ready(function() {    
      if(loginData != "none") {
          console.log("Has a session! " + loginData);
          showLoggedIn( loginData );
      }
      else {
        console.log("No session :'(");
      }

});