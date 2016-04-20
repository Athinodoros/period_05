/**
 * Created by Athinodoros on 19/4/2016.
 */
angular.module('chat', [])

    .factory('socket', function ($rootScope) {
        // See: http://www.html5rocks.com/en/tutorials/frameworks/angular-websockets/
        // for further details about this wrapper
        var socket = io.connect();
        return {
            on: function (eventName, callback) {
                socket.on(eventName, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function (eventName, data, callback) {
                socket.emit(eventName, data, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback.apply(socket, args);
                        }

                    });
                });
            }
        };
    }).factory('lists', function () {
        messages = [];
        users = [];
        return {
            addMessages: function (message) {
                messages.push(message);
            }, readMessages: function () {
                return messages;
            }, addUser: function (user) {
                users.push(user);
            }, readUsers: function () {
                return users;
            } ,dropUsers : function(){
                users = [];
            }

        }
    })

    .controller('mainController', ["socket", "$window", "lists", function (socket, $window, lists) {
        var scope = this;

        scope.messages = [];

        scope.animals = ["cat", "dog", "alligator", "elephant"];
        scope.userName;
        scope.inputUset = "";
        scope.users = [];
        var me = {};


        scope.sendMessage = function () {
            socket.emit('message', {
                type: "message",
                content: scope.messageInput,
                userName: name,
                id: scope.userID
            });
            scope.messageInput = '';
        };

        scope.sendUser = function (inputUset) {
            var name = (scope.inputUset != "") ? scope.inputUset : "anonymous " + scope.animals[Math.floor(Math.random() * scope.animals.length)];
            if ($window.localStorage.userName) {
                name = $window.localStorage.userName;
            } else {
                $window.localStorage.userName = name;
            }
            //console.log(name);
            scope.userID = document.cookie.big();
            //lists.addUser(name)

            me.userName = inputUset;
            socket.emit('user', objectToEmit);
            //console.log(socket);
        };


        socket.on("message", function (incom) {
            console.log(incom);
            scope.messages.push(incom.content)
            lists.addMessages(incom.messages);
        });
        socket.on("connected", function (incom) {

        });


        socket.on("newUser", function (incom) {
            console.log(incom)
            lists.dropUsers();
            scope.users = [];
            incom.forEach(function (name, index) {
                lists.addUser(name);
                if(name.userName==$window.localStorage.userName){
                    scope.users.push(name.userName + " (Me)");
                    console.log(name)
                }else {
                    scope.users.push(name.userName);
                    console.log(name)
                }
            });
            console.log(users);
        });

        // emit section


        function start() {
            var name = (scope.inputUset != "") ? scope.inputUset : "anonymous " + scope.animals[Math.floor(Math.random() * scope.animals.length)];
            if ($window.localStorage.getItem("userName") == null) {
                name = $window.localStorage.userName;
            } else {
                $window.localStorage.userName = name;
            }
            console.log(name);
            var objectToEmit = {
                type: "user",
                content: name,
                userName: $window.localStorage.userName,
            };
            me = objectToEmit;
            socket.emit("connected", me);
        };
        start();
        $window.onbeforeunload = function () {
            socket.emit("logOut", me);
        };

    }]);