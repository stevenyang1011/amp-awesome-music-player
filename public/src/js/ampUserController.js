app.controller('UserController', ['$scope', 'UserService', function ($scope, UserService) {


    if(window.user !== null){
        $scope.user = window.user;
        $scope.isLoggedIn = true;
    }
    else{
        $scope.user = [];
        $scope.isLoggedIn = false;
    }

    $scope.$on('userUpdated', function(event, data) {
        console.log(data);
        $scope.user = data;
        if($scope.user == 0){
            $scope.isLoggedIn = false;
        }
        else{
            $scope.isLoggedIn = true;
        }
    });

    $scope.handleLoginButtonClick = function(){
        UserService.login($scope.login.email, $scope.login.password);
    }

    $scope.handleSignupButtonClick = function(){
        UserService.signup($scope.signup.email, $scope.signup.password);
    }

    $scope.handleUpdateButtonClick = function(){
        UserService.update($scope.user);
    }

    $scope.handleLogoutButtonClick = function(){
        UserService.logout();
    }

    $scope.$on('angularPlayer:ready', function(){
        UserService.initPlaylist($scope.user);
        $scope.$on('player:playlist', function(event, data){
            UserService.syncPlaylist($scope.user, data);
        });
    });

}]);