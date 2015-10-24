app.controller('UserController', ['$scope', 'UserService', function ($scope, UserService) {
    $scope.handleUpdateButtonClick = function(){
        UserService.syncPlaylist();
    }
}]);