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

      socket.emit('chat message', '  -- Welcome to the lobby chat room!  You are User Number ' + that.numberOfClients + '. --  ');
      that.numberOfClients++;

  	  socket.on('chat message', function(msg){
  	  	//console.log("Message Received");
  	    that.io.emit('chat message', msg);
  	  });

      socket.on('disconnect', function () {
        that.numberOfClients--;
        that.io.emit('chat message', 'A user has disconnected.');
      });

    });
}
