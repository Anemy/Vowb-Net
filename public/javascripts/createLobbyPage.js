/* This contains the scripting for creating a voice chat lobby web page (client-side) */ 

var hasPassword = false;

//passwordChoice
$(document).ready(function() {

	//When image is clicked it loads and image a user chooses, uploads it then saves the URL
	$('#private_id').click(function(){
 		hasPassword = !hasPassword;
 		//console.log("Password choice clicket.");
 		if(hasPassword) {
 			$('.passwordFields').fadeIn(0);
 			// $('#private_id').css('display','block');
 		}
 		else {
 			$('.passwordFields').fadeOut(0);
 			// $('#private_id').css('display','none');
 		}
	});

	$('.inText').click(function() {
		$("#private_id").click();//attr  "checked", this.checked
	});

    $('#createLobbyForm').submit( function (event) {
        console.log ("Create lobby form submitted");

        var err = 1;
        var errMsg = "Haven't done backend yet.";

        if(hasPassword) {
        	//do password checking here

	        //verify password length is correct
	        if($("#password_id").val().length < 4){
	            errMsg = errMsg.concat("Password too short.\n");
	            err++;
	        }

	        //verify passwords match
	        if ($("#password_id").val() != $("#reenterpw_id").val()) {
	                errMsg = errMsg.concat("Passwords don't match.\n");
	                err++;
	        }
        }

        //do connection to server/db here
        if (err==0) {
            $.ajax({
                url: "/signup",
                type: "POST",
                data: {
                    lobbyName : $("#lobbyname_id").val(),
                    password : $("#password_id").val(),
                    reenterpw : $("#reenterpw_id").val()
                },
                success: function(data){
                  data = JSON.parse(data);
                  //console.log("Value: " + data.value);
                  if(data.value == "Success") {
                      console.log("Success from server");

                      //display "redirecting in 3 seconds"
                      $("body").fadeOut(1000,function(){
                          window.location.href = "/lobby/"+$("#lobbyname_id").val();
                      })
                  }
                  else {
                    alert("Lobby already exists!!");
                    console.log("Failure from server");
                  }
                },
                error: function(data){
                    alert("Lobby already exists!!");
                    console.log("Failure from server");
                }
            });
        } else {
            sweetAlert("Oops...", errMsg, "error");
            //alert(errMsg);
            console.log(errMsg);
        }

        return false;
    });
});