/*!
 *
 * Awesome Music Player - aka AMP
 *
 */

var app = angular.module('amp', ['ngStorage', 'ngMaterial', 'ampConfig', 'angularSoundManager']);

app.controller('AppCtrl', ['$scope', '$rootScope', '$mdSidenav', '$mdUtil', function($scope, $rootScope, $mdSidenav, $mdUtil) {
    $scope.togglePlaylist = buildToggler('right');
    function buildToggler(navID) {
        var debounceFn =  $mdUtil.debounce(function(){
            $mdSidenav(navID)
                .toggle()
        },300);
        return debounceFn;
    }

    $scope.toggleUser = buildToggler('left');
    function buildToggler(navID) {
        var debounceFn =  $mdUtil.debounce(function(){
            $mdSidenav(navID)
                .toggle()
        },300);
        return debounceFn;
    }
}]);

app.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('cyan');
});
angular.module("ampConfig", [])

.constant("searchSongUrl", "http://player.stevenyang.nz/search/song/")

.constant("searchArtistUrl", "http://player.stevenyang.nz/search/artist/")

.constant("searchAlbumUrl", "http://player.stevenyang.nz/search/album/")

.constant("viewArtistUrl", "http://player.stevenyang.nz/view/artist/")

.constant("viewAlbumUrl", "http://player.stevenyang.nz/view/album/")

.constant("viewSongUrl", "http://player.stevenyang.nz/song/")

.constant("viewLyricsUrl", "http://player.stevenyang.nz/lyrics/")

.constant("userLoginUrl", "http://localhost:4570/user/login/")

.constant("userLogoutUrl", "http://localhost:4570/user/logout/")

.constant("userSingupUrl", "http://localhost:4570/user/signup/")

.constant("userPlaylistUrl", "http://localhost:4570/user/playlist/")

;
app.controller('PlaylistController', ['$scope', 'angularPlayer', '$localStorage', function ($scope, angularPlayer, $localStorage) {
    $scope.volume = 50;
    angularPlayer.adjustVolumeSlider($scope.volume);
    $scope.$watch("volume", function(newValue, oldValue){
        if(newValue !== oldValue) {
            angularPlayer.adjustVolumeSlider(newValue);
        }
    });

}]);

app.controller('SearchController', ['$scope', '$rootScope', '$http', '$mdToast', 'searchSongUrl', 'searchArtistUrl', 'searchAlbumUrl', function($scope, $rootScope, $http, $mdToast, searchSongUrl, searchArtistUrl, searchAlbumUrl) {
    $scope.loading = false;
    $scope.songs = {
        'p': 1,
        'data': ''
    };
    $scope.artists = {
        'p': 1,
        'data': ''
    };
    $scope.albums = {
        'p': 1,
        'data': ''
    };
    $scope.handleSearchButtonClick = function(){
        $scope.songs.p = 1;
        $scope.searchSongs();
    }
    $scope.searchSongs = function(){
        if (typeof($scope.q) === 'string') {
            $scope.songs.data = {};
            $scope.loading = true;
            $http.post(searchSongUrl, {
                'q': $scope.q,
                'p': $scope.songs.p
            }).success(function (response) {
                if (response.code == '200') {
                    console.log(response.result);
                    $scope.loading = false;
                    $scope.songs.data = response.result;
                }
            });
        }
    }
    $scope.showAddToPlaylistToast = function() {
        $mdToast.show(
            $mdToast.simple()
                .content('Added to Playlist!')
                .position('bottom right')
                .hideDelay(3000)
        );
    };
}]);
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
app.service('UserService', ['$rootScope', '$http', '$localStorage', 'angularPlayer', 'userLoginUrl', 'userLogoutUrl', 'userSingupUrl', 'userPlaylistUrl', function ($rootScope, $http, $localStorage, angularPlayer, userLoginUrl, userLogoutUrl, userSingupUrl, userPlaylistUrl) {
    var self = this;

    self.initPlaylist = function(user){
        if (user !== null && typeof(user.defaultPlaylist) !== 'undefined'){
            user.defaultPlaylist.forEach(function (item, index) {
                angularPlayer.addTrack(item);
            });
        }
        else if(typeof($localStorage.playlist) !== 'undefined' ) {
            $localStorage.playlist.forEach(function (item, index) {
                angularPlayer.addTrack(item);
            });
        }
    }

    self.signup = function(email, password){
        $http.post(userSingupUrl, {
            'email': email,
            'password': password
        }).success(function (response) {
            if (response.code == '200' && response.user) {
                console.log(response);
                self.initPlaylist(response.user);
                self.syncPlaylist(response.user, $localStorage.playlist);
                $localStorage.playlist = [];
                $rootScope.$broadcast('userUpdated',response.user);
            }
            else{
                $rootScope.$broadcast('userUpdated',[]);
            }
        });
    }

    self.login = function(email, password){
        $http.post(userLoginUrl, {
            'email': email,
            'password': password
        }).success(function (response) {
            if (response.code == '200' && response.user) {
                console.log(response);
                self.initPlaylist(response.user);
                self.syncPlaylist(response.user, $localStorage.playlist);
                $localStorage.playlist = [];
                $rootScope.$broadcast('userUpdated',response.user);
            }
            else{
                $rootScope.$broadcast('userUpdated',[]);
            }
        });
    }

    self.logout = function(user){
        $http.get(userLogoutUrl)
        .success(function (response) {
            if (response.code == '200') {
                console.log(response);
                angularPlayer.clearPlaylist(function(success) {
                    if(success){
                        $rootScope.$broadcast('userUpdated', []);
                    }
                });
            }
            else{
                $rootScope.$broadcast('userUpdated', user);
            }
        });
    }

    self.syncPlaylist = function(user, data){
        if(typeof(user._id) !== "undefined") {
            $.extend(user, {'defaultPlaylist': data});
            $http.put(userPlaylistUrl + user._id, user)
                .success(function (response) {
                    console.log(response);
                })
                .error(function(response){
                    console.log(response);
                });
        }
        else{
            $localStorage.playlist = data;
        }
    }

    self.update = function(user) {
        $http.put(userPlaylistUrl + user._id, user)
            .success(function (response) {
                console.log(response);
            });
    }
}]);