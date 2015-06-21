/*!
 *
 * Awesome Music Player - aka AMP
 *
 */

var app = angular.module('amp', ['ngMaterial', 'ampConfig']);

app.controller('AppCtrl', ['$scope', '$mdSidenav', function($scope, $mdSidenav) {
    $scope.toggleSidenav = function (menuId) {
        $mdSidenav(menuId).toggle();
    };
}]);

app.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('cyan');
});
angular.module("ampConfig", [])

.constant("api_url", "http://localhost:4570")

;


app.controller('SearchController', ['$scope', '$http', 'ampConfig', function($scope, $http, ampConfig) {
    $http.get(ampConfig + "/api/users")
        .success(function(response) {
            $scope.employees = response.data;
        });
}]);

$(document).ready(function () {
    playlist = new jPlayerPlaylist({
            jPlayer: "#jquery_jplayer",
            cssSelectorAncestor: "#jp_container"
        },
        [],
        {
            swfPath: "../dist/jplayer",
            supplied: "oga, mp3",
            wmode: "window",
            useStateClassSkin: true,
            playlistOptions: {
                enableRemoveControls: true
            },
            autoBlur: false,
            smoothPlayBar: true,
            keyEnabled: true
        });

    $(playlist).on('playlist-update', function (e) {
        var songIds = [];
        var i = 0;
        $(playlist.playlist).each(function () {
            songIds[i++] = this.id;
        });
        $.cookie('playlist', escape(songIds.join(',')), {expires: 365});
    });

    $("#jplayer_inspector").jPlayerInspector({jPlayer: $("#jquery_jplayer")});

    // Attach a submit handler to the form
    $("#api-search-form").submit(function (event) {

        // Stop form from submitting normally
        event.preventDefault();

        // Get some values from elements on the page:
        var $form = $(this),
            term = $form.find("input[name='q']").val(),
            url = $form.attr("action");

        // Send the data using post
        $.post(url, $form.serialize(), function (data, status) {
            //For now, render songs only
            if (status == 'success' && data.songs != undefined) {
                $("#search-results").html('');
                $.each(data.songs, function () {
                    $("#search-results").append('<li><a data-song-id="' + this.id + '"><span>' + this.name + '</span> - ' + this.artists[0].name + '</a></li>');
                });
            }
            // $( "#search-results" ).html(data);
        }, "json");
    });

    //Handling adding songs to the playlist
    $('#search-results').on('click', 'li a', function (e) {
        var url = '/api/song/' + $(this).data('song-id');
        $.get(url, function (data, status) {
            if (status == 'success' && data.songs != undefined) {
                $.each(data.songs, function () {
                    if (this.mp3Url) {
                        var songDetail = {
                            title: this.name + ' - ' + this.artists[0].name,
                            id: this.id,
                            mp3: this.mp3Url,
                            poster: this.album.picUrl
                        }
                        playlist.add(songDetail);
                        $(playlist).trigger('playlist-update');

                    }
                });
            }
        });
    });

    var cookie = unescape($.cookie('playlist'));
    var songIds = cookie.split(',');
    var i = 0;
    if (songIds.length > 0 && songIds != '') {
        $(songIds).each(function () {
            $.ajax({
                url: '/song/' + this,
                success: function (data, status) {
                    if (status == 'success' && data.song != undefined) {
                        if (data.song.mp3Url) {
                            var songDetail = {
                                title: data.song.name + ' - ' + data.song.artists[0].name,
                                id: data.song.id,
                                mp3: data.song.mp3Url,
                                poster: data.song.album.picUrl
                            }
                            playlist.add(songDetail);
                        }
                    }
                },
                async: false
            });
        });
    }
    $('#jquery_jplayer').on($.jPlayer.event.play, function () {
        $('#jp_poster_0').css('width', '300px').css('height', '300px').addClass('spin');
    }).on($.jPlayer.event.pause, function () {
        $('#jp_poster_0').removeClass('spin');
    });
});