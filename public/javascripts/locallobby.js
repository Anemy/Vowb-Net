/*this script will handle lobby creation and management*/
//Create a room
var isInitiator;

//
// rtc.createStream({"video": false, "audio":true}, function(stream){
//   // get local stream for manipulation
//
// }
// rtc.connect('http://localhost:8001');//, optionalRoom);//ws://



navigator.getUserMedia = navigator.getUserMedia ||  navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

var constraints = {video: false, audio: true};

function successCallback(localMediaStream) {
  window.stream = localMediaStream; // stream available to console
  console.log("Sucessfull callback on the stream!!!");
  // var video = document.querySelector("video");
  // video.src = window.URL.createObjectURL(localMediaStream);
  // video.play();
}

function errorCallback(error){
  console.log("navigator.getUserMedia error: ", error);
}

navigator.getUserMedia(constraints, successCallback, errorCallback);





// room = prompt("Enter Lobby Name:");
room = "default";

var sckt = io.connect();


if (room !== "") {
  console.log('Joining Lobby ' + room);
  sckt.emit('Create or Join', room);
}

sckt.on('Full', function (room){
  console.log('Lobby ' + room + ' is full');
});

sckt.on('Empty', function (room){
  isInitiator = true;
  console.log('Lobby ' + room + ' is empty');
});

sckt.on('Join', function (room){
  console.log('Making request to join Lobby ' + room);
  console.log('You are the initiator!');
});

sckt.on('log', function (array){
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
    document.getElementById("msgBox").scrollTop = document.getElementById("msgBox").scrollHeight;
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
