/**
 * Created by Athinodoros on 19/4/2016.
 */
var shortid = require('shortid');
var clients = new Array();
var usersList = [];
console.log("number of clients " +clients);

module.exports = function(socket) {


    function broadcast(type, payload) {
        socket.broadcast.emit(type, payload);
        //socket.emit(type, payload);
    }
    socket.on('connected', function(){
        console.log(socket.broadcast.id)
       socket.emit('connected',socket.id)
    });

    socket.on('message', function(message){
        broadcast('message', message);
    });

    socket.on('user', function(user){
        user.id = socket.id;
        clients.push(user);
        console.log(clients );
        socket.broadcast.emit("newUser",clients)
    });

    socket.on("logOut",function(user){
        usersList.pop(user.userName);
        clients.pop(user);
    })

};