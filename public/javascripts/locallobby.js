/*this script will handle lobby creation and management*/
//makes local client connection
var socket = io();

socket.on('chat message', function(msg){
  $('#messages').append($('<li>').text(msg));
  document.getElementById("msgBox").scrollTop = document.getElementById("msgBox").scrollHeight;
});

socket.on('server message', function(msg){
  $('#messages').append($('<li class="serverMessage">').text(msg.text));
  if(msg.type == 'disconnect') {
      
  }
  else if(msg.type == 'connect') {

  }
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



var connectToVoiceChat = function() {
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
    var sessions;
    connection.onNewSession = function(session) {
        console.log("@@@@ Session: " + session.extra['session-name'] + " found! Connecting..");
        inSession = true;
        // if (madeSession) {
        //     return;
        // }
        // if (sessions[session.sessionid]) {
        //     return;
        // }
        sessions = session;
        connection.join(sessions);
        // var tr = document.createElement('tr');
        // tr.innerHTML = '<td><strong>' + session.extra['session-name'] + '</strong> lobby</td>' +
        //     '<td><button class="join">Join</button></td>';
        // roomsList.insertBefore(tr, roomsList.firstChild);
        // var joinRoomButton = tr.querySelector('.join');
        // joinRoomButton.setAttribute('data-sessionid', session.sessionid);
        // joinRoomButton.onclick = function() {
        //     this.disabled = true;
        //     var sessionid = this.getAttribute('data-sessionid');
        //     session = sessions[sessionid];
        //     if (!session) throw 'No such session exists.';
        //     connection.join(session);
        // };
    };

    setTimeout(function() {
        //this.disabled = true;
        if(inSession == false) {
            console.log("@@@@ Couldn't find any sessions... We're creating one.");
            inSession = true;
            connection.extra = {
                'session-name': 'Public'
            };
            connection.open();
        }
    }, 1000);

    var audioContainer = document.getElementById('audios-container') || document.body;
    var roomsList = document.getElementById('rooms-list');
    // document.getElementById('setup-new-conference').onclick = function() {
    //     this.disabled = true;
    //     connection.extra = {
    //         'session-name': document.getElementById('conference-name').value || 'Anonymous'
    //     };
    //     connection.open();
    // };
    // setup signaling to search existing sessions
    connection.connect();
}
