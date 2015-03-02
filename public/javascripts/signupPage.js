/* This javascript manages the sign up page's client side interactions */

$('#signupForm').ready (function() {

    /* Do signup actions here */
    $('#signupForm').submit( function (event) {
        console.log ("Signup form submitted");

        // get data from each thing and send to server

        // get data from each thing and send to server 
        //(Pascal 2/24/2015)
        if ($("#password_id").val() == $("#reenterpw_id").val()) {
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
            console.log("Passwords don't match.");
        }
        
        // return false stops the page from reloading
        return false;
    });
});
