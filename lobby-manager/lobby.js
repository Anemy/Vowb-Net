/* This manages a user's socket connection while in a lobby */
/* It controls their chat and current sub-lobby */
var fs = require('fs');
var vm = require('vm');
var includeInThisContext = function(path) {
    var code = fs.readFileSync(path);
    vm.runInThisContext(code, path);
}.bind(this);

var lobbyManager = module.exports =  {
    io: {}
}

lobbyManager.startListening = function(http) {
    this.io = require('socket.io')(http);
    //require('http').Server(app);

    //hacky fix for stuff
    var that = this;

    that.numberOfClients = 0;

    //creates a listening socket io connection
    that.io.on('connection', function(socket) {
      //console.log("New socket io connection made.");
      socket.name = "User " + that.numberOfClients;

      socket.on('username message', function(msg){
          socket.name = msg;
      });

      socket.emit('server message', {text: '  -- Welcome to the lobby chat room!  You are User Number ' + that.numberOfClients + '. --  ' ,type: 'join'});
      that.numberOfClients++;

  	  socket.on('chat message', function(msg){
  	  	//console.log("Message Received");
  	    socket.broadcast.emit('chat message', socket.name + ": " + msg);
  	  });

      that.io.emit('server message', {text:' -- A user has connected. -- ',type: 'disconnect'});

      socket.on('disconnect', function () {
        that.numberOfClients--;
        that.io.emit('server message', {text:' -- A user has disconnected. -- ',type: 'join'});
      });

    });
}
