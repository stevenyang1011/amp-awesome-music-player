app.controller('PlaylistController', ['$scope', 'angularPlayer', '$localStorage', function ($scope, angularPlayer, $localStorage) {
    $scope.volume = 50;
    angularPlayer.adjustVolumeSlider($scope.volume);

    $scope.playlist = $localStorage.playlist;
    if(typeof(angularPlayer.addTrack) === 'function'){
        $scope.playlist.forEach(function(item,index){
            angularPlayer.addTrack(item);
        });
    }

    $scope.$on('player:playlist', function(event, data){
            $localStorage.playlist = data;
    });

    $scope.$watch("volume", function(newValue, oldValue){
        if(newValue !== oldValue) {
            angularPlayer.adjustVolumeSlider(newValue);
        }
    });
}]);