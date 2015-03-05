/* Edit Profile Page Javascript*/

// $(document).ready (function() {
// 	var saveButtonClicked = function(){
// 		//save shit

// 	}
// });
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

  //When image is clicked it loads and image a user chooses, uploads it then saves the URL
  $('.profIMG').click(function(){
    filepicker.setKey("AxXSSg71vQROpwHyvp1Iaz");
    filepicker.pickAndStore({mimetype:"image/*"},{},
      function(InkBlobs){
        //console.log(JSON.stringify(InkBlobs));
        var uploadedPicURL = InkBlobs[0].url;

        console.log("Pic url: " + uploadedPicURL);

        $('.profIMG').attr('src', uploadedPicURL);

        //DO CODE TO SAVE THE URL HERE! So that it then uses the saved url from the user on the db to load the image
    });
  });
});
