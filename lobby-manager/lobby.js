/* This manages a user's socket connection while in a lobby */
/* It controls their chat and current sub-lobby */

var lobbyManager = module.exports =  {
    io: {}
}

lobbyManager.startListening = function(http) {
    this.io = require('socket.io')(http);
    //require('http').Server(app);

    this.io.on('connection', function(socket) {
        console.log("New socket io connection made.");
        // can do something with socket here.

    });
}
