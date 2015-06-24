var api = require('../model/api.server.model');

exports.searchSong = function(req, res, next) {
    var page = parseInt(req.body.p);
    if (req.body.q && page > 0) {
        api.search(req.body.q, '1', (page - 1) * 10, 'true', 10, function (err, data) {
            if (err) {
                res.send(err);
            } else {
                result = [];
                data.result.songs.forEach(function(song){
                    result.push({
                        'name': song.name,
                        'id': song.id,
                        'album': song.album,
                        'url': song.mp3Url,
                        'artists': song.artists,
                        'album': {
                            'id': song.album.id,
                            'name': song.album.name,
                            'picUrl': song.album.picUrl
                        }
                    });
                });
                res.send({'code': 200, 'result': result});
            }
        })
    }
};

exports.searchArtist = function(req, res, next) {
    var page = parseInt(req.body.p);
    if (req.body.q && page > 0) {
        api.search(req.body.q, '100', (page - 1) * 10, 'true', 10, function (err, data) {
            if (err) {
                res.send(err);
            } else {
                result = [];
                data.result.artists.forEach(function(artist){
                    result.push({
                        'name': artist.name,
                        'id': artist.id,
                        'picUrl': artist.picUrl,
                        'img1v1Url': artist.img1v1Url
                    });
                });
                res.send({'code': 200, 'result': result});
            }
        })
    }
};

exports.searchAlbum = function(req, res, next) {
    var page = parseInt(req.body.p);
    if (req.body.q && page > 0) {
        api.search(req.body.q, '10', (page - 1) * 10, 'true', 10, function (err, data) {
            if (err) {
                res.send(err);
            } else {
                result = [];
                data.result.albums.forEach(function(album){
                    result.push({
                        'name': album.name,
                        'id': album.id,
                        'picUrl': album.picUrl,
                        'artist': {
                            'id': album.artist.id,
                            'name': album.artist.name,
                            'picUrl': album.artist.picUrl,
                            'img1v1Url': album.artist.img1v1Url
                        }
                    });
                });
                res.send({'code': 200, 'result': result});
            }
        })
    }
};

exports.viewArtist = function(req, res, next) {
    var page = parseInt(req.body.p);
    if( page > 0) {
        api.artist(req.params.artist_id, (page - 1) * 10, 'true', 10, function (err, data) {
            if (err) {
                res.send(err);
            } else {
                res.send(data);
            }
        })
    }
};

exports.viewAlbum = function(req, res, next) {
    api.album(req.params.album_id, function (err, data) {
        if (err) {
            res.send(err);
        } else {
            res.send(data);
        }
    })
};

exports.song = function(req, res, next) {
    api.detail(req.params.song_id, function (err, data) {
        if (err) {
            res.send(err);
        } else {
            if (data.songs.length>0){
                data.songs.forEach(function(song){
                   if (song.mp3Url){
                       res.send({'code':'200', 'song': {
                           'id': song.id,
                           'name': song.name,
                           'url': song.mp3Url,
                           'artists': song.artists,
                           'album': song.album
                        }
                       });

                   }
                });
            } else {
                res.status(404).send({'code':'404'});
            }
        }
    })
};

exports.lyrics = function(req, res, next) {
    api.lyrics(req.params.song_id, function (err, data) {
        if (err) {
            res.send(err);
        } else {
            res.send(data);
        }
    })
};