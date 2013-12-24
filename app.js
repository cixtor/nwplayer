
/**
 * NWPlayer
 * http://cixtor.com/
 * https://github.com/cixtor/nwplayer
 *
 * Desktop and web application to watch videos from major websites and saving
 * the history in a local database. Check the history, video information, related
 * videos, playlists, avoid ads in the interface and take control of your stats
 * without affect your browsing.
 */

var express = require('express');
var http = require('http');
var url = require('url');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

/**
 * NWPlayer Service
 * @type {Object}
 *
 * JavaScript object with multiple functions required in the application to
 * execute requests to remote APIs and handling the response to save the
 * necessary information in the local database.
 */

var NWPlayer = {
    autoplay: true,
    allowed_types: [ 'youtube', 'vimeo' ],
    db: null,
    dbconfig: {
        name: 'history.db',
        path: 'public/history.db',
        description: 'NWPlayer Database',
        size: 2 * 1024 * 1024
    },

    initialize: function(){
        var sqlite3 = require('sqlite3').verbose();
        var db = new sqlite3.Database(this.dbconfig.path);
        this.db = db;

        db.serialize(function(){
            console.log('Check if database table exists, create it if not.');
            db.run(''
                +'CREATE TABLE IF NOT EXISTS videos ('
                +'id INTEGER PRIMARY KEY,'
                +'type TEXT,'
                +'video_id TEXT,'
                +'title TEXT,'
                +'description TEXT,'
                +'duration INTEGER,'
                +'url TEXT,'
                +'image TEXT,'
                +'views INTEGER,'
                +'created_at INTEGER,'
                +'updated_at INTEGER'
                +');'
            );
        });

        console.log('NWPlayer service initialized');
    },

    close_database: function(){
        this.db.close();
    },

    get_video_id: function(link){
        video_id = false;
        if( link!='' ){
            if( match = link.match(/.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)?([a-zA-Z0-9\-_]{11}).*/) ){
                video_id = ( match && match[1].length==11 ) ? match[1] : false;
            }else if( match = link.match(/[vimeo |vimeo\.com\/|vimeo.*clip_id=]?([0-9]+)/) ){
                video_id = match[1];
            }
        }
        return video_id;
    },

    get_playlist_id: function(link){
        video_id = false;
        if( link.length>0 ){
            if( match = link.match(/.*youtube\.com\/.*list=([a-zA-Z0-9]+)/) ){
                video_id = match[1];
            }
        }
        return video_id;
    },

    get_video_from_url: function(link, callback){
        if( callback ){
            video_id = this.get_video_id(link);
            if( video_id ){
                this.get_video_data(video_id, function(video){
                    callback(video);
                });
            }else{
                callback(false);
            }
        }
    },

    get_video_from_db: function(video_id, callback){
        var instance = this;
        instance.db.get('SELECT * FROM videos WHERE video_id = ? LIMIT 1', video_id, function(err, row){
            var video = new Object();
            video.original = row;
            video.basic = {
                type: video.original.type,
                id: video.original.video_id,
                title: video.original.title,
                description: video.original.description,
                image: video.original.image,
                duration: video.original.duration,
                exists: 1
            };
            video = instance.complement_video_data(video);
            callback(video);
        });
    },

    get_video_from_db_by: function(column, value, callback){
        if( typeof column != 'string' ){ column = 'title'; }

        var items = new Array();
        var sql = "SELECT * FROM videos WHERE "+column+" LIKE '%"+value+"%'";
        this.db.all(sql, function(err, rows){
            callback(rows);
        });
    },

    get_url_from_id: function(type, id){
        var video_url = false;
        switch(type){
            case 'youtube': video_url = 'http://www.youtube.com/watch?v='+id; break;
            case 'vimeo': video_url = 'http://vimeo.com/'+id; break;
        }
        return video_url;
    },

    get_url_for_embed: function(type, id){
        var video_url = false;
        switch(type){
            case 'youtube': video_url = 'http://www.youtube.com/embed/'+id; break;
            case 'vimeo': video_url = 'http://player.vimeo.com/video/'+id; break;
        }
        if( video_url && this.autoplay ){ video_url += '?autoplay=1'; }
        return video_url;
    },

    video_already_viewed: function(video_id, callback){
        this.db.get('SELECT video_id FROM videos WHERE video_id = ?', video_id, function(err, row){
            var viewed = (row==undefined) ? false : true;
            callback(viewed);
        });
    },

    get_video_data: function(video_id, callback){
        var instance = this;
        var current_time = new Date().getTime();
        instance.video_already_viewed(video_id, function(viewed){
            if(viewed){
                instance.get_video_from_db(video_id, function(data){
                    var video = data.original;
                    instance.db.run(
                        'UPDATE videos SET updated_at=?, views=? WHERE id=?',
                        [ current_time, video.views+1, video.id ]
                    );
                    callback(data);
                });
            }else{
                if( video_id.match(/[a-zA-Z0-9\-_]{11}/) ){
                    instance.get_youtube_video(video_id, function(data){
                        instance.set_video_data(data);
                        callback(data);
                    });
                }else if( video_id.match(/^[0-9]+$/) ){
                    instance.get_vimeo_video(video_id, function(data){
                        instance.set_video_data(data);
                        callback(data);
                    });
                }
            }
        });
    },

    set_video_data: function(data){
        var instance = this;
        var current_time = new Date().getTime();
        if( data ){
            video = data.basic;
            if( video.exists==1 ){
                instance.db.run(''
                    +'INSERT INTO videos(type, video_id, title, description, duration, url, image, views, created_at, updated_at) '
                    +'VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [ video.type, video.id, video.title, video.description, video.duration, video.url, video.image, 1, current_time, current_time ]
                );
            }
        }
    },

    get_remote: function(options, callback){
        var output = '';
        var search_uri = url.format({
            protocol: 'http',
            hostname: options.hostname,
            pathname: '/'+options.pathname,
            query: options.params ? options.params : {}
        });
        var p_search_uri = url.parse(search_uri);

        var req = http.get({
            host:p_search_uri.host,
            path:p_search_uri.path,
            headers:{
                'User-Agent': 'Mozilla/5.0 (X11; Linux i686; rv:20.0) Gecko/20121204 Firefox/20.0'
            }
        }, function(res){
            res.on('data', function(chunk){
                output += chunk;
            });
            res.on('end', function(){
                callback(output);
            })
        });

        req.on('error', function(e){
            console.log('Error. Problem with request: '+e.message);
        });
        req.end();
    },

    get_youtube_video: function(video_id, callback){
        var instance = this;
        instance.get_remote({
            hostname: 'gdata.youtube.com',
            pathname: 'feeds/api/videos/'+video_id,
            params: { v:2, alt:'jsonc' }
        }, function(response){
            response = JSON.parse(response);
            var vdata = response.data ? response.data : false;
            var video = false;

            if( vdata ){
                video = {
                    original: vdata,
                    basic: {
                        type: 'youtube',
                        id: vdata.id,
                        title: vdata.title,
                        description: vdata.description,
                        image: vdata.thumbnail.hqDefault,
                        duration: vdata.duration,
                        exists: vdata.error ? 0 : 1
                    }
                };
                video = instance.complement_video_data(video);
            }
            callback(video);
        });
    },

    get_vimeo_video: function(video_id, callback){
        var instance = this;
        instance.get_remote({
            hostname: 'vimeo.com',
            pathname: 'api/v2/video/'+video_id+'.json'
        }, function(response){
            response = response.match(/.* not found\./) ? false : JSON.parse(response);
            var vdata = response ? response[0] : false;
            var video = false;

            if( vdata ){
                video = {
                    original: vdata,
                    basic: {
                        type: 'vimeo',
                        id: vdata.id,
                        title: vdata.title,
                        description: vdata.description,
                        image: vdata.thumbnail_large,
                        duration: vdata.duration,
                        exists: 1
                    }
                }
                video = instance.complement_video_data(video);
            }
            callback(video);
        });
    },

    complement_video_data: function(video){
        video.basic.url = this.get_url_from_id(video.basic.type, video.basic.id);
        video.basic.embed = this.get_url_for_embed(video.basic.type, video.basic.id);
        return video;
    },

    render_json: function(response, data){
        response.set('Content-Type', 'application/json');

        if( data.status == undefined ){ data.status = 0; }
        if( data.code == undefined ){ data.code = 200; }
        if( data.message == undefined ){ data.message = 'Undefined'; }
        response.end(JSON.stringify(data));
    }
};


