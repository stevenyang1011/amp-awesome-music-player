/**
 * Module Dependencies
 */
var request = require('request')
var qs = require('querystring')
var concat = require('concat-stream')

/**
 * netEaseApiUrls
 */
var netEaseApiUrls = {
    search: 'http://music.163.com/api/search/pc',
    album: 'http://music.163.com/api/album/',
    detail: 'http://music.163.com/api/song/detail',
    playlist: 'http://music.163.com/api/playlist/detail',
    dj: 'http://music.163.com/api/dj/program/detail',
    lyrics: 'http://music.163.com/api/song/lyric',
    artist: 'http://music.163.com/api/artist/albums/'
}



/**
 * HEADERS
 */
var HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.1.6) Gecko/20091201 Firefox/3.5.6',
    'Referer': 'http://music.163.com/'
}

module.exports = {
    /**
     * search song/album/playlist
     * @param  {string}   key keywords
     * @param  {Function} cb  callback fucntion
     * @return {Object}       response data
     */
    search: function(key, type, offset, total, limit, cb) {
        var params = {
            s: key,
            type: type,
            offset: offset,
            total: total,
            limit: limit,
            csrf_token: ''
        }

        var req = request({
            uri: netEaseApiUrls.search + '?',
            headers: HEADERS,
            method: 'POST'
        })
        req.setHeader('Content-Type', 'application/x-www-form-urlencoded')
        req.setHeader('Content-Length', qs.stringify(params).length)
        req.end(qs.stringify(params))
        req.pipe(concat(function(data) {
            return cb(null, JSON.parse(data))
        }))

        req.on('error', function(err) {
            return cb(err)
        })
    },

    /**
     * get playlist by ID
     * @param  {string}   key ID
     * @param  {Function} cb  callback function
     * @return {object}       response playlist
     */
    playlist: function(key, cb) {
        var params = {
            id: key,
            csrf_token: ''
        }

        var req = request({
            uri: netEaseApiUrls.playlist + '?' + qs.stringify(params),
            headers: HEADERS
        }).pipe(concat(function(data) {
            return cb(null, JSON.parse(data))
        }))

        req.on('error', function(err) {
            return cb(err)
        })
    },

    /**
     * get playlist by ID
     * @param  {string}   key ID
     * @param  {Function} cb  callback function
     * @return {object}       response playlist
     */
    dj: function(key, cb) {
        var params = {
            id: key,
            csrf_token: ''
        }

        var req = request({
            uri: netEaseApiUrls.dj + '?' + qs.stringify(params),
            headers: HEADERS
        }).pipe(concat(function(data) {
            return cb(null, JSON.parse(data))
        }))

        req.on('error', function(err) {
            return cb(err)
        })
    },

    /**
     * get albums by artist ID
     * @param  {string}   key ID
     * @param  {Function} cb  callback function
     * @return {object}       response playlist
     */
    artist: function(key, offset, total, limit, cb) {
        var params = {
            offset: offset,
            total: total,
            limit: limit
        }
        var req = request({
            uri: netEaseApiUrls.artist + key + '?' + qs.stringify(params),
            headers: HEADERS
        }).pipe(concat(function(data) {
            //console.log(data.toString('utf8'));
            return cb(null, JSON.parse(data));

        }))

        req.on('error', function(err) {
            return cb(err)
        })
    },

    /**
     * get album list by ID
     * @param  {string}   key ID
     * @param  {Function} cb  callback function
     * @return {object}       response album list
     */
    album: function(key, cb) {
        var req = request({
            uri: netEaseApiUrls.album + key,
            headers: HEADERS
        }).pipe(concat(function(data) {
            return cb(null, JSON.parse(data))
        }))

        req.on('error', function(err) {
            return cb(err)
        })
    },

    /**
     * get details of a song by ID
     * @param  {string}   key ID
     * @param  {Function} cb  callback function
     * @return {object}       response detail info of a song
     */
    detail: function(key, cb) {
        var params = {
            id: key,
            ids: '[' + key + ']',
            csrf_token: ''
        }

        var req = request({
            uri: netEaseApiUrls.detail + '?' + qs.stringify(params),
            headers: HEADERS
        }).pipe(concat(function(data) {
            return cb(null, JSON.parse(data))
        }))

        req.on('error', function(err) {
            return cb(err)
        })
    },

    /**
     * get lyrics by song ID
     * @param  {string}   key ID
     * @param  {Function} cb  callback function
     * @return {object}       response detail info of a song
     */
    lyrics: function(key, cb) {
        var params = {
            os: 'pc',
            id: key,
            lv: '-1',
            kv: '-1',
            tv: '-1',
            csrf_token: ''
        }

        var req = request({
            uri: netEaseApiUrls.lyrics + '?' + qs.stringify(params),
            headers: HEADERS
        }).pipe(concat(function(data) {
            return cb(null, JSON.parse(data))
        }))

        req.on('error', function(err) {
            return cb(err)
        })
    }

}