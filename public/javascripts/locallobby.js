/*this script will handle lobby creation and management*/
//Create a room
var isInitiator;

room = prompt("Enter Lobby Name:");

var socket = io.connect();

if (room !== "") {
  console.log('Joining Lobby ' + room);
  socket.emit('Create or Join', room);
}

socket.on('Full', function (room){
  console.log('Lobby ' + room + ' is full');
});

socket.on('Empty', function (room){
  isInitiator = true;
  console.log('Lobby ' + room + ' is empty');
});

socket.on('Join', function (room){
  console.log('Making request to join Lobby ' + room);
  console.log('You are the initiator!');
});

socket.on('log', function (array){
  console.log.apply(console, array);
});

//makes local client connection
 var socket = io();
  $('form').submit(function(){
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
  });

  socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg));
  });

//Hitting enter sends the message
$(document).ready(function() {
$("#m").keyup(function(e) {
    if(e.keyCode == 13) {
      socket.emit('chat message', $('#m').val());
      $('#m').val('');
        return false;
    }
});
});
