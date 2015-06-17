var api = require('../../app/controllers/api.server.controller');
module.exports = function(app) {
    app.route('/search/song')
        .post(api.searchSong);
    app.route('/search/artist')
        .post(api.searchArtist);
    app.route('/search/album')
        .post(api.searchAlbum);
    app.route('/view/artist/:artist_id')
        .get(api.viewArtist);
    app.route('/view/album/:album_id')
        .get(api.viewAlbum);
    app.route('/song/:song_id')
        .get(api.song);
    app.route('/lyrics/:song_id')
        .get(api.lyrics);
};