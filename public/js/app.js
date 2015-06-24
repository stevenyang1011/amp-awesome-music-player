/*!
 *
 * Awesome Music Player - aka AMP
 *
 */

var app = angular.module('amp', ['ngMaterial', 'ampConfig', 'angularSoundManager']);

app.controller('AppCtrl', ['$scope', '$rootScope', '$mdSidenav', '$mdUtil', function($scope, $rootScope, $mdSidenav, $mdUtil) {
    $scope.togglePlaylist = buildToggler('right');
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

.constant("searchSongUrl", "http://player.stevenyang.nz/search/song")

.constant("searchArtistUrl", "http://player.stevenyang.nz/search/artist")

.constant("searchAlbumUrl", "http://player.stevenyang.nz/search/album")

.constant("viewArtistUrl", "http://player.stevenyang.nz/view/artist/")

.constant("viewAlbumUrl", "http://player.stevenyang.nz/view/album/")

.constant("viewSongUrl", "http://player.stevenyang.nz/song/")

.constant("viewLyricsUrl", "http://player.stevenyang.nz/lyrics/")

;
app.controller('PlaylistController', ['$scope', function ($scope) {
    $scope.songs = [];

    //$scope.$on('addToPlaylist', function(event, args) {
    //    $scope.songs.push(args);
    //    // do what you want to do
    //});
}]);

app.controller('SearchController', ['$scope', '$rootScope', '$http', '$mdToast', 'searchSongUrl', 'searchArtistUrl', 'searchAlbumUrl', function($scope, $rootScope, $http, $mdToast, searchSongUrl, searchArtistUrl, searchAlbumUrl) {
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
        $http.post(searchSongUrl,{
            'q': $scope.q,
            'p': $scope.songs.p
        }).success(function(response) {
            if(response.code == '200'){
                console.log(response.result);
                $scope.songs.data = response.result;
            }
        });
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