/*this script will handle lobby creation and management*/

//makes local client connection
 var socket = io();
  $('form').submit(function(){
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
  });

  socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg));
    document.getElementById("msgBox").scrollTop = document.getElementById("msgBox").scrollHeight;
  });

$(document).ready(function() {
    $("#m").keyup(function(e) {
        if(e.keyCode == 13) {
        	socket.emit('chat message', $('#m').val());
        	$('#m').val('');

            return false;
        }
    });
});
