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
            }, sok: socket
        };
    })

    .controller('mainController', ["socket", "$window", function (socket, $window) {
        var scope = this;

        scope.animals = ["cat", "dog", "alligator", "elephant"];

        scope.messages = [];
        scope.users = [];
        scope.userID = document.cookie;
        scope.userName;
        scope.inputUset = "";
        var me = {};


        scope.sendMessage = function () {
            socket.emit('message', {
                type: "message",
                content: scope.messageInput,
                userName: name,
                identifier: scope.userID
            });
            scope.messageInput = '';
        };

        scope.sendUser = function (inputUset) {
            var name = (scope.inputUset != "") ? scope.inputUset : "anonymous " + scope.animals[Math.floor(Math.random() * scope.animals.length)];
            if($window.localStorage.userName){
            name =$window.localStorage.userName;}else{
                $window.localStorage.userName =name;
            }
            console.log(name);
            scope.userID = document.cookie.big();
            scope.users.push(name)
            var objectToEmit = {
                type: "user",
                content: name,
                userName: $window.localStorage.userName,
                identifier: scope.userID
            };
            me = objectToEmit;
            socket.emit('user', objectToEmit);
            //console.log(socket);
        };

        scope.sendUser();

        socket.on("message", function (incom) {
            console.log(incom)
            scope.messages.push(incom);
        });
        socket.on("connected", function (incom) {

        });
        socket.emit("connected","");

        socket.on("newUser", function (incom) {
           //scope.users.push(incom[0].userName);
            console.log(scope.users)

                incom.forEach(function(name){
                    if(name.userName== me.userName){
                        scope.users.push(name.content + " (You)");
                    }else{
                        scope.users.push(name.content);

                    }
                })


        });

        $window.onbeforeunload = function () {
            socket.emit("logOut", me );
        };

    }]);