/**
 * NWPlayer Server
 * @return {string}
 *
 * ExpressJS implementation to route the requests and responses of the web
 * application. Note: This part of the application will eventually change
 * when the graphic interface is finished.
 */

NWPlayer.initialize();

app.get('/', function(req, res){
    res.render('index', { app_title:'NWPlayer' });
});

app.post('/api/video_play', function(req, res){
    if( req.body.video_id != undefined ){
        video_url = req.body.video_id;
        NWPlayer.get_video_from_url(video_url, function(response){
            if( response ){
                NWPlayer.render_json(res, { status:1, message:'Video found', video:response.basic });
            }else{
                NWPlayer.render_json(res, { code:404, message:'Invalid video source' });
            }
        });
    }else{
        NWPlayer.render_json(res, { 'message':'Video identifier parameter not sent.' });
    }
});

app.post('/api/search_video', function(req, res){
    if( req.body.query != undefined ){
        var query = req.body.query;
        NWPlayer.get_remote({
            hostname: 'gdata.youtube.com',
            pathname: 'feeds/api/videos',
            params: { v:2, alt:'jsonc', q:query }
        }, function(response){
            var object = JSON.parse(response);
            if( object.data.items != undefined ){
                res.render('search_video', { videos:object.data.items });
            }else{
                NWPlayer.render_json(res, { code:404, message:'No video results for "<strong>'+query+'</strong>"' });
            }
        });
    }
});

app.post('/api/db_history', function(req, res){
    var column = 'title';
    var query = ( req.body.query != undefined ) ? req.body.query : '';
    var fields = [ 'id', 'video_id', 'title', 'duration', 'views', 'updated_at' ];

    if( query.match(/(http|https|youtube|vimeo)/) ){
        column = 'video_id';
        query = NWPlayer.get_video_id(query);
    }

    NWPlayer.get_video_from_db_by(column, query, function(response){
        res.render('db_history', { fields:fields, videos:response });
    });
});

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
