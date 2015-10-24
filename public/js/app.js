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

.constant("searchSongUrl", "http://localhost:4570/search/song")

.constant("searchArtistUrl", "http://localhost:4570/search/artist")

.constant("searchAlbumUrl", "http://localhost:4570/search/album")

.constant("viewArtistUrl", "http://localhost:4570/view/artist/")

.constant("viewAlbumUrl", "http://localhost:4570/view/album/")

.constant("viewSongUrl", "http://localhost:4570/song/")

.constant("viewLyricsUrl", "http://localhost:4570/lyrics/")

.constant("updateUserUrl", "http://localhost:4570/api/users/")

;
app.controller('PlaylistController', ['$scope', 'angularPlayer', '$localStorage', function ($scope, angularPlayer, $localStorage) {
    $scope.volume = 50;
    angularPlayer.adjustVolumeSlider($scope.volume);
    $scope.$watch("volume", function(newValue, oldValue){
        if(newValue !== oldValue) {
            angularPlayer.adjustVolumeSlider(newValue);
        }
    });

    $scope.$on('angularPlayer:ready', function(){
        $localStorage.playlist.forEach(function(item,index){
            angularPlayer.addTrack(item);
        });
    });

    $scope.$on('player:playlist', function(event, data){
            $localStorage.playlist = data;
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
    $scope.handleUpdateButtonClick = function(){
        UserService.syncPlaylist();
    }
}]);
app.service('UserService', ['$http', '$localStorage', 'updateUserUrl', function ($http, $localStorage, updateUserUrl) {

    var user = [];

    this.login = function(){

    }

    this.logout = function(){

    }

    this.get = function(){
        return user;
    }

    //this.syncPlaylist = function(){
    //    if(typeof(user._id) !== "undefined") {
    //        $.extend(user, {'defaultPlaylist': $localStorage.playlist});
    //        $http.put(updateUserUrl + user._id, user)
    //            .success(function (response) {
    //                console.log(response);
    //            });
    //    }
    //}

    this.syncPlaylist = function(){
        $.extend(window.user, { 'defaultPlaylist': $localStorage.playlist});
        $http.put(updateUserUrl+window.user._id, window.user)
            .success(function (response) {
                console.log(response);
            });
    }
}]);