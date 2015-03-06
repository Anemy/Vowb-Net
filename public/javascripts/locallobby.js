/*this script will handle lobby creation and management*/
//makes local client connection
var socket = io();

socket.on('chat message', function(msg){
  $('#messages').append($('<li class="playerMessage">').text(msg));
  document.getElementById("msgBox").scrollTop = document.getElementById("msgBox").scrollHeight;
});

socket.on('server message', function(msg){
  $('#messages').append($('<li class="serverMessage">').text(msg.text));
  document.getElementById("msgBox").scrollTop = document.getElementById("msgBox").scrollHeight;
});
socket.on('username message', function(msg){

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
          if($('#un_id').val() == ""){
            
          }
          else{
            socket.emit('username message', $('#un_id').val());
          }
          $('#messages').append($('<li class="selfMessage">').text( $('#m').val() ));
          document.getElementById("msgBox").scrollTop = document.getElementById("msgBox").scrollHeight;

          socket.emit('chat message', $('#m').val());
          $('#m').val('');
            return false;
        }
    });
});


/*
THERE IS NO SERVER CODE.
This is the code which enables a user to create an RTC voice chat stream lobby
*/
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


var inSession = false;
//sessions manages the current lobbies in the sub lobby.
var sessions = {};
connection.onNewSession = function(session) {

    console.log("Session: " + session.extra['session-name'] + " was created.");
    inSession = true;
    if (sessions[session.sessionid]) return;
        sessions[session.sessionid] = session;
        var tr = document.createElement('tr');
        tr.innerHTML = '<td><span class="vertText">' + session.extra['session-name'] + '</span></td>' +
            '<td><button class="joinPrivateVoiceChat">Join</button></td>';
        roomsList.insertBefore(tr, roomsList.firstChild);
        var joinRoomButton = tr.querySelector('.joinPrivateVoiceChat');
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
