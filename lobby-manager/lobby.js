/* This manages a user's socket connection while in a lobby */
/* It controls their chat and current sub-lobby */
var fs = require('fs');
var vm = require('vm');
var includeInThisContext = function(path) {
    var code = fs.readFileSync(path);
    vm.runInThisContext(code, path);
}.bind(this);

includeInThisContext(__dirname + "/voice.js");
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
    /*function log() {
        var array = [">>> Message from server: "];
      for (var i = 0; i < arguments.length; i++) {
        array.push(arguments[i]);
      }
        socket.emit('log', array);
    }

    socket.on('message', function (message) {
        log('Got message:', message);
    // for a real app, would be room only (not broadcast)
        socket.broadcast.emit('message', message);
    });

    socket.on('create or join', function (room) {
        var numClients = io.sockets.clients(room).length;

        log('Room ' + room + ' has ' + numClients + ' client(s)');
        log('Request to create or join room ' + room);

        if (numClients === 0){
            socket.join(room);
            socket.emit('created', room);
        } else if (numClients === 1) {
            io.sockets.in(room).emit('join', room);
            socket.join(room);
            socket.emit('joined', room);
        } else { // max two clients
            socket.emit('full', room);
        }
        socket.emit('emit(): client ' + socket.id + ' joined room ' + room);
        socket.broadcast.emit('broadcast(): client ' + socket.id + ' joined room ' + room);

    });*/

}

