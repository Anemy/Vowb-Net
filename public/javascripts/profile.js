/*global window */
var self = false;

var editProfButtonClicked = function () {
    var url = "/users/edit/";
    url = url.concat(user_name);
    window.location.href = url;
}
var friendButtonClicked = function() {
    // console.log("friendButtonClicked");
    if(loginData != "none") {
        if(self){
            sweetAlert("Oops...", "We don't have a edit friends yet", "error");
        }
        else if (!isFriend) {
            console.log("before ajax");
            $.ajax({
                url:"/users/addFriend",
                type: "POST",
                data: {
                    addFriend : username
                },
                success: function(data){
                    // console.log("Successfully added friend");
                    var alertTitle = "Added ";
                    alertTitle = alertTitle.concat(username);
                    alertTitle = alertTitle.concat(" to your Friends List");
                    swal({title:"Success!", text: alertTitle, type:"success"},
                        function(){
                            var url = "/users/";
                            url = url.concat(username);
                            window.location.href = url;
                        }
                    );
                },
                error: function(data){
                    // console.log(data.responseText);
                    swal({title: "Error",text: data.responseText , type:"error"}, 
                        function(){
                            var url = "/users/";
                            url = url.concat(username);
                            window.location.href = url;
                        }
                    );
                }
            });
        } 
        else if (isFriend) {
            console.log("before ajax");
            $.ajax({
                url:"/users/removeFriend",
                type: "POST",
                data: {
                    removeFriend : username
                },
                success: function(data){
                    //console.log("Successfully removed friend");
                    var alertTitle = "Remove ";
                    alertTitle = alertTitle.concat(username);
                    alertTitle = alertTitle.concat(" to your Friends List");
                    // swal({title:"Success!",text: alertTitle, type:"success"},
                    //     function(){
                    //         console.log("Successfully removed friend");
                    //         var url = "/users/";
                    //         url = url.concat(username);
                    //         window.location.href = url;
                    //     }
                    // );
                    // alert("close");
                },
                error: function(data){
                    //console.log(data.responseText);
                    swal({title: "Error",text: data.responseText , type:"error"}, 
                        function(){
                            var url = "/users/";
                            url = url.concat(username);
                            window.location.href = url;
                        }
                    );
                }
            });
        }
    }
    else {
        sweetAlert("Oops...", "You're not logged in", "error");
    }

}
var changeButtons = function() {
    var checkurl = "/users/";
    checkurl = checkurl.concat(user_name)
    // console.log(window.location.pathname);
    // console.log(checkurl);
    if(window.location.pathname == checkurl){
        self = true;
        $("#addEditFriend").text("Edit Friends List");
        $("#addEditFriend").attr("href","");
        $("#addEditFriend").css("background-image","url(/images/profile/edit.png)");
        $("#sendViewMSG").text("View Messages");
        $("#sendViewMSG").attr("href","VIEWMSGES");
        $('.editProfButton').show();

    }
    else if(isFriend) {
        self = false;
        $("#addEditFriend").text("Remove Friend");
        $("#addEditFriend").attr("href","");
        $("#addEditFriend").css("background-image","url(/images/profile/delete.png)");
        $("#sendViewMSG").text("Send Message");
        $('.editProfButton').hide();
        // $("#sendViewMSG").attr("href","VIEWMSGES");
    }
    else {
        self = false;
        $('.editProfButton').hide();
        $("#addEditFriend").text("Add to Friends List");
        $("#addEditFriend").css("background-image","url(/images/profile/add.png)");
        $("#sendViewMSG").text("Send Message");
        // $("#sendViewMSG").attr("href","/SENDMSG");
    }

}
var msgButtonClicked = function() {
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
/* This javascript manages the sign up page's client side interactions */
$(document).ready(function() {    


    // console.log("Friends = " + friends);

    changeButtons();
    $('#FList').empty();
    if(friends != null){
        for(var i = 0; i < friends.length;i++){
            $('#FList').append('<li class="friend" id="friend['+i+']"><a href ="/users/'+friends[i]+'">'+friends[i]+'</a></li>');
            console.log(friends[i]);
        }
    }
    //href = "'window.location.href' + "/users/" + 'friend['+i+']'"
    // var checkurl = "/users/";
    // checkurl = checkurl.concat(user_name)
    // // console.log(window.location.pathname);
    // // console.log(checkurl);
    // if(window.location.pathname != checkurl) {
    // }
    // else {
    // }

});