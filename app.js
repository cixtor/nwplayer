
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
    res.render('index', { title: 'Express' });
});

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
