app.controller('SearchController', ['$scope', '$rootScope', '$http', 'searchSongUrl', 'searchArtistUrl', 'searchAlbumUrl', function($scope, $rootScope, $http, searchSongUrl, searchArtistUrl, searchAlbumUrl) {
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
    //$scope.handleTileClick = function(song){
    //    song.url = song.mp3Url;
    //    $rootScope.$broadcast('addToPlaylist', song);
    //}
}]);