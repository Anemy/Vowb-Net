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


      socket.on('username message', function(msg){
          if(msg == ""){
            socket.name = "User " + that.numberOfClients;
            //this way of assigning names is bad. When two anon users,
            //user 0 and user 1, are in lobby and user 0 leaves, numClients
            //becomes 1, so if user 0 rejoins he is renamed user 1, which is
            //already taken.  need to fix
          }
          else{
            socket.name = msg;
          }
          socket.emit('server message', {text: '  -- Hi ' + socket.name + '! Welcome to the lobby chat room! --  ' ,type: 'join'});
          that.io.emit('server message', {text:' -- ' + socket.name + ' has connected. -- ',type: 'disconnect'});

          that.numberOfClients++;
      });


  	  socket.on('chat message', function(msg){
  	  	//console.log("Message Received");
  	    socket.broadcast.emit('chat message', socket.name + ": " + msg);
  	  });


      socket.on('disconnect', function () {
        that.numberOfClients--;
        that.io.emit('server message', {text:' -- ' + socket.name + ' has disconnected. -- ',type: 'join'});
      });

    });
}
