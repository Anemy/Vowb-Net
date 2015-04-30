/* Edit Profile Page Javascript*/

var saveButtonClicked;

/* This javascript manages the sign up page's client side interactions */

$('#editProfileForm').ready (function() {


    /* Do signup actions here */
    $('#editProfileForm').submit( function (event) {
        console.log ("editProfileForm form submitted");
        
        var errMsg = "";
        var err = 0;

    });
});


$(document).ready(function() {
    var checkurl = "/users/edit/";
    checkurl = checkurl.concat(user_name)
    console.log(window.location.pathname);
    console.log(checkurl);
    if(window.location.pathname != checkurl) {
        window.location.pathname = "404";
    }

  //When image is clicked it loads and image a user chooses, uploads it then saves the URL
  $('.imgContainerOverlay').click(function(){
    filepicker.setKey("AxXSSg71vQROpwHyvp1Iaz");
    filepicker.pickAndStore({mimetype:"image/*", maxSize: 1024*1024},{},
      function(InkBlobs){
        //console.log(JSON.stringify(InkBlobs));
        var uploadedPicURL = InkBlobs[0].url;

        console.log("Pic url: " + uploadedPicURL);

        $('.profIMG').attr('src', uploadedPicURL);

        //DO CODE TO SAVE THE URL HERE! So that it then uses the saved url from the user on the db to load the image
    });
  });
  
  
 	saveButtonClicked = function(){
 		//save shit
        console.log("These!: " + $("#security_level_all").val() + "," + $("#security_level_friends").val() + "," + $("#security_level_self").val());
        // Concept code by Eric 3/5/2015
        $.ajax({
                url: "/edit-profile",
                type: "POST",
                data: {
                    // The user id commented out below should be added as an "int" variable
                    //    to show whose data will be overwritten, this will probably
                    //    be a input.hidden in JADE or something like that?
                    secretProfileIdValue : $("#secretProfileIdValue").val(),
                    userFullName : $("#userFullName").val(),
                    userAge : $(".userAge").val(),
                    userSex : $(".userSex").val(),
                    userState : $(".userState").val(),
                    aboutMeDesc : $(".aboutMeDesc").val(),
                    userfavGames : $("#userfavGames").val(),
                    userfavShows : $("#userfavShows").val(),
                    userfavFoods : $("#userfavFoods").val(),
                    security_level_all: $(".security_level_all").prop("checked"),
                    security_level_friends: $(".security_level_friends").prop("checked"),
                    security_level_self: $(".security_level_self").prop("checked"),
                    profileURL: $('.profIMG').attr('src')
                },
                success: function(data){
                    console.log("Profile edit success!!");
                    swal({title:"Your profile has been updated!", type:"success"},
                        function(){
                            var url = "/users/";
                            url = url.concat(user_name);
                            window.location.href = url;
                        }
                    );
                },
                error: function(data){
                    sweetAlert("Oops...", "Failed to save profile changes.", "error");
                }
        });


 	}
});