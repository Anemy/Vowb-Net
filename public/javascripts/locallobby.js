/*this script will handle lobby creation and management*/
//makes local client connection
var socket = io();
var intialName = loggedIn;

socket.on('chat message', function(msg){
  //$('#messages').append($('<div class="messageSpacer"/>'));
  var html = '';
  html += '<div class="messageSpacer">';
  html +=   '<li class="playerMessage">' + msg + '</li>';
  html += '</div>';
  $('#messages').append( html ); // $('<div class="messageSpacer"><li class="playerMessage"></div>').text(msg));
  document.getElementById("msgBox").scrollTop = document.getElementById("msgBox").scrollHeight;
});

socket.on('server message', function(msg){
  //$('#messages').append($('<div class="messageSpacer"/>'));
  $('#messages').append($('<li class="serverMessage">').text(msg.text));
  document.getElementById("msgBox").scrollTop = document.getElementById("msgBox").scrollHeight;
});
socket.on('username message', function(msg){ 

});

// submitting the chat form
$('form').submit(function(){
  if($('#m').val().length > 0) {
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
  }
  return false;
});

// Gets the lobby name and transfers that to the server as to connect to that specific chat socket io
var url = window.location.pathname;
var to = url.lastIndexOf('/') +1;

var chatToConnect =  url.substring(to,url.length);
// alert(chatToConnect);
console.log("Trying to connect to chat: " + chatToConnect);
socket.emit('connect to chat', chatToConnect);

setTimeout(function() {
  // insecurely transfers a user's username
  socket.emit('username message', user_name);
}, 50);



//Hitting enter sends the message
$("#m").keyup(function(e) {
    if(e.keyCode == 13) {
      if($('#m').val().length > 0) {
        //$('#messages').append($('<div class="messageSpacer"/>'));
        //$('#messages').append($('<div class="messageSpacer"><li class="selfMessage"> </div>').text( $('#m').val()));

        var html = '';
        html += '<div class="messageSpacer">';
        html +=   '<li class="selfMessage">' + $('#m').val() + '</li>';
        html += '</div>';
        $('#messages').append( html );


        document.getElementById("msgBox").scrollTop = document.getElementById("msgBox").scrollHeight;
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
      }

      return false;
    }
});


/*
THERE IS NO SERVER CODE.
This is the code which enables a user to create an RTC voice chat stream lobby
*/
//Start Password code
var connection = new RTCMultiConnection();
document.querySelector('#setup').onclick = function() {
    // room password has been set before calling "open" method
    connection.extra.password = prompt('Setup password for your room!');
    connection.open();
    this.disabled = true;
};
//Start Password Code
    document.querySelector('#setup').onclick = function () {
      console.log("Ask for Password");
      // room password has been set before calling "open" method
      connection.extra.password = prompt('Setup password for your room!');
      connection.open();
    };
    connection.onNewSession = function (session) {
      // set password for person who is trying to join the room
      connection.extra.password = prompt('Enter password to join this room.');
      connection.join(session);
    };
    connection.onRequest = function (userid, extra) {
      // validating password in "onRequest"
      if (extra.password != connection.extra.password)
        return alert('password: ' + extra.password + ' !== ' + connection.extra.password);
      connection.accept(userid, extra);
    };
//End Password Code
//End Password Code
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
//sessions manages the current lobbies in the sub-lobby.
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

            // set password for person who is trying to join the room
            connection.extra.password = prompt('Enter password to join this room.');

            connection.join(session);
    };
};
//Start Password Code
connection.onRequest = function(e) {
    // validating password in "onRequest"
    if (e.extra.password != connection.extra.password)
        return alert('password: ' + e.extra.password + ' !== ' + connection.extra.password);
    connection.accept(e);
};
connection.onstream = function(e) {
    document.body.appendChild(e.mediaElement);
};
//End Password Code

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
