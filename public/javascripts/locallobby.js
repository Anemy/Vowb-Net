/*this script will handle lobby creation and management*/
//Create a room
// var isInitiator;

//
// rtc.createStream({"video": false, "audio":true}, function(stream){
//   // get local stream for manipulation
//
// }
// rtc.connect('http://localhost:8001');//, optionalRoom);//ws://



// navigator.getUserMedia = navigator.getUserMedia ||  navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
//
// var constraints = {video: false, audio: true};
//
// function successCallback(localMediaStream) {
//   window.stream = localMediaStream; // stream available to console
//   console.log("Sucessfull callback on the stream!!!");
//   // var video = document.querySelector("video");
//   // video.src = window.URL.createObjectURL(localMediaStream);
//   // video.play();
// }
//
// function errorCallback(error){
//   console.log("navigator.getUserMedia error: ", error);
// }
//
// navigator.getUserMedia(constraints, successCallback, errorCallback);





// room = prompt("Enter Lobby Name:");
// room = "default";
//
// var sckt = io.connect();
//
//
// if (room !== "") {
//   console.log('Joining Lobby ' + room);
//   sckt.emit('Create or Join', room);
// }
//
// sckt.on('Full', function (room){
//   console.log('Lobby ' + room + ' is full');
// });
//
// sckt.on('Empty', function (room){
//   isInitiator = true;
//   console.log('Lobby ' + room + ' is empty');
// });
//
// sckt.on('Join', function (room){
//   console.log('Making request to join Lobby ' + room);
//   console.log('You are the initiator!');
// });
//
// sckt.on('log', function (array){
//   console.log.apply(console, array);
// });

//makes local client connection
var socket = io();

socket.on('chat message', function(msg){
  $('#messages').append($('<li>').text(msg));
  document.getElementById("msgBox").scrollTop = document.getElementById("msgBox").scrollHeight;
});

$(document).ready(function() {
    //submitting the chat form
    $('form').submit(function(){
      socket.emit('chat message', $('#m').val());
      $('#m').val('');
      return false;
    });


    //Hitting enter sends the message
    $("#m").keyup(function(e) {
        if(e.keyCode == 13) {
          socket.emit('chat message', $('#m').val());
          $('#m').val('');
            return false;
        }
    });
});



var connection = new RTCMultiConnection();
connection.session = {
    audio: true
};
connection.sdpConstraints.mandatory = {
    OfferToReceiveAudio: true,
    OfferToReceiveVideo: false
};
connection.onstream = function(e) {
    audioContainer.insertBefore(e.mediaElement, audioContainer.firstChild);
};
var sessions = {};
connection.onNewSession = function(session) {
    if (sessions[session.sessionid]) return;
    sessions[session.sessionid] = session;
    var tr = document.createElement('tr');
    tr.innerHTML = '<td><strong>' + session.extra['session-name'] + '</strong> is running a conference!</td>' +
        '<td><button class="join">Join</button></td>';
    roomsList.insertBefore(tr, roomsList.firstChild);
    var joinRoomButton = tr.querySelector('.join');
    joinRoomButton.setAttribute('data-sessionid', session.sessionid);
    joinRoomButton.onclick = function() {
        this.disabled = true;
        var sessionid = this.getAttribute('data-sessionid');
        session = sessions[sessionid];
        if (!session) throw 'No such session exists.';
        connection.join(session);
    };
};
var audioContainer = document.getElementById('audios-container') || document.body;
var roomsList = document.getElementById('rooms-list');
document.getElementById('setup-new-conference').onclick = function() {
    this.disabled = true;
    connection.extra = {
        'session-name': document.getElementById('conference-name').value || 'Anonymous'
    };
    connection.open();
};
// setup signaling to search existing sessions
connection.connect();
(function() {
    var uniqueToken = document.getElementById('unique-token');
    if (uniqueToken)
        if (location.hash.length > 2) uniqueToken.parentNode.parentNode.parentNode.innerHTML = '<h2 style="text-align:center;"><a href="' + location.href + '" target="_blank">Share this link</a></h2>';
        else uniqueToken.innerHTML = uniqueToken.parentNode.parentNode.href = '#' + (Math.random() * new Date().getTime()).toString(36).toUpperCase().replace(/\./g, '-');
})();
