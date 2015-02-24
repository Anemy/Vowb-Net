/* This manages a user's socket connection while in a lobby */
/* It controls their chat and current sub-lobby */

var lobbyManager = module.exports =  {
    io: {}
}

lobbyManager.startListening = function(http) {
    this.io = require('socket.io')(http);
    //require('http').Server(app);
    
    //hacky fix for stuff
    var that = this;

    this.io.on('connection', function(socket) {
      console.log("New socket io connection made.");
        // can do something with socket here.

	  socket.on('chat message', function(msg){
	  	console.log("Message Received");
	    that.io.emit('chat message', msg);
	  });

    });
}

