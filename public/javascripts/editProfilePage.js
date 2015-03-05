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


    //image picker code
    // var filePicked = function(e) {
    //   console.log(e.fpfile.url)
    // };
    //input(type='filepicker', data-fp-apikey='AAhXvilT1RIaTrxakvtWnz', data-fp-mimetypes='*/*', data-fp-container='modal', data-fp-services='COMPUTER,DROPBOX,GOOGLE_DRIVE,URL', onchange='filePicked(event)' data-fp-button-text="UPLOAD LOGO")
    // filepicker.setKey("AxXSSg71vQROpwHyvp1Iaz");
    // filepicker.pickAndStore({mimetype:"image/*"},{},
    //   function(InkBlobs){
    //     console.log(JSON.stringify(InkBlobs));
    // });
});
