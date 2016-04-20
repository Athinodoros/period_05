/**
 * Created by Athinodoros on 19/4/2016.
 */
var shortid = require('shortid');
var clients = [];
var usersList = [];
var socketsOn = [];
console.log("number of clients " + clients);

module.exports = function (socket) {


    function broadcastOthers(type, payload) {
        socket.broadcast.emit(type, payload);

    };

    function broadcastAll(type, payload) {
        socket.emit(type, payload);

    };
    socket.on('connected', function (user) {
        user.id = socket.id;
        socketsOn.push(user);
        usersList.push(user.userName);
        console.log(socketsOn);
        broadcastOthers("newUser",socketsOn)
        broadcastAll('newUser', socketsOn)
    });

    socket.on('message', function (incomingM) {
        console.log(incomingM);
        broadcastOthers("message",incomingM);
        broadcastAll('message', incomingM);
    });

    socket.on('user', function (user) {
        user.id = socket.id;
        clients.push(user);
        console.log(clients);
        socket.broadcast.emit("newUser", clients)
    });

    socket.on("logOut", function (user) {
        usersList.pop(user.userName);
        clients.pop(user);
    })

};