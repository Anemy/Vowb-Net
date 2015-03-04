/* This javascript manages the sign up page's client side interactions */

$('#signupForm').ready (function() {


    /* Do signup actions here */
    $('#signupForm').submit( function (event) {
        console.log ("Signup form submitted");
        var errMsg = "";
        var err = 0;
        //verify username is correct length
        if($("#username_id").val().length < 2 || $("#username_id").val().length > 16){
            errMsg = errMsg.concat("Error username must be between 2 and 16 characters.\n");
            err++;

        }

        //verify password length is correct
        if($("#password_id").val().length < 4){
            errMsg = errMsg.concat("Password to short.\n");
            err++;
        }

        //verify passwords match
        if ($("#password_id").val() != $("#reenterpw_id").val()) {
                errMsg = errMsg.concat("Passwords don't match.\n");
                err++;
        }

        // get data from each thing and send to server
        //(Pascal 2/24/2015)
        if (err==0) {
            $.ajax({
                url: "/signup",
                type: "POST",
                data: {
                    username : $("#username_id").val(),
                    email : $("#email_id").val(),
                    password : $("#password_id").val(),
                    reenterpw : $("#reenterpw_id").val()
                },
                success: function(data){
                    console.log("Success from server");
                    var delay = 3000; //Your delay in milliseconds
                    setTimeout(function(){ window.location = "/"; }, delay);
                    //display "redirecting in 3 seconds"
                },
                error: function(data){
                    console.log("Failure from server");

                }
            });
        } else {
            alert(errMsg);
            console.log(errMsg);
        }

        // return false stops the page from reloading
        return false;
    });
});
