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