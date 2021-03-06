function CircularBuffer(size) {
    this.size = size;
    this.arr = [];
}

CircularBuffer.prototype.size = function() {
    return this.size;
};

CircularBuffer.prototype.add = function(a) {
    if (this.arr.length >= this.size) {
        this.arr.shift();
    }
    this.arr.push(a);
}

CircularBuffer.prototype.addArray = function(arr) {
    for (var i=0;i<arr.length;i++) {
        this.add(arr[i]);
    }
};

CircularBuffer.prototype.newlineStr = function() {
    var str="";
    for (var i=0;i<this.arr.length;i++) {
        str = str + this.arr[i] + "\n";
    }
    return str;
};

CircularBuffer.prototype.getArr = function() {
    return this.arr;
};

var app = angular.module("helloWorldApp",[]);

app.controller("HelloWorldCtrl", function ($scope) {
    function init() {
        $scope.statusmessage = "";
        $scope.errormessage = '';
        $scope.buffer = new CircularBuffer(20);
    }

    $scope.initSockets = function() {
        $scope.socket={};
        $scope.socket.client = new SockJS('/helloworld');
        $scope.socket.stomp = Stomp.over($scope.socket.client);
        $scope.socket.stomp.connect({}, function() {
            $scope.socket.stomp.subscribe("/topic/greetings", $scope.notify);
            $scope.socket.stomp.subscribe("/app/oldmessages", $scope.onoldmessages);
        });
        $scope.socket.client.onclose = $scope.reconnect;
    };

    $scope.setErrorMessage = function (message) {
        $scope.errormessage = message;
        $scope.statusmessage = '';
    };

    $scope.setStatusMessage = function (message) {
        $scope.statusmessage = message;
        $scope.errormessage = '';
    };

    $scope.notify = function(message) {
        $scope.$apply(function() {
            $scope.buffer.add(angular.fromJson(message.body));
        });
    };

    $scope.onoldmessages = function(message) {
        $scope.$apply(function() {
            $scope.buffer.addArray(angular.fromJson(message.body));
        });
    }

    $scope.reconnect = function() {
        setTimeout($scope.initSockets, 10000);
    };

    $scope.submitGreeting = function() {
        $scope.socket.stomp.send("/app/greetings", {}, angular.toJson($scope.greeting));
    }

    init();
    $scope.initSockets();
});